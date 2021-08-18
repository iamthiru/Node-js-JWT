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
* IF 'tag' is 'pupil'
  * IF length of current frame > 0
    * Compute 'drop_P' as 0.85 * np.mean(input_lst)
    * Compute 'surge_P' as (0.15 + 1) * np.mean(input_lst)
    * IF length of current frame > 0 AND radius is in range of drop_P or surge_P 
      * Compute 'R' as mean of input_lst
    * Else:
      * Computer 'R' as radius
  * Else: 
    * Computer 'R' as radius
* Else:
  * IF length of current frame > 0
    * Compute 'drop_I' as 0.95 * np.mean(input_lst)
    * Compute 'surge_I' as (1 + 0.5) * np.mean(input_lst)
    * IF length of current frame > 0 AND radius is in range of drop_P or surge_P
      * Compute 'R' as mean of input_lst
    * Else:
      * Computer 'R' as radius
  * Else: 
    * Computer 'R' as radius
* Return R
