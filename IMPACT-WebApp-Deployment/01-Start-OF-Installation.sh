# Proprietary: Benten Technologies, Inc.
# Author: Pranav H. Deo { pdeo@bententech.com }
# Copyright Content (C)
# Date: 08/19/2021
# Version: v1.0
#!/bin/bash
sudo apt-get update
sudo apt-get upgrade
sudo apt install software-properties-common
sudo apt-get -y install build-essential
sudo apt-get -y install gcc-10 g++-10
sudo apt-get -y install cmake
sudo apt-get -y install zip
sudo apt-get -y install libopenblas-dev
sudo apt-get -y install libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev
sudo apt-get -y install libtbb2 libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev
sudo apt-get -y install git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get -y install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev
echo "Essential dependencies installed..."

echo "Downloading OpenCV..."
wget https://github.com/opencv/opencv/archive/4.1.0.zip
apt-get install -y unzip
unzip 4.1.0.zip
cd opencv-4.1.0
mkdir -p build
cd build
echo "Installing OpenCV..."
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D WITH_TBB=ON -D WITH_CUDA=OFF -D BUILD_SHARED_LIBS=OFF ..
make -j4
sudo make install
cd ../..
rm 4.1.0.zip
sudo rm -r opencv-4.1.0
echo "OpenCV installed."

echo "Downloading dlib..."
wget http://dlib.net/files/dlib-19.13.tar.bz2;
tar xf dlib-19.13.tar.bz2;
cd dlib-19.13;
mkdir -p build;
cd build;
cmake ..;
cmake --build . --config Release;
sudo make install;
sudo ldconfig;
cd ../..;
rm -r dlib-19.13.tar.bz2
echo "dlib installed"

echo "Installing OpenFace..."
apt-get -y install libboost-all-dev
cd OpenFace
mkdir -p build
bash download_models.sh
cd build
# In case the cmake command doesnt work, try to check the gcc and g++ under your OS's /usr/bin/
cmake -D CMAKE_CXX_COMPILER=g++-10 -D CMAKE_C_COMPILER=gcc-10 -D CMAKE_BUILD_TYPE=RELEASE ..
make
cd ..
echo "OpenFace successfully installed."
