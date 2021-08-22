# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# Copyright Content (C)
# Date: 08/21/2021
# Version: v1.0

# Any among ubuntu:16.04, ubuntu:18.04 or ubuntu:20.04
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

# Clone to install OpenFace on the container
RUN ["git", "clone", "https://github.com/TadasBaltrusaitis/OpenFace.git"]

# Install OpenFace automatically while creating a Docker Image
RUN ["bash", "01-Start-OF-Installation.sh"]

# Run Flask Application
CMD ["flask", "run", "--host", "0.0.0.0"]
