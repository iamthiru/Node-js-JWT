## IMPACT-PUPIL MODULES
### Functions used in the IMPACT PUPIL Development are separated using modularization.

### Module 1 - Data Processing:
1. Contains functions for the output video file generation with detections embedded.
2. List processing functions for Pupil and Iris for further usage.
3. DataFrame creation function to generate DFs from lists and store the values in CSVs.
4. Function to plot the graphs by reading from the CSVs.
5. Displaying the resources used to run the entire algorithm.

### Module 2 - Detector:
1. Contains the function to detect Threshold value dynamically for a given video.
2. Contains a function that uses this generated threshold value to detect the Pupil using contour approach.
3. Contains a function that uses threshold and center of the pupil circle to get Iris using Modified Hough approach.

### Module 3 - Validator:
Contains a single function that checks the radius value for validity and if it lies in the specified upper and lower bound.
