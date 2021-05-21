import Api from '.';

export const addPatientAPI = (newPatientData, token) => {
  return new Promise((resolve, reject) => {
    Api.post(`patient/add`, JSON.stringify(newPatientData), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // "x-acces-token": token
        // authorization: `Bearer ${token}`,
        authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTMzMzIzMiwiZXhwIjoxNjIxOTM4MDMyfQ.Zs1KCjzEKemQmEoyG2aOPyv8pD6D00QwsFROrgIZNVE`
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
        authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTMzMzIzMiwiZXhwIjoxNjIxOTM4MDMyfQ.Zs1KCjzEKemQmEoyG2aOPyv8pD6D00QwsFROrgIZNVE`

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
