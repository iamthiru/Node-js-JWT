#!/usr/bin/env python
# coding: utf-8
# Author: N Jagadesh Nischal

# ## Cascade for eye as a rectangle



## Dependencies: OpenCV, Python, Haar cascade as a xml file

import cv2

# Link for multiple cascades: https://github.com/Itseez/opencv/tree/master/data/haarcascades

# Download face cascade here: https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_frontalface_default.xml
# face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# Download eye cascade here: https://github.com/Itseez/opencv/blob/master/data/haarcascades/haarcascade_eye.xml
eye_cascade = cv2.CascadeClassifier('haarcascade_eye.xml')

# DOCUMENTATION: https://docs.opencv.org/2.4/modules/objdetect/doc/cascade_classification.html#cascadeclassifier-detectmultiscale




# Input the video file to track eyes

cap = cv2.VideoCapture('Test/Elina_DarkBrown_Vertical_01.MOV') ## Give video file path as parameter in VideoCapture function
# cap = cv2.VideoCapture('Test/Eric_Blue_Vertical01.MOV') ## Give video file path as parameter in VideoCapture function
# cap = cv2.VideoCapture('Test/Jagadesh_Brown_Vertical_02.mp4') ## Give video file path as parameter in VideoCapture function
# cap = cv2.VideoCapture('Test/Jagadesh_Green&Hazel_Vertical_01.mp4') ## Give video file path as parameter in VideoCapture function
# cap = cv2.VideoCapture('Test/Nikita_Browneyes_Vertical05.mp4') ## Give video file path as parameter in VideoCapture function
# cap = cv2.VideoCapture('Test/Yi_Dark_Brown_Vertical_3.MOV') ## Give video file path as parameter in VideoCapture function


# Read the video and work on it frame wise
while cap.isOpened():
    ret, img = cap.read()
    if not ret:
        print("End of Video. Exiting ...")
        break
    ## Resizing the video to show a smaller frame
    
    # Read the size of every frame in the video
    height, width, _ = img.shape
    
    # Half the size of input frame
    dsize = (int(width/2), int(height/2))

    # resize image, rotate by 90 degrees and change to Grayscale
    img = cv2.resize(img, dsize)
    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)


    ## Parameters: image file, ScaleFactor, minNeighbours (Adjust these parameters if output isn't good)
    ## Output: Gives x,y,height,width at places where it found eyes    
    eyes = eye_cascade.detectMultiScale(gray)
    
    #  Could also use this line of code for a more granular control over the parameters
#     eyes = eye_cascade.detectMultiScale(gray, 1.3, 2)
    
    for (ex,ey,ew,eh) in eyes:
        ## Function in OpenCV to draw rectangle on image
        cv2.rectangle(gray,(ex,ey+int(eh/5)),(ex+ew,ey+eh-int(eh/5)),(0,255,0),2)
        cv2.rectangle(img,(ex,ey+int(eh/5)),(ex+ew,ey+eh-int(eh/5)),(0,255,0),2)

    ## OpenCV function to show image in a window   
    cv2.imshow('Output with the eye tracking',img)
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

cap.release()
cv2.destroyAllWindows()






