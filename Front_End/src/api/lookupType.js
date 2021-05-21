import Api from '.';

export const lookupTypeAPI = (token) => {
  return new Promise((resolve, reject) => {
    Api.get('patient/getLookupType', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // authorization: `Bearer ${token}`,
        authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTMzMzIzMiwiZXhwIjoxNjIxOTM4MDMyfQ.Zs1KCjzEKemQmEoyG2aOPyv8pD6D00QwsFROrgIZNVE`
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
