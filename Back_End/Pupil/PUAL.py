# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 03/01/2021
# Version: v1.0

# Code Description:
# PUAL Function - Translating to Python Code.

# **********************************************************************************************************************
# IMPORTS:
import numpy as np
from scipy.fft import fft, ifft
from scipy.ndimage import gaussian_filter
import pandas as pd


# **********************************************************************************************************************
# Reading a CSV File:
Filename = 'APKTest06_Ratio_Dilation_Pranav.csv'
df = pd.read_csv(Filename, usecols=['Frame', 'Processed Ratio'])


# **********************************************************************************************************************
# PRE-DEFINED TOKENS:
FFT_Data = []
scan_length = len(df['Processed Ratio'])
print('Scan-length : ', scan_length)
frames_per_sec = 15
pi = np.pi
two_pi = 2 * pi
lower_bound_pual_millihertz = 200
upper_bound_pual_millihertz = 2500
lower_bound_white_noise_correction_millihertz = 7300
upper_bound_white_noise_correction_millihertz = 10000


# **********************************************************************************************************************
# FUNCTIONS:
def Write_to_CSV(raw_data, low_frequency_data, ratio_cleaned_data, fft_on_cleaned_data, orignial_pual, corrected_pual):
    data_frame = pd.DataFrame(columns=['Raw_Data', 'Low_Freq_Data', 'Cleaned_Data',
                                       'FFT_Cleaned_Data', 'PUAL_Score', 'Corrected_PUAL'])
    data_frame['Raw_Data'] = raw_data
    data_frame['Low_Freq_Data'] = low_frequency_data
    data_frame['Cleaned_Data'] = ratio_cleaned_data
    data_frame['FFT_Cleaned_Data'] = fft_on_cleaned_data
    data_frame['PUAL_Score'] = orignial_pual
    data_frame['Corrected_PUAL'] = corrected_pual
    data_frame.to_csv('PUAL_'+Filename, index=False)


def Calculate_PUAL(ratio_data, fps, fft_dt):
    # The Ratio Data is filtered and processed.
    # Blinks and detection failure is taken care of.
    # No such Invalids. No trial/test required to add or remove blinks.
    # We directly proceed to Gaussian and FFT computations.

    # Declarations:
    PUAL_index = 0
    Corrected_PUAL = 0
    Noise = 0
    denominator = 0
    data_points = len(ratio_data)
    low_freq = [0] * data_points
    start_index = int((lower_bound_pual_millihertz * scan_length) / (fps * 1000))
    end_index = int((upper_bound_pual_millihertz * scan_length) / (fps * 1000))
    start_index_noise = int((lower_bound_white_noise_correction_millihertz * scan_length) / (fps * 1000))
    end_index_noise = int((upper_bound_white_noise_correction_millihertz * scan_length) / (fps * 1000))

    # STEP 1: GAUSSIAN SMOOTHENING
    ratio_data_repeat = np.repeat(ratio_data, 3)
    for i in range(0, data_points):
        indx1 = i + data_points
        indx0 = data_points - i - 1
        indx2 = data_points * 3 - i - 1
        ratio_data_repeat[indx0] = ratio_data[i]
        ratio_data_repeat[indx1] = ratio_data[i]
        ratio_data_repeat[indx2] = ratio_data[i]

    std_dev = (fps * 1000) / (two_pi * lower_bound_pual_millihertz)
    if std_dev > data_points / 2:
        std_dev = data_points / 2

    for j in range(int(-2 * std_dev), int(2 * std_dev)):
        gauss = gaussian_filter(j, std_dev)
        denominator += gauss
    print('\n> Denominator: ', denominator)

    # STEP 2: FINDING LOW FREQUENCY COMPONENTS
    for j in range(0, data_points):
        low_freq[j] = 0
        for k in range(int(-2 * std_dev), int(2 * std_dev)):
            gauss = gaussian_filter(k, std_dev)
            low_freq[j] += ratio_data_repeat[data_points + j + k] * gauss
        low_freq[j] /= denominator
    print('\n> Low Frequency Data : ', low_freq)
    ratio_data_cleaned = ratio_data - low_freq
    print('> Ratio Data Cleaned : ', ratio_data_cleaned)

    # STEP 3: COMPUTING FFT
    fft_dt = fft(ratio_data_cleaned)
    print('\n> FFT on Cleaned Data : ', fft_dt)

    # STEP 4: COMPUTING SQRT OF AMPLITUDES
    sqrt_amp = np.sqrt(np.abs(fft_dt))
    print('\n> Amplitudes : ', sqrt_amp)

    # STEP 5: COMPUTING PUAL INDEX
    PUAL_index = np.sum(sqrt_amp[start_index:end_index]) / data_points

    # STEP 6: REMOVING WHITE NOISE & PUAL CORRECTION
    Noise = np.sum(sqrt_amp[start_index_noise:end_index_noise]) / data_points

    # STEP 7: COMPUTING CORRECTED PUAL SCORE
    Corrected_PUAL = PUAL_index - Noise
    if Corrected_PUAL < 0:
        Corrected_PUAL = 0

    # STEP 8: WRITING TO CSV FILE
    Write_to_CSV(ratio_data, low_freq, ratio_data_cleaned, fft_dt, PUAL_index, Corrected_PUAL)

    return PUAL_index, Corrected_PUAL


# **********************************************************************************************************************
if __name__ == '__main__':
    # Tests Okay - Checking the PUAL Score:
    Ratio_Data_Array = np.array(df['Processed Ratio'])
    print('\n 1. PUAL FUNCTION : ')
    PUAL_Score, Corrected_PUAL_score = Calculate_PUAL(Ratio_Data_Array, frames_per_sec, FFT_Data)
    print('\n** Original PUAL : ', PUAL_Score, '\n** Corrected PUAL : ', Corrected_PUAL_score)


# **********************************************************************************************************************
