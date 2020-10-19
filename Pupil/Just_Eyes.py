# Proprietary: BentenTech
# Author: Pranav H. Deo
# Copyright content

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
prev_center = []
frame_num = []
ratio = []
Pupil_memory = []
Iris_memory = []
avg_rad = 0
flag = 0


########################################################################################################################

def Scale(fr, percent=75):
    width = int(fr.shape[1] * percent / 100)
    height = int(fr.shape[0] * percent / 100)
    dim = (width, height)
    return cv2.resize(fr, dim, interpolation=cv2.INTER_AREA)


########################################################################################################################

def create_dataframe():
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(b / a))
    df['Ratio'] = ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio']
    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
              os.path.splitext(filename)[0] + '_Dilation.csv', index=False)

    for i in range(0, len(frame_num)-1):
        dt_P = Pupil_Dilation[i]
        dt_I = Iris_Dilation[i]
        Pupil_memory.append(dt_P)
        Iris_memory.append(dt_I)
        drop_P = 0.7 * (sum(Pupil_memory)/len(Pupil_memory))
        surge_P = (0.3 + 1) * (sum(Pupil_memory)/len(Pupil_memory))
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

    df['Pupil Dilation'] = Pupil_Dilation
    df['Iris Dilation'] = Iris_Dilation

    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
              os.path.splitext(filename)[0] + '_Avg_Dilation.csv', index=False)


########################################################################################################################

def plot_dilations():
    df = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                     os.path.splitext(filename)[0] + '_Dilation.csv')
    ax = plt.gca()
    plt.xlabel('Frame')
    plt.ylabel('Radius(px)')
    df.plot(kind='line', x='Frame', y='Iris Dilation', color='blue', ax=ax)
    df.plot(kind='line', x='Frame', y='Pupil Dilation', color='green', ax=ax)
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                os.path.splitext(filename)[0] + '_Dilation_Plot.png')
    plt.close()

    df2 = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                     os.path.splitext(filename)[0] + '_Avg_Dilation.csv')
    ax1 = plt.gca()
    plt.xlabel('Frame')
    plt.ylabel('Radius(px)')
    df2.plot(kind='line', x='Frame', y='Iris Dilation', color='blue', ax=ax1)
    df2.plot(kind='line', x='Frame', y='Pupil Dilation', color='green', ax=ax1)
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' +
                os.path.splitext(filename)[0] + '_Avg_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Iris_Detection(im, pup_cen):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    radii = []
    iris_center = []
    xpoints = []
    ypoints = []

    h, w = imge.shape
    blur = cv2.medianBlur(imge, 3)

    # Colored Videos
    if len(pup_cen) == 0:
        _, thresh = cv2.threshold(imge, 100, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/2.5), maxRadius=int(w/4))
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
                xpoints.append(int((x1 + x2) / 2))
                ypoints.append(int((y1 + y2) / 2))
                radii.append(r)

            avg_rad = sum(radii) / len(radii)
            Iris_Dilation.append(avg_rad)

        iris_center = np.array([(sum(xpoints) / len(xpoints)), (sum(ypoints) / len(ypoints))], dtype=np.int)
        return im, iris_center

    # NIR Videos
    else:
        _, thresh = cv2.threshold(imge, 48, 255, cv2.THRESH_BINARY)
        # cv2.imshow('Iris Threshold', thresh)
        canny_img = cv2.Canny(thresh, 10, 100)
        # circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/2.1), maxRadius=int(w/20))
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h / 2.2), maxRadius=int(w / 20))
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                cv2.circle(im, (pup_cen[0], pup_cen[1]), r, (255, 0, 0), 1)
                radii.append(r)

            avg_rad = sum(radii) / len(radii)
            Iris_Dilation.append(avg_rad)

        return im


########################################################################################################################

def Pupil_Detection(im, iris_cen):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    radii = []
    pupil_center = []
    global prev_center
    xpoints = []
    ypoints = []

    h, w = imge.shape
    blur = cv2.medianBlur(imge, 3)

    # NIR Videos
    if len(iris_cen) == 0:
        _, thresh = cv2.threshold(imge, 20, 255, cv2.THRESH_BINARY)
        # cv2.imshow('Pupil Thresh', thresh)
        canny_img = cv2.Canny(thresh, 10, 100)
        # circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/10), maxRadius=int(w/6.5))
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h / 12), maxRadius=int(w / 8))
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                cv2.circle(im, (x, y), r, (0, 255, 0), 1)
                radii.append(r)
                xpoints.append(x)
                ypoints.append(y)

            avg_rad = sum(radii) / len(radii)
            Pupil_Dilation.append(avg_rad)

        try:
            pupil_center = np.array([(sum(xpoints) / len(xpoints)), (sum(ypoints) / len(ypoints))], dtype=np.int)
            prev_center = np.array([(sum(xpoints) / len(xpoints)), (sum(ypoints) / len(ypoints))], dtype=np.int)
        except ZeroDivisionError:
            pupil_center = np.array([prev_center[0], prev_center[1]], dtype=np.int)

        return im, pupil_center

    # Colored Videos
    else:
        _, thresh = cv2.threshold(imge, 30, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 80, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h / 11), maxRadius=int(w / 8.5))
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")

            for (x, y, r) in circles:
                cv2.circle(im, (iris_cen[0], iris_cen[1]), r, (255, 255, 255), 1)
                radii.append(r)

            avg_rad = sum(radii) / len(radii)
            Pupil_Dilation.append(avg_rad)

        return im


#####################################################################################################################

# MAIN FUNCTION #

start_time = time.time()

print("\n############################## FACE - PUPIL DETECTION ##############################\n")
flag = 0
count = 1
counter = 0
emptylist = []
global filename

if len(sys.argv) > 1:
    ch = int(sys.argv[1])
    filename = str(sys.argv[2])
    video_type = str(sys.argv[3])
    video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Face_NIR_Color_Videos/' + filename)
else:
    filename = 'NIREYE4K_F2.mov'
    ch = 2
    video_type = 'NIR'
    video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/' + filename)

fps = video.get(cv2.CAP_PROP_FPS)
frame_rate = fps
print('> FPS: ', fps)

while video.isOpened() and count <= 150:
    if counter % 2 == 0:
        ret, frame = video.read()

        if ret:
            im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)

            frame_num.append(count)
            count = count + 1

            if video_type == 'NIR':
                Pupil, Pupil_center = Pupil_Detection(im, emptylist)
                Iris = Iris_Detection(im, Pupil_center)
                cv2.imshow('NIR', Pupil)
                flag = 1

            elif video_type == 'Color':
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
    time.sleep(0.15)


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
print('Execution Time : ', end_time)
print('Memory Usage : ', usage)
