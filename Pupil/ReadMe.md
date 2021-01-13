# **File: IMPACT_PUPIL_v1_2.py**

## This readme talks about the code layout and structure of the IMPACT_PUPIL_v1_2.py script.

### Main Function:
* The choice is made based on the type of video (NIR/Color).
* We use a 3x3 kernel to sharpen and Gaussian Blur to smoothen the frame.
* For an NIR Video:
  * We detect the Pupil and Pupil center (in a frame) since it has more contrast as compared to the Iris (Function: PUPIL_DETECTION).
  * Iris is then detected using the returned frame from PUPIL_DETECTION along with the Pupil center.
  * Based on the frames, centers and radius collected using lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris (Function: PLOT_DILATIONS).
* For a Colored Video:
  * Pupil is still the first to be detected since the approach is using contour wherein the pupil is more clearly visible.
  * Pupil tracking is done using Contour method with a fallback to Hough in case contour fails.
  * Iris tracking uses Pupil center with minRadius and maxRadius as a function of Pupil radius range.
  * Iris tracking is still conducted using the Hough method since Contour detects a lot of noise from eyebrows and eyelashes.
  * Based on the frames, centers and radius collected within lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris (Function: PLOT_DILATIONS).


### PUPIL DETECTION:
* This function is divided into 2 parts for handling NIR and COLOR Videos.
* ##### NIR and Color Part:
  * Since Pupil is the first thing which should be detected in NIR videos, we threshold the incoming frame using a manually entered number (The one which accurately find us our Pupil).
  * We use this thresholded frame and pass it to a OpenCV function: cv2.HOUGHCIRCLES() and cv2.findContours().
  * Using a HOUGH_GRADIENT we set the parameters which produces the best results along with Minimum and Maximum Radii range.
  * This HOUGH_CIRCLES Function finds us some 'X' number of circles which best fit on top of the Canny Edge detection.
  * Contour Method finds us the regions of higher intensity using the threshold value.
  * For the Contours we find:
    * We get the areas of the contours and try to fit a rectangle on top of them.
    * Next we give a area range within which we ask it to detect a contour.
    * Then we use the max diameter using the co-ordinates of the rectangle to fit a minEnclosingCircle()
  * Else if Contour is not detected and for the Hough circles we find:
    * We allow it to find the best X,Y center locations and Radii for the first 15 frames (Since we are using 15FPS).
    * For the next incoming frames we use a window biasing technique, where we check if the X,Y and Radius lie in that allowable range. If yes then we allow it to detect that center and Radius; if not, then we bias it to use the last 30 frames average to detect the center co-ordinates and radius. This gives the algorithm a bit of freedom (if within the allowable window) and guides it to the correct radius range and center (if outside the window of tolerance).
    * After this we return the frame and the center location to the Iris detection Function which makes use of these parameters to detect the correct Iris circle and center using Hough method.


### IRIS DETECTION:
* This function is also divided into 2 parts for handling NIR and COLOR Videos.
* ##### NIR and Color Part:
  * The Iris detection follows the Pupil Detection and it makes use of the center and the frame it gets from the PUPIL_DETECTION function.
  * A different manually entered value is used for the Iris Thresholding operation.
  * We use this thresholded frame to find Canny Edges and pass it to a OpenCV function: cv2.HOUGHCIRCLES().
  * Using a HOUGH_GRADIENT we set the parameters which produces the best results along with Minimum and Maximum Radii range.
  * This HOUGH_CIRCLES Function finds us some 'X' number of circles which best fit on top of the Canny Edge detection.
  * For the circle we find:
    * We use the pupil center co-ordinates and Iris detected Radii for the first 15 frames (Since we are using 15FPS).
    * For the next incoming frames we use a window biasing technique, where we check if the X,Y and Radius lie in that allowable range. If yes then we allow it to detect that center and Radius; if not, then we bias it to use the last 5-10 frames average to detect the center co-ordinates it got from the PUPIL_DETECTION function. This gives the algorithm a bit of freedom (if within the allowable window) and guides it to the correct radius range and center (if outside the window of tolerance).
    * Finally we return the frame with embedded PUPIL and IRIS circles.
