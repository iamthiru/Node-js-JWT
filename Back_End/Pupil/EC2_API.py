# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo
# Copyright Content
# Date: 02/17/2021
# Version: v1.0

import paramiko as paramiko
import os
import time

# Key file to connect to EC2.
# Path needs to be changed based on local.
# Do not share the .pem file.
key = paramiko.RSAKey.from_private_key_file('/Users/pranavdeo/Downloads/imp_benten.pem')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())


# This path has to be configured based on where the video is saved. Below is an example:
Video_File = '/Users/pranavdeo/Downloads/APKTest03_Elina.mp4'
_, Video_name = os.path.split(Video_File)
Out_File = os.path.splitext(Video_name)[0] + '_Ratio_Dilation.csv'
print(Out_File)


# Do not change the code below. Path is also consistent.
# Secure-Line connection with AWS EC2.
try:
    # Code to establish a secure connection with AWS EC2 through .pem file
    instance_ip = '3.87.214.251'
    client.connect(hostname=instance_ip, username="ubuntu", pkey=key)

    # Send file from local to EC2 instance.
    print('1')
    os.system('scp -i ~/Downloads/imp_benten.pem ' + Video_File + ' ubuntu@3.87.214.251:Video_Data/')
    print('2')
    stdin1, stdout1, stderr1 = client.exec_command('sudo docker cp ~/Video_Data/' + Video_name + ' a2bb32b4eae6:/AWS_Lambda/static/Pupil_Input_Videos/' + Video_name)

    # API Call to run the back-end algorithm.
    print('3')
    stdin2, stdout2, stderr2 = client.exec_command('sudo docker exec a2bb32b4eae6 bash -c "python IMPACT_PUPIL_v1.3.py 1 ' + Video_name + ' Color"', timeout=60)
    time.sleep(5)

    # Code to download the output files:
    print('4')
    stdin3, stdout3, stderr3 = client.exec_command('sudo docker cp a2bb32b4eae6:/AWS_Lambda/static/Pupil_Output_Images/' + Out_File + ' ~/Output_Data/' + Out_File)
    os.system('scp -i ~/Downloads/imp_benten.pem ubuntu@3.87.214.251:Output_Data/' + Out_File + ' ~/Downloads/' + Out_File)

    client.close()

except Exception as e:
    print(e)
