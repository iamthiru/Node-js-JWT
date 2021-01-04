# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content

# Code Description:
# This will create new csv files instead of appending to the same ones. Just for safety...

import pandas as pd
import os

inpath = '/Users/pranavdeo/Desktop/UNBC/'
outpath = '/Users/pranavdeo/Desktop/UNBC_Out/'
dir_list = os.listdir(inpath)

for d in dir_list:
    if d != '.DS_Store':
        ip = inpath + d
        op = outpath + d
        os.mkdir(op)
        files = os.listdir(ip)
        csv_files = [fl for fl in files if fl.endswith('.csv')]

        for f in csv_files:
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

            row_count = df.shape[0]
            PSPI = [0.0] * row_count
            indx = 0
            for index, row in df.iterrows():
                PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) + \
                             max(row['AU09_r'], row['AU10_r']) + row['AU45_c']
                indx = indx + 1

            sum_AU_r = df['AU01_r'] + df['AU02_r'] + df['AU04_r'] + df['AU05_r'] + df['AU06_r'] + df['AU07_r'] \
                       + df['AU09_r'] + df['AU10_r'] + df['AU12_r'] + df['AU14_r'] + df['AU15_r'] + df['AU17_r'] \
                       + df['AU20_r'] + df['AU23_r'] + df['AU25_r'] + df['AU26_r'] + df['AU45_r']

            Final_DF['OpenFace_PSPI'] = PSPI
            Final_DF['sum_AU_r'] = sum_AU_r
            Final_DF.to_csv(op + '/' + f, index=False)
            print('>File Done')

print('\nProcess Complete')

