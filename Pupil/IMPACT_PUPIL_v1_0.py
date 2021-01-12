# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/11/2021
# Version: v1.0

# Code Description:
# * 1080p videos of eyes to get Pupil->Iris for both NIR and COLOR.
# * Drop threshold of Pupil: 85%. If the radius increase by 15% in the next immediate frame, we stump it.
# * Video Quality and Drop Criteria Added (10 Frames)

# UPDATES:
# * Using Contour Detection Piggy-Backed with Hough when failure for both Pupil and Iris.
# * Iris radius depends on Pupil radius, with a shared/common center.
# * Hard-coded cropping removed.
# * Result Video will be created after Processing.
# * The incoming video is judged as Qualified/Unqualified if Pupil/Iris fails on 10 consecutive frames.


import os
import cv2
import sys
import time
import resource
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

Iris_Dilation = []
Pupil_Dilation = []

pupil_xpoints = []
pupil_ypoints = []
iris_xpoints = []
iris_ypoints = []

pupil_radii = []
iris_radii = []

frame_num = []
ratio = []
processed_ratio = []
Pupil_memory = []
Iris_memory = []


########################################################################################################################
# TO DO: Front End Bouding Box with EYE Cropped out....
def Extract_Eye(fr, orien):
    h, w, _ = fr.shape
    if orien == 'Vertical':
        # eye_fr = fr[500:h - 1100, 300:w - 300]   # Trial1
        # eye_fr = fr[350:h - 1200, 300:w - 300]   # Trial4
        # eye_fr = fr[250:h - 1300, 300:w - 300]   # Trial5
        eye_fr = fr[700:h - 750, 300:w - 300]  # Trial07
    else:
        eye_fr = fr[450:h-250, 600:w-800]       # Trial06
    return eye_fr


########################################################################################################################

def create_dataframe():
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(b / a))
    df['Ratio'] = ratio

    for i in range(0, len(frame_num)-1):
        dt_P = Pupil_Dilation[i]
        dt_I = Iris_Dilation[i]
        Pupil_memory.append(dt_P)
        Iris_memory.append(dt_I)
        # TO DO: 85% averaging (Use 90%?)
        drop_P = 0.85 * (sum(Pupil_memory)/len(Pupil_memory))
        surge_P = (0.15 + 1) * (sum(Pupil_memory)/len(Pupil_memory))
        drop_I = 0.99 * (sum(Iris_memory)/len(Iris_memory))
        surge_I = np.ceil((1 + 0.01) * (sum(Iris_memory)/len(Iris_memory)))

        if 0 < i < len(frame_num) and (dt_P <= drop_P or dt_P >= surge_P):
            Pupil_Dilation[i] = int((Pupil_Dilation[i-1] + Pupil_Dilation[i+1]) / 2)

        if 0 < i < len(frame_num) and (dt_I <= drop_I or dt_I >= surge_I):
            Iris_Dilation[i] = Iris_Dilation[i-1]

    df['Processed Iris Dilation'] = Iris_Dilation
    df['Processed Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        processed_ratio.append("{:.5f}".format(b / a))
    df['Processed Ratio'] = processed_ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio',
                  'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio']
    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
              os.path.splitext(filename)[0] + '_Dilation.csv', index=False)


########################################################################################################################

def plot_dilations():
    df = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                     os.path.splitext(filename)[0] + '_Dilation.csv')
    x_list = df['Frame']
    y1_list = df['Iris Dilation']
    y2_list = df['Pupil Dilation']
    y3_list = df['Processed Iris Dilation']
    y4_list = df['Processed Pupil Dilation']
    y5_list = df['Ratio']
    y6_list = df['Processed Ratio']

    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(10, 5))

    ax1.plot(x_list, y1_list, 'r', label='Iris Plot')
    ax1.plot(x_list, y2_list, 'b', label='Pupil Plot')
    ax1.set_title('Algorithm Generated')
    ax1.set_xlabel('Frames')
    ax1.set_ylabel('Radius (px)')
    ax1.legend(loc='center')

    ax2.plot(x_list, y3_list, 'r', label='Iris Plot')
    ax2.plot(x_list, y4_list, 'b', label='Pupil Plot')
    ax2.set_title('Processed')
    ax2.set_xlabel('Frames')
    ax2.set_ylabel('Radius (px)')
    ax2.legend(loc='center')

    ax3.plot(x_list, y5_list, 'g', label='Ratio Plot')
    ax3.set_title('Algorithm Generated')
    ax3.set_xlabel('Frames')
    ax3.set_ylabel('Ratio')
    ax3.set_yticks([0.4, 0.5, 0.6])

    ax4.plot(x_list, y6_list, 'g', label='Ratio Plot')
    ax4.set_title('Processed')
    ax4.set_xlabel('Frames')
    ax4.set_ylabel('Ratio')
    ax4.set_yticks([0.4, 0.5, 0.6])

    fig.tight_layout()
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                os.path.splitext(filename)[0] + '_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Iris_Detection(im, pup_cen, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    iris_center = []
    global iris_radii
    global iris_xpoints
    global iris_ypoints
    w, h = imge.shape
    global biasing
    global pupil_radii

    if v_type == 'NIR':
        _, thresh = cv2.threshold(imge, 35, 255, cv2.THRESH_BINARY)
        # cv2.imshow('Iris Thresh', thresh)
        # cv2.imwrite('/Users/pranavdeo/Desktop/Results/Iris_Thresh/Frame_' + str(count) + '.png', thresh)
        # cv2.imwrite('/Users/pranavdeo/Desktop/Results/Iris_Canny/Frame_' + str(count) + '.png', canny_img)

        # TO DO: Shadows and Hard-code value of 1.45 and 2.5
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=30, param2=10, minRadius=int(np.average(pupil_radii)*1.45), maxRadius=int(np.average(pupil_radii)*2.5))

        if circles is not None:
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(iris_radii) == 0 or len(iris_radii) <= 15:
                    cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                    iris_radii.append(r)
                    iris_xpoints.append(pup_cen[0])
                    iris_ypoints.append(pup_cen[1])
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 3
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 3
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 3
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 3
                    r_ll = int(np.floor(np.average(iris_radii))) - 1
                    r_ul = int(np.ceil(np.ceil(np.average(iris_radii)))) + 1

                    # TO DO: Do we drop when pupil fails? Or do we bias?

                    if ((x_ll <= x <= x_ul) and (y_ll <= y <= y_ul)) and (r_ll <= r <= r_ul):
                        if len(pup_cen) > 0:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        else:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (0, 0, 255), 1)
                        iris_radii.append(r)

                    else:
                        # print('BIASING: IRIS')
                        r = np.average(iris_radii[-5:])
                        iris_radii.append(r)
                        if len(pup_cen) < 1:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        else:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                Iris_Dilation.append(r)
        return im

    # COLORED VIDEOS
    else:
        _, thresh = cv2.threshold(imge, 80, 255, cv2.THRESH_BINARY)
        cv2.imshow('Iris Threshold', thresh)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=90, param2=30, minRadius=int(np.average(pupil_radii)*1.45), maxRadius=int(np.average(pupil_radii)*4))

        if circles is not None:
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(iris_radii) == 0 or len(iris_radii) < 15:
                    cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                    iris_radii.append(r)
                    iris_xpoints.append(pup_cen[0])
                    iris_ypoints.append(pup_cen[1])
                    # iris_center = [pup_cen[0], pup_cen[1]]
                else:
                    x_ll = int(np.floor(np.average(iris_xpoints))) - 3
                    x_ul = int(np.ceil(np.average(iris_xpoints))) + 3
                    y_ll = int(np.floor(np.average(iris_ypoints))) - 3
                    y_ul = int(np.ceil(np.average(iris_ypoints))) + 3
                    r_ll = int(np.floor(np.average(iris_radii))) - 3
                    r_ul = int(np.ceil(np.average(iris_radii))) + 3

                    if r_ll <= r <= r_ul:
                        if len(pup_cen) > 0:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        else:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        # iris_center = [x, y]
                    else:
                        # print('BIASING: Iris')
                        biasing += 1
                        r = np.average(iris_radii[-30:])
                        iris_radii.append(r)
                        if len(pup_cen) < 1:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        else:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        # iris_center = [x, y]
                Iris_Dilation.append(r)
        else:
            return [], []
        return im


########################################################################################################################

def Pupil_Detection(im, iris_cen, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    cv2.imshow('Gray', imge)
    imge = cv2.equalizeHist(imge)
    cv2.imshow('Hist', imge)
    pupil_center = []
    global pupil_radii
    global pupil_xpoints
    global pupil_ypoints
    # TO DO: Add the color of the center pixel...
    w, h = imge.shape
    # TO DO: Check if still using it
    global biasing

    if v_type == 'NIR':
        _, thresh = cv2.threshold(imge, 15, 255, cv2.THRESH_BINARY)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 1, 300, param1=30, param2=10, minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))

        flg = 0
        # Get the contour detection...
        if contours is not None and circles is not None:
            for c in contours:
                contour_area = cv2.contourArea(c)
                x1, y1, w1, h1 = cv2.boundingRect(c)
                if (2000 < contour_area < 15000) and (0.6 < (w1/h1) < 1.5):
                    # print('> CONTOUR Pupil...')
                    flg = 1
                    coords, r = cv2.minEnclosingCircle(c)
                    dia_p = max(w1, h1)
                    # cv2.circle(im, (int(coords[0]), int(coords[1])), int(r), (0, 255, 0), 1)
                    cv2.circle(im, ((int(x1 + (dia_p / 2))), int((y1 + (dia_p / 2)))), int(dia_p / 2), (0, 255, 0), 1)
                    # cv2.rectangle(im, (x1, y1), (x1+w1, y1+h1), (0, 255, 0), 2)
                    pupil_radii.append(w1/2)
                    Pupil_Dilation.append(w1/2)
                    pupil_xpoints.append(x1 + (dia_p / 2))
                    pupil_ypoints.append(y1 + (dia_p / 2))
                    pupil_center = [x1 + (dia_p / 2), y1 + (dia_p / 2)]

        # Get the Hough Detection in case contour fails...
        elif circles is not None and flg == 0:
            # print('> HOUGH Pupil...')
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(pupil_radii) == 0 or len(pupil_radii) < 15:
                    cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = [x, y]
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 6
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 6
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 6
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 6
                    r_ll = int(np.floor(np.average(pupil_radii))) - 7
                    r_ul = int(np.ceil(np.average(pupil_radii))) + 7

                    if r_ll <= r <= r_ul:
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                    else:
                        print('BIASING: PUPIL')
                        biasing += 1
                        r = np.average(pupil_radii[-30:])
                        pupil_radii.append(r)
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                Pupil_Dilation.append(r)
        else:
            return [], []
        return im, pupil_center

    # COLORED VIDEOS
    else:
        _, thresh = cv2.threshold(imge, 36, 255, cv2.THRESH_BINARY)
        cv2.imshow('Pupil', thresh)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 300, param1=30, param2=10, minRadius=int(h/15), maxRadius=int(w/5))
        # circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 1, 300, param1=30, param2=10, minRadius=int(np.average(iris_radii)/4), maxRadius=int(np.average(iris_radii)/1.2))
        flg = 0

        # Contour Method for Pupil
        if contours is not None:
            for c in contours:
                contour_area = cv2.contourArea(c)
                x1, y1, w1, h1 = cv2.boundingRect(c)
                if (1000 <= contour_area <= 25000) and (0.2 <= (w1 / h1) <= 1.1):
                    # print('> CONTOUR Pupil...')
                    flg = 1
                    coords, r = cv2.minEnclosingCircle(c)
                    # cv2.rectangle(thresh, (x1, y1), (x1 + w1, y1 + h1), (0, 0, 255), 2)
                    dia_p = max(w1, h1)
                    # cv2.circle(im, (int(coords[0]), int(coords[1])), int(r), (0, 255, 0), 1)
                    cv2.circle(im, ((int(x1 + (dia_p / 2))), int((y1 + (dia_p / 2)))), int(dia_p / 2), (0, 255, 0), 1)
                    # cv2.rectangle(im, (x1, y1), (x1+w1, y1+h1), (0, 255, 0), 2)
                    pupil_radii.append(w1 / 2)
                    Pupil_Dilation.append(w1 / 2)
                    pupil_xpoints.append(x1 + (dia_p / 2))
                    pupil_ypoints.append(y1 + (dia_p / 2))
                    pupil_center = [x1 + (dia_p / 2), y1 + (dia_p / 2)]

        # Hough Method when Contour Fails
        elif circles is not None and flg == 0:
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(pupil_radii) == 0 or len(pupil_radii) < 15:
                    cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = [x, y]
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 6
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 6
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 6
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 6
                    r_ll = int(np.floor(np.average(pupil_radii))) - 7
                    r_ul = int(np.ceil(np.average(pupil_radii))) + 7

                    if r_ll <= r <= r_ul:
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                    else:
                        print('BIASING: PUPIL')
                        biasing += 1
                        r = np.average(pupil_radii[-30:])
                        pupil_radii.append(r)
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                Pupil_Dilation.append(r)

        else:
            return [], []
        return im, pupil_center


#####################################################################################################################
# MAIN FUNCTION #
start_time = time.time()
print("\n############################## FACE - PUPIL DETECTION ##############################\n")
flag = 0
count = 0
counter = 0
emptylist = []
kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
global filename
biasing = 0
frame_array = []
Dropped_Frame_Counter = 0

if len(sys.argv) > 1:
    ch = int(sys.argv[1])
    filename = str(sys.argv[2])
    video_type = str(sys.argv[3])
    Orientation = 'Vertical'
    # video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/' + filename)
    video = cv2.VideoCapture('/Users/pranavdeo/Desktop/Trials/' + filename)
else:
    ch = 1
    video_type = 'Color'
    #filename = 'Dr_Niece_Video.mp4'
    filename = 'Trial06.mp4'
    Orientation = 'Horizontal'
    #Orientation = 'Horizontal'
    #filename = 'Test03.MOV'
    #filename = '1080p_04.MOV'
    #ch = 2
    #video_type = 'NIR'
    #video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/1080p_JUST_EYES/' + filename)
    # video = cv2.VideoCapture('/Users/pranavdeo/Desktop/Pain Eyes/' + filename)
    video = cv2.VideoCapture('/Users/pranavdeo/Desktop/Trials/' + filename)


# ***************************************************************************************************
fps = video.get(cv2.CAP_PROP_FPS)
frame_rate = fps
size = ()
print('> FPS: ', fps)

while video.isOpened():
    if counter % 2 == 0:
        ret, frame = video.read()

        if ret:
            frame_num.append(count)
            count = count + 1

            if video_type == 'NIR':
                file_ext = filename.split(".")[-1]
                im = frame
                if file_ext == 'MOV' or file_ext == 'mov' or file_ext == 'MP4' or file_ext == 'mp4':
                    im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
                # im = cv2.filter2D(im, -1, kernel)
                im = cv2.GaussianBlur(im, (5, 5), 0)
                height, width, layers = im.shape
                size = (width, height)
                Pupil, Pupil_center = Pupil_Detection(im, emptylist, video_type)
                if len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) != 0):
                    Pupil_center = [pupil_xpoints[-1], pupil_ypoints[-1]]
                elif len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) == 0):
                    Dropped_Frame_Counter += 1
                if Dropped_Frame_Counter > 10:
                    print('\n# VIDEO DIS-QUALIFIED..!!!')
                    flag = 0
                    break
                if len(Pupil_center) != 0:
                    Iris = Iris_Detection(im, Pupil_center, video_type)
                cv2.imshow('NIR', im)
                frame_array.append(im)
                flag = 1

            elif video_type == 'Color':
                file_ext = filename.split(".")[-1]
                im = frame
                #if file_ext == 'MOV' or file_ext == 'mov' or file_ext == 'MP4' or file_ext == 'mp4':
                #    im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
                im = cv2.filter2D(im, -1, kernel)
                im = cv2.GaussianBlur(im, (5, 5), 0)
                height, width, layers = im.shape
                size = (width, height)
                Pupil, Pupil_center = Pupil_Detection(im, emptylist, video_type)
                if len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) != 0):
                    Pupil_center = [pupil_xpoints[-1], pupil_ypoints[-1]]
                elif len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) == 0):
                    Dropped_Frame_Counter += 1
                if Dropped_Frame_Counter > 10:
                    print('\n# VIDEO DIS-QUALIFIED..!!!')
                    flag = 0
                    break
                if len(Pupil_center) != 0:
                    Iris = Iris_Detection(im, Pupil_center, video_type)
                cv2.imshow('Color', im)
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
    time.sleep(0.10)


# ***************************************************************************************************
# Print all the results
if flag == 1:
    # Creates the video out of the processed frames
    pathOut = '/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Videos/' + (filename.split('.')[0]) + '.mp4'
    out = cv2.VideoWriter(pathOut, cv2.VideoWriter_fourcc(*'DIVX'), fps, size)
    for i in range(len(frame_array)):
        # writing to a image array
        out.write(frame_array[i])
    out.release()

    # Processes and creates Equal Length Lists
    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))
    print('\n')

    if len(Pupil_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Pupil_Dilation)
        for x in range(0, amt):
            Pupil_Dilation.append(Pupil_Dilation[len(Pupil_Dilation)-1])
    elif len(Pupil_Dilation) > len(frame_num):
        amt = len(Pupil_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Pupil_Dilation[len(Pupil_Dilation) - 1]

    if len(Iris_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Iris_Dilation)
        for x in range(0, amt):
            Iris_Dilation.append(Iris_Dilation[len(Iris_Dilation)-1])
    elif len(Iris_Dilation) > len(frame_num):
        amt = len(Iris_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Iris_Dilation[len(Iris_Dilation) - 1]

    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))

    # Creates Dataframes and Plots them
    create_dataframe()
    plot_dilations()


print("\n####################################################################################")

usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
end_time = time.time() - start_time
print('Execution Time : ', end_time, ' sec')
print('Memory Usage : ', (usage/np.power(10, 6)), 'MB')

#####################################################################################################################