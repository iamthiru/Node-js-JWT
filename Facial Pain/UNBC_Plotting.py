# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content

# Code Description: Plotting the UNBC score and OpenFace PSPI Scores


import pandas as pd
import matplotlib.pyplot as plt
import os

src = '/Users/pranavdeo/Desktop/UNBC_Final_CSVs/'
dst = '/Users/pranavdeo/Desktop/UNBC_Graphs/'

dirs = [d for d in os.listdir(src) if d != '.DS_Store']

# Create dir in the output folder
for dir in dirs:
    os.mkdir(dst+dir)

# Read the CSVs from input dir, create graphs and save them
for dr in dirs:
    files = os.listdir(src+dr)
    for f in files:
        name = os.path.splitext(f)[0]
        df = pd.read_csv(src+dr+'/'+f, usecols=['frames', 'OpenFace_PSPI', 'sum_AU_r', 'UNBC_PSPI'])
        x = df['frames']
        y1 = df['OpenFace_PSPI']
        y2 = df['sum_AU_r']
        y3 = df['UNBC_PSPI']
        plt.plot(x, y1, label='OpenFace PSPI')
        plt.plot(x, y2, label='Sum AUs')
        plt.plot(x, y3, label='UNBC PSPI')
        plt.xlabel('Frames')
        plt.ylabel('PSPI Metrics')
        plt.legend()
        plt.savefig(dst+dr+'/'+name+'.png')
        plt.close()
