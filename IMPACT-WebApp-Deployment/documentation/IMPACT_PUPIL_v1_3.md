# Algorithmic Flow
## IMPACT PUPIL v1.3

(C) Copyright: Benten Technologies, Inc.

***

### Package Imports
> Lines 30-34
* OpenCV (For Computer Vision)
* Time, System
* NumPy (Numerical Python - Numerical Computation)
* Pandas (For creating / reading dataframes)

### Module Imports
> Lines 37-39
* Detector (Functions for Iris & Pupil Detection)
* Data_Processing (Functions to Process Detected Data)
* PUAL_Gen (Function to convert Raw Data to Frequency Data)

### Global Lists
> Lines 42-52
* **Iris Dilation** (To store frame-wise Iris Radius)
* **Pupil Dilation** (To store frame-wise Pupil Radius)
* **iris_xpoints** (To store frame-wise 'x' center co-ordinate of the detected iris circle)
* **iris_ypoints** (To store frame-wise 'y' center co-ordinate of the detected iris circle)
* **pupil_xpoints** (To store frame-wise 'x' center co-ordinate of the detected pupil circle)
* **pupil_ypoints** (To store frame-wise 'y' center co-ordinate of the detected pupil circle)
* **iris_radii** (To store frame-wise Iris Radii)
* **pupil_radii** (To store frame-wise Pupil Radii)
* **frame_num** (To store frames numbers)
* **ratio** (To store unfiltered & unprocessed frame-wise Pupil/Iris Ratio)
* **processed_ratio** (To store filtered & processed frame-wise Pupil/Iris Ratio)

### Variable Initializations
> Lines 55-62
* **start_time** (Gets the current time)
* **flag** (For condition checking purposes)
* **token** (Monitors and labels a video as 'Good' or 'Bad' based on results after processing)
* **count** (For counting purposes)
* **counter** (For counting purposes)
* **frame_array** (An array which stores the frames with Iris and Pupil circles drawn post-processing)
* **size** (A tuple which stores the frame dimensions)

### Main Algorithm
> Lines 68-76
* Checking if the required system arguments are provided (filename + video-type)
  * Load the name of the video file
  * Load the video type (Color or NIR)
  * Open video capturing from specified video file & from specific location (/static/Pupil_Input_Videos)
* If no arguments
  * Exit the process

> Lines 79-83
* Calculate the FPS of Video
* Load the Static-Dynamic Pupil & Iris Threshold Detector for the video into Pupil_Thresh & Iris_Thresh variables

> Lines 88-141
* While Video is not over
  * Open one frame at a time inside ret, frame variables
  * If the frame can be opened & is readable
    * Append the frame count into frame_num list
    * Increment the counter
    * Check what kind of video it is (NIR/Color)
      * Retrieve the file extension (mp4/avi/mov)
      * Retrieve the dimensions of the frame
      * Copy the original frame (We do not want to process on top of the original frame)
      * Use the Iris cropping function in the Detector module to crop the original frame to get only the Iris
      * Use Gaussian Blur with (5, 5) weights to blur the frame (Helps in Noise removal)
      * Use Bilateral Filter with weights to smoothen the frame from previous step but keep the edges sharp
      * Form a size tuple (width, height) for the frame
      * Call the Pupil Detection function in Detector module. It takes in necessary parameters and returns detection values
      * If for some reason the Pupil goes undetected in the current frame but this is not the very first frame
        * Use the previously detected Pupil center as the current Pupil center
      * Else
        * Consider this frame as not detectable and increment the Dropped_Frame_Counter
      * If the Dropped frames > 40
        * Disqualify the video: "Pupil Undetected, Retake Video"
        * Set the Token as "Bad" since it indicates that the video was not up to the standards
        * Set flag as 0
        * Break from the while loop detection and End the process
      * But, If Dropped frames < 40 and Pupil/Pupil center is detected in the current frame
        * Check if the Radius of the Pupil is >= 35 pixels
          * If yes then start the Iris detection function from the Detector module and pass necessary parameters and pupil center to detect the Iris
        * Else if the Pupil Radius < 35 pixels
          * Disqualify the video: "Low Pixels for Pupil, Retake Video"
          * Set the Token as "Bad" since it indicates that the video was not up to the standards
          * Set flag as 0
          * Break from the while loop detection and End the process
      * Append the detection (circles drawn on original frame) into a frame_array
      * Set flag as 1
    * Else if video is not Color/NIR
      * Send out invalid choice
      * Break from the Detection while loop and stop processes
    * In case someone hits any key while detection is occurring
      * Set flag as 1
      * Break from the Detection while loop and stop processes
  * If frame cannot be opened and is unreadable
    * Set flag as 1
    * Break from the Detection while loop and stop processes
  * Increment the frame counter

> Lines 146-161
* If flag is set to 1 and token is "Good"
  * Call the Output_Visual_Video_Generate function from Data_Processing module for generating an output video with detection drawn on top of the frames
  * Call the List_Processing function from Data_Processing module to formulate and return Pupil & Iris Dilation Lists
  * Call the Make_DFs function from Data_Processing module to return the computed Ratio & Processed Ratio of Pupil/Iris
  * Call the Grapher_Plot_Dilations functions from Data_Processing module to plot the graph for this computed ratio
  * Create a new dataframe (DF) using Frame & Processed Ratio column in previously generated CSV file
  * Send this dataframe to Calculate_PUAL function from PUAL_Gen module which creates a CSV with frequency calculations and PUAL score

> Lines 166-170
* Compute the resources (Time/CPU/Memory) used to run the algorithm
* Release the video and free the resources
* Destroy the cv2 processes if any

***
