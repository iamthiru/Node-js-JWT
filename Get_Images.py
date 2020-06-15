# From the downloaded Data-set segregate the images according to labels
# E.g. Images with label anger, is stored in anger folder and so on...

import os
import shutil

path = '/Users/pranavdeo/Desktop/jaffedbase/'
images = os.listdir(path)
Emotions = ['AN', 'DI', 'HA', 'FE', 'NE', 'SA', 'SU']
for file in images:
    if file.endswith('.txt'):
        continue
    St = str(file)
    label = St[3:5]
    for i in Emotions:
        if label == i:
            expression = label
    src = '/Users/pranavdeo/Desktop/jaffedbase/' + file
    dst = '/Users/pranavdeo/Desktop/dbase/' + expression + '/' + file
    shutil.copyfile(src, dst)
print('FINISH')
