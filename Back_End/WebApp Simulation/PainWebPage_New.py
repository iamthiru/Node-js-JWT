# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 03/17/2021
# Version: v1.5

# Code Description:
# Web Simulation (Alpha Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# PUAL Score Integrated
# Login and Registration using DynamoDB.
# API for IMPACT-Pupil.
# AWS S3 Bucket securely connected; Video+Output saved to S3.
# Bugs fixed for integration to Web scripts.
# Pupil Output Video embedding feature for Pupil part.
# Min, Mean and Max Scores removed for Pupil part.
# Integrated New IMPACT_FACIAL_v1.0.py for script call.
# Integrated New IMPACT_PUPIL_v1_3.py for script call.
# Removed Pupil From Facial Detection.

##############################################################
from flask import *
import pandas as pd
from boto3.dynamodb.conditions import Key, Attr
import boto3
import os
##############################################################
BUCKET_NAME = 'impact-benten'
# DYNAMODB:
DB = boto3.resource('dynamodb', region_name="us-east-1")
table_users = DB.Table('impact-users')
table_userData = DB.Table('impact-user-data')
##############################################################


option_val = ""
user_email = ""
user_logged_in = False
hard_login = False

fname = ""
face_fname = ""

app = Flask(__name__)
app.config.from_mapping(SECRET_KEY='dev')


@app.route('/')
@app.route('/Login', methods=['GET', 'POST'])
def Login():
    global user_logged_in
    global hard_login
    if hard_login is True:
        return render_template('HomePage.html')
    elif request.method == 'POST':
        global user_email
        user_email = request.form['email']
        user_password = request.form['password']
        response = table_users.query(KeyConditionExpression=Key('user-email').eq(user_email))
        item = response['Items']
        if user_password == item[0]['user-password']:
            user_logged_in = True
            return render_template('HomePage.html')
    return render_template('Login.html')


@app.route('/Register', methods=['GET', 'POST'])
def Register():
    global user_logged_in
    global hard_login
    if hard_login is True:
        return render_template('HomePage.html')
    elif request.method == 'POST':
        global user_email
        user_name = request.form['username']
        user_email = request.form['email']
        user_password = request.form['password']
        table_users.put_item(Item={'user-email': user_email, 'user-name': user_name,  'user-password': user_password})
        msg = 'User Registered'
        return render_template('Login.html', msg=msg)
    return render_template('Register.html')


@app.route('/HomePage')
def HomePage():
    global user_logged_in
    if user_logged_in is True or hard_login is True:
        return render_template('HomePage.html')
    else:
        return render_template('Login.html')


@app.route('/FacialPain')
def FacialPain():
    global user_logged_in
    if user_logged_in is True or hard_login is True:
        return render_template('FacialPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/PupilPain')
def PupilPain():
    global user_logged_in
    if user_logged_in is True or hard_login is True:
        return render_template('PupilPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/Logout')
def Logout():
    global user_logged_in
    user_logged_in = False
    return render_template('Login.html')


@app.route('/Upload')
def Upload():
    global user_logged_in
    if user_logged_in is True or hard_login is True:
        return render_template('FileUpload.html')
    else:
        return render_template('Login.html')


@app.route('/UploadPupil', methods=['GET', 'POST'])
def UploadPupil():
    global fname
    global user_email
    global user_logged_in
    if request.method == 'POST' and (user_logged_in is True or hard_login is True):
        fname_txtfield = request.form['firstname']
        lname_txtfield = request.form['lastname']
        eye_color_val = request.form['radio']
        f = request.files['file']
        PUPIL_UPLOAD_FOLDER_S3 = 'Pupil_Data/Uploads-VideoFiles/'
        PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
        fname = eye_color_val + fname_txtfield + lname_txtfield + '.mp4'
        f.filename = fname
        # write_to_txt(fname_txtfield, lname_txtfield, eye_color_val, fname, 1, video_type1)
        app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
        pth = os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname)
        f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname))
        if hard_login is False:
            Upload_2_S3(BUCKET_NAME, fname, pth, PUPIL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'user-email': user_email, 'user-name': fname_txtfield+' '+lname_txtfield,
                                          'user-eyecolor': eye_color_val, 's3-filepath': 's3://impact-benten/'+PUPIL_UPLOAD_FOLDER_S3+fname})
        # print("File Uploaded: " + f.filename)
        return render_template('Calculate_Pupil.html')
    else:
        return render_template('Login.html')


@app.route('/UploadFacial', methods=['GET', 'POST'])
def UploadFacial():
    global face_fname
    global user_email
    global user_logged_in
    if request.method == 'POST' and (user_logged_in is True or hard_login is True):
        fname_txtfield = request.form['firstname']
        lname_txtfield = request.form['lastname']
        option_val = request.form['radio']
        f = request.files['file']
        FACIAL_UPLOAD_FOLDER_S3 = 'Facial_Data/Uploads-VideoFiles/'
        FACIAL_UPLOAD_FOLDER = './static/Face_Input_Videos/'
        face_fname = fname_txtfield + lname_txtfield + '.avi'
        f.filename = face_fname
        # write_to_txt(fname_txtfield, lname_txtfield, option_val, face_fname, 2, video_type2)
        app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
        pth = os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname)
        f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
        if hard_login is False:
            Upload_2_S3(BUCKET_NAME, face_fname, pth, FACIAL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'user-email': user_email, 'user-name': fname_txtfield + ' ' + lname_txtfield,
                                      'user-videotype': option_val, 's3-filepath': 's3://impact-benten/'+FACIAL_UPLOAD_FOLDER_S3+face_fname})
        # print("File Uploaded: " + f.filename)
        return render_template('Calculate_Facial.html')
    else:
        return render_template('Login.html')


@app.route('/Process_Pupil')
def Process_Pupil():
    global user_logged_in
    global hard_login
    global fname
    if user_logged_in is True or hard_login is True:
        os.system('python IMPACT_PUPIL_v1_3.py ' + str(fname) + ' Color')
        token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(fname)[0]) + '.csv')
        if token:
            res_img_fold = os.path.join('static', 'Pupil_Output_Images')
            res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
            res_img_fold_S3 = 'Pupil_Data/Results-Output/'
            app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
            app.config['PUPIL_VID_OUT_FOLDER'] = res_vid_fold
            img_name = str(os.path.splitext(fname)[0])
            file = 'PUAL_' + img_name + '.csv'
            csv_file = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
            df = pd.read_csv(csv_file)
            PUAL_SCORE = round(df['PUAL_Score'][0], 3)
            f = img_name + '_Dilation_Plot.png'
            vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
            pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
            if hard_login is False:
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_S3)
                Upload_2_S3(BUCKET_NAME, img_name+'.mp4', vid_file, res_img_fold_S3)
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_S3)
            print('\n*************** DONE ****************\n')
            return render_template('Pupil_Success.html', image_file=pic, video_file=vid_file, score=PUAL_SCORE)
        else:
            print('\n*************** TOKEN : BAD ****************\n')
            return render_template('PupilPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/mobile_pupil_api/<filename>', methods=['GET', 'POST'])
def pupil_api(filename):
    upload_folder_S3 = 'Pupil_Data/Results-Output/'
    download_folder_S3 = 'Pupil_Data/Uploads-VideoFiles/'
    PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
    Download_from_S3(BUCKET_NAME, download_folder_S3+filename, PUPIL_UPLOAD_FOLDER+filename)
    os.system('python IMPACT_PUPIL_v1_3.py ' + str(filename) + ' Color')
    token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(fname)[0]) + '.csv')
    if token:
        res_img_fold = os.path.join('static', 'Pupil_Output_Images')
        res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
        app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
        app.config['PUPIL_VID_OUT_FOLDER'] = res_vid_fold
        img_name = str(os.path.splitext(filename)[0])
        file = img_name + '_Ratio_Dilation.csv'
        csv_file = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
        file = 'PUAL_' + img_name + '.csv'
        csv_f = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
        df = pd.read_csv(csv_f)
        PUAL_SCORE = round(df['PUAL_Score'][0], 3)
        f = img_name + '_Dilation_Plot.png'
        vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
        pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
        Upload_2_S3(BUCKET_NAME, f, pic, upload_folder_S3)
        Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, upload_folder_S3)
        Upload_2_S3(BUCKET_NAME, file, csv_file, upload_folder_S3)
        print('\n*************** DONE ****************\n')
        return PUAL_SCORE
    else:
        print('\n*************** TOKEN : BAD ****************\n')
        return "Retake"


@app.route('/Process_Facial')
def Process_Facial():
    global user_logged_in
    global hard_login
    if user_logged_in is True or hard_login is True:
        os.system('python IMPACT_FACIAL_v1.0.py ' + str(face_fname) + ' Color')
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
    else:
        return render_template('Login.html')


def write_to_txt(fnametxt, lnametxt, v, fln, flag, vid_type):
    if flag == 1:
        F = open('./static/Pupil_Output_Images/' + v + fnametxt + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nEye Color : " + v + "\nVideo File-Name : " + fln + "\nVideo Type : " + vid_type +"\n\n")
    elif flag == 2:
        F = open('./static/Facial_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")

    F.close()
    return


def Upload_2_S3(buck, f, fp, s3_to_path):
    # print('> Uploading : ', f, ' ; ', s3_to_path)
    s3 = boto3.resource('s3')
    bucket = s3.Bucket(buck)
    bucket.upload_file(Filename=fp, Key=s3_to_path+str(f), ExtraArgs={'ACL': 'public-read'})
    return 'Upload Done'


def Download_from_S3(buck, KEY, Local_fp):
    s3 = boto3.resource('s3')
    s3.Bucket(buck).download_file(KEY, Local_fp)
    return 'Download Done'


if __name__ == '__main__':
    app.run()
