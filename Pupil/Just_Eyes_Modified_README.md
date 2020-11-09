# **File: Just_Eyes_Modified.py**

## This readme talks about the code layout and structure of the Just_Eyes_Modified.py script.

### Main Function:
* The choice is made based on the type of video (NIR/Color).
* We use a 3x3 kernel to sharpen and Gaussian Blur to smoothen the frame.
* For an NIR Video:
  * We detect the Pupil and Pupil center (in a frame) since it has more contrast as compared to the Iris (Function: PUPIL_DETECTION).
  * Iris is then detected using the returned frame from PUPIL_DETECTION along with the Pupil center.
  * Based on the frames, centers and radius collected within lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris (Function: PLOT_DILATIONS).
* For a Colored Video:
  * Iris and Iris center is detected first since it has higher contrast in ambient light (Function: IRIS_DETECTION).
  * The Pupil uses the frame passed to it from the IRIS_DETECTION function along with the Iris center.
  * Based on the frames, centers and radius collected within lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris (Function: PLOT_DILATIONS).


### PUPIL DETECTION:
* This function is divided into 2 parts for handling NIR and COLOR Videos.
* ##### NIR Part:
  * Since Pupil is the first thing which should be detected in NIR videos, we threshold the incoming frame using a manually entered number (The one which accurately find us our Pupil).
  * We use this thresholded frame to find Canny Edges and pass it to a OpenCV function: cv2.HOUGHCIRCLES().
  * Using a HOUGH_GRADIENT we set the parameters which produces the best results along with Minimum and Maximum Radii range.
  * This HOUGH_CIRCLES Function finds us some 'X' number of circles which best fit on top of the Canny Edge detection.
  * For the circle we find:
    * We allow it to find the best X,Y center locations and Radii for the first 15 frames (Since we are using 15FPS).
    * For the next incoming frames we use a window biasing technique, where we check if the X,Y and Radius lie in that allowable range. If yes then we allow it to detect that center and Radius; if not, then we bias it to use the last 5-10 frames average to detect the center co-ordinates and radius. This gives the algorithm a bit of freedom (if within the allowable window) and guides it to the correct radius range and center (if outside the window of tolerance).
    * After this we return the frame and the center location to the Iris detection Function which makes use of these parameters to detect the correct Iris circle and center.
* ##### Colored Part:
  * The Pupil detection follows the Iris detection in this case. Iris detection sends it frames with Iris region and center co-ordinates.
  * The same process follows for Thresholding, Canny and cv2.HOUGH_CIRCLES.
  * For the circles it finds:
    * We use the Iris center co-ordinates as the pupils window to detect its center co-ordinates. If it lies inside that window then we allow it else we bias it to use the same center as that of the Iris.
    * This allows it more freedom to detect the correct center and not drift away with Iris in case it fails. This guarantees robustness.


### IRIS DETECTION:
* This function is also divided into 2 parts for handling NIR and COLOR Videos.
* ##### NIR Part:
  * The Iris detection follows the Pupil Detection and it makes use of the center and the frame it gets from the PUPIL_DETECTION function.
  * A different manually entered value is used for the Iris Thresholding operation.
  * We use this thresholded frame to find Canny Edges and pass it to a OpenCV function: cv2.HOUGHCIRCLES().
  * Using a HOUGH_GRADIENT we set the parameters which produces the best results along with Minimum and Maximum Radii range.
  * This HOUGH_CIRCLES Function finds us some 'X' number of circles which best fit on top of the Canny Edge detection.
  * For the circle we find:
    * We use the pupil center co-ordinates and Iris detected Radii for the first 15 frames (Since we are using 15FPS).
    * For the next incoming frames we use a window biasing technique, where we check if the X,Y and Radius lie in that allowable range. If yes then we allow it to detect that center and Radius; if not, then we bias it to use the last 5-10 frames average to detect the center co-ordinates it got from the PUPIL_DETECTION function. This gives the algorithm a bit of freedom (if within the allowable window) and guides it to the correct radius range and center (if outside the window of tolerance).
    * Finally we return the frame with embedded PUPIL and IRIS circles.
* ##### Colored Part:
  * When using a colored video, we detect the Iris first.
  * Using the same operations like Thresholding, Canny Edge and cv2.HOUGH_CIRCLES, we find the best fit circles.
  * For the circles we find:
    * For the first 15 frames we allow it to find its own center co-ordinates and the radius range.
    * For the next incoming frames, we see if the current detected center points lies in the Allowable window. If yes, we allow it to use that center else we bias it to use the previous 5 frames center co-ordinates and radius range. This is meant to give the algorithm some bound the algorithm and give it enough freedom at the same time to get the most accurate center.
