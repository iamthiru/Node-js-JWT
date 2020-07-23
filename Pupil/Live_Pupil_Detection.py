import time
import cv2
import os
import numpy as np

Facial_cascade = cv2.CascadeClassifier('face.xml')
Eye_cascade = cv2.CascadeClassifier('eye.xml')


#####################################################################


# Function To Capture Live Video
def live_capture():
    video = cv2.VideoCapture(0)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter('/Users/pranavdeo/Documents/Pupil/Input_Space/Video.avi', fourcc,
                          20.0, (int(video.get(3)), int(video.get(4))))
    while video.isOpened():
        _, frame = video.read()
        out.write(frame)
        cv2.imshow('Live', frame)
        if cv2.waitKey(1) == 27 or 0xFF == ord('q'):
            val = 1
            break

    video.release()
    cv2.destroyAllWindows()
    return val


#####################################################################


# Eye Extraction
def Face_Ext(inp, typ):
    print("> Extracting Face...")
    time.sleep(2)

    # Single Video file captured
    if typ == 1:
        f = inp+'/Video.avi'
        cap = cv2.VideoCapture(f)
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        out = cv2.VideoWriter('/Users/pranavdeo/Documents/Pupil/Face/Face.avi', fourcc, 20.0, (640, 480))

        while cap.isOpened():
            ret, image = cap.read()

            if ret:
                faces = Facial_cascade.detectMultiScale(image, 1.3, 5)

                for (x, y, w, h) in faces:
                    rec_face = image[y:y + h, x:x + w]
                    # img = cv2.resize(rec_face, (int(cap.get(3)), int(cap.get(4))))
                    img = cv2.resize(rec_face, (640, 480))
                    out.write(img)

            else:
                break

        cap.release()
        out.release()
        cv2.destroyAllWindows()

        time.sleep(2)
        print("\t# Face Extraction Successful")


#####################################################################


# Detect Pupil
def Detect_Pupil(ip, op):
    print("> Detecting Pupil...")
    time.sleep(2)
    f = ip + '/Face.avi'
    fop = op + '/Pupil.avi'

    cap = cv2.VideoCapture(f)

    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(fop, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))

    while cap.isOpened():
        ret, image = cap.read()

        if ret:
            # image = cv2.resize(image, (640, 480))
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            eyes = Eye_cascade.detectMultiScale(gray)

            for (ex, ey, ew, eh) in eyes:
                im = gray[ey:ey + eh, ex:ex + ew]
                cv2.rectangle(gray, (ex, ey), (ex+ew, ey+eh), (0, 255, 0), 1)
                _, thresh = cv2.threshold(im, 40, 255, cv2.THRESH_BINARY)
                canny_img = cv2.Canny(thresh, 800, 900)

                circles = cv2.HoughCircles(canny_img, cv2.HOUGH_GRADIENT, 5, 5000, param1=500, param2=30, minRadius=15,
                                           maxRadius=20)

                circles = np.uint16(np.around(circles))
                for i in circles[0, :]:
                    cv2.circle(im, (i[0], i[1]), i[2], (0, 0, 255), 3)

                # cv2.imshow('Video', gray)
                g = cv2.resize(gray, (640, 480))
                imge = cv2.cvtColor(g, cv2.COLOR_GRAY2BGR)
                out.write(imge)

                if cv2.waitKey(1) == 27 or 0xFF == ord('q'):
                    break
        else:
            break

    print('     # Pupil Detection Successful')
    cap.release()
    cv2.destroyAllWindows()


#####################################################################


# __MAIN()__
print("\n############################## LIVE PUPIL DETECTION ##############################")
print("\n> LIST OF OPERATIONS : \n\t1. Live Video Capture \n\t2. DataBase Directory")
ch = int(input("> Enter Choice : "))

if ch == 1:
    # flag = live_capture()
    flag = 1
    time.sleep(2)
    print("\n************* Video Capture Complete *************\n")
    time.sleep(2)
    if flag == 1:
        Face_Ext('/Users/pranavdeo/Documents/Pupil/Input_Space', 1)
        Detect_Pupil('/Users/pranavdeo/Documents/Pupil/Face', '/Users/pranavdeo/Documents/Pupil/Pupil_Output')

elif ch == 2:
    print("\n************* Video DataBase Directory *************\n")
    in_path = "/Users/pranavdeo/Documents/Pupil/Input_Space"
    time.sleep(2)
    # Face_Ext(in_path, 2)
    # Detect_Pupil('/Users/pranavdeo/Documents/Pupil/Face/', '/Users/pranavdeo/Documents/Pupil/Pupil_Output/')

else:
    print("WRONG CHOICE !!")
