IMPACT Facial Pain Summary

# Overview:
The main aim of this project is to identify pain in a human face through facial feature and expression changes. For this project, OpenFace toolbox has been used to keep track of Landmarks on a human face and through that, the change in Action Units, which denote the change in landmarks in a temporal sense.

# Requirements and Dependencies:
1. Python 3 or higher (PyCharm or Jupyter Notebook)
2. OpenCV 4.2.0 or higher (Computer Vision Library)
3. Pandas 1.0.5 or higher (CSV DataFrame Package)
4. OpenFace 2.2.0 (See the OpenFace_Installation_Guide)
5. NumPy 1.18.5 (For numerical calculations)
6. Google Collab (For a faster GPU on the cloud for ML training)
7. PyTorch

# Setup guide:

OpenFace Installation:
```
https://github.com/bententech/IMPACT/blob/master/OpenFace_Installation_Guide
```

PyTorch Installation (Conda installation):
```
conda install -c pytorch pytorch
```

OpenCV (Conda installation):
```
conda install -c conda-forge opencv
```

Numpy (Conda installation):
```
conda install -c anaconda numpy
```


Pandas (Conda installation):
```
conda install -c anaconda pandas
```

Matplotlib (Conda installation):
```
conda install -c conda-forge matplotlib
```

Scipy (Conda installation):
```
conda install -c anaconda scipy
```

# Datasets used:

1. UNBC
2. BioVid

Dataset Resource list:
```
https://docs.google.com/spreadsheets/d/1rKMkymAw14Vhg54788XDA_QlAc-9oci0j1NfLsgMMUs/edit?usp=sharing
```

# Approaches:
1) Machine Learning/Deep Learning Approach
This approach was done using CNN-LSTM and CNN-GRU methods to understand the Spacial and Temporal spread of facial keypoints. When we run the subject's video through OpenFace Toolbox, we get a csv file which consists of frame wise Action Unit scores (Presence and Intensities). This file is processed to get the PSPI and Sum of AUs score per frame and the human labels are also added to the frame data. These features are then passed to the LSTM or GRU model to learn the features associated with the frames. Here, a sliding window is used to pass 'n' number of frames to the LSTMs or GRUs. This can be considered as a Hyper-Parameter while training the model.

2) Statistical Approach
This approach was done by statistically understanding the spread of data and pain scores over various subjects. When we run the subject's video through OpenFace Toolbox, we get a csv file which consists of frame wise Action Unit scores (Presence and Intensities). This file is processed to get the PSPI and Sum of AUs score per frame and the human labels are also added to the frame data. There is a sliding window which passes over the frames ('n' at a time, variable. ex: 1 second) which understands the pain score spread in the span of it's window and classifies the pain into corresponding pain buckets. There are 2 approaches for this:
- 3 Pain Bucket Approach: Where pain levels 1 & 2 (From BioVid Dataset) are classified as Low Pain, Pain levels 3 & 4 (From BioVid Dataset) are classified as High Pain and a No-Pain class.
- 4 Pain Bucket Approach: Where we have No-Pain, Pain 1 (pain levels 1 & 2 From BioVid Dataset are classified as Pain 1), Pain 2 and Pain 3 classes.

3) The per second (Variable) labels of pain are multiplied with their sepcific tier score value and the summation of these scores are then divided by the total number of seconds to give every video a single score. This corresponds to the sequence pain score given to the video file.

# Useful video files from BioVid Dataset: 
Patients who do show facial expressions while heat pain is stimulated:
- 071709_w_23
- 071911_w_24
- 073114_m_25
- 080309_m_29
- 080714_m_23
- 081014_w_27
- 091814_m_37
- 092808_m_51
- 092813_w_24
- 100117_w_36
- 100909_w_65
- 111914_w_63
- 112809_w_23
- 120514_w_56



# Known Issues/bugs:
- Eye Blinking (FIXED)

- Talking of the subject in the video

- Sudden movement of the head

- With GRU and LSTMs, the key issue was the variability of the Action Unit scores corresponding to the same Patient reported pain labels. A person with small changes in facial expressions also report the heat as pain 4 along with a person with high facial expressions. This leads to the algorithm learning two different patterns for the same label.

- The current algorithm is based on Heat Stimulated pain only. There should be more data based on other types of pain stimuli to truly understand the pain in a more comprehensive way.
