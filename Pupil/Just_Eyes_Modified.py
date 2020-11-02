# Proprietary: BentenTech
# Author: Pranav H. Deo
# Copyright Content

# Code Description: Filming 4K/1080p videos of eyes to get Pupil->Iris. Drop threshold of Pupil: 90%. Averaging over on 15 frames. Using window method to bias center detection.

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


########################################################################################################################

def create_dataframe():
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(a / b))
    df['Ratio'] = ratio

    for i in range(0, len(frame_num)-1):
        dt_P = Pupil_Dilation[i]
        dt_I = Iris_Dilation[i]
        Pupil_memory.append(dt_P)
        Iris_memory.append(dt_I)
        drop_P = 0.90 * (sum(Pupil_memory)/len(Pupil_memory))
        surge_P = (0.10 + 1) * (sum(Pupil_memory)/len(Pupil_memory))
        drop_I = 0.99 * (sum(Iris_memory)/len(Iris_memory))
        surge_I = np.ceil((1 + 0.01) * (sum(Iris_memory)/len(Iris_memory)))
        # print(int(dt_P), ' ', int(drop_P))
        # print(int(dt_I), ' ', int(drop_I))
        if 0 < i < len(frame_num) and (dt_P <= drop_P or dt_P >= surge_P):
            Pupil_Dilation[i] = int((Pupil_Dilation[i-1] + Pupil_Dilation[i+1]) / 2)
            # print('Changed dt_P : ', Pupil_Dilation[i])
        if 0 < i < len(frame_num) and (dt_I <= drop_I or dt_I >= surge_I):
            Iris_Dilation[i] = Iris_Dilation[i-1]
            # print('Changed dt_I : ', Iris_Dilation[i])
        # print('\n')

    df['Processed Iris Dilation'] = Iris_Dilation
    df['Processed Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        processed_ratio.append("{:.5f}".format(a / b))
    df['Processed Ratio'] = processed_ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio',
                  'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio']
    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
              os.path.splitext(filename)[0] + '_Dilation.csv', index=False)


########################################################################################################################

def plot_dilations():
    df = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                     os.path.splitext(filename)[0] + '_Dilation.csv')
    x_list = df['Frame']
    y1_list = df['Iris Dilation']
    y2_list = df['Pupil Dilation']
    y3_list = df['Processed Iris Dilation']
    y4_list = df['Processed Pupil Dilation']
    y5_list = df['Ratio']
    y6_list = df['Processed Ratio']

    fig, ((ax1, ax3), (ax2, ax4)) = plt.subplots(2, 2)

    ax1.plot(x_list, y1_list, 'r', label='Iris Plot')
    ax1.plot(x_list, y2_list, 'b', label='Pupil Plot')
    ax1.set_title('Algorithm Generated')
    ax1.set_xlabel('Frames')
    ax1.set_ylabel('Radius (px)')
    ax1.legend(loc='center')

    ax3.plot(x_list, y5_list, 'g', label='Ratio Plot')
    ax3.set_title('Algorithm Generated')
    ax3.set_xlabel('Frames')
    ax3.set_ylabel('Ratio')

    ax2.plot(x_list, y3_list, 'r', label='Iris Plot')
    ax2.plot(x_list, y4_list, 'b', label='Pupil Plot')
    ax2.set_title('Processed')
    ax2.set_xlabel('Frames')
    ax2.set_ylabel('Radius (px)')
    ax2.legend(loc='center')

    ax4.plot(x_list, y6_list, 'g', label='Ratio Plot')
    ax4.set_title('Processed')
    ax4.set_xlabel('Frames')
    ax4.set_ylabel('Ratio')

    fig.tight_layout()
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                os.path.splitext(filename)[0] + '_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Iris_Detection(im, pup_cen):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    iris_center = []
    global iris_radii
    global iris_xpoints
    global iris_ypoints
    h, w = imge.shape

    # Colored Videos
    if len(pup_cen) == 0:
        _, thresh = cv2.threshold(imge, 90, 255, cv2.THRESH_BINARY)
        # cv2.imshow('Color Thresh', thresh)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/2.7), maxRadius=int(w/4))
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                height, width = imge.shape
                cv2.circle(im, (x, y), r, (255, 255, 255), 1)
                mask = np.zeros(imge.shape, np.uint8)
                cv2.circle(mask, (x, y), r, 255, 2)  # white mask for black border
                cv2.circle(mask, (x, y), r, 255, -1)  # white mask for (filled) circle
                imag = cv2.bitwise_or(imge, ~mask)  # image with white background

                x1 = max(x - r - 2 // 2, 0)
                x2 = min(x + r + 2 // 2, width)
                y1 = max(y - r - 2 // 2, 0)
                y2 = min(y + r + 2 // 2, height)

                # Image = imag[y1:y2, x1:x2]
                iris_xpoints.append(int((x1 + x2) / 2))
                iris_ypoints.append(int((y1 + y2) / 2))
                iris_radii.append(r)

            avg_rad = sum(iris_radii) / len(iris_radii)
            Iris_Dilation.append(avg_rad)

        iris_center = np.array([(sum(iris_xpoints) / len(iris_xpoints)), (sum(iris_ypoints) / len(iris_ypoints))], dtype=np.int)
        return im, iris_center

    # NIR Videos
    else:
        _, thresh = cv2.threshold(imge, 40, 255, cv2.THRESH_BINARY)
        # cv2.imshow('Iris Threshold', thresh)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/2.35), maxRadius=int(w/10))
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                cv2.circle(im, (pup_cen[0], pup_cen[1]), r, (255, 0, 0), 1)
                iris_radii.append(r)

            avg_rad = sum(iris_radii) / len(iris_radii)
            Iris_Dilation.append(avg_rad)

        return im


########################################################################################################################

def Pupil_Detection(im, iris_cen):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    pupil_center = []
    global pupil_radii
    global pupil_xpoints
    global pupil_ypoints
    h, w = imge.shape

    # NIR Videos
    if len(iris_cen) == 0:
        _, thresh = cv2.threshold(imge, 15, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500,
                                   param2=30, minRadius=int(h / 12), maxRadius=int(w / 5.5))

        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                print('\n')
                print('Pupil X and Y: ', x, y)
                if len(pupil_radii) == 0:
                    print('IN A')
                    cv2.circle(im, (x, y), r, (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = np.array([(sum(pupil_xpoints) / len(pupil_xpoints)), (sum(pupil_ypoints) / len(pupil_ypoints))], dtype=np.int)
                else:
                    x_ll = int(np.floor(np.average(pupil_xpoints))) - 5
                    x_ul = int(np.ceil(np.average(pupil_xpoints))) + 5
                    y_ll = int(np.floor(np.average(pupil_ypoints))) - 5
                    y_ul = int(np.ceil(np.average(pupil_ypoints))) + 5
                    print('Range: ', x_ll, x_ul, ' ; ', y_ll, y_ul)

                    if (x_ll <= x <= x_ul) and (y_ll <= y <= y_ul):
                        print('IN B')
                        cv2.circle(im, (x, y), r, (0, 255, 0), 1)
                        # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (0, 0, 255), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = np.array([(sum(pupil_xpoints) / len(pupil_xpoints)), (sum(pupil_ypoints) / len(pupil_ypoints))], dtype=np.int)
                    else:
                        print('IN C')
                        x_new = int((int(np.average(pupil_xpoints[-15:])) + x) / 2)
                        y_new = int((int(np.average(pupil_ypoints[-15:])) + y) / 2)
                        cv2.circle(im, (x_new, y_new), r, (0, 255, 0), 1)
                        # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (0, 0, 255), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = np.array([(sum(pupil_xpoints) / len(pupil_xpoints)), (sum(pupil_ypoints) / len(pupil_ypoints))], dtype=np.int)
                Pupil_Dilation.append(r)

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

if len(sys.argv) > 1:
    ch = int(sys.argv[1])
    filename = str(sys.argv[2])
    video_type = str(sys.argv[3])
    video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Face_NIR_Color_Videos/' + filename)
else:
    # filename = 'Test.mp4'
    # ch = 1
    # video_type = 'Color'
    filename = '1080p_02.MOV'
    # filename = '02.MOV'
    ch = 2
    video_type = 'NIR'
    video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/1080p_JUST_EYES/' + filename)

fps = video.get(cv2.CAP_PROP_FPS)
frame_rate = fps
print('> FPS: ', fps)

while video.isOpened() and count < 150:
    if counter % 2 == 0:
        ret, frame = video.read()

        if ret:
            frame_num.append(count)
            count = count + 1

            if video_type == 'NIR':
                im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
                im = cv2.filter2D(im, -1, kernel)
                im = cv2.GaussianBlur(im, (5, 5), 0)
                Pupil, Pupil_center = Pupil_Detection(im, emptylist)
                Iris = Iris_Detection(im, Pupil_center)
                cv2.imshow('NIR', Iris)
                cv2.imwrite('/Users/pranavdeo/Desktop/Output_Frames/Frame_' + str(count) + '.png', Iris)
                flag = 1

            elif video_type == 'Color':
                im = frame
                Iris, Iris_center = Iris_Detection(im, emptylist)
                Pupil = Pupil_Detection(Iris, Iris_center)
                cv2.imshow('Color', Pupil)
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


# Print all the results
if flag == 1:
    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))
    print('\n')

    if len(Pupil_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Pupil_Dilation)
        for x in range(0, amt):
            Pupil_Dilation.append(Pupil_Dilation[len(Pupil_Dilation) - 1])

    if len(Iris_Dilation) < len(frame_num):
        amt = len(frame_num) - len(Iris_Dilation)
        for x in range(0, amt):
            Iris_Dilation.append(Iris_Dilation[len(Iris_Dilation)-1])

    print('Frames : ', len(frame_num))
    print('Iris Dilation : ', len(Iris_Dilation))
    print('Pupil Dilation : ', len(Pupil_Dilation))

    create_dataframe()
    plot_dilations()

print("\n####################################################################################")

usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
end_time = time.time() - start_time
print('Execution Time : ', end_time, ' sec')
print('Memory Usage : ', (usage/np.power(10, 6)), ' MB')
