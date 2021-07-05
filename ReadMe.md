# IMPACT

***

**Proprietary:** Benten Technologies, Inc.

**Copyright (c) 2021., Author:** Pranav H. Deo { pdeo@bententech.com }

**IMPACT Wiki :** https://github.com/bententech/IMPACT/wiki

***

## IMPACT SYNOPSIS
* **Objective:** Detecting Pain based on Pupillary Unrest and changes in the intensity of the "Facial Action Units" (FAUs).

  - ***Facial Pain:***
    * **Methods of Detection:** Finding the change/increase in the intensity of each individual Action Units.
    * **Pain Scale Used:** Modified PSPI (Prkachin and Solomon Pain Intensity), NRS, VAS and OPR.
    * **Action Units Used:** AU01, AU_02, AU_04, AU05, AU06, AU07, AU09, AU10, AU12, AU14, AU15, AU17, AU20, AU23, AU25, AU26, AU45 and AU43
    
  - ***Pupillary Pain:***
    * **Objective:** Pain estimation from the Pupillary Unrest measurements (Ratio: Pupil/Iris).
    * **Approach Used:** Contour for Pupil & Modified HOUGH circles for Iris (NIR and COLOR).


#### Hardware Pre-requisities
1. RAM (Minimum 8GB)
2. Processor 1.6 GHz (i5)


#### Software Dependencies:
1. Python v3 or higher (PyCharm)
2. OpenFace 2.2.0 (See the OpenFace_Installation_Guide)
3. Docker (To build WebApp Image for Deployment)


#### Python Package Dependencies (Refer requirements.txt):
1. FLASK 1.1.2 (For Python WebApp Simulation)
2. OpenCV 4.5.1.48 or higher (Computer Vision Package)
3. Boto3 1.17.29 (AWS SDK for Python)
4. matplotlib 3.3.4 (Plotting Graphs)
5. Pandas 1.2.3 (CSV DataFrame Package)
6. Pillow 8.2.0 (Image Processing)
7. PyMySQL 1.0.2 (Python-MySQL connection)
8. dlib 19.20.0 or higher (For landmark detection)
9. NumPy 1.18.5 (For numerical calculations)
10. PyYAML 5.4.1 (yaml file reader for Python)
11. s3transfer 0.3.4 (For S3 Bucket connection and transfer)
12. scipy 1.6.2 (Scientific Python)
13. Botocore 1.20.29
14. click 7.1.2
15. pyparsing 2.4.7
16. python-dateutil 2.8.1
17. pytz 2021.1
18. cycler 0.10.0
19. itsdangerous 1.1.0
20. Jinja2 2.11.3
21. jmespath 0.10.0
22. six 1.15.0
23. kiwisolver 1.3.1
24. MarkupSafe 1.1.1
25. urllib3 1.26.4
26. Werkzeug 1.0.1


#### Deployment Requirements (AWS Cloud):
1. Docker (To Create App Image Build)
2. AWS CLI / Management Console Account (Elastic Cloud Compute for serving API)


#### Facial Pain Datasets (Training/Testing)
1. UNBC Shoulder Pain
2. BioVid Emo DB
