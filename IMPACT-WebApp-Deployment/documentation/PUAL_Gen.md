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
* Converting dataframe into CSV file as 'PUAL_{filename}.csv'

#### B. Calculate_PUAL
`Function parameters: {filename, ratio_data, fps }`
> Lines 37-100
* Initializing variables:
  * 'pi' is numpy.pi
  * 'two_pi' is twice the pi
  * 'lower_bound_pual_millihertz', 'upper_bound_pual_millihertz', 'lower_bound_white_noise_correction_millihertz' and 'upper_bound_white_noise_correction_millihertz' has been provided by Dr. Neice
  * 'data_points' are number of data points we have collected from the Pupil Detection Algorithm
  * 'start_index' is the index from which we include the data_points for PUAL computation { Provided by Dr. Neice from his Research }
  * 'end_index' is the index at which we stop to include the data_points for PUAL computation { Provided by Dr. Neice from his Research }
  * 'start_index_noise' is the index from which we include the data_points for PUAL Noise removal computation { Provided by Dr. Neice from his Research. We might not require it since we have no noise or the noise was cleaned. }
  * 'end_index_noise' is the index at which we stop to include the data_points for PUAL Noise removal computation { Provided by Dr. Neice from his Research. We might not require it since we have no noise or the noise was cleaned. }
* Step 1: Gaussian Smoothening
  * data_points are repeated 3 times in a new list 'ratio_data_repeat' since we have to make it feel like an infinite series
  * Copy the data from data_points into ratio_data_repeat
  * Compute the standard deviation 'std_dev' { Provided by Dr. Neice }
  * IF the 'std_dev' > half the no. of 'data_points'
    * Set the 'std_dev' as half the no. of data_points
* Step 2: Finding Low Frequency components
  * Apply the gaussian filter on the 'ratio_data' collected with computed std_dev; This will produce the low frequency components
  * 'ratio_data_cleaned' is removal of low frequency component from the actual 'ratio_data'
* Step 3: Computing FFT
  * Apply the fast fourier transform on the 'ratio_data_cleaned'; This produces a real part and imaginary part
* Step 4: Getting Amplitude
  * Compute the Amplitude which is the abs('FFT_Data'); abs computes the square of the amplitudes
* Step 5: Getting PUAL index
  * Add up all the amplitudes from 'start_index' up to 'end_index' and take the mean: Thats your PUAL_index / PUAL_Score
* Step 6: Computing Noise
  * Add up all the amplitudes from 'start_index_noise' up to 'end_index_noise' and take the mean: Thats your Corrected_PUAL
* Step 7: Compute Corrected PUAL
  * Remove Noise from PUAL
  * IF the 'Corrected_PUAL' < 0
    * Then set 'Corrected_PAUL' as 0
* Step 8: Save all the computed data to CSV
  * Write all the data collected and computed so far to a CSV file
  * Return PUAL_index, Noise, Corrected_PUAL

***
