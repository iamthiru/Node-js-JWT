# Algorithmic Flow
## PUAL_Gen

(C) Copyright: Benten Technologies, Inc.

***

### Package Imports
> Lines 12-15
* **NumPy** (For numerical computations)
* **Scipy** (For scientific computations)  
* **Pandas** (For creating/reading dataframes)


### Function Definitions
#### A. Write_to_CSV
`Function parameters: {f, raw_data, std, low_frequency_data, ratio_cleaned_data, fft_on_cleaned_data, amplitude, orignial_pual, noise_pual, corrected_pual }`
> Lines 20-33
* Defines columns to dataframes as - 'Raw_Data', 'StDev', 'Low_Freq_Data', 'Cleaned_Data', 'FFT_Cleaned_Data', 'Amplitude', 'PUAL_Score', 'Noise', 'Corrected_PUAL' 
* Assigning these columns with function parameter values.
* Converting dataframe into CSV file as 'filename.csv'

#### B. Calculate_PUAL
`Function parameters: {filename, ratio_data, fps }`
> Lines 37-100
* Initializing variables
*  
* Finding low frequency components
* Computing FFT  
* Computing Square root of Amplitudes
* Computing PUAL index
* Computing Noise to remove it from the calculated PUAL 
* Computing Corrected PUAL by subtracting noise from PUAL index
* IF Corrected_PUAL < 0
  * Initialize Corrected PUAL as 0
* Write all variables to CSV file
* Return PUAL_index, Noise, Corrected PUAL
***
