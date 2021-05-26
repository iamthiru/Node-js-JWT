import Api from '.'


const medicationListAPI =(token,patientId) =>{
    return new Promise((resolve,reject)=>{
        Api.get(`patient/medicationList/${patientId}`,{
            headers:
            {
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

export default medicationListAPI