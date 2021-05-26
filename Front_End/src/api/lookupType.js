import Api from '.';

export const lookupTypeAPI = (token) => {
  return new Promise((resolve, reject) => {
    Api.get('patient/getLookupType', {
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
