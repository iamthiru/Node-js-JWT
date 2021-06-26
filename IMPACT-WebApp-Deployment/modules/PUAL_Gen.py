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
from scipy.fft import fft
from scipy.ndimage import gaussian_filter
import pandas as pd


# **********************************************************************************************************************
# FUNCTIONS:
def Write_to_CSV(f, raw_data, std, low_frequency_data, ratio_cleaned_data,
                 fft_on_cleaned_data, amplitude, orignial_pual, noise_pual, corrected_pual):
    data_frame = pd.DataFrame(columns=['Raw_Data', 'StDev', 'Low_Freq_Data', 'Cleaned_Data',
                                       'FFT_Cleaned_Data', 'Amplitude', 'PUAL_Score', 'Noise', 'Corrected_PUAL'])
    data_frame['Raw_Data'] = raw_data
    data_frame.at[0, 'StDev'] = std
    data_frame['Low_Freq_Data'] = low_frequency_data
    data_frame['Cleaned_Data'] = ratio_cleaned_data
    data_frame['FFT_Cleaned_Data'] = fft_on_cleaned_data
    data_frame['Amplitude'] = amplitude
    data_frame.at[0, 'PUAL_Score'] = orignial_pual
    data_frame.at[0, 'Noise'] = noise_pual
    data_frame.at[0, 'Corrected_PUAL'] = corrected_pual
    data_frame.to_csv('./static/Pupil_Output_Images/PUAL_' + f, index=False)


def Calculate_PUAL(filename, ratio_data, fps):
    # The Ratio Data is filtered and processed.
    # Blinks and detection failure is taken care of.
    # No such Invalids. No trial/test required to add or remove blinks.
    # We directly proceed to Gaussian and FFT computations.

    # Declarations:
    pi = np.pi
    two_pi = 2 * pi
    lower_bound_pual_millihertz = 200  # 300
    upper_bound_pual_millihertz = 2500
    lower_bound_white_noise_correction_millihertz = 7300
    upper_bound_white_noise_correction_millihertz = 10000
    data_points = len(ratio_data)
    fl_name = filename.split('.')[0] + '.csv'
    start_index = int((lower_bound_pual_millihertz * data_points) / (fps * 1000))
    end_index = int((upper_bound_pual_millihertz * data_points) / (fps * 1000))
    start_index_noise = int((lower_bound_white_noise_correction_millihertz * data_points) / (fps * 1000))
    end_index_noise = int((upper_bound_white_noise_correction_millihertz * data_points) / (fps * 1000))
    # print(start_index, ' , ', end_index, '\n', start_index_noise, ' , ', end_index_noise)

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

    # STEP 2: FINDING LOW FREQUENCY COMPONENTS
    low_freq = gaussian_filter(ratio_data, std_dev)
    # print('\n> Low Frequency Data : ', low_freq)
    ratio_data_cleaned = ratio_data - low_freq
    # print('> Ratio Data Cleaned : ', ratio_data_cleaned)

    # STEP 3: COMPUTING FFT
    FFT_Data = fft(ratio_data_cleaned)
    # print('\n> FFT on Cleaned Data : ', fft_dt)

    # STEP 4: COMPUTING SQRT OF AMPLITUDES
    Amp = np.abs(FFT_Data)
    # print('\n> Amplitudes : ', Amp)

    # STEP 5: COMPUTING PUAL INDEX
    PUAL_index = np.sum(Amp[start_index:end_index+1]) / (end_index - start_index)

    # STEP 6: REMOVING WHITE NOISE & PUAL CORRECTION
    Noise = np.sum(Amp[start_index_noise:end_index_noise+1]) / (end_index_noise - start_index_noise)

    # STEP 7: COMPUTING CORRECTED PUAL SCORE
    Corrected_PUAL = PUAL_index - Noise
    if Corrected_PUAL < 0:
        Corrected_PUAL = 0

    # STEP 8: WRITING TO CSV FILE
    Write_to_CSV(fl_name, ratio_data, std_dev, low_freq, ratio_data_cleaned, FFT_Data, Amp, PUAL_index, Noise, Corrected_PUAL)

    return PUAL_index, Noise, Corrected_PUAL

# **********************************************************************************************************************
