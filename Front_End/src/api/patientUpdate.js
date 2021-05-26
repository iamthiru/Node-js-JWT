import Api from '.'
const patientUpdateApi = (patientData,token) =>{
    return new Promise((resolve,reject)=>{
        Api.post('patient/editPatient',JSON.stringify(patientData),{
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                authorization: `Bearer ${token}`
            }
        })
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}
export default patientUpdateApi     
