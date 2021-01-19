# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Content : PLUGIN FILE FOR IMPACT-PUPIL

import os

# 1. NIR ; 2. Color
ch = 1

# video filename
filename = 'Elina_DarkBrown_Vertical_02.MOV'

# video type: NIR or Color
video_type = 'Color'

command = 'python IMPACT_PUPIL_v1.3.py ' + str(ch) + ' ' + filename + ' ' + video_type
os.system(command)
