import cv2
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import sys
import os
import time

Iris_Dilation = []
Pupil_Dilation = []
frame_num = []
ratio = []
memory = []
avg_rad = 0
count = 0
frame_rate = 0


########################################################################################################################

def create_dataframe():
    df = pd.DataFrame(frame_num)
    df['Iris Dilation'] = Iris_Dilation
    df['Pupil Dilation'] = Pupil_Dilation

    for a, b in zip(Iris_Dilation, Pupil_Dilation):
        ratio.append("{:.5f}".format(b / a))
    df['Ratio'] = ratio
    df.columns = ['Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio']
    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
              os.path.splitext(filenm)[0] + '_Dilation.csv', index=False)

    for i in range(0, len(frame_num)):
        dt = Pupil_Dilation[i]
        memory.append(dt)
        drop = 0.6 * (sum(memory)/len(memory))
        surge = (0.6 + 1) * (sum(memory)/len(memory))
        print(int(dt), ' ', int(drop))
        if i > 0 and (dt <= drop or dt >= surge):
            Pupil_Dilation[i] = int((Pupil_Dilation[i-1] + Pupil_Dilation[i+1]) / 2)
            print('Changed dt : ', Pupil_Dilation[i])

    df['Pupil Dilation'] = Pupil_Dilation

    df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
              os.path.splitext(filenm)[0] + '_Avg_Dilation.csv', index=False)


########################################################################################################################

def plot_dilations():
    df = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                     os.path.splitext(filenm)[0] + '_Dilation.csv')
    ax = plt.gca()
    df.plot(kind='line', x='Frame', y='Iris Dilation', color='blue', ax=ax)
    df.plot(kind='line', x='Frame', y='Pupil Dilation', color='green', ax=ax)
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                os.path.splitext(filenm)[0] + '_Dilation_Plot.png')
    plt.close()

    df2 = pd.read_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                     os.path.splitext(filenm)[0] + '_Avg_Dilation.csv')
    ax1 = plt.gca()
    df2.plot(kind='line', x='Frame', y='Iris Dilation', color='blue', ax=ax1)
    df2.plot(kind='line', x='Frame', y='Pupil Dilation', color='green', ax=ax1)
    plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' +
                os.path.splitext(filenm)[0] + '_Avg_Dilation_Plot.png')
    plt.close()


########################################################################################################################

def Detect_Iris_Circle(im, str):
    im = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    radii = []
    iris_center = []
    xpoints = []
    ypoints = []

    if str == 'IMG':
        h, w = im.shape
        blur = cv2.medianBlur(im, 3)
        _, thresh = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=250, maxRadius=300)
    else:
        h, w = im.shape
        blur = cv2.medianBlur(im, 3)
        _, thresh = cv2.threshold(blur, 100, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/2.5), maxRadius=int(w/4))

    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            height, width = im.shape
            cv2.circle(im, (x, y), r, (0, 0, 255), 2)
            radii.append(r)
            xpoints.append(x)
            ypoints.append(y)

            '''
            mask = np.zeros(im.shape, np.uint8)
            cv2.circle(mask, (x, y), r, 255, 2)  # white mask for black border
            cv2.circle(mask, (x, y), r, 255, -1)  # white mask for (filled) circle
            imag = cv2.bitwise_or(im, ~mask)  # image with white background

            x1 = max(x - r - 2 // 2, 0)
            x2 = min(x + r + 2 // 2, width)
            y1 = max(y - r - 2 // 2, 0)
            y2 = min(y + r + 2 // 2, height)

            Image = imag[y1:y2, x1:x2]

        avg_rad = sum(radii) / len(radii)
        Iris_Dilation.append(avg_rad)
        '''
        iris_center = np.array([(sum(xpoints) / len(xpoints)), (sum(ypoints) / len(ypoints))], dtype=np.int)

    return im, iris_center


########################################################################################################################

def Detect_Pupil_Circle(imge, Pup_cen, Str):
    rad = []

    if Str == 'VID':
        h, w = imge.shape
        im = imge
        _, thresh = cv2.threshold(im, 30, 255, cv2.THRESH_BINARY)
        cv2.imshow('Pupil Thresh', thresh)
        canny_img = cv2.Canny(thresh, 80, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=int(h/9), maxRadius=int(w/5))

    else:
        im = imge
        _, thresh = cv2.threshold(im, 35, 255, cv2.THRESH_BINARY)
        canny_img = cv2.Canny(thresh, 10, 100)
        circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 7, 7000, param1=1500, param2=30, minRadius=80, maxRadius=130)

    if circles is not None:
        circles = np.round(circles[0, :]).astype("int")
        for (x, y, r) in circles:
            cv2.circle(im, (Pup_cen[0], Pup_cen[1]), r, (0, 0, 255), 2)
            rad.append(r)

        # avg_rad = sum(rad) / len(rad)
        # Pupil_Dilation.append(avg_rad)

    # else:
        # Pupil_Dilation.append(Pupil_Dilation[len(Pupil_Dilation)-1])

    if Str == 'VID':
        cv2.imshow('img', imge)
        return imge
    else:
        return im


########################################################################################################################

def Iris_Detection(fr, str):
    if str == 'IMG':
        Iris_frame = Detect_Iris_Circle(fr, 'IMG')
        # cv2.imshow('Image', Iris_frame)
        cv2.imwrite('/Users/pranavdeo/Desktop/Iris_Found.jpg', Iris_frame)
    else:
        Iris_frame, cen = Detect_Iris_Circle(fr, 'VID')
        # cv2.imshow('Image', Iris_frame)

    return Iris_frame, cen


########################################################################################################################

def Pupil_Detection(img, centr, str):
    if str == 'VID':
        Pupil_frame = Detect_Pupil_Circle(img, centr, 'VID')
        # cv2.imshow('Image', Pupil_frame)
    else:
        Pupil_frame = Detect_Pupil_Circle(img, 'IMG')
        # cv2.imshow('Pupil', Pupil_frame)
        cv2.imwrite('/Users/pranavdeo/Desktop/Pupil_Found.jpg', Pupil_frame)


########################################################################################################################

# Main
print("\n############################## IRIS - PUPIL DETECTION ##############################")
print("\n> LIST OF OPERATIONS : \n\t1. Image \n\t2. Video")
tag = 0

if len(sys.argv) > 1:
    global filenm
    ch = int(sys.argv[1])
    filenm = str(sys.argv[2])
    tag = 1
else:
    ch = int(input("> Enter Choice : "))

flag = 0

if ch == 2:
    if tag == 1:
        video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/'+filenm)
    else:
        filenm = "Pupil.mp4"
        video = cv2.VideoCapture('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/'+filenm)
    fps = video.get(cv2.CAP_PROP_FPS)
    frame_rate = fps
    print('> FPS: ' + str(fps))

    while video.isOpened():
        time.sleep(0.15)
        ret, frame = video.read()

        if ret:
            Iris, center = Iris_Detection(frame, 'VID')
            Pupil_Detection(Iris, center, 'VID')
            count = count + 1
            frame_num.append(count)

            if cv2.waitKey(1) == 27:
                # create_dataframe()
                # plot_dilations()
                flag = 1
                break
        else:
            break

    # if flag == 0:
        # create_dataframe()
        # plot_dilations()

    video.release()
    cv2.destroyAllWindows()

elif ch == 1:
    count = count + 1
    frame_num.append(count)
    if tag == 1:
        image = cv2.imread('/Users/pranavdeo/Desktop/'+filenm)
    else:
        image = cv2.imread('/Users/pranavdeo/Desktop/Iris.jpg')
    Iris = Iris_Detection(image, 'IMG')
    Pupil_Detection(Iris, 'IMG')
    create_dataframe()
    plot_dilations()

else:
    print("WRONG CHOICE !!")


print('Iris Dilation : ', len(Iris_Dilation))
print('Pupil Dilation : ', len(Pupil_Dilation))
print('Frames : ', len(frame_num))
print('Ratio : ', len(ratio))
print("\n####################################################################################")

########################################################################################################################
