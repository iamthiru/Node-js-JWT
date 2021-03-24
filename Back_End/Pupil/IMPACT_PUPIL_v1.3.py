# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 03/24/2021
# Version: v1.4

# Code Description:
# * 1080p videos of eyes to get Pupil->Iris for both NIR and COLOR.
# * Drop threshold of Pupil: 80%. If the radius increase by 20% in the next immediate frame, we stump it.
# * Video Quality and Drop Criteria Added (20 Frames).

# UPDATES:
# * Brightness Adjustor.
# * Fixed for any FPS.
# * CODE MODULES created.
# * MAJOR UPDATE - Added Dynamic Threshold Detector for Pupil and Iris.
# * Threshold value decided by looking at first 10 frames.
# * Using Contour Detection Piggy-Backed with Hough when failure for both Pupil and Iris.
# * Iris radius depends on Pupil radius, with a shared/common center.
# * Hard-coded cropping removed.
# * Result Video will be created after Processing.
# * Pupil and Iris Radius go through validity check. Based on upper and lower bound, the radius is set.
# * The video displayed uses the adjusted radius. Works on the Fly.
# * The incoming video is Qualified/Disqualified if Pupil/Iris fails on 20 consecutive frames + if Pupil radius < 35px.

########################################################################################################################
# PACKAGE IMPORTS
import time
import cv2
import sys
import numpy as np
import pandas as pd

# MODULE IMPORTS
import Detector
import Data_Processing
import PUAL_Gen
import Histogram_Adjustment

# GLOBAL LISTS
Iris_Dilation = []
Pupil_Dilation = []
iris_xpoints = []
iris_ypoints = []
pupil_xpoints = []
pupil_ypoints = []
iris_radii = []
pupil_radii = []
frame_num = []
ratio = []
processed_ratio = []

# INITIALIZATIONS:
start_time = time.time()
flag = 0
token = 'Good'
count = 0
counter = 0
Dropped_Frame_Counter = 0
frame_array = []
size = ()

########################################################################################################################


# Fetching Plugins from Configuration Files:
if len(sys.argv) >= 2:
    print("\n************************* IMPACT: PUPIL DETECTION *************************\n")
    filename = str(sys.argv[1])
    video_type = str(sys.argv[2])
    # Running the Brightness Adjustor:
    Histogram_Adjustment.Video_Brighten_Regenerate(filename)
    video = cv2.VideoCapture('./static/Pupil_Input_Videos/' + filename)
else:
    exit()

# Calculate FPS of the Video:
fps = video.get(cv2.CAP_PROP_FPS)
print('> FPS: ', fps)

# Running Threshold Tracker:
Pupil_Thresh, Iris_Thresh = Detector.Threshold_Detect(video)

########################################################################################################################

# Reading Video Frame by Frame:
while video.isOpened():
    ret, frame = video.read()

    if ret:
        frame_num.append(count)
        count = count + 1

        if video_type == 'NIR' or video_type == 'Color':
            file_ext = filename.split(".")[-1]
            im = frame
            # im = cv2.rotate(im, cv2.ROTATE_90_COUNTERCLOCKWISE)
            im = cv2.GaussianBlur(im, (5, 5), 0)
            im = cv2.medianBlur(im, 5)
            im = cv2.bilateralFilter(im, 9, 75, 75)
            height, width, layers = im.shape
            size = (width, height)
            Pupil, Pupil_center, pupil_radii, pupil_xpoints, pupil_ypoints, Pupil_Dilation = Detector.Pupil_Detection(im, frame_num, Pupil_Thresh, pupil_radii,
                                                                                                                      pupil_xpoints, pupil_ypoints, Pupil_Dilation, video_type)
            if len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) != 0):
                Pupil_center = [pupil_xpoints[-1], pupil_ypoints[-1]]
            elif len(Pupil_center) == 0:
                Dropped_Frame_Counter += 1
            if Dropped_Frame_Counter > 40:
                print('\n# VIDEO DIS-QUALIFIED -> Pupil Undetected.. Retake Video!!!')
                token = 'Bad'
                flag = 0
                break
            if len(Pupil_center) != 0:
                if np.average(pupil_radii) >= 35:
                    Iris, iris_radii, iris_xpoints, iris_ypoints, Iris_Dilation = Detector.Iris_Detection(im, frame_num, Iris_Thresh, Pupil_center,
                                                                                                          iris_radii, iris_xpoints, iris_ypoints,
                                                                                                          pupil_radii, Iris_Dilation, video_type)
                else:
                    print('\n# VIDEO DIS-QUALIFIED -> Low Pixels for Pupil.. Retake Video!!!')
                    token = 'Bad'
                    flag = 0
                    break

            # cv2.imshow('Output', im)
            frame_array.append(im)
            flag = 1

        else:
            print("WRONG CHOICE !!")
            break

        key = cv2.waitKey(1)
        if key == 27 or 0xFF == ord('q'):
            flag = 1
            break
    else:
        flag = 1
        break

    counter = counter + 1

########################################################################################################################

# Create Video Output for Visualization
if flag == 1 and token == 'Good':
    # Creates the video out of the processed frames
    Data_Processing.Output_Visual_Video_Generate(filename, fps, size, frame_array)
    # Process the Pupil and Iris lists : Fill Spaces and Post-Process
    Pupil_Dilation, Iris_Dilation = Data_Processing.List_Processing(frame_num, Pupil_Dilation, Iris_Dilation)
    # Compute Ratio and Processed Ratio
    ratio, processed_ratio = Data_Processing.Make_DFs(filename, frame_num, Iris_Dilation,
                                                      Pupil_Dilation, ratio, processed_ratio)
    # Graph the values from CSVs into a plot
    Data_Processing.Grapher_Plot_Dilations(filename)

    # Computing the PUAL Score for the data-points collected
    print('\n***************************** PUAL *****************************')
    new_DF = pd.read_csv('./static/Pupil_Output_Images/' + filename.split(".")[0] + '_Ratio_Dilation.csv', usecols=['Frame', 'Processed Ratio'])
    PUAL_Score, Noise, Corrected_PUAL_Score = PUAL_Gen.Calculate_PUAL(filename, np.array(new_DF['Processed Ratio'])[0:256], fps)
    print('\n> PUAL: ', PUAL_Score, ' ; ', 'Noise: ', Noise, ' ; ', 'Corrected PUAL: ', Corrected_PUAL_Score)

########################################################################################################################

# Compute Resources being used or utilized
print('\n***************************************************************************')
Data_Processing.Compute_Resources(start_time)

video.release()
cv2.destroyAllWindows()

########################################################################################################################
