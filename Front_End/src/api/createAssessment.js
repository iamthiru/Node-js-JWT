import Api from '.';

export const createAssessmentAPI = (assement, token) => {
  return new Promise((resolve, reject) => {
    Api.post('patient/createAssessment', JSON.stringify(assement), {
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

export default createAssessmentAPI;
