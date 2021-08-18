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
* Start a For Loop with 'i' from 0-length of last frame
  * Initialize 'dt_P' to be Pupil_Dilation[current_frame(i)]
  * Initialize 'dt_I' to be Iris_Dilation[current_frame(i)]  
  * Appending dt_P and dt_I to Pupil_memory and Iris_memory respectively
  * Computing 'drop_P' as '0.80 * np.mean(Pupil_Dilation)'
  * Computing 'Surge_P' as '(0.20 + 1) * np.mean(Pupil_Dilation)'
  * Computing 'drop_I' as '0.90 * np.mean(Iris_Dilation)'
  * Computing 'Surge_I' as '(1 + 0.10) * np.mean(Iris_Dilation)'  
  * IF ('i' is between '0' and length of frame number) AND ('dt_P' is below 'drop_P') OR ('dt_P'  is above 'surge_P'))
    * current_frame(i) is assigned mean of all previous Pupil_Dilation values
  * IF ('i' is between '0' and length of frame number) AND (('dt_I' is below 'drop_I') OR ('dt_I' is above 'surge_I'))
    * current_frame(i) is assigned mean of all previous Iris_Dilation values 
* Dataframes - Processed Iris Dilation and Processed Pupil Dilation     
* Defining dataframe columns as - 'Frame', 'Iris Dilation', 'Pupil Dilation', 'Ratio', 'Processed Iris Dilation', 'Processed Pupil Dilation', 'Processed Ratio'
* Converting the dataframe into two CSV files - 'Dilation.csv' and 'Ratio_Dilation.csv'
* Return 'ratio' and 'processed_ratio'


#### D. Grapher_Plot_Dilations
`Function parameters: { filename }`
> Lines 116-156
* Read the CSV file 'Dilation.csv generated after running Make_DFS into dataframe 'df'
* Create 7 new lists and append all the columns from dataframe 'df' in these lists respectively.
* Plotting 4 graphs -
  * Algorithm Generated - 
    * 'frames' on x-axis and 'Radius (px)' on y-axis
    * 'frames' on x-axis and 'Ratio' on y-axis
  * Processed - 
    * 'frames' on x-axis and 'Radius (px)' on y-axis
    * 'frames' on x-axis and 'Ratio' on y-axis
* Save plotted figure
* Close plots

#### E. Computer_Resources
`Function parameters: { start_time }`
> Lines 161-165
* Compute the resources (time/memory/cpu) used to run this entire process

***
