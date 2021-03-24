import cv2
import numpy as np


def Video_Brighten_Regenerate(filename):
    target_val = 0.7
    frame_gen = []
    video = cv2.VideoCapture('./static/Pupil_Input_Videos/' + filename)
    fps = video.get(cv2.CAP_PROP_FPS)

    while video.isOpened():
        ret, frame = video.read()

        if ret:
            im = frame
            cols, rows, _ = im.shape
            brightness = np.sum(im) / (255 * cols * rows)
            alpha = brightness / target_val
            bright_img = cv2.convertScaleAbs(im, alpha=alpha, beta=0)
            frame_gen.append(bright_img)

            if cv2.waitKey(1) == 27 or 0xFF == ord('q'):
                break
        else:
            break

    out_path = './static/Pupil_Input_Videos/' + filename
    out = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'DIVX'), fps, (rows, cols))

    for i in range(len(frame_gen)):
        out.write(frame_gen[i])

    out.release()
    video.release()
    cv2.destroyAllWindows()
