# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 06/21/2021
# Version: v1.10

# Code Description:
# Web Simulation (Beta Version) for Pupil and Facial Pain Analysis.

# UPDATES:
# Patient Record Search Feature - Fetch Linked File Record
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
import boto3
import pymysql
from time import *
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
patient_ID = ""
user = ""

##############################################################


@app.route('/')
@app.route('/Login', methods=['GET', 'POST'])
def Login():
    global user
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
            user = email.split("@")[0]
            return render_template('HomePage.html', user=user)
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


@app.route('/PatientRecords', methods=['GET', 'POST'])
def PatientRecords():
    global user
    if 'user_email' in session:
        if request.method == 'POST':
            pat_id = request.form['PatientID']
            dts = request.form['TentativeDate']
            operation = request.form['operation']
            # print(pat_id, ' - ', dts, ' - ', operation)
            links, dt_mod = FetchS3BucketObj(pat_id, dts, operation)
            if len(links) == 0:
                return render_template('PatientRecords.html', user=user)
            else:
                data_buck = []
                for i in range(0, len(links)):
                    data_tup = (links[i], dt_mod[i])
                    data_buck.append(data_tup)
                # print(data_buck)
                if operation == 'Pupil':
                    page_header = 'Pupil'
                else:
                    page_header = 'Facial'
                return render_template('ShowRecord.html', user=user, page_header=page_header,
                                       pat_id=pat_id, data_buck=data_buck)
        return render_template('PatientRecords.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


@app.route('/Device_Data_Upload')
def Device_Data_Upload():
    global user
    if 'user_email' in session:
        if request.method == 'POST':
            pat_fname = request.form['firstname']
            pat_lname = request.form['lastname']
            upload_date = request.form['uploaddate']
            file_to_upload = str(pat_fname) + str(pat_lname) + str(upload_date)
            s3_path = 'Pupil_Data/Pupillometer_Data/'
            Upload_2_S3(BUCKET_NAME, file_to_upload, s3_path + file_to_upload, s3_path)
            return render_template('HomePage.html', user=user)
        return render_template('Upload_from_device.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


@app.route('/HomePage')
def HomePage():
    global user
    if 'user_email' in session:
        return render_template('HomePage.html', user=user)
    else:
        session.pop('user_email', None)
        return render_template('Login.html')


@app.route('/FacialPain')
def FacialPain():
    global user
    if 'user_email' in session:
        return render_template('FacialPain_Form.html', user=user)
    else:
        return render_template('Login.html')


@app.route('/PupilPain')
def PupilPain():
    global user
    if 'user_email' in session:
        return render_template('PupilPain_Form.html', user=user)
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
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            # pat_id = ''.join(rnd.choices(string.ascii_uppercase + string.digits, k=12))
            # fname = eye_color_val + fname_txtfield + lname_txtfield + str(st) + '.mp4'
            fname = eye_color_val + '_' + fname_txtfield + lname_txtfield + '.mp4'
            f.filename = fname
            app.config['PUPIL_UPLOAD_FOLDER'] = PUPIL_UPLOAD_FOLDER
            pth = os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname)
            f.save(os.path.join(app.config['PUPIL_UPLOAD_FOLDER'], fname))
            Upload_2_S3(BUCKET_NAME, fname, pth, PUPIL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'timestamp': str(st), 'Request': 'Website', 'user-email': email,
                                          'user-name': fname_txtfield + ' ' + lname_txtfield,
                                          'user-eyecolor': eye_color_val, 'user-metric': 'Pupil Pain',
                                          's3-filepath': 's3://impact-benten/' + PUPIL_UPLOAD_FOLDER_S3 + fname})
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
                return render_template('Pupil_Success.html', user=user, image_file=pic,
                                       video_file=vid_file, score=PUAL_SCORE)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                return render_template('PupilPain_Form.html', user=user)
    else:
        return render_template('Login.html')


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
            ts = time.time()
            st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
            # pat_id = ''.join(rnd.choices(string.ascii_uppercase + string.digits, k=12))
            # face_fname = option_val + fname_txtfield + lname_txtfield + str(st) + '.avi'
            face_fname = option_val + '_' + fname_txtfield + lname_txtfield + '.avi'
            f.filename = face_fname
            app.config['FACIAL_UPLOAD_FOLDER'] = FACIAL_UPLOAD_FOLDER
            pth = os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname)
            f.save(os.path.join(app.config['FACIAL_UPLOAD_FOLDER'], face_fname))
            Upload_2_S3(BUCKET_NAME, face_fname, pth, FACIAL_UPLOAD_FOLDER_S3)
            table_userData.put_item(Item={'timestamp': str(st), 'Request': 'Website', 'user-email': email,
                                          'user-name': fname_txtfield + ' ' + lname_txtfield,
                                          'user-video-type': option_val, 'user-metric': 'Facial Pain',
                                          's3-filepath': 's3://impact-benten/' + FACIAL_UPLOAD_FOLDER_S3 + face_fname})
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
                print('\n*************** DONE ****************\n')
                return render_template('Facial_Success.html', user=user, image_file=pic, max_pain=max_pain_score,
                                       mean_pain=mean_pain_score, min_pain=min_pain_score,
                                       time=time_sec, label=label_sec)
            else:
                print('\n*************** TOKEN : BAD ****************\n')
                render_template('FacialPain_Form.html', user=user)
    else:
        return render_template('Login.html')


@app.route('/mobile_pupil_api/<filename>', methods=['GET', 'POST'])
def pupil_api(filename):
    upload_folder_s3 = 'Pupil_Data/Results-Output/'
    download_folder_s3 = 'Pupil_Data/Uploads-VideoFiles/'
    PUPIL_UPLOAD_FOLDER = './static/Pupil_Input_Videos/'
    Download_from_S3(BUCKET_NAME, download_folder_s3 + filename, PUPIL_UPLOAD_FOLDER + filename)
    ts = time.time()
    st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
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
        Upload_2_S3(BUCKET_NAME, f, pic, upload_folder_s3)
        Upload_2_S3(BUCKET_NAME, img_name + '.mp4', vid_file, upload_folder_s3)
        Upload_2_S3(BUCKET_NAME, file, csv_file, upload_folder_s3)
        table_userData.put_item(Item={'timestamp': str(st), 'Request': 'API', 'user-metric': 'Pupil Pain',
                                      's3-filepath': 's3://impact-benten/' + download_folder_s3 + filename})
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
    Download_from_S3(BUCKET_NAME, download_folder_s3 + filename, FACIAL_UPLOAD_FOLDER + filename)
    ts = time.time()
    st = dt.datetime.fromtimestamp(ts).strftime('%Y-%m-%d_%H:%M:%S')
    os.system('python IMPACT_FACIAL_v1_0.py ' + str(filename))
    token = os.path.exists('./static/Face_Output_Images/' + str(os.path.splitext(filename)[0]) + '.csv')
    if token:
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
        Upload_2_S3(BUCKET_NAME, f, pic, res_img_fold_s3)
        Upload_2_S3(BUCKET_NAME, file, csv_file, res_img_fold_s3)
        Upload_2_S3(BUCKET_NAME, img_name + '_LabelFile.csv', label_file_csv, res_img_fold_s3)
        table_userData.put_item(Item={'timestamp': str(st), 'Request': 'API', 'user-metric': 'Facial Pain',
                                      's3-filepath': 's3://impact-benten/' + download_folder_s3 + filename})
        return str(label_sec)
    else:
        print('\n*************** TOKEN : BAD ****************\n')
        return "Retake"


def Upload_2_S3(buck, f, fp, s3_to_path):
    # s3 = boto3.resource('s3')
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    bucket = s3.Bucket(buck)
    bucket.upload_file(Filename=fp, Key=s3_to_path + str(f), ExtraArgs={'ACL': 'public-read'})
    return 'Upload Done'


def Download_from_S3(buck, KEY, Local_fp):
    # s3 = boto3.resource('s3')
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    s3.Bucket(buck).download_file(KEY, Local_fp)
    return 'Download Done'


def FetchS3BucketObj(patient_id, tent_date, op):
    s3 = boto3.resource('s3', aws_access_key_id=key_db['AWSAccessKeyId'], aws_secret_access_key=key_db['AWSSecretKey'])
    my_bucket = s3.Bucket(BUCKET_NAME)
    op_links = []
    dt_modified = []
    if op == 'Pupil':
        for file in my_bucket.objects.filter(Prefix='Pupil_Data/Results-Output/'):
            filename = file.key
            last_mod_date = file.last_modified
            if filename.find(patient_id) != -1:
                if filename.find('PUAL_') and str(filename).endswith('.csv'):
                    if str(tent_date) in str(last_mod_date):
                        pupil_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + filename
                        op_links.append(pupil_url)
                        dt_modified.append(last_mod_date)
    else:
        for file in my_bucket.objects.filter(Prefix='Facial_Data/Results-Output/'):
            filename = file.key
            last_mod_date = file.last_modified
            if filename.find(patient_id) != -1:
                if filename.find('_Pain_Plot.png') != -1:
                    if str(tent_date) in str(last_mod_date):
                        facial_url = f'https://{BUCKET_NAME}.s3.amazonaws.com/' + filename
                        op_links.append(facial_url)
                        dt_modified.append(last_mod_date)

    return op_links, dt_modified


if __name__ == '__main__':
    app.run()
