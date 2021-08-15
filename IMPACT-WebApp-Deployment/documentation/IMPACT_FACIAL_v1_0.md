# Algorithmic Flow
## IMPACT FACIAL v1.0

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
`Function parameters: { input_path, output_path }`
> Lines 51-56






***
