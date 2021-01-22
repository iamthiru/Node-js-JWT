# **File: IMPACT_PUPIL_v1.3.py**

## This readme talks about the code layout and structure of the IMPACT_PUPIL_v1.3.py script.

### Main Function:
1. The choice is made based on the type of video (NIR/Color).
2. A Dynamic Thresholder is run which selects the best value for Threshold for both Pupil and Iris.
3. For an NIR or a Colored Video:
   * Performing a 90 degree rotation using cv2 module.
   * Performing combination of smoothing filters on top of frame.
   * We detect the Pupil and Pupil center (in a frame) since it has more contrast as compared to the Iris (Module Function: Detector.Pupil_Detection).
   * A check is performed for No Detection of Pupil. If No Detection a Dropped Frame counter is incremented.
   * Else if the Pupil is detected, Iris detection starts using the returned frame from Detector.Pupil_Detection. Iris uses Pupil center.
   * Based on the frames, centers and radius collected using lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
   * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris (Function: PLOT_DILATIONS).


### PUPIL DETECTION:
1. NIR and COLOR uses the same logical model/algorithm with some minute changes.
  * We use this thresholded frame and pass it to a OpenCV function: cv2.findContours() and cv2.HOUGHCIRCLES().
  * Using a Contour approach for a dynamically produced threshold for the Pupil.
  * Contour Method finds us the regions of higher intensity; areas with darker regions as compared to the other regions in the frame.
  * For the Contours we find:
     * We get the areas of the contours and try to fit a rectangle on top of them.
     * Next we give a area range within which we ask it to detect a contour.
     * Then we use the max diameter using the co-ordinates of the rectangle to fit a minEnclosingCircle()
  * Else if Contour is not detected and for the Hough circles we find:
     * For a contour within the LL and UL, we find the minEnclosingCircle() and the diameter from the rectangular box that is fit on the contour.
     * For every radius collected, we run it through validity check and fit a circle on top of it.
     * For the radius that passes this valdity check, we store it in a list named pupil_radii and Pupil_Dilation for future CSV and graphing purposes.
     * Also the center detected is also collected under pupil_xpoints and pupil_ypoints.


### IRIS DETECTION:
* 
