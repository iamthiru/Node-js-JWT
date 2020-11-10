import cv2
from scipy.spatial import distance as dist
import glob
import pandas as pd
import matplotlib.pyplot as plt


# GridLine Function
def draw_grid(img, line_color=(0, 255, 0), thickness=1, type_=cv2.LINE_AA, pxstep=20, pystep=20):
    x = pxstep
    y = pystep
    while x < img.shape[1]:
        cv2.line(img, (x, 0), (x, img.shape[0]), color=line_color, lineType=type_, thickness=thickness)
        x += pxstep
    while y < img.shape[0]:
        cv2.line(img, (0, y), (img.shape[1], y), color=line_color, lineType=type_, thickness=thickness)
        y += pystep


# Mouse Click Record
def mousePoints(event, x, y, flags, params):
    if event == cv2.EVENT_LBUTTONDOWN:
        p_current.append([x, y])
        print(p_current)


########################## MAIN ############################
filenames = glob.glob(r"/Users/pranavdeo/Desktop/Results/Frames/*.png")
filenames.sort()
images = [cv2.imread(img) for img in filenames]

point_total = []
count = 0
for image in images:
    if count <= 5:
        p_current = []
        img_copy = image
        src = cv2.cvtColor(img_copy, cv2.COLOR_BGR2GRAY)
        img_copy = cv2.equalizeHist(src)
        draw_grid(img_copy)
        cv2.imshow('out', img_copy)
        cv2.setMouseCallback('out', mousePoints)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        print('Frame Done! Loading Next Frame')
        point_total.append(p_current)
        print(len(point_total))
        count = count + 1

point_total
point_total[0][0]
iris_radius = []
pupil_radius = []
for points in point_total:
    print(points[0], points[3])
    Iris_D = dist.euclidean(points[0], points[3])
    print(Iris_D)
    iris_radius.append(Iris_D / 2)
    Pupil_D = dist.euclidean(points[1], points[2])
    pupil_radius.append(Pupil_D / 2)
    print(Pupil_D)
len(pupil_radius)

data = []
for a, b in zip(iris_radius, pupil_radius):
    data.append([a, b])

df = pd.DataFrame(data, columns=['Iris R', 'Pupil R'])
P_by_I = [p / i for i, p in zip(iris_radius, pupil_radius)]
df['P/I Ratio'] = P_by_I
df.to_csv('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Manual_Pupil_Iris/Manual_File.csv', index=False)

plt.xlabel('Frame')
plt.ylabel('P/I Ratio')
plt.plot(P_by_I)
plt.savefig('/Users/pranavdeo/PycharmProjects/FaceEmotionRecognition/static/Manual_Pupil_Iris/Manual_Plot.png')
