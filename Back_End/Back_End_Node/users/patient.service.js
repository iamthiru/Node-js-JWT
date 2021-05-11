const pool = require('../_helpers/db');

module.exports = {
    addNewPatient,
    getAllPatientList,
    createAssessment
};


async function addNewPatient(data) {
    const SQL = `INSERT INTO patient(first_name,last_name,dob,eyeColor,gender,medical_record_no,createdBy) VALUE(?,?,?,?,?,?,?)`;
    params = [data.firstName, data.lastName, data.dob, data.eyeColor, data.gender, data.medicalRecordNo, data.createdBy]
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

async function createAssessment(data){
    const SQL = `INSERT INTO assessment(patient_id,assessment_datetime,type,current_pain_score,
    least_pain_score,most_pain_score,pain_location_id,pain_quality_id,pain_frequency_id,description,pain_impact_id,
    pupillary_dilation,facial_expression,note,total_score,createdAt,createdBy) 
    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    params = [data.patient_id,data.assessment_datetime,data.type,data.current_pain_score,data.least_pain_score,data.most_pain_score,data.pain_location_id,data.pain_quality_id,data.pain_frequency_id,
        data.description,data.pain_impact_id,data.pupillary_dilation,data.facial_expresssion,data.note,data.total_score,data.createdAt,data.createdBy
    ]
     const assessment = await new Promise((resolve, reject) => {
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
    })
    let reminder ={};
    if(data.isReminder) {
        const SQL2 = `INSERT INTO reminder (patient_id,reminder_datetime,frequency,createdAt,createdBy) VALUE(?,?,?,?,?)`;
        params2 = [data.patient_id, data.reminder_datetime, data.frequency, data.createdAt, data.createdBy]
        reminder = await new Promise((resolve, reject) => {
            pool.query(SQL2, params2, (err, result) => {
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
            })
        })
        console.log(reminder);
        if (assessment.result.affectedRows && reminder.result.affectedRows) {
            return {
                message: 'ASSESSMENT_AND_REMINDER_CREATED_SUCCESSFULLY'
            }
        } else {
            return {
                message: 'ASSESSMENT_FAILED'
            }
        }
    }
    if(assessment.result.affectedRows){
        return {message:'ASSESSMENT_CREATED_SUCCESSFULLY'}
    }
    return {};
}

