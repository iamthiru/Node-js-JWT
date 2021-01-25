# OpenFace Installation

****************************************************************************  
1. Mac Installation:


****************************************************************************  
2. UNIX installation:

      2.A. Automatic:

          Download this file (unix_install.sh)
          Open your terminal and chdir to the directory where you want to set up OpenFace 2.2.0
          Run this command: sudo bash ./install.sh

      2.B. Manual:

          # Installing gcc (Need latest gcc)
          sudo apt-get update
          sudo apt-get install build-essential
          sudo apt-get install g++-8

          # If you have Ubuntu 16.04 or lower, you will need the following:
          sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
          sudo apt-get -y update

          # Installing CMake
          sudo apt-get install cmake
          
          # Ubuntu 16.04 has CMake 3.5 but for OpenFace you need at least a CMake version 3.8. To do that do the following:
          sudo apt-get --purge remove cmake-qt-gui -y
          sudo apt-get --purge remove cmake -y
          mkdir -p cmake_tmp
          cd cmake_tmp
          wget https://cmake.org/files/v3.10/cmake-3.10.1.tar.gz
          tar -xzvf cmake-3.10.1.tar.gz -qq
          cd cmake-3.10.1/
          ./bootstrap
          make -j4
          sudo make install
          cd ../..
          sudo rm -rf cmake_tmp

          # Get OpenBLAS
          sudo apt-get install libopenblas-dev

          # OpenCV 4.1.0
          Install OpenCV dependencies:
          sudo apt-get install git libgtk2.0-dev pkg-config libavcodec-dev libavformat-dev libswscale-dev
          sudo apt-get install python-dev python-numpy libtbb2 libtbb-dev libjpeg-dev libpng-dev libtiff-dev libdc1394-22-dev
          
          # OpenCV4.1: https://github.com/opencv/opencv/archive/4.1.0.zip
          wget https://github.com/opencv/opencv/archive/4.1.0.zip
          Unzip it and create a build folder:
          sudo unzip 4.1.0.zip
          cd opencv-4.1.0
          mkdir build
          cd build
          
          # Build it using:
          sudo cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D BUILD_TIFF=ON -D WITH_TBB=ON ..
          sudo make -j2
          sudo make install


          # Download and compile dlib:
          wget http://dlib.net/files/dlib-19.13.tar.bz2
          tar xf dlib-19.13.tar.bz2
          cd dlib-19.13
          mkdir build;
          cd build;
          cmake ..;
          cmake --build . --config Release;
          sudo make install;
          sudo ldconfig;
          cd ../..;    
          sudo apt-get install libboost-all-dev (optional)

          # Clone OpenFace 2.2.0:
          git clone https://github.com/TadasBaltrusaitis/OpenFace.git
          cd OpenFace
          mkdir build
          cd build
          
          # Compile the code using:
          cmake -D CMAKE_CXX_COMPILER=g++-8 -D CMAKE_C_COMPILER=gcc-8 -D CMAKE_BUILD_TYPE=RELEASE ..
          Make


          # To install models you need to run the file:
          bash ./downloads_models.sh

          # To test the installation, run the command:
          ./bin/FeatureExtraction -f "filepath/default.wmv"

****************************************************************************

3. Windows installation:

    3.A. Download Binaries:
          # The installation for windows has an option to choose 32-bit or 64-bit version:
          
          # 32-bit: 
          https://github.com/TadasBaltrusaitis/OpenFace/releases/download/OpenFace_2.2.0/OpenFace_v2.2.0_win_x86.zip
          
          # 64-bit: 
          https://github.com/TadasBaltrusaitis/OpenFace/releases/download/OpenFace_2.2.0/OpenFace_v2.2.0_win_x64.zip
 
   3.B. Extract the compressed zip file and the toolbox would be extracted and ready to use. For the binaries, you need to install Visual Studio Code 2017 or the 64-bit Visual C++ redistributable package. 
          Link: https://aka.ms/vs/16/release/vc_redist.x64.exe
 
   3.C. To use the command line arguments for the Openface toolbox, check the link below to run the commands:
          Link: https://github.com/TadasBaltrusaitis/OpenFace/wiki/Command-line-arguments
 
   3.D. Before using the toolbox, you need to download the Models for the software. It can be done by running the download_models.ps1 file using Powershell tool. (Right click the file and run with PowerShell)
 
   3.E. The toolbox can also be executed by directly using the executable files in the file directory. These files show an interactive GUI to the user to select the Image, Video or Webcam feed and the results from the algorithm will be stored in the ‘processed’ folder in the file directory.

****************************************************************************