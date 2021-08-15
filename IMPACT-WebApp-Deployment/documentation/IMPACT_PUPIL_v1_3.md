# Algorithmic Flow
## IMPACT PUPIL v1.3

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
      * 


***
