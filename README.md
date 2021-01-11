# IMPACT

## IMPACT SYNOPSIS
* **Objective:** Detecting Pain based on Pupillary Unrest and changes in the intensity of the "Facial Action Units" (FAUs).

  - ***Facial Pain:***
    * **Methods of Detection:** Finding the change/increase in the intensity of each individual Action Units.
    * **Pain Scale Used:** Modified PSPI (Prkachin and Solomon Pain Intensity), NRS, VAS.
    * **Action Units Used:** AU04, AU06, AU07, AU09, AU10, AU15, AU25, AU45 and AU43
    
  - ***Pupillary Pain:***
    * **Methods of Detection:** Calculating the increase/decrease in the diameter of Pupil (Measuring Pupil Dilation).
    * **Approach Used:** Contour for Pupil & Modified HOUGH circles for Iris (NIR and COLOR).


#### Hardware Pre-requisities
1. RAM (Minimum 4GB)
2. Processor 1.6 GHz (i5)
3. GPU (if available)


#### Software Dependencies to Run Code:
1. Python v3 or higher (PyCharm or Jupyter)
2. OpenCV 4.2.0 or higher (Computer Vision Package)
3. Pandas 1.0.5 or higher (CSV DataFrame Package)
4. imutils 0.5.3 or higher (Image Utility Package)
5. dlib 19.20.0 or higher (For landmark detection)
6. OpenFace 2.0 (See the OpenFace_Installation_Guide)
7. FLASK 1.1.2 (For Python WebApp Simulation)
8. NumPy 1.18.5 (For numerical calculations)


#### Deployment Requirements (Mobile and Cloud):
1. Python3 (Installed on mobile platform)
2. OpenCV 4.2.0 or higher (Check OpenCV package for Android and iOS)


#### Dataset for Study (Training/Testing)
1. UNBC Shoulder Pain
2. BioVid Emo DB
