# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/15/2021
# Version: v1.3

# Code Description:
# Reflection Removal approach using IN-PAINT OpenCV technique.
# Generating a Mask to detect a bright blob using threshold value >=180.
# Blobs detected are filled in using INPAINT_NS or INPAINT_TELEA methods.
# Finally the new frames are appended to create a new video.

import os
import cv2
import time
import numpy as np
from skimage import measure
from os.path import isfile, join


# *****************************************************************************

def Output_Visual_Video_Generate(Size, frame_array):
    fps = video.get(cv2.CAP_PROP_FPS)
    pathOut = '/Users/pranavdeo/Desktop/Test_NS.mp4'
    out = cv2.VideoWriter(pathOut, cv2.VideoWriter_fourcc(*'DIVX'), fps, Size)
    for i in range(len(frame_array)):
        # writing to a image array
        out.write(frame_array[i])
    out.release()


# *****************************************************************************

def Generate_Mask(fr):
    # Glare means pixel threshold value >= 180 on a scale of 0-255
    img = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
    img = cv2.GaussianBlur(img, (9, 9), 0)
    _, thresh = cv2.threshold(img, 180, 255, cv2.THRESH_BINARY)

    eroded_im = cv2.erode(thresh, None, iterations=2)
    dilated_im = cv2.dilate(eroded_im, None, iterations=4)

    labels = measure.label(dilated_im, neighbors=8, background=0)
    mask = np.zeros(dilated_im.shape, dtype="uint8")

    for label in np.unique(labels):
        # if this is the background label, ignore it
        if label == 0:
            continue
        # otherwise, construct the label mask and count the number of pixels
        labelMask = np.zeros(dilated_im.shape, dtype="uint8")
        labelMask[labels == label] = 255
        numPixels = cv2.countNonZero(labelMask)
        # if the number of pixels in the component is sufficiently large,
        # then add it to our mask of "large blobs"
        if numPixels > 300:
            mask = cv2.add(mask, labelMask)

    cv2.imshow('Mask', mask)
    return mask


# *****************************************************************************

# MAIN
video = cv2.VideoCapture('/Users/pranavdeo/Desktop/Trials/Pranav/Pranav_DarkBrown_Vertical_01.mov')
size = ()
fr_arr = []

while video.isOpened():
    ret, frame = video.read()
    if ret:
        im = cv2.rotate(frame, cv2.ROTATE_90_CLOCKWISE)
        height, width, layers = im.shape
        size = (width, height)
        cv2.imshow('Original', im)

        Mask = Generate_Mask(im)
        final_img = cv2.inpaint(im, Mask, 5, cv2.INPAINT_NS)

        cv2.imshow('Result', final_img)
        time.sleep(0.05)
        fr_arr.append(final_img)

        key = cv2.waitKey(1)
        if key == 27 or 0xFF == ord('q'):
            break
    else:
        break

Output_Visual_Video_Generate(size, fr_arr)

# *****************************************************************************
