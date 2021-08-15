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
* Start a For Loop with 'i' from 0-length of AU_45c column
  * Initialize 'end_ix' to be window (i to i+num_steps)
  * If 'end_ix' goes out of range & greater than size of AU_45c column
    * Break the Loop
  * Get data out from the window into the score variable
  * Since 'c' in AU_45c indicates 'Absence'/'Presence' of AU_45c, if 1 occurs in all the frames in that window, it is considered as an eye-closure, else an eye-blink (hence we take the product)
  * Eye closure means '1' in all the frames for that window duration or greater
  * 'mult' will be '1' if product of frame values inside the window is 1 else 0
  * If 'mult' variable is '1'
    * We mark that window inside the new dataframe as '1' else '0'
* Return the new dataframe (This is the AU_43c dataframe)

#### D. Compute_PSPI_AUs
`Function parameters: { out-path, file-path, filename_wo_extension }`
> Lines 84-153
* Read the CSV files generated after running OpenFace API call into dataframe 'df'
* Create a new dataframe 'Final_DF' and append all the columns from dataframe 'df'
* Compute num_steps (it is fps*0.45), since an average eye blink occurs for 0.45s
* Get the AU_43c dataframe by calling function 'Calculate_AU43'
* Copy the returned dataframe into 'Final_DF' dataframe
* Count the number of rows in this dataframe 'Final_DF'
* Create a variable 'PSPI' with the entire column initialized to '0'
* Now to compute OpenFace PSPI start For Loop and iterate over each row
  * For each row compute PSPI using formula => 'AU04_r' + max('AU06_r', 'AU07_r') + max('AU09_r', 'AU10_r') + 'AU43_c'
  * Store the result inside PSPI for every row
* Now to compute OpenFace 'SUM_OF_ALL_AUs' get hold of all columns for all AUs and add them together
* Append the 'PSPI' calculated into 'Final_DF' dataframe
* Append the 'SUM_AUs_r' into 'Final_DF' dataframe
* Convert this dataframe 'Final_DF' into a CSV file and save the CSV as {filename}_PSPI_AUs.csv


***
