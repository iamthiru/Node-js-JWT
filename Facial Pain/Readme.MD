IMPACT Facial Pain Summary

# Overview:
The main aim of this project is to identify pain in a human face through facial feature and expression changes. For this project, OpenFace toolbox has been used to keep track of Landmarks on a human face and through that, the change in Action Units, which denote the change in landmarks in a temporal sense.

# Requirements and Dependencies:
1. Python 3 or higher (PyCharm or Jupyter Notebook)
2. OpenCV 4.2.0 or higher (Computer Vision Library)
3. Pandas 1.0.5 or higher (CSV DataFrame Package)
4. OpenFace 2.2.0 (See the OpenFace_Installation_Guide)
5. NumPy 1.18.5 (For numerical calculations)

# Setup guide:

OpenFace Installation

PyTorch Installation

OpenCV ?

Numpy

Pandas

Matplotlib

Scipy

# Datasets used:

UNBC
BioVid

Dataset Resource list:
```
https://docs.google.com/spreadsheets/d/1rKMkymAw14Vhg54788XDA_QlAc-9oci0j1NfLsgMMUs/edit?usp=sharing
```

# Approaches:
1) Machine Learning/Deep Learning Approach
This approach was done using CNN-LSTM and CNN-GRU methods to understand the Spacial and Temporal spread of facial keypoints. When we run the subject's video through OpenFace Toolbox, we get a csv file which consists of frame wise Action Unit scores (Presence and Intensities). This file is processed to get the PSPI and Sum of AUs score per frame and the human labels are also added to the frame data. These features are then passed to the LSTM or GRU model to learn the features associated with the frames. Here, a sliding window is used to pass 'n' number of frames to the LSTMs or GRUs. This can be considered as a Hyper-Parameter while training the model.

2) Statistical Approach
This approach was done by statistically understanding the spread of data and pain scores over various subjects. When we run the subject's video through OpenFace Toolbox, we get a csv file which consists of frame wise Action Unit scores (Presence and Intensities). This file is processed to get the PSPI and Sum of AUs score per frame and the human labels are also added to the frame data. There is a sliding window which passes over the frames ('n' at a time, variable) which understands the pain score spread in the span of it's window and classifies the pain into corresponding pain buckets. There are 2 approaches for this:
- 3 Pain Bucket Approach: Where pain levels 1 & 2 (From BioVid Dataset) are classified as Low Pain, Pain levels 3 & 4 (From BioVid Dataset) are classified as High Pain and a No-Pain class.
- 5 Pain Bucket Approach: Where we have No-Pain, Pain 1, Pain 2, Pain 3 and Pain 4 classes.

# Known issues/bugs:
-Eye Blinking
-Talking of the subject in the video
-Sudden movement of the head

# References:
