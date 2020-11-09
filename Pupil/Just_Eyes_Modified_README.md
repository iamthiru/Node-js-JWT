# **File: Just_Eyes_Modified.py**

## This readme talks about the code layout and structure of the Just_Eyes_Modified.py script.

### Main Function:
* The choice is made based on the type of video (NIR/Color).
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
* NIR Part:
  * Since Pupil is the first thing which should be detected in NIR videos, we threhold the incoming frame using a manually entered number (The one which accurately find us our Pupil).
  * We use this threholded frame to find Canny Edges and pass it to a OpenCV function: cv2.HOUGHCIRCLES().
  * Using a HOUGH_GRADIENT we set the parameters which produces the best results along with Minimum and Maximum Radii range.
  * This HOUGH_CIRCLES Function finds us some 'X' number of circles which best fit on top of the Canny Edge detection.
  * For the circle we find:
    * We allow it to find the best X,Y center locations and Radii for the first 15 frames (Since we are using 15FPS).
    * For the next incoming frames we use a window biasing technique, where we check if the X,Y and Radius lie in that allowable range. If yes then we allow it to detect that center and Radius; if not, then we bias it to use the last 5-10 frames average to detect the center co-ordinates and radius. This allows the algorithm a bit freedom if within the allowable window and guides it to the correct radius range and center if outside the window of tolerance.
