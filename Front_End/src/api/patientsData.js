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
export const getPatientListAPI = (token, userId) => {
  return new Promise((resolve, reject) => {
    // Api.get(`patient/getPatientList?userId=${userId}`
    Api.get('patient/getPatientList'
    ,{
      headers :{
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
         authorization: `Bearer ${token}`,
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
