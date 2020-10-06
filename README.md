# IMPACT

## IMPACT SYNOPSIS
* **Objective:** Detecting pain based on changes in the intensity of the "Facial Action Units" (FAUs) and Pupil Dilation.

  - ***Facial Pain:***
    * **Methods of Detection:** Finding the increase in the intensity of Action Units.
    * **Pain Scale Used:** Modified PSPI (Prkachin and Solomon Pain Intensity).
    * **Action Units Used:** AU04, AU06, AU07, AU09, AU10, AU15, AU25 and AU45
    
  - ***Pupillary Pain:***
    * **Methods of Detection:** Verifying the increase/decrease in the diameter of Pupil (Measuring Pupil Dilation).
    * **Method Used:** Modified HOUGH circles.


#### Hardware Pre-requisities
1. RAM (Minimum 4GB)
2. Processor 1.6 GHz (i5)
3. GPU (if available)


#### Software Dependencies
1. Python editor (PyCharm)
2. OpenCV (For Computer Vision)
3. Pandas (For DataFrame)
4. imutils
5. dlib (For landmark detection)
6. OpenFace 2.0 (See the OpenFace_Installation_Guide)


#### Dataset for Study (Training/Testing)
1. UNBC Shoulder Pain
2. BioVid Emo DB
