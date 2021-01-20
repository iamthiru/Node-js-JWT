# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 01/15/2021
# Version: v1.3

# Code Description:
# Web Simulation (Alpha Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# Bugs fixed for integration to Web scripts.
# Integrated New IMPACT_PUPIL_v1.3.py for script call.

from flask import *
import os
import pandas as pd

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


@app.route('/FacePupilPain')
def FacePupilPain():
    return render_template('Pupil_from_Face.html')


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
        option_val = request.form['radio']
        video_type1 = request.form['radio1']
        f = request.files['file']
        global fname
        if "Video" in option_val:
            opt = 2
            print("Option Selected: " + option_val)
            fname = option_val + fname_txtfield + lname_txtfield + '.MOV'
            write_to_txt(fname_txtfield, lname_txtfield, option_val, fname, 1, video_type1)
            PUPIL_UPLOAD_FOLDER = '/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Pupil_Input_Videos/'
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
            face_fname = option_val + fname_txtfield + lname_txtfield + '.avi'
            write_to_txt(fname_txtfield, lname_txtfield, option_val, face_fname, 2, video_type2)
            FACIAL_UPLOAD_FOLDER = '/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Face_Input_Videos/'
            app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
            f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
        print("File Uploaded: " + f.filename)
        return render_template('Calculate_Facial.html')


@app.route('/UploadNIRColorFace', methods=['GET', 'POST'])
def UploadNIRColorFace():
    global Opt
    global video_type3
    if request.method == 'POST':
        fname_txtfield = request.form['firstname']
        lname_txtfield = request.form['lastname']
        option_val = request.form['radio']
        video_type = request.form['radio1']
        f = request.files['file']
        global flname
        if "Video" in option_val:
            Opt = 2
            print("Option Selected: " + option_val)
            flname = option_val + fname_txtfield + lname_txtfield + '.avi'
            write_to_txt(fname_txtfield, lname_txtfield, option_val, flname, 3, video_type3)
            FACE_UPLOAD_FOLDER = '/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/Face_NIR_Color_Videos/'
            app.config['FACE_UPLOAD_FOLDER'] = FACE_UPLOAD_FOLDER
            f.save(os.path.join(app.config['FACE_UPLOAD_FOLDER'], flname))
        print("File Uploaded: " + f.filename)
        return render_template('Calculate_Pupil_From_Face.html')


@app.route('/Process_Pupil')
def Process_Pupil():
    os.system('cd ~/PycharmProjects/FaceEmotionRecognition/')
    os.system('python IMPACT_PUPIL_v1.3.py '+str(opt)+' '+str(fname)+' '+str(video_type1))
    res_img_fold = os.path.join('static', 'Pupil_Output_Images')
    app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
    img_name = str(os.path.splitext(fname)[0])
    file = img_name + '_Dilation_Plot.png'
    pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
    return render_template('Pupil_Success.html', image_file=pic)


@app.route('/Process_Facial')
def Process_Facial():
    os.system('cd ~/PycharmProjects/FaceEmotionRecognition/')
    os.system('python AU_Detection.py '+str(option)+' '+str(face_fname)+' '+str(video_type2))
    res_img_fold = os.path.join('static', 'Facial_Output_Images')
    app.config['FACIAL_OUTPUT_FOLDER'] = res_img_fold
    img_name = str(os.path.splitext(face_fname)[0])
    file = img_name + '_PSPI_AUs_Pain.csv'
    csv_file = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], file)
    df = pd.read_csv(csv_file)
    pain_score = df['Pain_PSPI']
    max_pain_score = pain_score.max()
    min_pain_score = pain_score.min()
    mean_pain_score = round(sum(pain_score) / len(pain_score), 2)
    f = img_name + '_Pain_Plot.png'
    pic = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], f)
    return render_template('Facial_Success.html', image_file=pic, max_pain=max_pain_score, mean_pain=mean_pain_score, min_pain=min_pain_score)


@app.route('/Process_Pupil_From_Face')
def Process_Pupil_From_Face():
    os.system('cd ~/PycharmProjects/FaceEmotionRecognition/')
    os.system('python Face_Eyes_Iris.py '+str(Opt)+' '+str(flname)+' '+str(video_type3))
    res_img_fold = os.path.join('static', 'Face_Pupil_Output_Images')
    app.config['OUTPUT_FOLDER'] = res_img_fold
    img_name = str(os.path.splitext(flname)[0])
    file = img_name + '_Avg_Dilation_Plot.png'
    pic = os.path.join(app.config['OUTPUT_FOLDER'], file)
    return render_template('Pupil_Success.html', image_file=pic)


def write_to_txt(fnametxt, lnametxt, v, fln, flag, vid_type):
    if flag == 1:
        F = open('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Pupil_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")
    elif flag == 2:
        F = open('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Facial_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")
    else:
        F = open('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Face_Pupil_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")

    F.close()
    return


if __name__ == '__main__':
    app.run(debug=True)
