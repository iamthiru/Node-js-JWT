#!/usr/bin/env python
# coding: utf-8
# Author: Jagadesh

import os
import cv2
import sys
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import math
import glob



## NIR video code
kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
Hough_diameters=[]
Contour_diameters=[]

# Select video here
video = cv2.VideoCapture(r'C:\Users\Nischal\Desktop\Impact_eye\PV09.MOV')
# video = cv2.VideoCapture(r'C:\Users\Nischal\Desktop\Impact_eye\1080p.MOV')

Contour_miss=0
fps = video.get(cv2.CAP_PROP_FPS)
frame_rate = fps
print('> FPS: ', fps)
frame_number=0
while frame_number<=int(video.get(cv2.CAP_PROP_FRAME_COUNT)):
    ret, img = video.read()
    frame_number+=1
    
    if ret:
        img=cv2.cvtColor(img.copy(), cv2.COLOR_BGR2GRAY)
        
        ### Uncomment if Video is in MP4 format
        img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        
        out=img.copy()
        h, w = img.shape

        _, thresh = cv2.threshold(img, 15, 255, cv2.THRESH_BINARY)
        _,contours,hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        ## Hough circle code and saving values
        w, h = img.shape
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 1, 1000, param1=30, param2=10, minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))
        im=img.copy()
        h_flag=0
        if circles is not None:
            circles = np.round(circles[0, :])
            for (x, y, r) in circles:
                cv2.circle(im, (round(x), round(y)), round(r), (255, 0, 0), 1)
                h_flag=1
                Hough_D=2*r
        ## Cases where Hough circle failed
        if h_flag==0:
            Hough_D=0
        
        # Contour part of code
        flag=0
        for c in contours:
            a=cv2.contourArea(c)
            x,y,w,h = cv2.boundingRect(c)
            if a>2500.0 and a< 25000.0 and w/h<1.3 and w/h> 0.8:
                flag=1
                (x,y), r = cv2.minEnclosingCircle(c)
                cv2.circle(out, (int(x),int(y)), int(r),  (255, 0, 0), 1)
                cv2.drawContours(img, [c], 0, (0, 255, 0), 3)
                x,y,w,h = cv2.boundingRect(c)
                # taking width of the bounding box as the diameter of the Pupil
                Contour_D=w
                
                # Histogram equilization for the sake of good visualization
                out=cv2.equalizeHist(out)
                cv2.rectangle(out,(x,y),(x+w,y+h),(0,255,0),2)
                
                # Uncomment to save frame outputs
#                 cv2.imwrite(r'C:\Users\Nischal\Desktop\Impact_eye\Output_frames7\frame'+str(con)+'.jpg', np.hstack([out, img, im]))
                
                cv2.imshow("Bounding box, Contour, Hough Circle", np.hstack([out, img, im]))
                cv2.waitKey(0)
                cv2.destroyAllWindows()
        
        ## Cases where Contour failed
        if flag==0:
#             print('Contour code did not register a circle')
            Contour_D=0.0
            Contour_miss+=1
        Hough_diameters.append(Hough_D)
        Contour_diameters.append(Contour_D)
        
# Saving all the Pupil diameter values into a csv file
column_names = ["Hough_D", "Contour_D"]

df = pd.DataFrame(columns = column_names)
df["Hough_D"]=Hough_diameters
df["Contour_D"]=Contour_diameters
df.to_csv(r'C:\Users\Nischal\Desktop\Impact_eye\Output_frames7\Contour_Hough_File.csv', index=False)

print("Number of frames missed by Contour detection is : ",Contour_miss," out of",int(video.get(cv2.CAP_PROP_FRAME_COUNT))," Frames.")
print('End of code')


