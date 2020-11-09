# **File: Just_Eyes_Modified.py**

## This readme talks about the code layout and structure of the Just_Eyes_Modified.py script.

### Main Function:
* The choice is made based on the type of video (NIR/Color).
* For an NIR Video:
  * We detect the Pupil and Pupil center (in a frame) since it has more contrast as compared to the Iris (Function: PUPIL_DETECTION).
  * Iris is then detected using the returned frame from PUPIL_DETECTION along with the Pupil center.
  * Based on the frames, centers and radius collected within lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris.
* For a Colored Video:
  * Iris and Iris center is detected first since it has higher contrast in ambient light (Function: IRIS_DETECTION).
  * The Pupil uses the frame passed to it from the IRIS_DETECTION function along with the Iris center.
  * Based on the frames, centers and radius collected within lists for Pupil and Iris, we compute the ratio (Function: CREATE_DATAFRAME).
  * A graph is created after cleaning for noise and sudden drops/surges in radii of Pupil and Iris.
  
### PUPIL DETECTION:
* 
