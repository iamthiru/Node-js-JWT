# Algorithmic Flow
## Validator

(C) Copyright: Benten Technologies, Inc.

***

### Package Import
> Lines 12
* **NumPy** (For numerical computations)

### Function Definitions
#### A. Radius_Validity_Check
`Function parameters: { radius, input_lst, fr_nm, tag }`
> Lines 17-38
* IF this check is happening for 'Pupil'
  * IF this is not the first frame
    * Compute allowable drop in Pupil data OR value ('drop_P') as 0.85 * mean(Pupil_Detection_History); Basically we allow it to drop up to 15%. We allow the Pupil value to fluctuate but restrict it to control false detections
    * Compute allowable surge in Pupil data OR value ('surge_P') as 1.15 * mean(Pupil_Detection_History); Basically we allow it to surge by up to 15%. We allow the Pupil value to fluctuate but restrict it to monitor false detections
    * IF this is not the first frame AND detected pupil radius is outside the range of drop_P or surge_P 
      * Compute 'R' (corrected Pupil Radius) as mean(Pupil_Detection_History)
    * Else:
      * Computer 'R' (corrected Pupil Radius) as the same detected pupil radius
  * Else IF this is the first frame for detection: 
    * Computer 'R' (corrected Pupil Radius) as the same detected pupil radius, because we have no pupil detection history
* Else IF this check is happening for 'Iris'
  * IF this is not the first frame
    * Compute allowable drop in Iris data OR value ('drop_I') as 0.95 * mean(Iris_Detection_History); Basically we allow it to drop up to 5%. We don't want the Iris value to fluctuate since Iris radius should be same; but still 5% for safety
    * Compute allowable surge in Iris data OR value ('surge_I') as 1.05 * mean(Iris_Detection_History); Basically we allow it to surge by up to 5%. We don't want the Iris value to fluctuate since Iris radius should be same; but still 5% for safety
    * IF this is not the first frame AND detected iris radius is outside the range of 'drop_I' or 'surge_I'
      * Compute 'R' (corrected Iris Radius) as mean(Iris_Detection_History)
    * Else:
      * Computer 'R' (corrected Iris Radius) as the same detected iris radius
  * Else IF this is the first frame for detection: 
    * Computer 'R' (corrected Iris Radius) as the same detected iris radius, because we have no iris detection history
* Return 'R' (Corrected Radius)
