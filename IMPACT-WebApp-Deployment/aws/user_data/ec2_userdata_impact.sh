# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# Copyright Content (C)
# Date: 07/12/2021
# Version: v1.0

Content-Type: multipart/mixed; boundary="//"
MIME-Version: 1.0

--//
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config.txt"

#cloud-config
cloud_final_modules:
- [scripts-user, always]

--//
Content-Type: text/x-shellscript; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="userdata.txt"

#!/bin/bash
#==========================================
# Installing LAMP
#==========================================
apt-get update
apt-get -y upgrade
apt install -y apache2
apt-get install php libapache2-mod-php php-mysql php-curl php-gd php-json php-zip php-mbstring 
service apache2 restart
apt-get install -y mysql-server
#==========================================
# Installing Docker
#==========================================
apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-get update
apt install -y docker-ce
docker login -u hkchang3x024--xxxxxx -p bentenx-p-s--xxxxxwrwedff_1x0x5
docker pull hkchang3x024/impact-benten:v16
docker run -d --restart unless-stopped -p 5000:5000 --name impact hkchang3x024/impact-benten:v16
--//