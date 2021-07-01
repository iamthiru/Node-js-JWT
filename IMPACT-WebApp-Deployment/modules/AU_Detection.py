# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content

#######################################################################################################################
import cv2
import pandas as pd
import os
import subprocess
import matplotlib.pyplot as plt
import sys

#######################################################################################################################


# Function To Capture Live Image/Video
def live_capture(st):
    video = cv2.VideoCapture(0)
    if st == 1:
        while 1:
            _, image = video.read()
            cv2.imshow('Live', image)
            if cv2.waitKey(1) == 27 or 0xFF == ord('q'):
                cv2.imwrite('/Users/pranavdeo/Documents/FAUs/Face_Test/face.png', image)
                break
        video.release()
        cv2.destroyAllWindows()

    elif st == 2:
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter('/Users/pranavdeo/Documents/FAUs/Face_Test/face.mp4', fourcc, 20.0,
                              int(video.get(3), int(video.get(4))))
        while video.isOpened():
            _, frame = video.read()
            out.write(frame)
            cv2.imshow('Live', frame)
            if cv2.waitKey(1) == 27 or 0xFF == ord('q'):
                break
        video.release()
        cv2.destroyAllWindows()

    else:
        print("** Nothing Captured...")


#######################################################################################################################

# Function to Detect Faces and Landmark them
def Image_Processing(ipath, opath):
    print("> Feature Extraction Command Executed !!")
    cmd = "build/bin/FeatureExtraction -f " + ipath + " -out_dir " + opath + " -aus -2Dfp"
    subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True).communicate()
    print("     # AUs Detected...")


#######################################################################################################################

# Function to read the AUs from the CSV file
def Retrieve_AUs(opath, fpath, D):
    print("     # Attempting to Read File...")
    df1 = pd.read_csv(fpath, usecols=['AU01_c', 'AU02_c', 'AU04_c', 'AU06_c', 'AU07_c', 'AU09_c', 'AU10_c',
                                      'AU12_c', 'AU14_c', 'AU15_c', 'AU17_c', 'AU20_c', 'AU23_c', 'AU25_c',
                                      'AU26_c', 'AU45_c',
                                      'AU01_r', 'AU02_r', 'AU04_r', 'AU06_r', 'AU07_r', 'AU09_r', 'AU10_r',
                                      'AU12_r', 'AU14_r', 'AU15_r', 'AU17_r', 'AU20_r', 'AU23_r', 'AU25_r',
                                      'AU26_r', 'AU45_r'], engine='python')

    df2 = pd.read_csv(fpath, usecols=['frame',
                                      'AU04_r', 'AU06_r', 'AU07_r', 'AU09_r', 'AU10_r',
                                      'AU15_r', 'AU25_r', 'AU45_r', 'AU20_r', 'AU25_r', 'AU26_r',
                                      'AU45_r'], engine='python')

    df3 = pd.read_csv(fpath, usecols=['frame',
                                      'x_0', 'x_1', 'x_2', 'x_3', 'x_4', 'x_5', 'x_6', 'x_7', 'x_8', 'x_9',
                                      'x_10', 'x_11', 'x_12', 'x_13', 'x_14', 'x_15', 'x_16', 'x_17', 'x_18',
                                      'x_19', 'x_20', 'x_21', 'x_22', 'x_23', 'x_24', 'x_25', 'x_26', 'x_27',
                                      'x_28', 'x_29', 'x_30', 'x_31', 'x_32', 'x_33', 'x_34', 'x_35', 'x_36',
                                      'x_37', 'x_38', 'x_39', 'x_40', 'x_41', 'x_42', 'x_43', 'x_44', 'x_45',
                                      'x_46', 'x_47', 'x_48', 'x_49', 'x_50', 'x_51', 'x_52', 'x_53', 'x_54',
                                      'x_55', 'x_56', 'x_57', 'x_58', 'x_59', 'x_60', 'x_61', 'x_62', 'x_63',
                                      'x_64', 'x_65', 'x_66', 'x_67',
                                      'y_0', 'y_1', 'y_2', 'y_3', 'y_4', 'y_5', 'y_6', 'y_7', 'y_8', 'y_9',
                                      'y_10', 'y_11', 'y_12', 'y_13', 'y_14', 'y_15', 'y_16', 'y_17', 'y_18',
                                      'y_19', 'y_20', 'y_21', 'y_22', 'y_23', 'y_24', 'y_25', 'y_26', 'y_27',
                                      'y_28', 'y_29', 'y_30', 'y_31', 'y_32', 'y_33', 'y_34', 'y_35', 'y_36',
                                      'y_37', 'y_38', 'y_39', 'y_40', 'y_41', 'y_42', 'y_43', 'y_44', 'y_45',
                                      'y_46', 'y_47', 'y_48', 'y_49', 'y_50', 'y_51', 'y_52', 'y_53', 'y_54',
                                      'y_55', 'y_56', 'y_57', 'y_58', 'y_59', 'y_60', 'y_61', 'y_62', 'y_63',
                                      'y_64', 'y_65', 'y_66', 'y_67'], engine='python')

    df1.to_csv(opath + '/' + D + '_AUs.csv', index=False)
    df2.to_csv(opath + '/' + D + '_PSPI_AUs.csv', index=False)
    df3.to_csv(opath + '/' + D + '_Landmarks.csv', index=False)
    print("     # Read Complete! Attempting to write CSV files...")
    print("     # CSV written successfully !!")

#######################################################################################################################


# Calculate the Pain using the PSPI scale
def Calculate_Pain(opath, fname, fl):
    data = pd.read_csv(opath + fname)
    df = pd.DataFrame(data)
    print("> Calculating PSPI scale...")
    row_count = df.shape[0]
    PSPI = [0.0] * row_count
    indx = 0
    for index, row in df.iterrows():
        PSPI[indx] = PSPI[indx] + row['AU04_r'] + max(row['AU06_r'], row['AU07_r']) + \
                     max(row['AU09_r'], row['AU10_r']) + row['AU45_r'] + row['AU20_r'] + row['AU25_r']
        # + max(row['AU15_r'], row['AU25_r']) + row['AU45_r']
        indx = indx + 1
    df["Pain_PSPI"] = PSPI
    df.to_csv(opath + os.path.splitext(fname)[0] + '_Pain.csv', index=False)
    print("     # CSV written successfully !!")

#######################################################################################################################


# Plotting the Pain graph
def Plot_Pain(opath, fname, fl, flag):
    # time.sleep(2)
    print("> Plotting Pain...")
    # time.sleep(2)
    df = pd.read_csv(opath + fname)
    b = []
    a = []
    b = df['Pain_PSPI']
    a = df['frame']
    plt.plot(a, b)
    plt.xlabel('Frames')
    plt.ylabel('Pain')
    if flag == 0:
        plt.savefig(opath + fl + '_Pain_Plot.png')
    else:
        plt.savefig(opath + '_Pain_Plot.png')
    print("     # Pain Plot Complete")
    plt.close()

#######################################################################################################################


# Plotting the Landmarks
def Plot_Landmarks(opath, fname, fl, flag):
    print("> Plotting Landmarks...")
    df = pd.read_csv(opath + fname)
    data_x = []
    data_y = []

    col_x = [col for col in df.columns if 'x_' in col]
    col_y = [col for col in df.columns if 'y_' in col]
    for x in col_x:
        data_x.append(df[x])

    for y in col_y:
        data_y.append(df[y])

    plt.plot(data_x, data_y)
    plt.xlabel('X_Co-ordinates')
    plt.ylabel('Y_Co-ordinates')
    if flag == 0:
        plt.savefig(opath + fl + '_Landmarks_Plot.png')
    else:
        plt.savefig(opath + '_Landmarks_Plot.png')
    print("     # Landmarks Plot Complete")
    plt.close()

#######################################################################################################################


def Process_Folder(opath):
    print("> Processing Folder Data...")
    dir = os.listdir(opath)

    for d in dir:
        if d == '.DS_Store':
            continue
        else:
            files = os.listdir(opath + '/' + d)
            for f in files:
                nm = os.path.splitext(f)[0]
                if f == nm + '.csv':
                    Retrieve_AUs(opath + '/' + d, opath + '/' + d + '/' + f, d)

    for d in dir:
        if d == '.DS_Store':
            continue
        else:
            files = os.listdir(opath + '/' + d)
            for f in files:
                if f == d + '_PSPI_AUs.csv':
                    Calculate_Pain(opath + d + '/', f, os.path.splitext(d)[0])

    for d in dir:
        if d == '.DS_Store':
            continue
        else:
            fil = os.listdir(opath + '/' + d)
            for F in fil:
                if F == d + '_Landmarks.csv':
                    Plot_Landmarks(opath + d + '/', F, os.path.splitext(d)[0], 1)

    for d in dir:
        if d == '.DS_Store':
            continue
        else:
            fil = os.listdir(opath + '/' + d)
            for F in fil:
                if F == d + '_PSPI_AUs_Pain.csv':
                    Plot_Pain(opath + d + '/', F, os.path.splitext(d)[0], 1)

#######################################################################################################################


# __MAIN__
if __name__ == "__main__":
    print("\n############################## AUTOMATIC FACIAL AU DETECTION ##############################")
    tag = 0
    sign = 0

    if len(sys.argv) > 1:
        global filenm
        ch = int(sys.argv[1])
        filenm = str(sys.argv[2])
        video_type = str(sys.argv[3])
        tag = 1
    else:
        ch = int(input("> Enter Choice : "))

    out_path = "/AWS_Lambda/static/Face_Output_Images/"
    in_path = ""

    if ch == 1:
        print("\n************* Image Capture Complete *************")
        print("> Extracting Features...")
        if tag == 1:
            in_path = "/AWS_Lambda/static/Facial_Input_Videos/" + filenm
        else:
            in_path = "/static/Face_Input_Videos/face.png"
        os.chdir('../OpenFace')
        Image_Processing(in_path, out_path)
        sign = 0

    elif ch == 2:
        print("\n************* Video Capture Complete *************")
        print("> Extracting Features...")
        if tag == 1:
            in_path = "/AWS_Lambda/static/Face_Input_Videos/" + filenm
        else:
            in_path = "/AWS_lambda/static/Face_Input_Videos/face.mp4"
        os.chdir('../OpenFace')
        Image_Processing(in_path, out_path)
        sign = 0

    elif ch == 3:
        print("\n************* Image/Video DataBase Directory *************")
        in_path = "/Users/pranavdeo/Documents/FAUs/Face_Test/"
        files = os.listdir(in_path)
        print("> Extracting Features...")
        os.chdir('../OpenFace')

        for f in files:
            in_path = '/Users/pranavdeo/Documents/FAUs/Face_Test'
            if f.startswith('.DS_Store'):
                continue
            else:
                in_path = in_path + '/' + f
                name = os.path.splitext(f)[0]
                os.mkdir(out_path + '/' + name)
                Image_Processing(in_path, out_path + '/' + name)
                sign = 1

    else:
        print("WRONG CHOICE !!")

    if sign == 1:
        Process_Folder(out_path)

    elif sign == 0:
        if tag == 1:
            Retrieve_AUs(out_path, out_path + os.path.splitext(filenm)[0] + '.csv', os.path.splitext(filenm)[0])
            Calculate_Pain(out_path, os.path.splitext(filenm)[0] + '_PSPI_AUs.csv', os.path.splitext(filenm)[0])
            Plot_Pain(out_path, os.path.splitext(filenm)[0] + '_PSPI_AUs_Pain.csv', os.path.splitext(filenm)[0], 0)
        else:
            Retrieve_AUs(out_path, out_path + 'face.csv', 'face')
            Calculate_Pain(out_path, 'face_PSPI_AUs.csv', 'face')
            Plot_Pain(out_path, 'face_PSPI_AUs_Pain.csv', 'face', 0)
    else:
        print("> NO CSV FILE ERROR...EXECUTION STOPPED !!")

    print("\n############################## END OF EXECUTION ##############################")
#######################################################################################################################
