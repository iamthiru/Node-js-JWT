# OpenFace 2.2.0 Installation

****************************************************************************  

1. Mac Installation:
      
      1.A. Manual:
            
          Follow this process to install OpenFace 2.2.0 on your Mac:
          a. Install Homebrew: 'https://brew.sh'. (It is an alternative to apt-get for Mac users)
          b. After installing Homebrew, install the following dependencies: (GCC, boost, tbb, openblas, dlib, wget and opencv)
             > brew update
             > brew install gcc
             > brew install boost
             > brew install tbb
             > brew install openblas
             > brew install --build-from-source dlib
             > brew install wget
             > brew install opencv
          c. Now you will have to pull the OpenFace 2.2.0 GitHub repository:
             > git clone https://github.com/TadasBaltrusaitis/OpenFace.git
             This will create a directory in the location you want to install OpenFace 2.2.0 (Make sure the location is the same throughout).
          d. Place a section of code under CMakeLists.txt under the OpenFace directory just created.
             Open the file CMakeLists.txt and traverse the file until after the OpenCV section, after which you paste the following:
             ------------------------------------------------
             find_package( X11 REQUIRED )
             MESSAGE("X11 information:")
             MESSAGE("  X11_INCLUDE_DIR: ${X11_INCLUDE_DIR}")
             MESSAGE("  X11_LIBRARIES: ${X11_LIBRARIES}")
             MESSAGE("  X11_LIBRARY_DIRS: ${X11_LIBRARY_DIRS}")
             include_directories( ${X11_INCLUDE_DIR} )
             ------------------------------------------------
          e. Model file (.dat files) installation:
             Find a file under OpenFace directory (you just created) named: download_models.sh
             Copy that file and paste it under this directory: /OpenFace/lib/local/LandmarkDetector/model/patch_experts
             After this, go to your terminal and go to that directory:
             > cd ~/OpenFace/lib/local/LandmarkDetector/model/patch_experts
             > bash download_models.sh
             This will install the .dat (model) files required to run the OpenFace 2.2.0 live on your machine.
          f. Now the important steps to finally install OpenFace 2.2.0
             > cd OpenFace
             > mkdir build
             > cd build
             > cmake -D CMAKE_BUILD_TYPE=RELEASE ..
             > make
             
             Yay! You have now installed OpenFace 2.2.0 on your local platform.
             
          g. To test the installation:
             > cd OpenFace
             > build/bin/FeatureExtraction -verbose -f "../samples/default.wmv"
             If this throws an error, you have done something incorrect or have missed an installation requirement. Please install and re-rerun.
             Otherwise you are all set.

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
4. Google Collab installation:

Paste the following code on the Google Collab code cell. Will take around 42 minutes to run and install.

```
import os
from os.path import exists, join, basename, splitext

################# Need to revert back to CUDA 10.0 ##################
# Thanks to http://aconcaguasci.blogspot.com/2019/12/setting-up-cuda-100-for-mxnet-on-google.html
#Uninstall the current CUDA version
!apt-get --purge remove cuda nvidia* libnvidia-*
!dpkg -l | grep cuda- | awk '{print $2}' | xargs -n1 dpkg --purge
!apt-get remove cuda-*
!apt autoremove
!apt-get update

#Download CUDA 10.0
!wget  --no-clobber https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/cuda-repo-ubuntu1804_10.0.130-1_amd64.deb
#install CUDA kit dpkg
!dpkg -i cuda-repo-ubuntu1804_10.0.130-1_amd64.deb
!sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/7fa2af80.pub
!apt-get update
!apt-get install cuda-10-0
#Slove libcurand.so.10 error
!wget --no-clobber http://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/nvidia-machine-learning-repo-ubuntu1804_1.0.0-1_amd64.deb
#-nc, --no-clobber: skip downloads that would download to existing files.
!apt install ./nvidia-machine-learning-repo-ubuntu1804_1.0.0-1_amd64.deb
!apt-get update
####################################################################

git_repo_url = 'https://github.com/TadasBaltrusaitis/OpenFace.git'
project_name = splitext(basename(git_repo_url))[0]
# clone openface
!git clone -q --depth 1 $git_repo_url

# install new CMake becaue of CUDA10
!wget -q https://cmake.org/files/v3.13/cmake-3.13.0-Linux-x86_64.tar.gz
!tar xfz cmake-3.13.0-Linux-x86_64.tar.gz --strip-components=1 -C /usr/local

# Get newest GCC
!sudo apt-get update
!sudo apt-get install build-essential 
!sudo apt-get install g++-8

# install python dependencies
!pip install -q youtube-dl

# Finally, actually install OpenFace
!cd OpenFace && bash ./download_models.sh && sudo bash ./install.sh
```

Command to Run OpenFace on Collab:
Mount your google drive and run openface on the videos by using the following command
```
!/content/OpenFace/build/bin/FeatureExtraction -f 'Path to video on google drive' + video -out_dir 'Path to folder to save csv' -aus

```

****************************************************************************
