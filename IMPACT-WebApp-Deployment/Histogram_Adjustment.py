import cv2
import numpy as np


def Video_Brighten_Regenerate(filename):
    target_val = 50
    frame_gen = []
    video = cv2.VideoCapture('./static/Pupil_Input_Videos/' + filename)
    fps = video.get(cv2.CAP_PROP_FPS)

    while video.isOpened():
        ret, frame = video.read()

        if ret:
            im = frame
            im = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
            cols, rows = im.shape
            brightness = np.sum(im) / (cols * rows)
            # print(brightness)
            # alpha = brightness / target_val
            # TODO alpha = 1, adjust beta value
            bright_img = cv2.convertScaleAbs(im, alpha=1, beta=np.abs(target_val - brightness))
            final_img = cv2.cvtColor(bright_img, cv2.COLOR_GRAY2BGR)
            frame_gen.append(final_img)

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
