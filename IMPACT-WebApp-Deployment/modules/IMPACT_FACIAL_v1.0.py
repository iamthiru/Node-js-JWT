# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content
# Date: 05/05/2021
# Version: v1.0

# Code Description:
# Code built to read a video and predict second wise pain detection as well as predicting a single score for the video.
# OpenFace toolbox is used to generate the AU values and we compute scores per frame for Sum of AUs and PSPI.
# The Sum of AU scores are passed through an algorithm which has a sliding window which classifies each second of the
# video into 1 'Neutral/ No Pain' class and 3 'Pain' classes based on the separating boundary between BioVid
# Dataset Heat level boundaries shown by the selected video files (As mentioned in the Github Readme file).
# The algorithm also computes a single video score based on a weighted sum formula (Based on actual mean of
# the pain level scores).

# UPDATES:
# Added comments to explain all the functions in a detailed manner
# Added time tracking and module imports

########################################################################################################################
# PACKAGE IMPORTS
import os
import sys
import cv2
import time
import subprocess
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# MODULE IMPORTS
import Data_Processing

# INITIALIZATIONS:
start_time = time.time()


#######################################################################################################################

# Function to Detect Faces and get the AU values from the video. Output would be a csv file with frame wise scores
def OpenFace_API_Call(ipath, opath):
    print("> OpenFace Feature Extraction Command Executed !!")
    cmd = "OpenFace/build/bin/FeatureExtraction -f " + ipath + " -out_dir " + opath + " -aus"
    print("> Command : ", cmd)
    subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True).communicate()


#######################################################################################################################

# Read the video for fps calculation useful for calculation of eye closure and sliding window values.
def fps_calculator(video_path):
    # Read the video
    vid = cv2.VideoCapture(video_path)
    # Find OpenCV version
    fps = vid.get(cv2.CAP_PROP_FPS)
    return fps


#######################################################################################################################

# Run computations on the csv file and attach new columns to the csv files
# Function to compute AU43_c (Eye closure) from AU45_c (Eye Blink)
def Calculate_AU43(x_data, num_steps):
    # Create empty list of the size of AU_45c
    new = pd.DataFrame(np.zeros((len(x_data), 1)), columns=['AU43_c'])
    # Loop over AU_45c and identify longer lists of eye closure detections
    for i in range(x_data.shape[0]):
        # compute a new (sliding window) index
        end_ix = i + num_steps
        # if index is larger than the size of the list, end loop
        if end_ix >= x_data.shape[0]:
            break
        # Compute product of the elements and check for 1 (Eye closure) over the num_steps
        score = x_data[i:end_ix]
        mult = np.prod(score)
        if mult == 1.0:
            new['AU43_c'][i:end_ix] = 1.0
    return new


#######################################################################################################################

# Computing PSPI, AU43 and SUM_AUs and adding them to the final processed csv file and saving the file
def Compute_PSPI_AUs(opath, fpath, D):
    df = pd.read_csv(fpath)

    Final_DF = pd.DataFrame()
    Final_DF['frames'] = df['frame']
    Final_DF['timestamp'] = df['timestamp']
    Final_DF['AU_01r'] = df['AU01_r']
    Final_DF['AU_02r'] = df['AU02_r']
    Final_DF['AU_04r'] = df['AU04_r']
    Final_DF['AU_05r'] = df['AU05_r']
    Final_DF['AU_06r'] = df['AU06_r']
    Final_DF['AU_07r'] = df['AU07_r']
    Final_DF['AU_09r'] = df['AU09_r']
    Final_DF['AU_10r'] = df['AU10_r']
    Final_DF['AU_12r'] = df['AU12_r']
    Final_DF['AU_14r'] = df['AU14_r']
    Final_DF['AU_15r'] = df['AU15_r']
    Final_DF['AU_17r'] = df['AU17_r']
    Final_DF['AU_20r'] = df['AU20_r']
    Final_DF['AU_23r'] = df['AU23_r']
    Final_DF['AU_25r'] = df['AU25_r']
    Final_DF['AU_26r'] = df['AU26_r']
    Final_DF['AU_45r'] = df['AU45_r']

    Final_DF['AU_01c'] = df['AU01_c']
    Final_DF['AU_02c'] = df['AU02_c']
    Final_DF['AU_04c'] = df['AU04_c']
    Final_DF['AU_05c'] = df['AU05_c']
    Final_DF['AU_06c'] = df['AU06_c']
    Final_DF['AU_07c'] = df['AU07_c']
    Final_DF['AU_09c'] = df['AU09_c']
    Final_DF['AU_10c'] = df['AU10_c']
    Final_DF['AU_12c'] = df['AU12_c']
    Final_DF['AU_14c'] = df['AU14_c']
    Final_DF['AU_15c'] = df['AU15_c']
    Final_DF['AU_17c'] = df['AU17_c']
    Final_DF['AU_20c'] = df['AU20_c']
    Final_DF['AU_23c'] = df['AU23_c']
    Final_DF['AU_25c'] = df['AU25_c']
    Final_DF['AU_26c'] = df['AU26_c']
    Final_DF['AU_45c'] = df['AU45_c']

    num_steps = video_fps * 0.45  # (video fps*0.45 sec, convert to int, denotes average human eye blink)
    new = Calculate_AU43(Final_DF['AU_45c'], int(num_steps * 2))

    df['AU43_c'] = new['AU43_c']
    Final_DF['AU_43c'] = new['AU43_c']

    row_count = df.shape[0]
    PSPI = [0.0] * row_count
    indx = 0

    # Computing OpenFace PSPI:
    for index, row in df.iterrows():
        PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) + \
                     max(row['AU09_r'], row['AU10_r']) + row['AU43_c']
        indx += 1

    # Computing SUM_AU_r
    sum_AU_r = df['AU01_r'] + df['AU02_r'] + df['AU04_r'] + df['AU05_r'] + df['AU06_r'] + df['AU07_r'] \
               + df['AU09_r'] + df['AU10_r'] + df['AU12_r'] + df['AU14_r'] + df['AU15_r'] + df['AU17_r'] \
               + df['AU20_r'] + df['AU23_r'] + df['AU25_r'] + df['AU26_r'] + df['AU43_c']

    Final_DF['OpenFace_PSPI'] = PSPI
    Final_DF['sum_AU_r'] = sum_AU_r

    Final_DF.to_csv(opath + '/' + D + '_PSPI_AUs.csv', index=False)
    # print("     # Read Complete! Attempting to write CSV files...")
    print("# CSV written successfully !!")


#######################################################################################################################

# BUCKET CODE : Run the Sliding window on the above csv file to classify the pain into buckets
# Function to have a sliding window over the frame values to classify pain as one of the 4 bucket classes
# NOTE: Any other mode of calculation (DL approaches) would come here in classifying the sequence of frames into buckets
def Calculate_Pain_Labeler(opath, fpath, D, num_steps):
    # Sliding window for calculating pain levels
    video_csv = pd.read_csv(fpath)

    # Bucket threshold values here:
    no_pain_UL = 5.18  # (Calculated by using Delaware Pain DB and computing scores on Neutral faces)
    pain_1_UL = 6.78  # (BioVid Pain 1 and Pain 2 labels below)
    pain_2_UL = 8.05  # (BioVid Pain 3 label below, Pain 4 label above)

    start_ix = 0
    end_ix = num_steps
    x_data = video_csv["sum_AU_r"]
    Word_Label = []

    # For the first sequence of frames:
    seq_X = x_data[start_ix:end_ix]
    slider_value = seq_X.mean()

    if slider_value <= no_pain_UL:
        Word_Label.append("No Pain")
    elif no_pain_UL < slider_value <= pain_1_UL:
        Word_Label.append("Pain Level 1")
    elif pain_1_UL < slider_value <= pain_2_UL:
        Word_Label.append("Pain Level 2")
    elif slider_value > pain_2_UL:
        Word_Label.append("Pain Level 3")

    # Loop of the entire data set (apart from the first sequence)
    for i in range(x_data.shape[0]):
        # compute a new (sliding window) index
        start_ix = start_ix + num_steps
        end_ix = end_ix + num_steps
        # if index is larger than the size of the dataset, we stop
        if end_ix >= x_data.shape[0]:
            break
        # Get a sequence of data for x
        seq_X = x_data[start_ix:end_ix]
        slider_value = seq_X.mean()

        if slider_value <= no_pain_UL:
            Word_Label.append("No Pain")
        elif no_pain_UL < slider_value <= pain_1_UL:
            Word_Label.append("Pain Level 1")
        elif pain_1_UL < slider_value <= pain_2_UL:
            Word_Label.append("Pain Level 2")
        elif slider_value > pain_2_UL:
            Word_Label.append("Pain Level 3")

        label_csv = pd.DataFrame(Word_Label)
        label_csv.columns = {'Label'}
        label_csv['Time (sec)'] = range(1, len(Word_Label) + 1)
        label_csv['Video Score'] = 0
        label_csv = label_csv[['Time (sec)', 'Label', 'Video Score']]
        label_csv.to_csv(opath + '/' + D + '_LabelFile.csv', index=False)

    return Word_Label


#######################################################################################################################

# Video Labeler: Used to read the csv file and generate a new file with high level second and pain scores.
# Also used to compute a video score using a weighted formula.
def Video_Labeler(opath, D, label_list):
    # Value of each level (Mean of the pain levels as calcuated using BioVid Dataset):
    Pain_0 = 5.18
    Pain_1 = 6.44
    Pain_2 = 7.07
    Pain_3 = 9.032

    count_np = 0
    count_p1 = 0
    count_p2 = 0
    count_p3 = 0

    for level in label_list:
        if level == 'No Pain':
            count_np += 1
        if level == 'Pain Level 1':
            count_p1 += 1
        if level == 'Pain Level 2':
            count_p2 += 1
        if level == 'Pain Level 3':
            count_p3 += 1

    # print("The sliding window counter:    ")
    # print("No Pain count is:   ", count_np)
    # print("Pain 1 count is:    ", count_p1)
    # print("Pain 2 count is:    ", count_p2)
    # print("Pain 3 count is:    ", count_p3)

    score = (count_np * Pain_0 + count_p1 * Pain_1 + count_p2 * Pain_2 + count_p3 * Pain_3) / len(label_list)
    score = ((score - Pain_0) / (Pain_3 - Pain_0)) * 10
    label_file = pd.read_csv(opath + '/' + D + '_LabelFile.csv')
    label_file['Video Score'] = score
    label_file.to_csv(opath + '/' + D + '_LabelFile.csv', index=False)
    print("Final score for the video is : ", score)
    return score


#######################################################################################################################

# Plotting the Pain graph
def Graph_Plot(opath, fname, fl, flag):
    print("> Plotting Pain...")
    df = pd.read_csv(opath + fname)
    b = df['sum_AU_r']
    a = df['frames']
    plt.plot(a, b)
    plt.xlabel('Frames')
    plt.ylabel('Pain Score')
    if flag == 0:
        plt.savefig(opath + fl + '_Pain_Plot.png')
    else:
        plt.savefig(opath + '_Pain_Plot.png')
    print("# Pain Plot Complete")
    plt.close()


#######################################################################################################################

# __MAIN__
if __name__ == "__main__":
    in_path = ""
    out_path = "static/Face_Output_Images/"
    tag = 0

    if len(sys.argv) > 1:
        print("\n############################## IMPACT FACIAL ##############################")
        global filenm
        filenm = str(sys.argv[1])
        in_path = "static/Face_Input_Videos/" + filenm
        tag = 1
    else:
        print("\n############################## IMPACT FACIAL ##############################")
        filenm = "face.mp4"
        in_path = "static/Face_Input_Videos/" + filenm

    print("\n************* Video Capture Complete *************")
    print("> Extracting Features...")
    video_fps = fps_calculator(in_path)

    if tag == 1:
        print('> FPS: ', video_fps)
        OpenFace_API_Call(in_path, out_path)
        Compute_PSPI_AUs(out_path, out_path + os.path.splitext(filenm)[0] + '.csv', os.path.splitext(filenm)[0])
        video_label_list = Calculate_Pain_Labeler(out_path, out_path + os.path.splitext(filenm)[0] + '_PSPI_AUs.csv',
                                                  os.path.splitext(filenm)[0], int(video_fps))
        final_video_label = Video_Labeler(out_path, os.path.splitext(filenm)[0], video_label_list)
        Graph_Plot(out_path, os.path.splitext(filenm)[0] + '_PSPI_AUs.csv', os.path.splitext(filenm)[0], 0)
    else:
        OpenFace_API_Call(in_path, out_path)
        Compute_PSPI_AUs(out_path, out_path + 'face.csv', 'face')
        video_label_list = Calculate_Pain_Labeler(out_path, out_path + 'face_PSPI_AUs.csv', 'face', int(video_fps))
        final_video_label = Video_Labeler(out_path, os.path.splitext(filenm)[0], video_label_list)
        Graph_Plot(out_path, 'face_PSPI_AUs.csv', 'face', 0)

    print("\n############################## END OF EXECUTION ##############################")
########################################################################################################################

# Compute Resources being used or utilized
print('\n***************************************************************************')
Data_Processing.Compute_Resources(start_time)
########################################################################################################################
