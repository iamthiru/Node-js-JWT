FROM ubuntu:20.04
FROM python:3.8

WORKDIR /IMPACT

EXPOSE 5000
ENV FLASK_ENV=development
ENV FLASK_APP=PainWebPage_New.py

ADD . /IMPACT

RUN python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt
RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "libgl1-mesa-dev"]
RUN ["apt-get", "install", "-y", "vim"]
RUN ["apt-get", "install", "-y", "apt-transport-https"]
RUN ["apt-get", "install", "-y", "ca-certificates"]
RUN ["apt-get", "install", "-y", "curl"]
RUN ["apt-get", "install", "-y", "gnupg"]
RUN ["apt-get", "install", "-y", "lsb-release"]
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN ["apt-get", "install", "-y", "docker.io"]
CMD ["flask", "run", "--host", "0.0.0.0"]
