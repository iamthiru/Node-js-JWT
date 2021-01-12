#!/usr/bin/env python
# coding: utf-8

# Author: Nagireddi Jagadesh Nischal

import csv
import matplotlib.pyplot as plt
import pandas as pd
import os

def Combine_label_csv(stimulus_file,human_file):
    ## Reading the stimulus csv files with time stamps and machine labels into lists
    with open(stimulus_file) as csv_file:
        readCSV = csv.reader(csv_file, delimiter='\t')
        time_stamps=[]
        machine_labels=[]
        for row in readCSV:
            time_stamps.append(row[0])
            machine_labels.append(row[1])
    
    ## Reading the human reported csv files with time stamps and human labels into lists
    with open(human_file) as csv_file:
        read_long_CSV = csv.reader(csv_file, delimiter='\t')
        long_time_stamps=[]
        long_labels=[]
        for row in read_long_CSV:
            long_time_stamps.append(row[0])
            long_labels.append(row[1])
    
    ### Finding indexes of timestamps from stimulus csv files in longer human label files
    index_finder=[]
    for element in time_stamps[1:]:
        index_loc=long_time_stamps.index(element)
        index_finder.append(index_loc)
    
    ### Finding offsetted values of the human labels wrt timestamps from stimulus labels into a list 
    final_human_labels=[]
    final_human_labels.append('Human Label')
    for i in index_finder:
        final_human_labels.append(long_labels[i+10])
    
    ### Converting time from microseconds to seconds
    time_convert = 1000000
    newList=time_stamps[1:]
    final_time_list=[]
    final_time_list.append(time_stamps[0])
    for x in newList:
        final_time_list.append(round(float(x) / time_convert,2))
    
    ## Converting the lists into a pandas dataframe
    dict = {'time': final_time_list[1:], 'machine_label': machine_labels[1:], 'human_label': final_human_labels[1:]}
    df = pd.DataFrame(dict)  
    
    ## Add path and file name EDIT TO FILE NAME
    head, tail = os.path.split(stimulus_file)
    df.to_csv(r'C:\Users\Nischal\Desktop\BioVid Data csvs\combined_labels'+'\\'+tail, index=False)
    ######################################################################################################
    #Plotting code, uncomment to check
#     import matplotlib.pyplot as plt
#     ax = plt.gca()
#     df=df.astype(float)
#     df.plot(kind='line',x='time',y='machine_label',ax=ax)
#     df.plot(kind='line',x='time',y='human_label', color='red', ax=ax)
#     plt.show()


## Stimulus csv files path:
stimPath= r'C:\Users\Nischal\Desktop\BioVid Data csvs\stimulus'
os.chdir(stimPath)

## Human Labels files path:
humanPath= r'C:\Users\Nischal\Desktop\BioVid Data csvs\label'


stim_files= os.listdir('.') 
stim_file_path=[os.getcwd()+"\\"+ x for x in stim_files]

## Create directory to save the csv files
os.mkdir(r'C:\Users\Nischal\Desktop\BioVid Data csvs\combined_labels')

## Main loop to run the program
for stim in stim_file_path:
    head, tail = os.path.split(stim)
    human_file_path=humanPath+"\\"+tail
    Combine_label_csv(stim,human_file_path)

