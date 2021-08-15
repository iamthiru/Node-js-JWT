# Algorithmic Flow
## IMPACT FACIAL v1.0

(C) Copyright: Benten Technologies, Inc.

***

### Package Imports
> Lines 22-29
* **OS, System** (For making os calls and system commands)
* **OpenCV** (For Computer Vision)
* **Time** (To get system time elements)
* **Subprocess** (To run shell commands inside Python)
* **NumPy** (For numerical computations)
* **Pandas** (For creating/reading dataframes)
* **Matplotlib-PyPlot** (Library for plotting graphs)

### Module Imports
> Line 32
* **Data_Processing** (To process raw data collected)

### Variable Initialization
> Line 35
* **start_time** (getting the current system time)

### Function Definitions
#### A. OpenFace_API_Call
`Function parameters: { input_path, output_path }`
> Lines 41-45
* Runs OpenFace FeatureExtraction command with video input-path and out-path to generate CSV file with Action Units
* Popen will run the command in shell CLI

#### B. fps_calculator
`Function parameters: { video-path }`
> Lines 51-56
* Open the video from the video-path using OpenCV video capture mode
* Calculate the fps of the video
* Return the fps of the video

#### C. Calculate_AU43
`Function parameters: { AU_45c_Col, num_steps=fps*Avg_Human_Eye_Blink (0.45s ~ "Medical Standard") }`
> Lines 63-78
* Create a new dataframe with null entries under column AU_45c
* 


***
