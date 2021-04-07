# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content

# Code Description:
# Appending columns: OpenFace_PSPI, SUM_AU, AU43_c and Labels: OPR, AFF, SEN, VAS
# FINALLY CREATING CSVs and GRAPHING

import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt


# ********************************************************************************************
# Part 1: Creating Main CSV files with AU43, OpenFace PSPI, SUM_AU, OPR, VAS, SEN, AFF labels.
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


inpath = '/Users/pranavdeo/Desktop/UNBC/'
outpath = '/Users/pranavdeo/Desktop/UNBC_Out/'
summary_file = pd.read_csv('/Users/pranavdeo/Desktop/UNBC_Labels.csv')
dir_list = os.listdir(inpath)

for d in dir_list:
    if d != '.DS_Store':
        ip = inpath + d
        op = outpath + d
        os.mkdir(op)
        files = os.listdir(ip)
        csv_files = [fl for fl in files if fl.endswith('.csv')]

        for f in csv_files:
            videofile = os.path.splitext(f)[0]
            df = pd.read_csv(ip + '/' + f)
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

            num_steps = 8
            new = Sliding_Window_AU43(Final_DF['AU_45c'], num_steps + 5)

            df['AU43_c'] = new['AU43_c']
            Final_DF['AU_43c'] = new['AU43_c']

            row_count = df.shape[0]
            PSPI = [0.0] * row_count
            indx = 0

            # Computing OpenFace PSPI:
            for index, row in df.iterrows():
                PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) + \
                             max(row['AU09_r'], row['AU10_r']) + row['AU43_c']
                indx = indx + 1

            # Computing SUM_AU_r
            sum_AU_r = df['AU01_r'] + df['AU02_r'] + df['AU04_r'] + df['AU05_r'] + df['AU06_r'] + df['AU07_r'] \
                       + df['AU09_r'] + df['AU10_r'] + df['AU12_r'] + df['AU14_r'] + df['AU15_r'] + df['AU17_r'] \
                       + df['AU20_r'] + df['AU23_r'] + df['AU25_r'] + df['AU26_r'] + df['AU43_c']

            Final_DF['OpenFace_PSPI'] = PSPI
            Final_DF['sum_AU_r'] = sum_AU_r

            # Pulling out Labels from UNBC Sequence Labels
            for indx, rw in summary_file.iterrows():
                if videofile == rw['Video_name']:
                    Final_DF['OPR'] = rw['OPR']
                    Final_DF['AFF'] = rw['AFF']
                    Final_DF['SEN'] = rw['SEN']
                    Final_DF['VAS'] = rw['VAS']

            Final_DF.to_csv(op + '/' + f, index=False)
            print('>File Done')


# ********************************************************************************************
# Part 2: Adding UNBC_PSPI values from the individual files to the CSVs
inpath = '/Users/pranavdeo/Desktop/PSPI/'
outpath = '/Users/pranavdeo/Desktop/OUT/'
os.mkdir(outpath)
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
                    fl = open(inpath + d + '/' + d2 + '/' + txtfile)
                    storage_list.append(float(fl.readline()))
                    fl.close()

                DF = pd.DataFrame(storage_list, columns=['UNBC_PSPI'])
                DF['UNBC_PSPI'] = storage_list
                DF.to_csv(outpath + d2 + '.csv', index=False)


# ********************************************************************************************
# Part 3: From these CSVs write to the Main CSV file
inpath = '/Users/pranavdeo/Desktop/OUT/'
outpath = '/Users/pranavdeo/Desktop/UNBC_Out/'
file_list = os.listdir(inpath)
dir = os.listdir(outpath)

for d in dir:
    if d != '.DS_Store':
        lst = os.listdir(outpath + d)
        for file in lst:
            col = ['UNBC_PSPI']
            print(outpath + d + '/' + file, ' : ', inpath + file)
            df_main_csv = pd.read_csv(outpath + d + '/' + file)
            df_small_csv = pd.read_csv(inpath + file, usecols=col)
            df_main_csv['UNBC_PSPI'] = df_small_csv['UNBC_PSPI']
            df_main_csv.to_csv(outpath + d + '/' + file, index=False)

print('\nProcess Complete')


# ********************************************************************************************
# Part 4: Graphing the Main CSV files
src = '/Users/pranavdeo/Desktop/UNBC_Out/'
dst = '/Users/pranavdeo/Desktop/UNBC_Graphs/'
os.mkdir(dst)

print('\n\n> GRAPHING THE FILES....')

dirs = [d for d in os.listdir(src) if d != '.DS_Store']

# Create dir in the output folder
for dir in dirs:
    os.mkdir(dst+dir)

# Read the CSVs from input dir, create graphs and save them
for dr in dirs:
    files = os.listdir(src+dr)
    for f in files:
        name = os.path.splitext(f)[0]
        df = pd.read_csv(src+dr+'/'+f, usecols=['frames', 'OpenFace_PSPI', 'sum_AU_r', 'UNBC_PSPI', 'OPR', 'VAS', 'SEN', 'AFF'])
        x = df['frames']
        y1 = df['OpenFace_PSPI']
        y2 = df['sum_AU_r']
        y3 = df['UNBC_PSPI']
        y4 = df['OPR']
        y5 = df['VAS']
        y6 = df['SEN']
        y7 = df['AFF']
        plt.plot(x, y1, label='OpenFace PSPI')
        plt.plot(x, y2, label='Sum AUs')
        plt.plot(x, y3, label='UNBC PSPI')
        plt.plot(x, y4, label='OPR')
        plt.plot(x, y5, label='VAS')
        plt.plot(x, y6, label='SEN')
        plt.plot(x, y7, label='AFF')
        plt.xlabel('Frames')
        plt.ylabel('PSPI Metrics, Labels')
        plt.legend()
        plt.savefig(dst+dr+'/'+name+'.png')
        plt.close()

print('\n> GRAPHING COMPLETE...')

# ********************************************************************************************
