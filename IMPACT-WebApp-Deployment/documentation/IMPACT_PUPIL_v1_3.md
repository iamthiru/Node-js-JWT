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

***
