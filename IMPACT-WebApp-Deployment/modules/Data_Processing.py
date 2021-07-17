# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content
# Date: 05/05/2021

# Module Description:
# * Output Video Generator
# * List Processing
# * DataFrame Creator
# * Graph Plotter
# * Resource Sharer

########################################################################################################################
# PACKAGE IMPORTS
import cv2
import os
import time
import resource
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


########################################################################################################################

def Output_Visual_Video_Generate(fln, fps, size, frame_array):
    pathOut = './static/Pupil_Output_Videos/' + (fln.split('.')[0]) + '.mp4'
    out = cv2.VideoWriter(pathOut, cv2.VideoWriter_fourcc(*'DIVX'), fps, size)
    for i in range(len(frame_array)):
        out.write(frame_array[i])
    out.release()


########################################################################################################################

def List_Processing(frame_num, Pupil_Dilation, Iris_Dilation):
    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))

    if len(Pupil_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Pupil_Dilation)
        for x in range(0, amt):
            Pupil_Dilation.append(Pupil_Dilation[len(Pupil_Dilation) - 1])
    elif len(Pupil_Dilation) > len(frame_num):
        amt = len(Pupil_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Pupil_Dilation[len(Pupil_Dilation) - 1]

    if len(Iris_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Iris_Dilation)
        for x in range(0, amt):
            Iris_Dilation.append(Iris_Dilation[len(Iris_Dilation) - 1])
    elif len(Iris_Dilation) > len(frame_num):
        amt = len(Iris_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Iris_Dilation[len(Iris_Dilation) - 1]

    # print('Frames : ', len(frame_num))
    # print('Iris Dilation : ', len(Iris_Dilation))
    # print('Pupil Dilation : ', len(Pupil_Dilation))

    return Pupil_Dilation, Iris_Dilation


########################################################################################################################

def Make_DFs(filename, frame_num, Iris_Dilation, Pupil_Dilation, ratio, processed_ratio):
    Iris_memory = []
    Pupil_memory = []
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(b / a))
    df['Ratio'] = ratio

    for i in range(0, len(frame_num) - 1):
        dt_P = Pupil_Dilation[i]
        dt_I = Iris_Dilation[i]
        Pupil_memory.append(dt_P)
        Iris_memory.append(dt_I)
        drop_P = 0.80 * np.mean(Pupil_Dilation)
        surge_P = (0.20 + 1) * np.mean(Pupil_Dilation)
        drop_I = 0.90 * np.mean(Iris_Dilation)
        surge_I = (1 + 0.10) * np.mean(Iris_Dilation)

        if 0 < i < len(frame_num) and (dt_P <= drop_P or dt_P >= surge_P):
            # Pupil_Dilation[i] = int((Pupil_Dilation[i-1] + Pupil_Dilation[i+1]) / 2)
            Pupil_Dilation[i] = np.mean(Pupil_Dilation)
            # print('Pupil Changed : ', Pupil_Dilation[i])

        if 0 < i < len(frame_num) and (dt_I <= drop_I or dt_I >= surge_I):
            # Iris_Dilation[i] = Iris_Dilation[i-1]
            Iris_Dilation[i] = np.mean(Iris_Dilation)
            # print('Iris Changed : ', Iris_Dilation[i])

    df['Processed Iris Dilation'] = Iris_Dilation
    df['Processed Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        processed_ratio.append("{:.5f}".format(b / a))
    df['Processed Ratio'] = processed_ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio',
                  'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio']
    df.to_csv('./static/Pupil_Output_Images/' + os.path.splitext(filename)[0] + '_Dilation.csv', index=False)
    df.to_csv('./static/Pupil_Output_Images/' + os.path.splitext(filename)[0] + '_Ratio_Dilation.csv', index=False,
              columns=['Frame', 'Processed Ratio'])

    return ratio, processed_ratio


########################################################################################################################

def Grapher_Plot_Dilations(filename):
    df = pd.read_csv('./static/Pupil_Output_Images/' + os.path.splitext(filename)[0] + '_Dilation.csv')
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
    ax3.set_yticks([0.3, 0.4, 0.5, 0.6])

    ax4.plot(x_list, y6_list, 'g', label='Ratio Plot')
    ax4.set_title('Processed')
    ax4.set_xlabel('Frames')
    ax4.set_ylabel('Ratio')
    ax4.set_yticks([0.3, 0.4, 0.5, 0.6])

    fig.tight_layout()
    plt.savefig('./static/Pupil_Output_Images/' + os.path.splitext(filename)[0] + '_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Compute_Resources(start_time):
    usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
    end_time = time.time() - start_time
    print('Execution Time : ', end_time, ' sec')
    print('Memory Usage : ', (usage / (8 * np.power(10, 6))), 'MB')

########################################################################################################################
