import Api from '.';

const createMedicationAPI= (medication, token) => {
  return new Promise((resolve, reject) => {
    Api.post('patient/createMedication', JSON.stringify(medication), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // authorization: `Bearer ${token}`,
        authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTk0MTU3OCwiZXhwIjoxNjIyNTQ2Mzc4fQ.khhr8Om9sxooZ8hlX_2Rbvhu0Ia_ecvEh023tu1K_Pk`
        // authorization:`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyMTMzMzIzMiwiZXhwIjoxNjIxOTM4MDMyfQ.Zs1KCjzEKemQmEoyG2aOPyv8pD6D00QwsFROrgIZNVE`
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

export default createMedicationAPI;
