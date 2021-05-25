import Api from '.';
 const assessmentListAPI = (token) => {
  return new Promise((resolve, reject) => {
    Api.get('patient/assessmentList', {
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
export default assessmentListAPI
