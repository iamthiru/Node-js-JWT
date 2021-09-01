# **********************************************************************************************************************
# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# (C) Copyright Content
# Date: 08/25/2021
# Version: v1.11

# Code Description:
# Website and API (Beta Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# Added Facial Record Search Feature
# JSONified APIs, Security Token
# Datetime functionality
# Returning PUAL + AVG PUPIL RATIO
# Updated Patient Search Functionality
# Patient Pupil Record - Pupillometer Data Uploader
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

# **********************************************************************************************************************

##############################################################
import os
import time
import yaml
import pytz
import boto3
import base64
import pymysql
from flask import *
import pandas as pd
import datetime as dt
from time import mktime
from Crypto.Cipher import AES
from datetime import datetime
from werkzeug.utils import secure_filename

##############################################################
# --------------------- AMAZON-S3 -------------------------- #
BUCKET_NAME = 'impact-benten'
key_db = yaml.load(open('aws/config/Keys.yaml'))
##############################################################
# -------------------- AMAZON-DynamoDB --------------------- #
# Dynamo_DB = boto3.resource('dynamodb', region_name="us-east-1")
Dynamo_DB = boto3.resource('dynamodb', aws_access_key_id=key_db['AWSAccessKeyId'],
                           aws_secret_access_key=key_db['AWSSecretKey'], region_name="us-east-1")
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
patient_ID = ""
user = ""

##############################################################


# [Routing] Login Routine
@app.route('/')
@app.route('/Login', methods=['GET', 'POST'])
def Login():
    global user
    session.pop('user_email', None)
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        conn = est_conn_rds()
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
            user = email.split("@")[0]
            flash("Login Success!", "success")
            return render_template('HomePage.html', user=user)
        else:
            cursor.close()
            flash("Login Failed!", "error")
            return render_template('Login.html')
    return render_template('Login.html')


# [Routing] Register Routine
@app.route('/Register', methods=['GET', 'POST'])
def Register():
    session.pop('user_email', None)
    if request.method == 'POST':
        user_name = request.form['username']
        email = request.form['email']
        password = request.form['password']
        conn = est_conn_rds()
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


# [Routing] HomePage
@app.route('/HomePage')
def HomePage():
    global user
    if 'user_email' in session:
        return render_template('HomePage.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Facial Pain Form Routine
@app.route('/FacialPain')
def FacialPain():
    global user
    if 'user_email' in session:
        return render_template('FacialPain_Form.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Pupil Pain Form Routine
@app.route('/PupilPain')
def PupilPain():
    global user
    if 'user_email' in session:
        return render_template('PupilPain_Form.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Logout Routine
@app.route('/Logout')
def Logout():
    session.pop('user_email', None)
    flash("Logged Out!", "success")
    return render_template('Login.html')


# [Routing] Routine to Fetch Pupil Records [CSV and Video]
@app.route('/PupilRecords', methods=['GET', 'POST'])
def PupilRecords():
    global user
    if 'user_email' in session:
        if request.method == 'POST':
            patient_name = request.form['text']
        else:
            patient_name = ''
        page_header = 'Pupil'
        bucket_prefix = 'Pupil_Data/Results-Output/'
        pupil_csv_list = S3_record_fetcher(patient_name, bucket_prefix)
        if patient_name != '':
            if len(pupil_csv_list) != 0:
                flash("Searched Patient/Term: '" + patient_name + "'", "success")
            else:
                flash("Searched Patient/Term: '" + patient_name + "'", "error")
        return render_template('ShowRecord_Pupil.html',
                               user=user,
                               pupil_csv_list=pupil_csv_list,
                               page_header=page_header)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Routine to Fetch Pupil Records [CSV and Video]
@app.route('/FacialRecords', methods=['GET', 'POST'])
def FacialRecords():
    global user
    if 'user_email' in session:
        if request.method == 'POST':
            patient_name = request.form['text']
        else:
            patient_name = ''
        page_header = 'Facial'
        bucket_prefix = 'Facial_Data/Results-Output/'
        facial_csv_list = S3_record_fetcher(patient_name, bucket_prefix)
        if patient_name != '':
            if len(facial_csv_list) != 0:
                flash("Searched Patient/Term: '" + patient_name + "'", "success")
            else:
                flash("Searched Patient/Term: '" + patient_name + "'", "error")
        return render_template('ShowRecord_Facial.html',
                               user=user,
                               facial_csv_list=facial_csv_list,
                               page_header=page_header)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Upload Pupillometer Data Routine
@app.route('/Upload_Device_Data', methods=['GET', 'POST'])
def Upload_Device_Data():
    global user
    if 'user_email' in session:
        if request.method == 'POST':
            f = request.files['file']
            txt_fname = request.form['text']
            page_header = 'Pupil'
            pupil_csv_list = S3_record_fetcher('')
            ext = os.path.splitext(secure_filename(f.filename))[1]
            new_filename = txt_fname + '_PUP_Device' + ext
            f.filename = str(new_filename)
            PUPIL_UPLOAD_FOLDER_S3 = 'Pupil_Data/Pupillometer_Data/'
            PUPIL_UPLOAD_FOLDER = './static/Device_Data/'
            app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
            pth = os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], f.filename)
            f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], f.filename))
            Upload_2_S3(BUCKET_NAME, f.filename, pth, PUPIL_UPLOAD_FOLDER_S3)
            flash("Success! Uploaded File As: '" + f.filename + "'", "info")
            return render_template('ShowRecord_Pupil.html',
                                   user=user,
                                   pupil_csv_list=pupil_csv_list,
                                   page_header=page_header)
        return render_template('HomePage.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] File Upload Routine
@app.route('/Upload')
def Upload():
    if 'user_email' in session:
        return render_template('FileUpload.html')
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Pupil Processing Algorithm Routine [Upload Video-Data + Process Video-Data]
@app.route('/Upload_Process_Pupil', methods=['GET', 'POST'])
def Upload_Process_Pupil():
    global fname
    global user
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
            fname = eye_color_val + '_' + fname_txtfield + lname_txtfield + '.mp4'
            f.filename = fname
            app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
            pth = os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname)
            f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname))
            Upload_2_S3(BUCKET_NAME, fname, pth, PUPIL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'timestamp': str(dt.datetime.now()), 'Request': 'Website',
                                          'user-email': email, 'user-name': fname_txtfield + ' ' + lname_txtfield,
                                          'user-eyecolor': eye_color_val, 'user-metric': 'Pupil Pain',
                                          's3-filepath': 's3://impact-benten/' + PUPIL_UPLOAD_FOLDER_S3 + fname})
            # Processing Segment:
            os.system('python modules/IMPACT_PUPIL_v1_3.py ' + str(fname) + ' Color')
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
                avg_pupil_ratio = sum(df['Raw_Data']) / len(df['Raw_Data'])
                f = img_name + '_Dilation_Plot.png'
                vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
                pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
                print('PUAL : ', PUAL_SCORE, ' ; AVG RATIO : ', avg_pupil_ratio)
                print('\n***************************** DONE *****************************\n')
                return render_template('Pupil_Success.html', user=user, image_file=pic,
                                       video_file=vid_file, score=PUAL_SCORE)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                return render_template('PupilPain_Form.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [Routing] Facial Pain Processing Algorithm Routine [Upload Video-Data + Process Video-Data]
@app.route('/Upload_Process_Facial', methods=['GET', 'POST'])
def UploadFacial():
    global face_fname
    global user
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
            face_fname = option_val + '_' + fname_txtfield + lname_txtfield + '.avi'
            f.filename = face_fname
            app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
            pth = os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname)
            f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
            Upload_2_S3(BUCKET_NAME, face_fname, pth, FACIAL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'timestamp': str(dt.datetime.now()), 'Request': 'Website',
                                          'user-email': email, 'user-name': fname_txtfield + ' ' + lname_txtfield,
                                          'user-video-type': option_val, 'user-metric': 'Facial Pain',
                                          's3-filepath': 's3://impact-benten/' + FACIAL_UPLOAD_FOLDER_S3 + face_fname})
            # Processing Segment:
            os.system('python modules/IMPACT_FACIAL_v1_0.py ' + str(face_fname))
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
                label_file_csv = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], img_name + '_LabelFile.csv')
                bucket_df = pd.read_csv(label_file_csv)
                time_sec = bucket_df['Time (sec)']
                label_sec = list(bucket_df['Label'])
                video_score = round(float(bucket_df['Video Score'][0]), 2)
                label_sec.append(str(min_pain_score))
                label_sec.append(str(mean_pain_score))
                label_sec.append(str(max_pain_score))
                label_sec.append(str(video_score))
                pic = os.path.join(app.config['FACIAL_OUTPUT_FOLDER'], f)
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
                Upload_2_S3(BUCKET_NAME, img_name + '_LabelFile.csv', label_file_csv, res_img_fold_s3)
                print('\n***************************** DONE *****************************\n')
                return render_template('Facial_Success.html', user=user, image_file=pic, max_pain=max_pain_score,
                                       mean_pain=mean_pain_score, min_pain=min_pain_score,
                                       time=time_sec, label=label_sec)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                render_template('FacialPain_Form.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


# [API] Pupil Processing Algorithm Routine (Routing)
@app.route('/mobile_pupil_api/<filename>', methods=['GET', 'POST'])
def pupil_api(filename):
    if filename == '':
        status = 'Failure'
        msg = 'Error! File Not Provided'
        code = '500'
        return jsonify(status=status, msg=msg, code=code)
    else:
        upload_folder_s3 = 'Pupil_Data/Results-Output/'
        download_folder_s3 = 'Pupil_Data/Uploads-VideoFiles/'
        PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
        start_timer = time.time()
        status = Download_from_S3(BUCKET_NAME, download_folder_s3 + filename, PUPIL_UPLOAD_FOLDER + filename)
        stop_timer = time.time()
        input_video_download_time = stop_timer - start_timer
        if status == 'Absent':
            status = 'Failure'
            msg = 'Error! Pupil API Failure. File Non-Existent on S3'
            code = '404'
            return jsonify(status=status, msg=msg, code=code)
        else:
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            start_timer = time.time()
            os.system('python modules/IMPACT_PUPIL_v1_3.py ' + str(filename) + ' Color')
            stop_timer = time.time()
            algo_time = stop_timer - start_timer
            token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(filename)[0]) + '.csv')
            if token:
                start_timer = time.time()
                print('\n*************** TOKEN : GOOD ****************\n')
                res_img_fold = os.path.join('static', 'Pupil_Output_Images')
                res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
                app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
                app.config['PUPIL_VID_OUT_FOLDER'] = res_vid_fold
                img_name = str(os.path.splitext(filename)[0])
                file = 'PUAL_' + img_name + '.csv'
                csv_f = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
                df = pd.read_csv(csv_f)
                PUAL_SCORE = round(df['PUAL_Score'][0], 3)
                avg_pupil_ratio = round((sum(df['Raw_Data'])/len(df['Raw_Data'])), 3)
                f = img_name + '_Dilation_Plot.png'
                vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
                pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
                stop_timer = time.time()
                post_process_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, f, pic, upload_folder_s3)
                stop_timer = time.time()
                img_upload_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, upload_folder_s3)
                stop_timer = time.time()
                output_video_upload_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, file, csv_f, upload_folder_s3)
                stop_timer = time.time()
                csv_upload_time = stop_timer - start_timer

                # table_userData.put_item(Item={'timestamp': str(st), 'Request': 'API', 'user-metric': 'Pupil Pain',
                #                               's3-filepath': 's3://impact-benten/' + download_folder_s3 + filename})

                print('PUAL : ', PUAL_SCORE, ' ; AVG RATIO : ', avg_pupil_ratio)
                pupil_list = [PUAL_SCORE, avg_pupil_ratio]
                status = 'Success'
                msg = 'Pupil API Success'
                code = '200'
                timers = {'Download Input Video': str(input_video_download_time),
                          'Algorithm Run-time': str(algo_time),
                          'Post-processing files generation time': str(post_process_time),
                          'Image Upload to S3 time': str(img_upload_time),
                          'Output Video Upload to S3 time': str(output_video_upload_time),
                          'CSV Upload upload to S3 time': str(csv_upload_time)}
                return jsonify(status=status, msg=msg, code=code, result=pupil_list, timers=timers)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                status = 'Failure'
                msg = 'Pupil API Failed'
                reasons_failure = {'Bad Video Quality', 'Pupil OR Iris Undetected',
                                   'Bad Lighting', 'Video Did Not Meet Requirements'}
                code = '400'
                return jsonify(status=status, msg=msg, reasons_failure=reasons_failure, code=code)


'''
# [API] Pupil Processing Algorithm Routine (Routing)
@app.route('/mobile_pupil_api2/<token>/<filename>', methods=['GET', 'POST'])
def pupil_api2(token, filename):
    # Using AES decrypt the token
    print(token)
    SHA = yaml.load(open('aws/config/apiAES256key.yaml'))
    private_key = SHA['key']
    cipher, IV = str(token).split('####')
    IV = bytes.fromhex(IV)
    print('Cipher: ', cipher, ' - IV: ', IV)
    cipher_obj = AES.new(private_key, AES.MODE_CFB, IV)
    decrypted_token = cipher_obj.decrypt(cipher)
    dt_bytes = base64.decode(decrypted_token)
    Hex_DT = dt_bytes.hex()
    print('DT_bytes : ', dt_bytes, ' ; ', 'Hex DT : ', Hex_DT)
    year, month, _ = str(dt.date.today()).split('-')
    expected_token = 'APIIMP@CTB10' + year + month + '#'
    print('Decrypted Token: ', decrypted_token)
    if Hex_DT == expected_token:
        print('\n*************** Authentication Passed ****************\n')
        if filename == '':
            status = 'Failure'
            msg = 'Error! File Not Provided'
            code = '500'
            return jsonify(status=status, msg=msg, code=code)
        else:
            upload_folder_s3 = 'Pupil_Data/Results-Output/'
            download_folder_s3 = 'Pupil_Data/Uploads-VideoFiles/'
            PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
            status = Download_from_S3(BUCKET_NAME, download_folder_s3 + filename, PUPIL_UPLOAD_FOLDER + filename)
            if status == 'Absent':
                status = 'Failure'
                msg = 'Error! Pupil API Failure. File Non-Existent on S3'
                code = '404'
                return jsonify(status=status, msg=msg, code=code)
            else:
                ts = time.time()
                st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
                os.system('python modules/IMPACT_PUPIL_v1_3.py ' + str(filename) + ' Color')
                token = os.path.exists('./static/Pupil_Output_Images/' + 'PUAL_' + str(os.path.splitext(filename)[0]) + '.csv')
                if token:
                    print('\n*************** TOKEN : GOOD ****************\n')
                    res_img_fold = os.path.join('static', 'Pupil_Output_Images')
                    res_vid_fold = os.path.join('static', 'Pupil_Output_Videos')
                    app.config['PUPIL_OUTPUT_FOLDER'] = res_img_fold
                    app.config['PUPIL_VID_OUT_FOLDER'] = res_vid_fold
                    img_name = str(os.path.splitext(filename)[0])
                    file = 'PUAL_' + img_name + '.csv'
                    csv_f = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], file)
                    df = pd.read_csv(csv_f)
                    PUAL_SCORE = round(df['PUAL_Score'][0], 3)
                    avg_pupil_ratio = round((sum(df['Raw_Data'])/len(df['Raw_Data'])), 3)
                    f = img_name + '_Dilation_Plot.png'
                    vid_file = os.path.join(app.config['PUPIL_VID_OUT_FOLDER'], img_name + '.mp4')
                    pic = os.path.join(app.config['PUPIL_OUTPUT_FOLDER'], f)
                    Upload_2_S3(BUCKET_NAME, f, pic, upload_folder_s3)
                    Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, upload_folder_s3)
                    Upload_2_S3(BUCKET_NAME, file, csv_f, upload_folder_s3)
                    table_userData.put_item(Item={'timestamp': str(st), 'Request': 'API', 'user-metric': 'Pupil Pain',
                                                  's3-filepath': 's3://impact-benten/' + download_folder_s3 + filename})
                    print('PUAL : ', PUAL_SCORE, ' ; AVG RATIO : ', avg_pupil_ratio)
                    pupil_list = [PUAL_SCORE, avg_pupil_ratio]
                    status = 'Success'
                    msg = 'Pupil API Success'
                    code = '200'
                    return jsonify(status=status, msg=msg, code=code, result=pupil_list)
                else:
                    print('\n*************** TOKEN : BAD ****************\n')
                    return "Retake"
    else:
        print('\n*************** Authentication Failed ****************\n')
        status = 'Authentication Failure'
        msg = 'Authentication Error! Token Incorrect'
        code = '401'
        return jsonify(status=status, msg=msg, code=code)
'''


# [API] Facial Pain Processing Algorithm Routine (Routing)
@app.route('/mobile_facial_api/<filename>', methods=['GET', 'POST'])
def facial_api(filename):
    if filename == '':
        status = 'Failure'
        msg = 'Error! File Not Provided'
        code = '500'
        return jsonify(status=status, msg=msg, code=code)
    else:
        upload_folder_s3 = 'Facial_Data/Results-Output/'
        download_folder_s3 = 'Facial_Data/Uploads-VideoFiles/'
        FACIAL_UPLOAD_FOLDER = './static/Face_Input_Videos/'
        start_timer = time.time()
        status = Download_from_S3(BUCKET_NAME, download_folder_s3 + filename, FACIAL_UPLOAD_FOLDER + filename)
        stop_timer = time.time()
        input_video_download_time = stop_timer - start_timer
        if status == 'Absent':
            status = 'Failure'
            msg = 'Error! Facial API Failure. File Non-Existent on S3'
            code = '404'
            return jsonify(status=status, msg=msg, code=code)
        else:
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            start_timer = time.time()
            os.system('python modules/IMPACT_FACIAL_v1_0.py ' + str(filename))
            stop_timer = time.time()
            algo_time = stop_timer - start_timer
            token = os.path.exists('./static/Face_Output_Images/' + str(os.path.splitext(filename)[0]) + '.csv')
            if token:
                start_timer = time.time()
                print('\n*************** TOKEN : GOOD ****************\n')
                res_img_fold = os.path.join('static', 'Face_Output_Images')
                res_img_fold_s3 = upload_folder_s3
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
                # time_sec = bucket_df['Time (sec)']
                label_sec = list(bucket_df['Label'])
                video_score = round(float(bucket_df['Video Score'][0]), 3)
                label_sec.append(str(min_pain_score))
                label_sec.append(str(mean_pain_score))
                label_sec.append(str(max_pain_score))
                label_sec.append(str(video_score))
                stop_timer = time.time()
                post_process_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
                stop_timer = time.time()
                img_upload_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
                stop_timer = time.time()
                csv1_upload_time = stop_timer - start_timer

                start_timer = time.time()
                Upload_2_S3(BUCKET_NAME, img_name + '_LabelFile.csv', label_file_csv, res_img_fold_s3)
                stop_timer = time.time()
                csv2_upload_time = stop_timer - start_timer

                # table_userData.put_item(Item={'timestamp': str(st), 'Request': 'API', 'user-metric': 'Facial Pain',
                #                               's3-filepath': 's3://impact-benten/' + download_folder_s3 + filename})

                status = 'Success'
                msg = 'Facial API Success'
                code = '200'
                timers = {'Download Input Video': str(input_video_download_time),
                          'Algorithm Run-time': str(algo_time),
                          'Post-processing files generation time': str(post_process_time),
                          'Image Upload to S3 time': str(img_upload_time),
                          'OpenFace CSV Upload to S3 time': str(csv1_upload_time),
                          'LabelFile CSV Upload to S3 time': str(csv2_upload_time)}
                return jsonify(status=status, msg=msg, code=code, result=label_sec, timers=timers)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                status = 'Failure'
                msg = 'Facial API Failed'
                reasons_failure = {'Bad Video Quality', 'Face Undetected',
                                   'Bad Lighting', 'Video Did Not Meet Requirements'}
                code = '400'
                return jsonify(status=status, msg=msg, reasons_failure=reasons_failure, code=code)


@app.template_filter('CTdatetimefilter')
def CTdatetimefilter(value, format='%b %d %I:%M %p'):
    tz = pytz.timezone('US/Central')   # timezone you want to convert to from UTC (US/Central)
    utc = pytz.timezone('UTC')
    value = utc.localize(value, is_dst=None).astimezone(pytz.utc)
    local_dt = value.astimezone(tz)
    return local_dt.strftime(format)


# [Function] Upload to S3 Bucket Routine
def Upload_2_S3(buck, f, fp, s3_to_path):
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    bucket = s3.Bucket(buck)
    bucket.upload_file(Filename=fp, Key=s3_to_path + str(f), ExtraArgs={'ACL': 'public-read'})
    return 'Upload Done'


# [Function] Download from S3 Bucket Routine
def Download_from_S3(buck, KEY, Local_fp):
    flag = 0
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    prefix = str(KEY).split('/')[0] + '/' + str(KEY).split('/')[1]
    for file in s3.Bucket(buck).objects.filter(Prefix=prefix):
        bucket_filename = str(file.key).split('/')[2]
        search_filename = str(KEY).split('/')[2]
        if search_filename == bucket_filename:
            s3.Bucket(buck).download_file(KEY, Local_fp)
            flag = 1
            break
    if flag == 1:
        return 'Present'
    else:
        return 'Absent'


# [Function] Fetch S3 Records from Pupil Folder in Bucket
def S3_record_fetcher(pat_name, prefix):
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    my_bucket = s3.Bucket(BUCKET_NAME)
    all_csv_files = {}
    for file in my_bucket.objects.filter(Prefix=prefix):
        filename = file.key
        last_mod_date = file.last_modified
        new_last_mod_date = str(last_mod_date).split('+')[0]
        new_last_mod_date = time.strptime(str(new_last_mod_date), "%Y-%m-%d %H:%M:%S")
        new_last_mod_date = datetime.fromtimestamp(mktime(new_last_mod_date))
        timestamp_jay_mp4 = str(filename).split("_")[-1]
        timestamp_jay_final = timestamp_jay_mp4.split(".")[0]

        if prefix == 'Pupil_Data/Results-Output/':
            if filename.find('.csv') != -1:
                if (str.upper(filename).find(str.upper(pat_name)) or str.lower(filename).find(str.lower(pat_name))) != -1:
                    _, fl = os.path.split(filename)
                    head, tail = os.path.splitext(fl)
                    fn = head.split('PUAL_')[1]
                    csv_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + filename
                    video_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + str(prefix) + str(fn) + '.mp4'
                    all_csv_files[fl] = (str(fn) + '.csv', str(fn) + '.mp4', new_last_mod_date, timestamp_jay_final, csv_url, video_url)
        else:
            if filename.find('_PSPI_AUs.csv') != -1:
                if (str.upper(filename).find(str.upper(pat_name)) or str.lower(filename).find(str.lower(pat_name))) != -1:
                    _, fl = os.path.split(filename)
                    head, tail = os.path.splitext(fl)
                    fn = head.split('_PSPI_AUs')[0]
                    timestamp_jay_final = str(fn).split("_")[-1]
                    csv_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + str(prefix) + str(head) + '.csv'
                    plot_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + str(prefix) + str(fn) + '_Pain_Plot.png'
                    all_csv_files[fl] = (str(head) + '.csv', str(fn) + '_Pain_Plot.png', new_last_mod_date, timestamp_jay_final, csv_url, plot_url)

    sorted_list = sorted(all_csv_files.items(), key=lambda x: x[1][2], reverse=True)
    return sorted_list


# [Function] Establishing new connection with RDS-MySQL DB-Server
def est_conn_rds():
    db = yaml.load(open('aws/config/db.yaml'))
    conn = pymysql.connect(host=db['mysql_host'],
                           user=db['mysql_user'],
                           password=db['mysql_password'],
                           database=db['mysql_db'],
                           port=int(db['mysql_port']))
    return conn


# [MAIN] Runner Call
if __name__ == '__main__':
    app.run()

# **********************************************************************************************************************
