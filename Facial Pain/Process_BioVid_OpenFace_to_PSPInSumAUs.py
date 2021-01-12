#!/usr/bin/env python
# coding: utf-8

# ### Import dependencies for the file


import pandas as pd
import os
import numpy as np


# ### Assumptions and details:
# #### While reading the OpenFace CSV file, we consider a 2 seconds offset after the 4 second pain stimulus to capture facial pain offset
# #### Implying each pain stimulus lasts for 6 seconds


## Loading the video file output from OpenFace and computing PSPI and Sum of AUs to that file. Also, adding the Human Label for each pain stimulus


## Specify paths to OpenFace processed csvs, TimeStamp csvs and output directory
OF_dir_path = r'C:/Users/Nischal/Desktop/Bio_Vid_Final/OpenFace_Output/'
timestamp_dir_path = r'C:/Users/Nischal/Desktop/Bio_Vid_Final/TimeStamp/'
Out_Path = r'C:/Users/Nischal/Desktop/Bio_Vid_Final/Processed_csv_files/'
OF_files = os.listdir(OF_dir_path)

## Function to compute AU43_c (Eye closure) from AU45_c (Eye Blink)
def Sliding_Window_AU43(x_data, num_steps):
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


for f in OF_files:
    if f == '.DS_Store':
        OF_files.remove(f)

for i in range(0, len(OF_files)):

    with open(OF_dir_path + OF_files[i], 'r'):

        with open(timestamp_dir_path + OF_files[i], 'r'):

            key_csv = timestamp_dir_path + OF_files[i]
            search_csv = OF_dir_path + OF_files[i]

            print('Reading and Processing: ', OF_files[i])
            df_key_csv = pd.read_csv(key_csv)
            df_search_csv = pd.read_csv(search_csv)

            Key_csv_timestamps = df_key_csv['time']
            Key_csv_Labels = df_key_csv['human_label']

            Search_csv_timestamps = df_search_csv['timestamp']

            # Initialize new CSV file with Columns:
            Final_DF = pd.DataFrame()
            Final_DF['frames'] = df_search_csv['frame']
            Final_DF['timestamp'] = df_search_csv['timestamp']
            
            Final_DF['AU_01r'] =  df_search_csv['AU01_r']
            Final_DF['AU_02r'] =  df_search_csv['AU02_r']
            Final_DF['AU_04r'] =  df_search_csv['AU04_r']
            Final_DF['AU_05r'] =  df_search_csv['AU05_r']
            Final_DF['AU_06r'] =  df_search_csv['AU06_r']
            Final_DF['AU_07r'] =  df_search_csv['AU07_r']
            Final_DF['AU_09r'] =  df_search_csv['AU09_r']
            Final_DF['AU_10r'] =  df_search_csv['AU10_r']
            Final_DF['AU_12r'] =  df_search_csv['AU12_r']
            Final_DF['AU_14r'] =  df_search_csv['AU14_r']
            Final_DF['AU_15r'] =  df_search_csv['AU15_r']
            Final_DF['AU_17r'] =  df_search_csv['AU17_r']
            Final_DF['AU_20r'] =  df_search_csv['AU20_r']
            Final_DF['AU_23r'] =  df_search_csv['AU23_r']
            Final_DF['AU_25r'] =  df_search_csv['AU25_r']
            Final_DF['AU_26r'] =  df_search_csv['AU26_r']
            Final_DF['AU_45r'] =  df_search_csv['AU45_r']
    
            Final_DF['AU_01c'] = df_search_csv['AU01_c']
            Final_DF['AU_02c'] = df_search_csv['AU02_c']
            Final_DF['AU_04c'] = df_search_csv['AU04_c']
            Final_DF['AU_05c'] = df_search_csv['AU05_c']
            Final_DF['AU_06c'] = df_search_csv['AU06_c']
            Final_DF['AU_07c'] = df_search_csv['AU07_c']
            Final_DF['AU_09c'] = df_search_csv['AU09_c']
            Final_DF['AU_10c'] = df_search_csv['AU10_c']
            Final_DF['AU_12c'] = df_search_csv['AU12_c']
            Final_DF['AU_14c'] = df_search_csv['AU14_c']
            Final_DF['AU_15c'] = df_search_csv['AU15_c']
            Final_DF['AU_17c'] = df_search_csv['AU17_c']
            Final_DF['AU_20c'] = df_search_csv['AU20_c']
            Final_DF['AU_23c'] = df_search_csv['AU23_c']
            Final_DF['AU_25c'] = df_search_csv['AU25_c']
            Final_DF['AU_26c'] = df_search_csv['AU26_c']
            Final_DF['AU_45c'] = df_search_csv['AU45_c']
            
            ## Num_steps is the limit over which AU45_c is classified as eye closure (AU43_c)
            fps=25.0 # For BioVid
            num_steps = int(fps*0.5*2)
            new = Sliding_Window_AU43(Final_DF['AU_45c'], num_steps)

            df_search_csv['AU43_c'] = new['AU43_c']
            Final_DF['AU_43c'] = new['AU43_c']
            
            ## Computing Sum of all AUs from OpenFace
            
            SUM_AU_r = df_search_csv['AU01_r'] + df_search_csv['AU02_r'] + df_search_csv['AU04_r']                        + df_search_csv['AU05_r'] + df_search_csv['AU06_r'] + df_search_csv['AU07_r']                        + df_search_csv['AU09_r'] + df_search_csv['AU10_r'] + df_search_csv['AU12_r']                        + df_search_csv['AU14_r'] + df_search_csv['AU15_r'] + df_search_csv['AU17_r']                        + df_search_csv['AU20_r'] + df_search_csv['AU23_r'] + df_search_csv['AU25_r']                        + df_search_csv['AU26_r'] + df_search_csv['AU43_c']
            Final_DF['SUM_AU_r'] = SUM_AU_r
            
            ## Computing PSPI score using AUs from OpenFace
            
            row_count = df_search_csv.shape[0]
            PSPI = [0.0] * row_count
            indx = 0
            for index, row in df_search_csv.iterrows():
                PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) +                              max(row['AU09_r'], row['AU10_r']) + row['AU43_c'] 

                indx = indx + 1


            Final_DF["PSPI_score"] = PSPI 
            # Uncomment for scaling value between 0 to 1
            #numpy.asarray(PSPI)/15.0
            #PSPI/15.0
            LABEL = [0] * df_search_csv['frame']
            count = 0

            ## Adding Human Label to the csv file (Specific to BioVid files)
            for t in Key_csv_timestamps:
                actual_t = t
                integer_t = int(t)
                if actual_t in Search_csv_timestamps:
                    frame_no = int(25 * actual_t)
                    LABEL[frame_no:frame_no + 151] = Key_csv_Labels[count]
                elif integer_t in Search_csv_timestamps:
                    frame_no = 25 * integer_t + 10
                    LABEL[frame_no:frame_no + 151] = Key_csv_Labels[count]
                count = count + 1

            Final_DF['H_LABEL'] = LABEL
            
            ## Uncomment the following lines to skip saving the specific pain label frame values
#             Final_DF = Final_DF[Final_DF.H_LABEL != 0]
#             Final_DF = Final_DF[Final_DF.H_LABEL != 2]
#             Final_DF = Final_DF[Final_DF.H_LABEL != 3]

            # Saving files as csvs
            Final_DF.to_csv(Out_Path + OF_files[i], index=False)

    print('File Done..')





## Code to combine BioVid files into a single csv

df1=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\071709_w_23.csv')
df2=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\071911_w_24.csv')
df3=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\073114_m_25.csv')
df4=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\080309_m_29.csv')
df5=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\080714_m_23.csv')
df6=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\081014_w_27.csv')

df7=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\091814_m_37.csv')
df8=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\092808_m_51.csv')
df9=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\100117_w_36.csv')
df10=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\100909_w_65.csv')
df11=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\101814_m_58.csv')
df12=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\111914_w_63.csv')

df13=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\112310_m_20.csv')
df14=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\112809_w_23.csv')
df15=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\120514_w_56.csv')
df16=pd.read_csv(r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\092813_w_24.csv')


final_file=pd.concat([df1, df2, df3, df4, df5, df6, df7,df8,df9,df10,df11,df12,df13,df14,df15,df16], ignore_index=True)
final_file.to_csv (r'C:\Users\Nischal\Desktop\Bio_Vid_Final\Processed_csv_files\combined_BioVid_16.csv', index = False, header=True)





# Uncomment to check Check fps of any Video
# import cv2
# import time

# if __name__ == '__main__' :

#     # Start default camera
#     video = cv2.VideoCapture(r'C:\Users\Nischal\Desktop\Bio_vid_video2\071709_w_23.mp4')

#     # Find OpenCV version
#     (major_ver, minor_ver, subminor_ver) = (cv2.__version__).split('.')

#     # With webcam get(CV_CAP_PROP_FPS) does not work.
#     # Let's see for ourselves.

#     if int(major_ver)  < 3 :
#         fps = video.get(cv2.cv.CV_CAP_PROP_FPS)
#         print("Frames per second using video.get(cv2.cv.CV_CAP_PROP_FPS): {0}".format(fps))
#     else :
#         fps = video.get(cv2.CAP_PROP_FPS)
#         print("Frames per second using video.get(cv2.CAP_PROP_FPS) : {0}".format(fps))

#     # Number of frames to capture
#     num_frames = 120;

#     print("Capturing {0} frames".format(num_frames))

#     # Start time
#     start = time.time()

#     # Grab a few frames
#     for i in range(0, num_frames) :
#         ret, frame = video.read()

#     # End time
#     end = time.time()

#     # Time elapsed
#     seconds = end - start
#     print ("Time taken : {0} seconds".format(seconds))

#     # Calculate frames per second
#     fps  = num_frames / seconds
#     print("Estimated frames per second : {0}".format(fps))

#     # Release video
#     video.release()

## FPS for BioVid videos is 25

