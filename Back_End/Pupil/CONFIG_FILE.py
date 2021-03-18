# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Content : PLUGIN FILE FOR IMPACT-PUPIL

import os

# 1. NIR ; 2. Color
# ch = 1

# video filename
filename = 'Eric_Test01.mp4'

# video type: NIR or Color
video_type = 'Color'

command = 'python IMPACT_PUPIL_v1_3.py ' + filename + ' ' + video_type
os.system(command)
