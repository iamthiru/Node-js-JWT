# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/13/2021
# Version: v1.2

# Code Description:
# * 1080p videos of eyes to get Pupil->Iris for both NIR and COLOR.
# * Drop threshold of Pupil: 80%. If the radius increase by 20% in the next immediate frame, we stump it.
# * Video Quality and Drop Criteria Added (20 Frames).

# UPDATES:
# * HUGE UPDATE - Added Dynamic Threshold Detector for Pupil and Iris.
# * Threshold value decided by looking at first 5 frames.
# * Using Contour Detection Piggy-Backed with Hough when failure for both Pupil and Iris.
# * Iris radius depends on Pupil radius, with a shared/common center.
# * Hard-coded cropping removed.
# * Result Video will be created after Processing.
# * Pupil and Iris Radius go through validity check. Based on upper and lower bound, the radius is set.
# * The video displayed uses the adjusted radius. Works on the Fly.
# * The incoming video is judged as Qualified/Unqualified if Pupil/Iris fails on 10 consecutive frames.


import os
import cv2
import sys
import time
import resource
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

Iris_Dilation = []
Pupil_Dilation = []

pupil_xpoints = []
pupil_ypoints = []
iris_xpoints = []
iris_ypoints = []

pupil_radii = []
iris_radii = []

frame_num = []
ratio = []
processed_ratio = []
Pupil_memory = []
Iris_memory = []

Pupil_Thresh_Store = []
Iris_Thresh_Store = []


########################################################################################################################
def Dynamic_Threshold_Detector(Vid):
    process_frames = 1
    while Vid.isOpened() and process_frames <= 5:
        process_frames += 1
        retr, fr = video.read()
        if retr:
            # Getting Pupil Threshold Value Dynamically
            for var in range(10, 60):
                ima = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(ima, var, 255, cv2.THRESH_BINARY)
                contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

                if contours is not None:
                    for c in contours:
                        contour_area = cv2.contourArea(c)
                        x1, y1, w1, h1 = cv2.boundingRect(c)
                        if (1500 < contour_area < 15000) and (0.6 < (w1 / h1) < 1.5):
                            Pupil_Thresh_Store.append(var)

            # Getting Iris Threshold Value Dynamically
            for var in range(Pupil_Thresh_Store[len(Pupil_Thresh_Store) - 1], 110):
                ima = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(ima, var, 255, cv2.THRESH_BINARY)
                contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

                if contours is not None:
                    for c in contours:
                        contour_area = cv2.contourArea(c)
                        x1, y1, w1, h1 = cv2.boundingRect(c)
                        if (4500 < contour_area < 45000) and (0.6 < (w1 / h1) < 1.5):
                            Iris_Thresh_Store.append(var)

    # print('Pupil Threshold : ', Pupil_Thresh_Store)
    print('Pupil Threshold Value : ', np.mean(Pupil_Thresh_Store))
    # print('Iris Threshold : ', Iris_Thresh_Store)
    print('Iris Threshold Value : ', np.mean(Iris_Thresh_Store))
    return np.mean(Pupil_Thresh_Store)-5, np.mean(Iris_Thresh_Store)


########################################################################################################################

def Radius_Validity_Check(radius, tag):
    global iris_radii
    global pupil_radii
    global frame_num
    if tag == 'pupil':
        if len(frame_num) > 0:
            drop_P = 0.80 * (sum(pupil_radii) / len(pupil_radii))
            surge_P = (0.2 + 1) * (sum(pupil_radii) / len(pupil_radii))
            if radius <= drop_P or radius >= surge_P:
                R = sum(pupil_radii)/len(pupil_radii)
            else:
                R = radius
        else:
            R = radius
    else:
        if len(frame_num) > 0:
            drop_I = 0.99 * (sum(iris_radii) / len(iris_radii))
            surge_I = (1 + 0.01) * (sum(iris_radii) / len(iris_radii))
            if len(frame_num) > 0 and (radius <= drop_I or radius >= surge_I):
                R = sum(iris_radii) / len(iris_radii)
            else:
                R = radius
        else:
            R = radius
    return R


########################################################################################################################

def create_dataframe():
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(b / a))
    df['Ratio'] = ratio

    for i in range(0, len(frame_num)-1):
        dt_P = Pupil_Dilation[i]
        dt_I = Iris_Dilation[i]
        Pupil_memory.append(dt_P)
        Iris_memory.append(dt_I)
        # TO DO: 85% averaging (Use 90%?)
        drop_P = 0.80 * (sum(Pupil_memory)/len(Pupil_memory))
        surge_P = (0.20 + 1) * (sum(Pupil_memory)/len(Pupil_memory))
        drop_I = 0.99 * (sum(Iris_memory)/len(Iris_memory))
        surge_I = (1 + 0.01) * (sum(Iris_memory)/len(Iris_memory))

        #print('\n\nPupil : ', drop_P, ' ', dt_P, ' ', surge_P)
        if 0 < i < len(frame_num) and (dt_P <= drop_P or dt_P >= surge_P):
            # Pupil_Dilation[i] = int((Pupil_Dilation[i-1] + Pupil_Dilation[i+1]) / 2)
            Pupil_Dilation[i] = sum(Pupil_memory)/len(Pupil_memory)
            #print('Pupil Changed : ', Pupil_Dilation[i])

        #print('\n Iris : ', drop_I, ' ', dt_I, ' ', surge_I)
        if 0 < i < len(frame_num) and (dt_I <= drop_I or dt_I >= surge_I):
            # Iris_Dilation[i] = Iris_Dilation[i-1]
            Iris_Dilation[i] = sum(Iris_memory)/len(Iris_memory)
            #print('Iris Changed : ', Iris_Dilation[i])

    df['Processed Iris Dilation'] = Iris_Dilation
    df['Processed Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        processed_ratio.append("{:.5f}".format(b / a))
    df['Processed Ratio'] = processed_ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio',
                  'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio']
    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
              os.path.splitext(filename)[0] + '_Dilation.csv', index=False)


########################################################################################################################

def plot_dilations():
    df = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                     os.path.splitext(filename)[0] + '_Dilation.csv')
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
    ax3.set_yticks([0.4, 0.5, 0.6])

    ax4.plot(x_list, y6_list, 'g', label='Ratio Plot')
    ax4.set_title('Processed')
    ax4.set_xlabel('Frames')
    ax4.set_ylabel('Ratio')
    ax4.set_yticks([0.4, 0.5, 0.6])

    fig.tight_layout()
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                os.path.splitext(filename)[0] + '_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Iris_Detection(im, pup_cen, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    iris_center = []
    global iris_radii
    global iris_xpoints
    global iris_ypoints
    w, h = imge.shape
    global biasing
    global pupil_radii
    global Iris_Thresh

    if v_type == 'NIR':
        _, thresh = cv2.threshold(imge, 35, 255, cv2.THRESH_BINARY)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=30, param2=10, minRadius=int(np.average(pupil_radii)*1.45), maxRadius=int(np.average(pupil_radii)*2.5))

        if circles is not None:
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(iris_radii) == 0 or len(iris_radii) <= 15:
                    cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                    iris_radii.append(r)
                    iris_xpoints.append(pup_cen[0])
                    iris_ypoints.append(pup_cen[1])
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 3
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 3
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 3
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 3
                    r_ll = int(np.floor(np.average(iris_radii))) - 1
                    r_ul = int(np.ceil(np.ceil(np.average(iris_radii)))) + 1

                    if ((x_ll <= x <= x_ul) and (y_ll <= y <= y_ul)) and (r_ll <= r <= r_ul):
                        if len(pup_cen) > 0:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        else:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (0, 0, 255), 1)
                        iris_radii.append(r)

                    else:
                        r = np.average(iris_radii[-5:])
                        iris_radii.append(r)
                        if len(pup_cen) < 1:
                            cv2.circle(im, (int(x), int(y)), r, (255, 0, 0), 1)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        else:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), r, (255, 0, 0), 1)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                Iris_Dilation.append(r)
        return im

    # COLORED VIDEOS
    else:
        _, thresh = cv2.threshold(imge, abs(int(Iris_Thresh)), 255, cv2.THRESH_BINARY)
        cv2.imshow('Iris Thresh', thresh)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=90, param2=30, minRadius=int(np.average(pupil_radii)*1.45), maxRadius=int(np.average(pupil_radii)*6))
        # circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=30, param2=10, minRadius=int(w / 10), maxRadius=int(h / 3))

        if circles is not None:
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(iris_radii) == 0 or len(iris_radii) < 15:
                    if len(frame_num) > 10:
                        # Check the value of the radius using lower and upper bound
                        r = Radius_Validity_Check(r, 'iris')
                    cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                    iris_radii.append(r)
                    iris_xpoints.append(pup_cen[0])
                    iris_ypoints.append(pup_cen[1])
                    # iris_center = [pup_cen[0], pup_cen[1]]
                else:
                    x_ll = int(np.floor(np.average(iris_xpoints))) - 3
                    x_ul = int(np.ceil(np.average(iris_xpoints))) + 3
                    y_ll = int(np.floor(np.average(iris_ypoints))) - 3
                    y_ul = int(np.ceil(np.average(iris_ypoints))) + 3
                    r_ll = int(np.floor(np.average(iris_radii))) - 3
                    r_ul = int(np.ceil(np.average(iris_radii))) + 3

                    if r_ll <= r <= r_ul:
                        if len(pup_cen) > 0:
                            if len(frame_num) > 10:
                                # Check the value of the radius using lower and upper bound
                                r = Radius_Validity_Check(r, 'iris')
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                            iris_radii.append(r)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        else:
                            if len(frame_num) > 10:
                                # Check the value of the radius using lower and upper bound
                                r = Radius_Validity_Check(r, 'iris')
                            cv2.circle(im, (int(x), int(y)), int(r), (255, 0, 0), 1)
                            iris_radii.append(r)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        # iris_center = [x, y]
                    else:
                        biasing += 1
                        r = np.average(iris_radii[-30:])
                        iris_radii.append(r)
                        if len(pup_cen) < 1:
                            cv2.circle(im, (int(x), int(y)), int(r), (255, 0, 0), 1)
                            iris_radii.append(r)
                            iris_xpoints.append(x)
                            iris_ypoints.append(y)
                        else:
                            cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                            # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (255, 0, 0), 1)
                            iris_radii.append(r)
                            iris_xpoints.append(pup_cen[0])
                            iris_ypoints.append(pup_cen[1])
                        # iris_center = [x, y]
                Iris_Dilation.append(r)
        else:
            return [], []
        return im


########################################################################################################################

def Pupil_Detection(im, iris_cen, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    pupil_center = []
    global pupil_radii
    global pupil_xpoints
    global pupil_ypoints
    w, h = imge.shape
    global biasing
    global Pupil_Thresh

    if v_type == 'NIR':
        _, thresh = cv2.threshold(imge, 15, 255, cv2.THRESH_BINARY)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 1, 300, param1=30, param2=10, minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))

        flg = 0
        # Get the contour detection...
        if contours is not None:
            for c in contours:
                contour_area = cv2.contourArea(c)
                x1, y1, w1, h1 = cv2.boundingRect(c)
                if (2000 < contour_area < 15000) and (0.6 < (w1/h1) < 1.5):
                    flg = 1
                    coords, r = cv2.minEnclosingCircle(c)
                    dia_p = max(w1, h1)
                    cv2.circle(im, ((int(x1 + (dia_p / 2))), int((y1 + (dia_p / 2)))), int(dia_p / 2), (0, 255, 0), 1)
                    # cv2.rectangle(im, (x1, y1), (x1+w1, y1+h1), (0, 255, 0), 2)
                    pupil_radii.append(w1/2)
                    Pupil_Dilation.append(w1/2)
                    pupil_xpoints.append(x1 + (dia_p / 2))
                    pupil_ypoints.append(y1 + (dia_p / 2))
                    pupil_center = [x1 + (dia_p / 2), y1 + (dia_p / 2)]
                else:
                    break

        # Get the Hough Detection in case contour fails...
        elif circles is not None and flg == 0:
            print('>Trying Hough: Pupil')
            circles = np.round(circles[0, :])

            for (x, y, r) in circles:
                if len(pupil_radii) == 0 or len(pupil_radii) < 15:
                    cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = [x, y]
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 6
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 6
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 6
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 6
                    r_ll = int(np.floor(np.average(pupil_radii))) - 7
                    r_ul = int(np.ceil(np.average(pupil_radii))) + 7

                    if r_ll <= r <= r_ul:
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                    else:
                        biasing += 1
                        r = np.average(pupil_radii[-30:])
                        pupil_radii.append(r)
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                Pupil_Dilation.append(r)
        else:
            return [], []
        return im, pupil_center

    # COLORED VIDEOS
    else:
        _, thresh = cv2.threshold(imge, abs(int(Pupil_Thresh)), 255, cv2.THRESH_BINARY)
        cv2.imshow('Pupil', thresh)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 300, param1=30, param2=10, minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))
        flg = 0

        # Contour Method for Pupil
        if contours is not None:
            # print('>Contour Pupil')
            for c in contours:
                contour_area = cv2.contourArea(c)
                x1, y1, w1, h1 = cv2.boundingRect(c)
                if (1200 <= contour_area <= 25000) and (0.2 <= (w1 / h1) <= 1.15):
                    flg = 1
                    coords, r = cv2.minEnclosingCircle(c)
                    dia_p = max(w1, h1)
                    rad_p = dia_p / 2
                    if len(frame_num) > 10:
                        # Check the value of the radius using lower and upper bound
                        rad_p = Radius_Validity_Check(dia_p/2, 'pupil')
                    cv2.circle(im, ((int(x1 + rad_p)), int((y1 + rad_p))), int(rad_p), (0, 255, 0), 1)
                    # cv2.rectangle(im, (x1, y1), (x1+w1, y1+h1), (0, 255, 0), 2)
                    pupil_radii.append(rad_p)
                    Pupil_Dilation.append(rad_p)
                    pupil_xpoints.append(x1 + dia_p / 2)
                    pupil_ypoints.append(y1 + dia_p / 2)
                    pupil_center = [x1 + dia_p / 2, y1 + dia_p / 2]

        # Hough Method when Contour Fails
        elif circles is not None and flg == 0:
            print('>Trying Hough: Pupil')
            circles = np.round(circles[0, :])
            for (x, y, r) in circles:
                if len(pupil_radii) == 0 or len(pupil_radii) < 15:
                    if len(frame_num) > 10:
                        # Check the value of the radius using lower and upper bound
                        r = Radius_Validity_Check(r, 'pupil')
                    cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = [x, y]
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 6
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 6
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 6
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 6
                    r_ll = int(np.floor(np.average(pupil_radii))) - 7
                    r_ul = int(np.ceil(np.average(pupil_radii))) + 7

                    if r_ll <= r <= r_ul:
                        if len(frame_num) > 10:
                            # Check the value of the radius using lower and upper bound
                            r = Radius_Validity_Check(r, 'pupil')
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                    else:
                        biasing += 1
                        r = np.average(pupil_radii[-30:])
                        pupil_radii.append(r)
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                Pupil_Dilation.append(r)

        else:
            return [], []
        return im, pupil_center


#####################################################################################################################
# MAIN FUNCTION #
start_time = time.time()
print("\n############################## FACE - PUPIL DETECTION ##############################\n")
flag = 0
count = 0
counter = 0
emptylist = []
kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
global filename
biasing = 0
frame_array = []
Dropped_Frame_Counter = 0

if len(sys.argv) > 1:
    ch = int(sys.argv[1])
    filename = str(sys.argv[2])
    video_type = str(sys.argv[3])
    Orientation = 'Vertical'
    # video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/' + filename)
    video = cv2.VideoCapture('/Users/pranavdeo/Desktop/Trials/' + filename)

# ***************************************************************************************************
fps = video.get(cv2.CAP_PROP_FPS)
frame_rate = fps
size = ()
print('> FPS: ', fps)

# Running Threshold Tracker:
Pupil_Thresh, Iris_Thresh = Dynamic_Threshold_Detector(video)

while video.isOpened():
    if counter % 2 == 0:
        ret, frame = video.read()

        if ret:
            frame_num.append(count)
            count = count + 1

            if video_type == 'NIR':
                file_ext = filename.split(".")[-1]
                im = frame
                if file_ext == 'MOV' or file_ext == 'mov' or file_ext == 'MP4' or file_ext == 'mp4':
                    im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
                # im = cv2.filter2D(im, -1, kernel)
                im = cv2.GaussianBlur(im, (5, 5), 0)
                height, width, layers = im.shape
                size = (width, height)
                Pupil, Pupil_center = Pupil_Detection(im, emptylist, video_type)
                if len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) != 0):
                    Pupil_center = [pupil_xpoints[-1], pupil_ypoints[-1]]
                elif len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) == 0):
                    Dropped_Frame_Counter += 1
                if Dropped_Frame_Counter > 10:
                    print('\n# VIDEO DIS-QUALIFIED..!!!')
                    flag = 0
                    break
                if len(Pupil_center) != 0:
                    Iris = Iris_Detection(im, Pupil_center, video_type)
                cv2.imshow('NIR', im)
                frame_array.append(im)
                flag = 1

            elif video_type == 'Color':
                file_ext = filename.split(".")[-1]
                im = frame
                im = cv2.rotate(im, cv2.ROTATE_90_CLOCKWISE)
                #if file_ext == 'MOV' or file_ext == 'mov' or file_ext == 'MP4' or file_ext == 'mp4':
                #    im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
                # im = cv2.filter2D(im, -1, kernel)
                im = cv2.GaussianBlur(im, (5, 5), 0)
                height, width, layers = im.shape
                size = (width, height)
                # print('> Width : ', width, ' ; Height : ', height)
                Pupil, Pupil_center = Pupil_Detection(im, emptylist, video_type)
                if len(Pupil_center) == 0 and (len(pupil_xpoints) and len(pupil_ypoints) != 0):
                    Pupil_center = [pupil_xpoints[-1], pupil_ypoints[-1]]
                elif len(Pupil_center) == 0:
                    Dropped_Frame_Counter += 1
                if Dropped_Frame_Counter > 20:
                    print('\n# VIDEO DIS-QUALIFIED..!!!')
                    flag = 0
                    break
                if len(Pupil_center) != 0:
                    Iris = Iris_Detection(im, Pupil_center, video_type)
                cv2.imshow('Color', im)
                frame_array.append(im)
                flag = 1

            else:
                print("WRONG CHOICE !!")
                break

            key = cv2.waitKey(1)
            if key == 27 or 0xFF == ord('q'):
                flag = 1
                break

        else:
            flag = 1
            break

    counter = counter + 1
    time.sleep(0.10)


# ***************************************************************************************************
# Create Video Output for Visualization
if flag == 1:
    # Creates the video out of the processed frames
    pathOut = '/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Videos/' + (filename.split('.')[0]) + '.mp4'
    out = cv2.VideoWriter(pathOut, cv2.VideoWriter_fourcc(*'DIVX'), fps, size)
    for i in range(len(frame_array)):
        # writing to a image array
        out.write(frame_array[i])
    out.release()

# ***************************************************************************************************
# Print all the results
# Processes and creates Equal Length Lists
    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))
    print('\n')

    if len(Pupil_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Pupil_Dilation)
        for x in range(0, amt):
            Pupil_Dilation.append(Pupil_Dilation[len(Pupil_Dilation)-1])
    elif len(Pupil_Dilation) > len(frame_num):
        amt = len(Pupil_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Pupil_Dilation[len(Pupil_Dilation) - 1]

    if len(Iris_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Iris_Dilation)
        for x in range(0, amt):
            Iris_Dilation.append(Iris_Dilation[len(Iris_Dilation)-1])
    elif len(Iris_Dilation) > len(frame_num):
        amt = len(Iris_Dilation) - len(frame_num)
        for x in range(0, amt):
            del Iris_Dilation[len(Iris_Dilation) - 1]

    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))

    # Creates Dataframes and Plots them
    create_dataframe()
    plot_dilations()


print("\n####################################################################################")

usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
end_time = time.time() - start_time
print('Execution Time : ', end_time, ' sec')
print('Memory Usage : ', (usage/np.power(10, 6)), 'MB')

#####################################################################################################################
cv2.destroyAllWindows()
