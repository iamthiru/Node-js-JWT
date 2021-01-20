#!/usr/bin/env python
# coding: utf-8
# Author: Nagireddi Jagadesh Nischal
# File: Facial Pain processing code 


# Import dependencies here:

import pandas as pd
import os
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats



# Config File: (PENDING)

video='Input.mp4'

# Bucket values here

no_pain_UL= 5.55
pain_1_UL= 6.858448655155239
pain_2_UL= 7.511978468639286
pain_3_UL= 9.5308146345487535

# Run the main py file here




# Read the video for fps calculation:
def fps_calculator(video_name):
    # Read the video
    video = cv2.VideoCapture('/content/drive/'+ video_name)

    # Find OpenCV version
    (major_ver, minor_ver, subminor_ver) = (cv2.__version__).split('.')

    if int(major_ver)  < 3 :
        fps = video.get(cv2.cv.CV_CAP_PROP_FPS)
        print("Frames per second using video.get(cv2.cv.CV_CAP_PROP_FPS): {0}".format(fps))
    else :
        fps = video.get(cv2.CAP_PROP_FPS)
        print("Frames per second using video.get(cv2.CAP_PROP_FPS) : {0}".format(fps))
    return fps



# Run OpenFace for the video

# change file name to a variable
get_ipython().system("/content/OpenFace/build/bin/FeatureExtraction -f video -out_dir '/content/drive/MyDrive/' -aus")




# Check if the video was processed properly (Confidence check)

# Run the csv through a loop to check the confidence column





# Read the video output csv file
def read_csv(video_csv):
    df=pd.read_csv('/content/drive/MyDrive/' + video_csv)
    return df



# Run computations on the csv file and attach new columns

## Function to compute AU43_c (Eye closure) from AU45_c (Eye Blink)
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



def compute_sums(csv_file):
    outpath = '/content/drive/MyDrive/'

    # Take in the variable for csv here
    df = csv_file
    
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

    num_steps = video_fps*0.45 # (video fps*0.45 sec, convert to int, denotes average human eye blink)
    new = Calculate_AU43(Final_DF['AU_45c'], int(num_steps*2))

    df['AU43_c'] = new['AU43_c']
    Final_DF['AU_43c'] = new['AU43_c']

    row_count = df.shape[0]
    PSPI = [0.0] * row_count
    indx = 0

    # Computing OpenFace PSPI:
    for index, row in df.iterrows():
        PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) + max(row['AU09_r'], row['AU10_r']) + row['AU43_c']
        indx = indx + 1

    # Computing SUM_AU_r
    sum_AU_r = df['AU01_r'] + df['AU02_r'] + df['AU04_r'] + df['AU05_r'] + df['AU06_r'] + df['AU07_r']  + df['AU09_r'] + df['AU10_r'] + df['AU12_r'] + df['AU14_r'] + df['AU15_r'] + df['AU17_r']                + df['AU20_r'] + df['AU23_r'] + df['AU25_r'] + df['AU26_r'] + df['AU43_c']

    Final_DF['OpenFace_PSPI'] = PSPI
    Final_DF['sum_AU_r'] = sum_AU_r

    Final_DF.to_csv(op + '/result.csv', index=False)
    print('File Processed')




### BUCKET CODE

# Run the Sliding window on the above csv file

# Function to have a sliding window over the frame values to predict pain
def Pain_labeler(video_csv, num_steps=video_fps):
    """ Sliding window for calculating pain levels """
    
    start_ix=0
    end_ix=num_steps
    
    # Uncomment to use PSPI as the scale
    #x_data=video_csv["PSPI_score"]

    x_data=video_csv["SUM_AU_r"]
    Pain_label=video_csv["H_LABEL"]
    
    Word_Label=[]
    
    # For the first sequence of frames: ########################################
    seq_X = x_data[start_ix:end_ix]
    slider_value=seq_X.mean()
    
    if slider_value<= no_pain_UL:
        Word_Label.append("No Pain")
    elif slider_value >no_pain_UL and one_second_value<pain_1_UL:
        Word_Label.append("Pain Level 1")
    elif slider_value >pain_1_UL and one_second_value<pain_2_UL:
        Word_Label.append("Pain Level 2")
    elif slider_value >pain_2_UL and one_second_value<pain_3_UL:
        Word_Label.append("Pain Level 3")
    elif slider_value >pain_3_UL:
        Word_Label.append("Pain Level 4")
    ############################################################################

    # Loop of the entire data set (apart from the first sequence)
    for i in range(x_data.shape[0]):
        # compute a new (sliding window) index
        start_ix= start_ix + num_steps
        end_ix = end_ix + num_steps
        # if index is larger than the size of the dataset, we stop
        if end_ix >= x_data.shape[0]:
            break
        # Get a sequence of data for x
        seq_X = x_data[start_ix:end_ix]
        slider_value=seq_X.mean()
        
        H_pain=Pain_label[start_ix:end_ix]
        y_mean_label = stats.mode(H_pain)
        y_label = y_mean_label[0][0]
        True_Pain_label.append(y_label)
        
        if slider_value<= no_pain_UL:
            Word_Label.append("No Pain")
        elif slider_value >no_pain_UL and one_second_value<pain_1_UL:
            Word_Label.append("Pain Level 1")
        elif slider_value >pain_1_UL and one_second_value<pain_2_UL:
            Word_Label.append("Pain Level 2")
        elif slider_value >pain_2_UL and one_second_value<pain_3_UL:
            Word_Label.append("Pain Level 3")
        elif slider_value >pain_3_UL:
            Word_Label.append("Pain Level 4")

    return Word_Label



# Video labeller
def Label(video_label_list):
    count_np=0
    count_p1=0
    count_p2=0
    count_p3=0
    count_p4=0
    for level in video_label_list:
        if level=='No Pain':
            count_np+=1
        if level=='Pain Level 1':
            count_p1+=1
        if level=='Pain Level 2':
            count_p2+=1
        if level=='Pain Level 3':
            count_p3+=1
        if level=='Pain Level 4':
            count_p4+=1
    print("The sliding window counter:    ")
    print("No Pain count is:   ",count_np)
    print("Pain 1 count is:    ",count_p1)
    print("Pain 2 count is:    ",count_p2)
    print("Pain 3 count is:    ",count_p3)
    print("Pain 4 count is:    ",count_p4)
    
    score= (count_np*no_pain_UL + count_p1*pain_1_UL + count_p2*pain_2_UL + count_p3*pain_3_UL + count_p4*pain_4)/ len(video_label_list)
    print("Final score for the video is : ", score)


# Plot the results

def Plotter(video_csv):
    x_data=video_csv["SUM_AU_r"]
    plt.plot(x_data)
    plt.plot(Final_DF['SUM_AU_r'])
    plt.ylabel('Sum_of_AUs_score')
    plt.xlabel('Frames')
    plt.axhline(y=no_pain_UL, color='r', linestyle='-')
    plt.axhline(y=pain_1_UL, color='b', linestyle='-')
    plt.axhline(y=pain_2_UL, color='b', linestyle='-')
    plt.axhline(y=pain_3_UL, color='b', linestyle='-')
    plt.legend()
    plt.savefig('/content/drive/MyDrive/Video_pain_plot.png')


# Main Code:

video_fps = fps_calculator(video)

## Check video validity

output_csv=read_csv(video_csv)

compute_sums(output_csv)

video_label_list=Pain_labeler(video_csv, num_steps=video_fps)

Label(video_label_list)

Plotter(video_csv)

print('Video Processing completed')




