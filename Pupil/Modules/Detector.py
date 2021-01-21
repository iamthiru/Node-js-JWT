# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/15/2021

# Module Description:
# * Iris Detector
# * Pupil Detector
# * Dynamic Pupil, Iris Threshold Detection

# PACKAGE IMPORTS
import cv2
import Validator
import numpy as np

# LIST INITIALIZATION
Pupil_Thresh_Store = []
Iris_Thresh_Store = []


########################################################################################################################

def Iris_Detection(im, frame_num, iris_thresh, pup_cen, iris_radii, iris_xpoints, iris_ypoints, pupil_radii, Iris_Dilation, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    w, h = imge.shape

    _, thresh = cv2.threshold(imge, abs(int(iris_thresh)), 255, cv2.THRESH_BINARY)
    cv2.imshow('Iris Threshold', thresh)

    if v_type == 'NIR':
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 500, param1=30, param2=10,
                                   minRadius=int(max(pupil_radii)*1.3), maxRadius=int(max(pupil_radii)*5))
    else:
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 3, 800, param1=90, param2=30,
                                   minRadius=int(max(pupil_radii)*1.3), maxRadius=int(max(pupil_radii)*5))

    if circles is not None:
        circles = np.round(circles[0, :])

        for (x, y, r) in circles:
            if len(iris_radii) == 0 or len(iris_radii) < 15:
                if len(frame_num) > 10:
                    r = Validator.Radius_Validity_Check(r, iris_radii, frame_num, 'iris')
                cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                iris_radii.append(r)
                iris_xpoints.append(pup_cen[0])
                iris_ypoints.append(pup_cen[1])

            else:
                if v_type == 'NIR':
                    r_ll = int(np.floor(np.average(iris_radii))) - 1
                    r_ul = int(np.ceil(np.average(iris_radii))) + 1
                else:
                    r_ll = int(np.floor(np.average(iris_radii))) - 3
                    r_ul = int(np.ceil(np.average(iris_radii))) + 3

                if r_ll <= r <= r_ul:
                    if len(pup_cen) > 0:
                        if len(frame_num) > 10:
                            r = Validator.Radius_Validity_Check(r, iris_radii, frame_num, 'iris')
                        cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                        iris_radii.append(r)
                        iris_xpoints.append(pup_cen[0])
                        iris_ypoints.append(pup_cen[1])
                    else:
                        if len(frame_num) > 10:
                            r = Validator.Radius_Validity_Check(r, iris_radii, frame_num, 'iris')
                        cv2.circle(im, (int(x), int(y)), int(r), (255, 0, 0), 1)
                        iris_radii.append(r)
                        iris_xpoints.append(x)
                        iris_ypoints.append(y)

                else:
                    if v_type == 'NIR':
                        r = np.average(iris_radii[-5:])
                    else:
                        r = np.average(iris_radii[-10:])
                    iris_radii.append(r)

                    if len(pup_cen) < 1:
                        cv2.circle(im, (int(x), int(y)), int(r), (255, 0, 0), 1)
                        iris_radii.append(r)
                        iris_xpoints.append(x)
                        iris_ypoints.append(y)
                    else:
                        cv2.circle(im, (int(pup_cen[0]), int(pup_cen[1])), int(r), (255, 0, 0), 1)
                        # cv2.rectangle(im, (x_ll, y_ll), (x_ul, y_ul), (255, 0, 0), 1)
                        iris_radii.append(r)
                        iris_xpoints.append(pup_cen[0])
                        iris_ypoints.append(pup_cen[1])

            Iris_Dilation.append(r)

    else:
        return [], iris_radii, iris_xpoints, iris_ypoints, Iris_Dilation

    return im, iris_radii, iris_xpoints, iris_ypoints, Iris_Dilation


########################################################################################################################

def Pupil_Detection(im, frame_num, Pupil_Thresh, pupil_radii,  pupil_xpoints, pupil_ypoints, Pupil_Dilation, v_type):
    imge = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    pupil_center = []
    w, h = imge.shape

    _, thresh = cv2.threshold(imge, abs(int(Pupil_Thresh)), 255, cv2.THRESH_BINARY)
    cv2.imshow('Pupil', thresh)
    contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    flg = 0

    if v_type == 'NIR':
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 1, 300, param1=30, param2=10,
                                   minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))
    else:
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 2, 300, param1=30, param2=10,
                                   minRadius=int(min(w, h) / 12), maxRadius=int(max(w, h) / 5.5))

        # Contour Method for Pupil
        if contours is not None:
            for c in contours:
                contour_area = cv2.contourArea(c)
                x1, y1, w1, h1 = cv2.boundingRect(c)

                if v_type == 'NIR':
                    LL_C_Area = 2000
                    UL_C_Area = 15000
                    LL_val = 0.6
                    UL_val = 1.5
                else:
                    LL_C_Area = 1200
                    UL_C_Area = 25000
                    LL_val = 0.2
                    UL_val = 1.15

                if (LL_C_Area <= contour_area <= UL_C_Area) and (LL_val <= (w1 / h1) <= UL_val):
                    flg = 1
                    coords, r = cv2.minEnclosingCircle(c)
                    dia_p = max(w1, h1)
                    rad_p = dia_p / 2
                    if len(frame_num) > 10:
                        # Check the value of the radius using lower and upper bound
                        rad_p = Validator.Radius_Validity_Check(dia_p / 2, pupil_radii, frame_num, 'pupil')
                    cv2.circle(im, ((int(x1 + rad_p)), int((y1 + rad_p))), int(rad_p), (0, 255, 0), 1)
                    # cv2.rectangle(im, (x1, y1), (x1+w1, y1+h1), (0, 255, 0), 2)
                    pupil_radii.append(rad_p)
                    Pupil_Dilation.append(rad_p)
                    pupil_xpoints.append(x1 + dia_p / 2)
                    pupil_ypoints.append(y1 + dia_p / 2)
                    pupil_center = [x1 + dia_p / 2, y1 + dia_p / 2]

        # Hough Method when Contour Fails
        elif circles is not None and flg == 0:
            print('>Trying Hough: Pupil')
            circles = np.round(circles[0, :])
            for (x, y, r) in circles:
                if len(pupil_radii) == 0 or len(pupil_radii) <= 15:
                    if len(frame_num) > 10:
                        # Check the value of the radius using lower and upper bound
                        r = Validator.Radius_Validity_Check(r, pupil_radii, frame_num, 'pupil')
                    cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                    pupil_radii.append(r)
                    pupil_xpoints.append(x)
                    pupil_ypoints.append(y)
                    pupil_center = [x, y]
                else:
                    r_ll = int(np.floor(np.average(pupil_radii))) - 7
                    r_ul = int(np.ceil(np.average(pupil_radii))) + 7

                    if r_ll <= r <= r_ul:
                        if len(frame_num) > 10:
                            # Check the value of the radius using lower and upper bound
                            r = Validator.Radius_Validity_Check(r, pupil_radii, frame_num, 'pupil')
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_radii.append(r)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]
                    else:
                        r = np.average(pupil_radii[-15:])
                        pupil_radii.append(r)
                        cv2.circle(im, (x, y), int(r), (0, 255, 0), 1)
                        pupil_xpoints.append(x)
                        pupil_ypoints.append(y)
                        pupil_center = [x, y]

                Pupil_Dilation.append(r)

        else:
            return [], [], pupil_radii, pupil_xpoints, pupil_ypoints, Pupil_Dilation

        return im, pupil_center, pupil_radii, pupil_xpoints, pupil_ypoints, Pupil_Dilation


########################################################################################################################

def Threshold_Detect(Vid):
    process_frames = 1
    while Vid.isOpened() and process_frames <= 5:
        process_frames += 1
        retr, fr = Vid.read()
        if retr:
            # Getting Pupil Threshold Value Dynamically
            for var in range(10, 60):
                ima = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(ima, var, 255, cv2.THRESH_BINARY)
                contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

                if contours is not None:
                    for c in contours:
                        contour_area = cv2.contourArea(c)
                        x1, y1, w1, h1 = cv2.boundingRect(c)
                        if (1500 < contour_area < 15000) and (0.6 < (w1 / h1) < 1.5):
                            Pupil_Thresh_Store.append(var)

            # Getting Iris Threshold Value Dynamically
            for var in range(Pupil_Thresh_Store[len(Pupil_Thresh_Store) - 1]+10, 110):
                ima = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
                _, thresh = cv2.threshold(ima, var, 255, cv2.THRESH_BINARY)
                contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

                if contours is not None:
                    for c in contours:
                        contour_area = cv2.contourArea(c)
                        x1, y1, w1, h1 = cv2.boundingRect(c)
                        if (4500 < contour_area < 45000) and (0.6 < (w1 / h1) < 1.5):
                            Iris_Thresh_Store.append(var)

    # print('Pupil Threshold : ', Pupil_Thresh_Store)
    print('Pupil Threshold Value : ', np.mean(Pupil_Thresh_Store))
    # print('Iris Threshold : ', Iris_Thresh_Store)
    print('Iris Threshold Value : ', np.mean(Iris_Thresh_Store))
    return np.mean(Pupil_Thresh_Store)-10, np.mean(Iris_Thresh_Store)

########################################################################################################################