import Api from '.';

export const addPatientAPI = (newPatientData, token) => {
  return new Promise((resolve, reject) => {
    Api.post(`patient/add`, JSON.stringify(newPatientData), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        resolve(res);
        console.log('-----Newly Added Patient-----', res);
      })
      .catch((err) => {
        reject(err);
        console.log('----New  Added Patient Error-----', err);
      });
  });
};
export const getPatientListAPI = (token) => {
  return new Promise((resolve, reject) => {
    Api.get('patient/getPatientList',{
      headers :{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // authorization: `Bearer ${token}`,
        authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTk0MTU3OCwiZXhwIjoxNjIyNTQ2Mzc4fQ.khhr8Om9sxooZ8hlX_2Rbvhu0Ia_ecvEh023tu1K_Pk`
        
        // authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTMzMzIzMiwiZXhwIjoxNjIxOTM4MDMyfQ.Zs1KCjzEKemQmEoyG2aOPyv8pD6D00QwsFROrgIZNVE`

      }
    })
      .then((res) => {
        resolve(res);
        console.log('------All Patient List Success---', res);
      })
      .catch((err) => {
        reject(err);
        console.log('-----All Patient List Error---- ', err);
      });
  });
};
