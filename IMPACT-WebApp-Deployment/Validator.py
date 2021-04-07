# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/15/2021

# Module Description:
# * Radius_Validity_Check - Checks the Current Frame's detected Radius Validity wrt previously recorded Radius values.
# * Checks if Pupil was detected in a frame.

# PACKAGE IMPORTS
import numpy as np


########################################################################################################################

def Radius_Validity_Check(radius, input_lst, fr_nm, tag):
    if tag == 'pupil':
        if len(fr_nm) > 0:
            drop_P = 0.80 * np.mean(input_lst)
            surge_P = (0.20 + 1) * np.mean(input_lst)
            if len(fr_nm) > 0 and (radius <= drop_P or radius >= surge_P):
                R = np.mean(input_lst)
            else:
                R = radius
        else:
            R = radius
    else:
        if len(fr_nm) > 0:
            drop_I = 0.90 * np.mean(input_lst)
            surge_I = (1 + 0.10) * np.mean(input_lst)
            if len(fr_nm) > 0 and (radius <= drop_I or radius >= surge_I):
                R = np.mean(input_lst)
            else:
                R = radius
        else:
            R = radius
    return R

########################################################################################################################
