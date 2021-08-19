# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# Copyright Content (C)
# Date: 08/14/2021
# Version: v1.0

FROM ubuntu:20.04
FROM python:3.9

WORKDIR /IMPACT

EXPOSE 5000
ENV FLASK_ENV=development
ENV FLASK_APP=IMPACT_WebApp.py

ADD . /IMPACT

RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt
RUN ["apt-get", "update"]
RUN ["apt-get", "-y", "install", "sudo"]
RUN ["apt-get", "install", "-y", "libgl1-mesa-dev"]
RUN ["apt-get", "install", "-y", "vim"]
RUN ["apt-get", "install", "-y", "apt-transport-https"]
RUN ["apt-get", "install", "-y", "ca-certificates"]
RUN ["apt-get", "install", "-y", "curl"]
RUN ["apt-get", "install", "-y", "gnupg"]
RUN ["apt-get", "install", "-y", "lsb-release"]

# Run the command for git clone if you want to manually install OpenFace on container
RUN ["git", "clone", "https://github.com/TadasBaltrusaitis/OpenFace.git"]

# Run the bash script if you want OpenFace to be installed on container automatically
RUN ["bash", "Install_OpenFace.sh"]

CMD ["flask", "run", "--host", "0.0.0.0"]
# CMD ["flask", "run"]
