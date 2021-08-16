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

#### E. Calculate_Pain_Labeler
`Function parameters: { out-path, file-path, filename_wo_extension, num_steps=video_fps }`
> Lines 161-216
* Read the PSPI_AUs CSV file from given filepath
* This is a Bucket creation and mapping function 
* The variables 'no_pain_UL', 'pain_1_UL' and 'pain_2_UL' are calculated after processing ML/DL models from Delaware Pain DB, BioVid etc.
* Set start_index as '0' and end_index as num_steps (num_steps = fps of video)
* Gather the 'SUM_AUs_r' column data from PSPI_AUs CSV file into 'x_data'
* Initialize Word_Label list to be empty
* For the first sequence (0-60 if 60 FPS or 0-30 if 30 FPS), 'seq_X' = x_data[0:60] or x_data[0:30]
* Set the 'slider_value' as mean of 'seq_X'
* Label the first second (60 frames / 30 frames based on FPS) as "No Pain", "Pain Level 1", "Pain Level 2" or "Pain Level 3" based on under which bucket this 'slider_value' falls
* Append the Label to 'Word_Label'
* Loop 'i' over the entire 'x_data' column with sliding window index technique
* Since we calculated for the first 30/60 frames (=1second), we set 'start_index' = 'start_index' (initially 0) + FPS
* 'end_index' = previous 'end_index' + FPS { Try to visualize this window }
* If the 'end_index' goes over the size of the column, then we break out of the For Loop
* Get the 'seq_X' from the current 'start_index' and 'end_index' range
* Set the slider value as mean of this current 'seq_X'
* Again Label this 'second' (60 frames / 30 frames) as "No Pain", "Pain Level 1", "Pain Level 2" or "Pain Level 3" based on under which bucket this 'slider_value' falls
* Create a Label CSV file after converting the 'Word_Label' column into a dataframe
* Name the column as 'Label' and also add columns 'Time (sec)' and 'Video Score'
* Save this CSV to the out-path provided
* Return the 'Word_Label' list

**NOTE: This Function is labelling every second (time) with a word label**

#### F. Video_Labeler
`Function parameters: { out-path, filename_wo_extension, label_list=Word_Label }`
> Lines 223-257
* Each Pain Level (0/1/2/3) here are finalized after application of ML/DL techniques over BioVid Dataset
* Initialize count variables for no-pain, pain1, pain2, pain3 as '0'
* Count the no-pains, pain1s, pain2s, pain3s from the Label_List generated
* Score calculated is the weighted mean; it will be based on count of different levels of pain
* Normalize the Pain Score by removing No Pain part and dividing by Pain part and multiply by 10 to map it to scale of 0-10
* Append this 'Final Video Score' as a column in the label_file
* Save this as a CSV file {filename}_LabelFile.csv
* Return the computed score

#### G. Graph_Plot
`Function parameters: { out-path, file-path, filename, 0 }`
> Lines 263-275
* Load the CSV using pandas into a dataframe
* Grab hold of two columns ('sum_AU_r' or 'PSPI_AU_r') & 'frames'
* Plot graph with 'frames' on x-axis and 'sum_AU_r' or 'PSPI_AU_r' on y-axis
* Save plotted figure
* Close plots

### Main Algorithm
* Set input-path and out-path
* Set tag as '0'
* If the code is called using system arguments { filename }
  * Set 'filenm' as global
  * Get 'filenm' from provided system argument variable
  * Set input-path as '/static/Face_Input_Videos/'; this is where the video-file will be placed
  * Set tag as '1'
* Else if nothing is provided in system argument variables
  * Use a default face.mp4 file loaded inside '/static/Face_Input_Videos/'
  * Load the input-path as the file-path
* Calculate the FPS of the video by passing it to fps_calculator function
* If tag is '1' (system argument variables are provided)
  * Make OpenFace_API_Call on file provided from system arguments
  * Compute and produce PSPI_AUs CSV file from the main CSV file from OpenFace_API_Call result
  * Pipe the PSPI_AUs CSV file to Calculate_Pain_Labeler function to produce Word Labels
  * Pipe the Word Label list to Video_Labeler to generate a final video score
  * Plot the Graph using the CSV file
* Else (if not arguments provided)
  * Make OpenFace_API_Call on default file present in system
  * Compute and produce PSPI_AUs CSV file from the main CSV file from OpenFace_API_Call result
  * Pipe the PSPI_AUs CSV file to Calculate_Pain_Labeler function to produce Word Labels
  * Pipe the Word Label list to Video_Labeler to generate a final video score
  * Plot the Graph using the CSV file
* Compute the resources (time/memory/cpu) used to run this entire process

***
