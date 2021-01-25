# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content

# Code Description:
# Appending the column containing UNBC PSPI values to the final CSV file...

import pandas as pd
import os

'''
# Part 1: Append the values from the individual files to the CSVs
inpath = '/Users/pranavdeo/Desktop/PSPI/'
outpath = '/Users/pranavdeo/Desktop/OUT/'

# Part 1: Create csv files for every video file with UNBC PSPI score
dir = os.listdir(inpath)
for d in dir:
    if d != '.DS_Store':
        dirL1 = os.listdir(inpath + d)

        for d2 in dirL1:
            if d2 != '.DS_Store':
                print(d2)
                storage_list = []
                dirL2 = sorted(os.listdir(inpath + d + '/' + d2))

                for txtfile in dirL2:
                    #print(txtfile)
                    fl = open(inpath + d + '/' + d2 + '/' + txtfile)
                    storage_list.append(float(fl.readline()))
                    fl.close()

                DF = pd.DataFrame(storage_list, columns=['UNBC_PSPI'])
                DF['UNBC_PSPI'] = storage_list
                DF.to_csv(outpath+d2+'.csv', index=False)
'''

# Part 2: From these CSVs
outpath = '/Users/pranavdeo/Desktop/UNBC_Out/'
inpath = '/Users/pranavdeo/Desktop/OUT/'
file_list = os.listdir(inpath)

dir = os.listdir(outpath)

for d in dir:
    if d != '.DS_Store':
        print(d)
        lst = os.listdir(outpath+d)
        for file in lst:
            col = ['UNBC_PSPI']
            print(outpath+d+'/'+file, ' : ', inpath+file)
            df_main_csv = pd.read_csv(outpath+d+'/'+file)
            df_small_csv = pd.read_csv(inpath+file, usecols=col)
            df_main_csv['UNBC_PSPI'] = df_small_csv['UNBC_PSPI']
            df_main_csv.to_csv(outpath+d+'/'+file, index=False)
