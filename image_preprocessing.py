# Image Filtering (Sharpening, Cleaning and Storing)
import os
import cv2
import numpy as np

path = '/Users/pranavdeo/Desktop/jaffedbase/'
files = os.listdir(path)
count = 0
for f in files:
    if f == '.DS_Store':
        continue
    src = '/Users/pranavdeo/Desktop/jaffedbase/' + f
    img = cv2.imread(src, 0)
    weights = np.array([[-1, -1, -1], [-1, 9.5, -1], [-1, -1, -1]])
    sharp_img = cv2.filter2D(img, -1, weights)
    dst = '/Users/pranavdeo/Desktop/sharp_dbase/' + f
    cv2.imwrite(dst, sharp_img)
    count = count + 1
print(count, ' Files Processed')


