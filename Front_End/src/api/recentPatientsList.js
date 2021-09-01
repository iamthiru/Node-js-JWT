import Api from '.';
 const recentPatientsListAPI = (token,userId) => {
    //  http://localhost:3004/patient/recentPatient/1
  return new Promise((resolve, reject) => {
    Api.get(`patient/recentPatient/${userId}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: `Bearer ${token}`
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export default recentPatientsListAPI
