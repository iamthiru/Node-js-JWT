import Api from '.';

const lastMedicationAssessmentAPI = (token, patientId) => {
  return new Promise((resolve, reject) => {
    Api.get(`patient/lastMedicationAndAssessment/${patientId}`, {
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

export default lastMedicationAssessmentAPI;
