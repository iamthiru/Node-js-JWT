#!/usr/bin/env python
# coding: utf-8

# In[12]:


import cv2
from scipy.spatial import distance as dist
import numpy as np
import glob
import csv
import pandas as pd 
import matplotlib.pyplot as plt


# In[13]:


def draw_grid(img, line_color=(0, 255, 0), thickness=1, type_=cv2.LINE_AA, pxstep=20, pystep=20):
    '''(ndarray, 3-tuple, int, int) -> void
    draw gridlines on img
    line_color:
        BGR representation of colour
    thickness:
        line thickness
    type:
        8, 4 or cv2.LINE_AA
    pxstep:
        grid line frequency in pixels
    '''
    x = pxstep
    y = pystep
    while x < img.shape[1]:
        cv2.line(img, (x, 0), (x, img.shape[0]), color=line_color, lineType=type_, thickness=thickness)
        x += pxstep

    while y < img.shape[0]:
        cv2.line(img, (0, y), (img.shape[1], y), color=line_color, lineType=type_, thickness=thickness)
        y += pystep

def mousePoints(event,x,y,flags,params):
    '''
    Records the mouse clicks on image 
    '''
    if event == cv2.EVENT_LBUTTONDOWN:
        p_current.append([x,y])
        print(p_current)


# In[14]:


## Give the path to the frames
filenames = glob.glob(r"C:\Users\Nischal\Desktop\EyeManual\sample\*.png")
filenames.sort()
images = [cv2.imread(img) for img in filenames]


# In[15]:


point_total=[]
for image in images:
    p_current = []
    img_copy=image
    src = cv2.cvtColor(img_copy, cv2.COLOR_BGR2GRAY)
    img_copy = cv2.equalizeHist(src)
    draw_grid(img_copy)
    cv2.imshow('out',img_copy)
    cv2.setMouseCallback('out',mousePoints)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    print('Frame Done! Loading Next Frame')
    point_total.append(p_current)
    print(len(point_total))
    


# In[16]:


point_total


# In[17]:


point_total[0][0]


# In[18]:


iris_dia=[]
pupil_dia=[]
for points in point_total:
    print(points[0],points[3])
    ID=dist.euclidean(points[0], points[3])
    print(ID)
    iris_dia.append(ID)
    PD=dist.euclidean(points[1], points[2])
    pupil_dia.append(PD)
    print(PD)

    


# In[19]:


len(pupil_dia)


# In[20]:


data = []
for a, b in zip(iris_dia,pupil_dia):
    data.append([a, b])

df = pd.DataFrame(data, columns=['iris_diameter', 'pupil_diameter'])
I_by_P = [i / p for i, p in zip(iris_dia, pupil_dia)]
P_by_I = [p / i for i, p in zip(iris_dia, pupil_dia)]
df['iris/pupil_ratio'] = I_by_P
df['pupil/iris_ratio'] = P_by_I
## Saving the dataframe to csv file
df.to_csv (r'C:\Users\Nischal\Desktop\EyeManual\Output\data.csv', index = True, header=True)


# In[21]:


plt.xlabel('Frame')
plt.ylabel('IRIS/PUPIL')
plt.plot(I_by_P)
## Give path for plot
plt.savefig('./Output/IRIS_by_PUPIL.png')


# In[22]:


plt.xlabel('Frame')
plt.ylabel('PUPIL/IRIS')
plt.plot(P_by_I)
## Give path for plot
plt.savefig('./Output/PUPIL_by_IRIS.png')


# In[ ]:




