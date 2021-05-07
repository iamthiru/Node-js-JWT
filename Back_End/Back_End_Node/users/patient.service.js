const pool = require('../_helpers/db');

module.exports = {
    addNewPatient,
    getAllPatientList
};


async function addNewPatient(data) {
    const SQL = `INSERT INTO patient(first_name,last_name,dob,gender,medical_record_no,createdBy) VALUE(?,?,?,?,?,?)`;
    params = [data.firstName, data.lastName, data.dob, data.gender, data.medicalRecordNo, data.createdBy]
    return new Promise((resolve, reject) => {
        pool.query(SQL, params, (err, result) => {
            if (err) {
                console.log(err);
                resolve({
                    isError: true,
                    error: err,
                })
            } else {
                resolve({
                    isError: false,
                    result: result
                })
            }
        });
    });
}


async function getAllPatientList() {
    const SQL = `select * from patient`;
    params = []
    return new Promise((resolve, reject) => {
        pool.query(SQL, params, (err, result) => {
            if (err) {
                console.log(err);
                resolve({
                    isError: true,
                    error: err,
                })
            } else {
                resolve({
                    isError: false,
                    result: result
                })
            }
        });
    });
}