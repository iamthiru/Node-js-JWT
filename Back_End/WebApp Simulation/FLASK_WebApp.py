# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/28/2021
# Version: v1.2

# Code Description:
# Web Simulation (Alpha Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# Bugs fixed for integration to Web scripts.
# Pupil Output Video embedding feature for Pupil part.
# Min, Mean and Max Scores removed for Pupil part.
# Integrated New IMPACT_FACIAL_v1.0.py for script call.
# Integrated New IMPACT_PUPIL_v1.3.py for script call.

from flask import *
import pandas as pd
import boto3
import os

option_val = ""

app = Flask(__name__)
app.config.from_mapping(
        SECRET_KEY='dev'
    )


@app.route('/')
@app.route('/HomePage')
def HomePage():
    return render_template('HomePage.html')


@app.route('/FacialPain')
def FacialPain():
    return render_template('FacialPain_Form.html')


@app.route('/PupilPain')
def PupilPain():
    return render_template('PupilPain_Form.html')


@app.route('/Upload')
def Upload():
    return render_template('FileUpload.html')


@app.route('/UploadPupil', methods=['GET', 'POST'])
def UploadPupil():
    global opt
    global video_type1
    if request.method == 'POST':
        fname_txtfield = request.form['firstname']
        lname_txtfield = request.form['lastname']
        eye_color_val = request.form['radio']
        video_type1 = request.form['radio1']
        f = request.files['file']
        global fname
        if "Video" in video_type1:
            opt = 2
            print("Eye color selected: " + eye_color_val)
            fname = eye_color_val + fname_txtfield + lname_txtfield + '.mp4'
            write_to_txt(fname_txtfield, lname_txtfield, eye_color_val, fname, 1, video_type1)
            PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
            app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
            f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname))
        print("File Uploaded: " + f.filename)
        return render_template('Calculate_Pupil.html')


@app.route('/UploadFacial', methods=['GET', 'POST'])
def UploadFacial():
    global option
    global video_type2
    if request.method == 'POST':
        fname_txtfield = request.form['firstname']
        lname_txtfield = request.form['lastname']
        option_val = request.form['radio']
        video_type2 = request.form['radio1']
        f = request.files['file']
        global face_fname
        if "Video" in option_val:
            option = 2
            print("Option Selected: " + option_val)
            face_fname = fname_txtfield + lname_txtfield + '.avi'
            write_to_txt(fname_txtfield, lname_txtfield, option_val, face_fname, 2, video_type2)
            FACIAL_UPLOAD_FOLDER = './static/Face_Input_Videos/'
            app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
            f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
        print("File Uploaded: " + f.filename)
        return render_template('Calculate_Facial.html')


@app.route('/Process_Pupil')
def Process_Pupil():
    # os.system('cd ./static')
    os.system('python IMPACT_PUPIL_v1.3.py '+str(opt)+' '+str(fname)+' '+str(video_type1))
    res_img_fold = os.path.join('static', 'Pupil_Output_Images')
    res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
    app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
    app.config['PUPIL_VID_OUT_FOLDER'] = res_vid_fold
    img_name = str(os.path.splitext(fname)[0])
    file = img_name + '_Ratio_Dilation.csv'
    csv_file = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
    df = pd.read_csv(csv_file)
    pupil_ratio = df['Processed Ratio']
    # max_pupil_ratio = round(pupil_ratio.max(), 2)
    # mean_pupil_ratio = round(sum(pupil_ratio) / len(pupil_ratio), 2)
    # min_pupil_ratio = round(pupil_ratio.min(), 2)
    f = img_name + '_Dilation_Plot.png'
    vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
    pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
    return render_template('Pupil_Success.html', image_file=pic, video_file=vid_file)


@app.route('/Process_Facial')
def Process_Facial():
    # os.system('cd /AWS_Lambda/')
    os.system('python IMPACT_FACIAL_v1.0.py '+str(option)+' '+str(face_fname)+' '+str(video_type2))
    res_img_fold = os.path.join('static', 'Facial_Output_Images')
    app.config['FACIAL_OUTPUT_FOLDER'] = res_img_fold
    img_name = str(os.path.splitext(face_fname)[0])
    file = img_name + '_PSPI_AUs.csv'
    csv_file = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], file)
    df = pd.read_csv(csv_file)
    pain_score = df['sum_AU_r']
    max_pain_score = round(pain_score.max(), 2)
    min_pain_score = round(pain_score.min(), 2)
    mean_pain_score = round(sum(pain_score) / len(pain_score), 2)
    f = img_name + '_Pain_Plot.png'
    pic = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], f)
    return render_template('Facial_Success.html', image_file=pic, max_pain=max_pain_score, mean_pain=mean_pain_score, min_pain=min_pain_score)


def write_to_txt(fnametxt, lnametxt, v, fln, flag, vid_type):
    if flag == 1:
        F = open('./static/Pupil_Output_Images/' + v + fnametxt + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nEye Color : " + v + "\nVideo File-Name : " + fln + "\nVideo Type : " + vid_type +"\n\n")
    elif flag == 2:
        F = open('./static/Facial_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")

    F.close()
    return


if __name__ == '__main__':
    app.run()
