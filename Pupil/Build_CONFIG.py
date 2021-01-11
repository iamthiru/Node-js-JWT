# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Content : Build Config File to run the Python Script

import os

# 1. NIR ; 2. Color
ch = 1

# video filename
filename = 'Eric_Blue_Vertical01.MOV'

# video type: NIR or Color
video_type = 'Color'

command = 'python IMPACT_PUPIL_v1_0.py ' + str(ch) + ' ' + filename + ' ' + video_type
os.system(command)
