import pandas as pd
import os
import numpy as np
import matplotlib.pyplot as plt

file=pd.read_csv(r'C:\Users\Nischal\Desktop\BioVid_data_processing\Eye_ClosureAU_43\gf097t1aaaff.csv')

AU_45c=file["AU_45c"]


video_fps=17 ## Changes with video
Average_eye_blink= 0.5 ## Seconds (unit)
num_steps= int(video_fps*Average_eye_blink)

def Sliding_Window_AU43(x_data, num_steps):
    # Create empty list of the size of AU_45c
    new = pd.DataFrame(np.zeros((len(x_data), 1)))
    new.columns = ["AU_43c"]
    # Loop over AU_45c and identify longer lists of eye closure detections
    for i in range(x_data.shape[0]):
        # compute a new (sliding window) index
        end_ix = i + num_steps
        # if index is larger than the size of the list, end loop
        if end_ix >= x_data.shape[0]:
            break
        # Compute product of the elements and check for 1 (Eye closure) over the num_steps
        score = x_data[i:end_ix]
        mult=np.prod(score)
        if mult==1.0:
            new["AU_43c"][i:end_ix]=1.0
    return new

new=Sliding_Window_AU43(AU_45c,num_steps+5)

# get the list of tuples from two lists.  
# and merge them by using zip().  
list_of_tuples = list(zip(AU_45c, new['AU_43c']))  
    
# Assign data to tuples.  
list_of_tuples   

# Converting lists of tuples into  
# pandas Dataframe.  
df = pd.DataFrame(list_of_tuples, 
                  columns = ['AU_45c', 'AU_43c'])  

df.to_csv(r'C:\Users\Nischal\Desktop\BioVid_data_processing\Eye_ClosureAU_43\43v45test.csv', index=False)