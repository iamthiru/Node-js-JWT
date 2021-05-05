# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 05/05/2021
# Version: v1.8

# Code Description:
# Web Simulation (Alpha Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# Mobile APIs for Pupil and Facial integrated.
# Login/Registration Changed from DynamoDB to RDS-MySQL.
# User Data stored in DynamoDB.
# User Session Integrated.
# Redundant Code removal.
# PUAL Score Integrated
# API for IMPACT-Pupil.
# AWS S3 Bucket securely connected; Video+Output saved to S3.
# Bugs fixed for integration to Web scripts.
# Pupil Output Video embedding feature for Pupil part.
# Min, Mean and Max Scores removed for Pupil part.
# Integrated New IMPACT_FACIAL_v1_0.py for script call.
# Integrated New IMPACT_PUPIL_v1_3.py for script call.
# Removed Pupil From Facial Detection.

##############################################################
import os
import yaml
import time
import boto3
import pymysql
from flask import *
import pandas as pd
import datetime as dt
##############################################################
# --------------------- AMAZON-S3 -------------------------- #
BUCKET_NAME = 'impact-benten'
key_db = yaml.load(open('Keys.yaml'))
##############################################################
# ------------------- AMAZON-RDS-MySQL --------------------- #
db = yaml.load(open('db.yaml'))
conn = pymysql.connect(host=db['mysql_host'],
                       user=db['mysql_user'],
                       password=db['mysql_password'],
                       database=db['mysql_db'],
                       port=int(db['mysql_port']))
##############################################################
# -------------------- AMAZON-DynamoDB --------------------- #
# Dynamo_DB = boto3.resource('dynamodb', region_name="us-east-1")
Dynamo_DB = boto3.resource('dynamodb', aws_access_key_id=key_db['AWSAccessKeyId'],
                           aws_secret_access_key=key_db['AWSSecretKey'], region_name="us-east-1")
# table_users = DB.Table('impact-users')
table_userData = Dynamo_DB.Table('impact-user-data')
##############################################################
# ------------------- FLASK-APP CONFIG --------------------- #
app = Flask(__name__)
app.config.from_mapping(SECRET_KEY='dev')
app.secret_key = 'ImpactProjectDevelopment'
##############################################################
# ------------------- VARIABLE CONFIGS --------------------- #
option_val = ""
fname = ""
face_fname = ""
##############################################################


@app.route('/')
@app.route('/Login', methods=['GET', 'POST'])
def Login():
    session.pop('user_email', None)
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        cur = conn.cursor()
        cur.execute('SELECT * FROM information_schema.tables WHERE table_name = "impact_users"')
        if cur.fetchone() is None:
            create_table = "create table impact_users (user_name varchar(100)," \
                           "user_email varchar(100),user_password varchar(100))"
            cur.execute(create_table)
            conn.commit()
            cur.close()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM impact_users WHERE user_email = % s AND user_password = % s;', (email, password))
        if cursor.fetchone() is not None:
            session['user_email'] = email
            cursor.close()
            return render_template('HomePage.html')
        else:
            cursor.close()
            return render_template('Register.html')
    return render_template('Login.html')


@app.route('/Register', methods=['GET', 'POST'])
def Register():
    session.pop('user_email', None)
    if request.method == 'POST':
        user_name = request.form['username']
        email = request.form['email']
        password = request.form['password']
        cur = conn.cursor()
        cur.execute('SELECT * FROM information_schema.tables WHERE table_name = "impact_users"')
        if cur.fetchone() is None:
            create_table = "create table impact_users (user_name varchar(100)," \
                           "user_email varchar(100),user_password varchar(100))"
            cur.execute(create_table)
            conn.commit()
            cur.close()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO impact_users(user_name, user_email, user_password) "
                       "VALUES (%s, %s, %s)", (user_name, email, password))
        conn.commit()
        cursor.close()
        return render_template('Login.html')
    return render_template('Register.html')


@app.route('/HomePage')
def HomePage():
    if 'user_email' in session:
        return render_template('HomePage.html')
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


@app.route('/FacialPain')
def FacialPain():
    if 'user_email' in session:
        return render_template('FacialPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/PupilPain')
def PupilPain():
    if 'user_email' in session:
        return render_template('PupilPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/Logout')
def Logout():
    session.pop('user_email', None)
    return render_template('Login.html')


@app.route('/Upload')
def Upload():
    if 'user_email' in session:
        return render_template('FileUpload.html')
    else:
        return render_template('Login.html')


@app.route('/Upload_Process_Pupil', methods=['GET', 'POST'])
def Upload_Process_Pupil():
    global fname
    if 'user_email' in session:
        if request.method == 'POST':
            # Uploading Segment:
            email = session['user_email']
            fname_txtfield = request.form['firstname']
            lname_txtfield = request.form['lastname']
            eye_color_val = request.form['radio']
            f = request.files['file']
            PUPIL_UPLOAD_FOLDER_S3 = 'Pupil_Data/Uploads-VideoFiles/'
            PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            fname = eye_color_val + fname_txtfield + lname_txtfield + str(st) + '.mp4'
            f.filename = fname
            app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
            pth = os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname)
            f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname))
            Upload_2_S3(BUCKET_NAME, fname, pth, PUPIL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'user-email': email, 'user-name': fname_txtfield+' '+lname_txtfield,
                                          'user-eyecolor': eye_color_val,  'user-metric': 'Pupil Pain',
                                          's3-filepath': 's3://impact-benten/'+PUPIL_UPLOAD_FOLDER_S3+fname})
            # Processing Segment:
            os.system('python IMPACT_PUPIL_v1_3.py ' + str(fname) + ' Color')
            token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(fname)[0]) + '.csv')
            if token:
                res_img_fold = os.path.join('static', 'Pupil_Output_Images')
                res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
                res_img_fold_s3 = 'Pupil_Data/Results-Output/'
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
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
                print('\n*************** DONE ****************\n')
                return render_template('Pupil_Success.html', image_file=pic, video_file=vid_file, score=PUAL_SCORE)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                return render_template('PupilPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/Upload_Process_Facial', methods=['GET', 'POST'])
def UploadFacial():
    global face_fname
    if 'user_email' in session:
        if request.method == 'POST':
            # Uploading Segment:
            email = session['user_email']
            fname_txtfield = request.form['firstname']
            lname_txtfield = request.form['lastname']
            option_val = request.form['radio']
            f = request.files['file']
            FACIAL_UPLOAD_FOLDER_S3 = 'Facial_Data/Uploads-VideoFiles/'
            FACIAL_UPLOAD_FOLDER = './static/Face_Input_Videos/'
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            face_fname = option_val + fname_txtfield + lname_txtfield + str(st) + '.avi'
            f.filename = face_fname
            app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
            pth = os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname)
            f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
            Upload_2_S3(BUCKET_NAME, face_fname, pth, FACIAL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'user-email': email, 'user-name': fname_txtfield + ' ' + lname_txtfield,
                                          'user-video-type': option_val, 'user-metric': 'Facial Pain',
                                          's3-filepath': 's3://impact-benten/'+FACIAL_UPLOAD_FOLDER_S3+face_fname})
            # Processing Segment:
            os.system('python IMPACT_FACIAL_v1_0.py ' + str(face_fname))
            token = os.path.exists('./static/Face_Output_Images/' + str(os.path.splitext(face_fname)[0]) + '.csv')
            if token:
                res_img_fold = os.path.join('static', 'Face_Output_Images')
                res_img_fold_s3 = 'Facial_Data/Results-Output/'
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
                label_file_csv = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], img_name+'_LabelFile.csv')
                bucket_df = pd.read_csv(label_file_csv)
                time_sec = bucket_df['Time (sec)']
                label_sec = bucket_df['Label']
                pic = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], f)
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, img_name+'_LabelFile.csv', label_file_csv, res_img_fold_s3)
                print('\n*************** DONE ****************\n')
                return render_template('Facial_Success.html', image_file=pic, max_pain=max_pain_score,
                                       mean_pain=mean_pain_score, min_pain=min_pain_score,
                                       time=time_sec, label=label_sec)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                render_template('FacialPain_Form.html')
    else:
        return render_template('Login.html')


@app.route('/mobile_pupil_api/<filename>', methods=['GET', 'POST'])
def pupil_api(filename):
    upload_folder_S3 = 'Pupil_Data/Results-Output/'
    download_folder_S3 = 'Pupil_Data/Uploads-VideoFiles/'
    PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
    Download_from_S3(BUCKET_NAME, download_folder_S3+filename, PUPIL_UPLOAD_FOLDER+filename)
    os.system('python IMPACT_PUPIL_v1_3.py ' + str(filename) + ' Color')
    token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(filename)[0]) + '.csv')
    if token:
        print('\n*************** TOKEN : GOOD ****************\n')
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
        print('PUAL : ', PUAL_SCORE)
        return str(PUAL_SCORE)
    else:
        print('\n*************** TOKEN : BAD ****************\n')
        return "Retake"


@app.route('/mobile_facial_api/<filename>', methods=['GET', 'POST'])
def facial_api(filename):
    upload_folder_s3 = 'Facial_Data/Results-Output/'
    download_folder_s3 = 'Facial_Data/Uploads-VideoFiles/'
    FACIAL_UPLOAD_FOLDER = './static/Face_Input_Videos/'
    Download_from_S3(BUCKET_NAME, download_folder_s3+filename, FACIAL_UPLOAD_FOLDER + filename)
    os.system('python IMPACT_FACIAL_v1_0.py ' + str(filename))
    token = os.path.exists('./static/Face_Output_Images/' + str(os.path.splitext(filename)[0]) + '.csv')
    if token:
        print('\n*************** TOKEN : GOOD ****************\n')
        res_img_fold = os.path.join('static', 'Face_Output_Images')
        res_img_fold_s3 = 'Facial_Data/Results-Output/'
        app.config['FACIAL_OUTPUT_FOLDER'] = res_img_fold
        img_name = str(os.path.splitext(filename)[0])
        file = img_name + '_PSPI_AUs.csv'
        csv_file = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], file)
        df = pd.read_csv(csv_file)
        pain_score = df['sum_AU_r']
        max_pain_score = round(pain_score.max(), 2)
        min_pain_score = round(pain_score.min(), 2)
        mean_pain_score = round(sum(pain_score) / len(pain_score), 2)
        f = img_name + '_Pain_Plot.png'
        pic = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], f)
        label_file_csv = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], img_name + '_LabelFile.csv')
        bucket_df = pd.read_csv(label_file_csv)
        time_sec = bucket_df['Time (sec)']
        label_sec = tuple(bucket_df['Label'])
        Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
        Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
        Upload_2_S3(BUCKET_NAME, img_name + '_LabelFile.csv', label_file_csv, res_img_fold_s3)
        return str(label_sec)
    else:
        print('\n*************** TOKEN : BAD ****************\n')
        return "Retake"


def write_to_txt(fnametxt, lnametxt, v, fln, flag, vid_type):
    if flag == 1:
        F = open('./static/Pupil_Output_Images/' + v + fnametxt + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nEye Color : " + v + "\nVideo File-Name : " + fln + "\nVideo Type : " + vid_type +"\n\n")
    elif flag == 2:
        F = open('./static/Face_Output_Images/' + fnametxt + "_" + lnametxt + ".txt", "a+")
        F.write("Patient Name : " + fnametxt + " " + lnametxt + "\nVideo Type : " + v + "\nVideo File-Name : " + fln + "\nVideo Code : " + vid_type +"\n\n")
    F.close()
    return


def Upload_2_S3(buck, f, fp, s3_to_path):
    # s3 = boto3.resource('s3')
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    bucket = s3.Bucket(buck)
    bucket.upload_file(Filename=fp, Key=s3_to_path+str(f), ExtraArgs={'ACL': 'public-read'})
    return 'Upload Done'


def Download_from_S3(buck, KEY, Local_fp):
    # s3 = boto3.resource('s3')
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    s3.Bucket(buck).download_file(KEY, Local_fp)
    return 'Download Done'


if __name__ == '__main__':
    app.run()
