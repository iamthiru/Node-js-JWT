#!/usr/bin/env python
# coding: utf-8
# Author: Nagireddi Jagadesh Nischal


import pandas as pd
import os
import numpy as np


main_folders_path= r'C:\Users\Nischal\Desktop\UNBC_Analysis\UNBC_OF'
os.chdir(main_folders_path)

sub_folders= os.listdir('.')
print(sub_folders)


subject_list= os.listdir('.')
print(subject_list)

### generate sub folder paths
sub_folder_paths=[os.getcwd()+"\\"+ x for x in sub_folders]
print(sub_folder_paths)


## Pseudo Code
#for subj in subject_list:
    # Change dir to subj and OPR
    # Get files list from subject folder
    # append file names to a list
 #   for file in file_list:
        # Read the text file and convert to pandas
        # Add the file name and label to an array and append to a list
    # Repeat for all the files and save the new csv files with video names and the OPR labels


# In[42]:

## Main Code

OPR_list=[]
AFF_list=[]
SEN_list=[]
VAS_list=[]
files=[]
############ OPR ###################################################################################################
for subj in subject_list:
    
    folder_path= r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\OPR\\'+str(subj)
    os.chdir(folder_path)

    file_list=os.listdir('.')
    # Change dir to subj and OPR
    # Get files list from subject folder
    # append file names to a list

    for file in file_list:
        # Read the text file and convert to pandas
        data = pd.read_csv(r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\OPR\\'+str(subj)+'\\'+str(file), header=None)
        OPR_list.append(data[0][0])
        files.append(file)
        # Add the file name and label to an array and append to a list
##########################################################################################################################        

############ AFF ###################################################################################################
for subj in subject_list:
    
    folder_path= r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\AFF\\'+str(subj)
    os.chdir(folder_path)

    file_list=os.listdir('.')
    # Change dir to subj and AFF
    # Get files list from subject folder
    # append file names to a list

    for file in file_list:
        # Read the text file and convert to pandas
        data = pd.read_csv(r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\AFF\\'+str(subj)+'\\'+str(file), header=None)
        AFF_list.append(data[0][0])
        files.append(file)
        # Add the file name and label to an array and append to a list
########################################################################################################################## 

############ SEN ###################################################################################################
for subj in subject_list:
    
    folder_path= r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\SEN\\'+str(subj)
    os.chdir(folder_path)

    file_list=os.listdir('.')
    # Change dir to subj and SEN
    # Get files list from subject folder
    # append file names to a list

    for file in file_list:
        # Read the text file and convert to pandas
        data = pd.read_csv(r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\SEN\\'+str(subj)+'\\'+str(file), header=None)
        SEN_list.append(data[0][0])
        files.append(file)
        # Add the file name and label to an array and append to a list
########################################################################################################################## 

############ VAS ###################################################################################################
for subj in subject_list:
    
    folder_path= r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\VAS\\'+str(subj)
    os.chdir(folder_path)

    file_list=os.listdir('.')
    # Change dir to subj and VAS
    # Get files list from subject folder
    # append file names to a list

    for file in file_list:
        # Read the text file and convert to pandas
        data = pd.read_csv(r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\VAS\\'+str(subj)+'\\'+str(file), header=None)
        VAS_list.append(data[0][0])
        files.append(file)
        # Add the file name and label to an array and append to a list
########################################################################################################################## 


    # Repeat for all the files and save the new csv files with video names and the OPR labels


# In[46]:

## Saving data to csv files

list_of_tuples = list(zip(files, OPR_list, AFF_list, SEN_list, VAS_list))  

# Assign data to tuples.  
# list_of_tuples

## Converting lists of tuples into  
# pandas Dataframe
df = pd.DataFrame(list_of_tuples, columns = ['Video_name', 'OPR', 'AFF', 'SEN', 'VAS'])
# # Print data
# df
# convert to csv
df.to_csv (r'C:\Users\Nischal\Desktop\UNBC_Analysis\Sequence_Labels\Summary\UNBC_Labels.csv', index = False, header=True)





