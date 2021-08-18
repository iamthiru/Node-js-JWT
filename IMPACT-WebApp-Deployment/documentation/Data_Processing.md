# Algorithmic Flow
## Data Processing

(C) Copyright: Benten Technologies, Inc.

***

### Package Imports
> Lines 15-21
* **cv2** (For Computer Vision)
* **OS** (For making os calls and system commands)
* **Time** (To get system time elements)
* **NumPy** (For numerical computations)
* **Pandas** (For creating/reading dataframes)
* **Matplotlib-PyPlot** (Library for plotting graphs)

### Function Definitions
#### A. Output_Visual_Video_Generate
`Function parameters: { filename, fps, size, frame_array }`
> Lines 26-31
* Path where we will save the Output Video file
* VideoWriter in-built function will convert frames to a mp4 video file
* We create a video by stitching all the frames together

#### B. List_Processing
`Function parameters: { frame number, Pupil Dilation, Iris Dilation }`
> Lines 36-63
* This function is used to check if we missed detections for Pupil and Iris
* Case1: if we have 500 frames but the Pupil list contains lesser frames, this means some frames went undetected
  * In this case compute the difference in two lists and replicate the detection value for the last frame from Pupil List for all missing frames
* Case2: if we have 500 frames but the Pupil list contains more than 500 frames, this means we have multiple detections inside frames
  * In this case we get rid of the surplus frames in the Pupil List
* Case1: if we have 500 frames but the Iris list contains lesser frames, this means some frames went undetected
  * In this case compute the difference in two lists and replicate the detection value for the last frame from Iris List for all missing frames
* Case2: if we have 500 frames but the Iris list contains more than 500 frames, this means we have multiple detections inside frames
  * In this case we get rid of the surplus frames in the Iris List
* Return the Pupil Dilation and Iris Dilation Lists

#### C. Make_DFS
`Function parameters: { filename, frame_num, Iris_Dilation, Pupil_Dilation, ratio, processed_ratio }`
> Lines 68-111
* Create a new dataframe with Pupil and Iris dilation values
* Start a For Loop with 'i' from 0 to no. of frames
  * Initialize 'dt_P' to be Pupil_Dilation[current_frame(i)]
  * Initialize 'dt_I' to be Iris_Dilation[current_frame(i)]
  * For Pupil, we try to monitor for false detections / noise; We are looking out for sudden drop / surge in Pupil value
  * 'drop_P' and 'surge_P' mark the allowable drops / surges in the value of the Pupil detection in the current frame
  * * For Pupil, we try to monitor for false detections / noise; We are looking out for sudden drop / surge in Pupil value
  * 'drop_I' and 'surge_I' mark the allowable drops / surges in the value of the Iris detection in the current frame
  * IF current pupil detected value 'dt_P', has dropped more than allowed drop value 'drop_P' OR current pupil detected value 'dt_P', has surged more than allowed surge value 'surge_P'
    * current pupil detection will be assigned the mean of all previously detected Pupil values
  * IF current iris detected value 'dt_I', has dropped more than allowed drop value 'drop_I' OR current iris detected value 'dt_I', has surged more than allowed surge value 'surge_I'
    * current iris detection will be assigned the mean of all previously detected Iris values
* New Column is created named 'Processed Iris Dilation' and 'Processed Pupil Dilation'     
* 'processed_ratio' list will be appended ratio of Pupil / Iris with up to 5 points after the decimal
* This 'processed_ratio' list is appended to the new Dataframe column
* Defining Dataframe columns as - 'Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio', 'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio'
* Converting the dataframe into two CSV files - 'Dilation.csv' and 'Ratio_Dilation.csv'
* Dilation.csv will contain all columns while Ratio_Dilation.csv will contain only 'Frames' & 'Processed Ratio' (Smaller File)
* Return 'ratio' and 'processed_ratio'


#### D. Grapher_Plot_Dilations
`Function parameters: { filename }`
> Lines 116-156
* Read the CSV file 'Dilation.csv generated after running Make_DFS into dataframe 'df'
* Create 7 new lists and append all the columns from dataframe 'df' in these lists respectively.
* Plotting 4 graphs -
* First plot: Raw Data - [ Iris Radius vs Frames & Pupil Radius vs Frames ]
* Second plot: Processed Data - [ Processed Iris Radius vs Frames & Processed Pupil Radius vs Frames ]
* Third plot: Raw Data Ratio - [ Pupil/Iris vs Frames ]
* Fourth plot: Processed Data Ratio - [ Processed Pupil/Iris vs Frames ]
* Save the plots as .png file
* Close all plots

#### E. Computer_Resources
`Function parameters: { start_time }`
> Lines 161-165
* Compute the resources (time/memory/cpu) used to run this entire process

***
