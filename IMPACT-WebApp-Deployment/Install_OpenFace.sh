#!/bin/bash
apt-get update
apt-get -y install build-essential
apt-get -y install g++-8
apt-get -y install cmake
apt-get -y install libopenblas-dev
apt-get -y install git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
apt-get -y install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev
wget https://github.com/opencv/opencv/archive/4.1.0.zip
apt-get install -y unzip
unzip 4.1.0.zip
cd opencv-4.1.0
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D BUILD_TIFF=ON -D WITH_TBB=ON ..
make -j2
make install
wget http://dlib.net/files/dlib-19.13.tar.bz2
tar xf dlib-19.13.tar.bz2
cd dlib-19.13
mkdir build
cd build
cmake ..
cmake --build . --config Release
make install
ldconfig
cd ../..
apt-get -y install libboost-all-dev
cd OpenFace
mkdir build
bash download_models.sh
cd build
cmake -D CMAKE_CXX_COMPILER=g++-8 -D CMAKE_C_COMPILER=gcc-8 -D CMAKE_BUILD_TYPE=RELEASE ..
make
