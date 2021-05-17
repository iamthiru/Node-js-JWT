const pool = require('../_helpers/db');

module.exports = {
    addNewPatient,
    getAllPatientList,
    createAssessment,
    getAssessmentByPatientId,
    getLookUp,
    getLookUpTypeList,
    createMedication,
    getMedicationList,
    getPatientLastAssessmentAndMedication
};


async function addNewPatient(data) {
    const SQL = `INSERT INTO patient(first_name,last_name,dob,eyeColor,gender,medical_record_no,createdBy) VALUE(?,?,?,?,?,?,?)`;
    params = [data.firstName, data.lastName, data.dob, data.eyeColor, data.gender, data.medicalRecordNo, data.createdBy];
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
    params = [];
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

async function createAssessment(data) {
    data.createdAt = new Date();
    data.isDeleted = false;
    console.log(parseInt(data.createdAt));
    const SQL = `INSERT INTO assessment(patient_id,assessment_datetime,type,current_pain_score,
    least_pain_score,most_pain_score,pain_location_id,pain_quality_id,pain_frequency_id,description,pain_impact_id,
    pupillary_dilation,facial_expression,note,total_score,createdAt,createdBy,isDeleted) 
    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    params = [data.patient_id, data.assessment_datetime, data.type, data.current_pain_score, data.least_pain_score, data.most_pain_score, data.pain_location_id, data.pain_quality_id, data.pain_frequency_id,
        data.description, data.pain_impact_id, data.pupillary_dilation, data.facial_expresssion, data.note, data.total_score, data.createdAt, data.createdBy,data.isDeleted
    ];
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
    });
    let reminder = {};
    if (data.isReminder) {
        const SQL2 = `INSERT INTO reminder (patient_id,reminder_datetime,frequency,createdAt,createdBy) VALUE(?,?,?,?,?)`;
        params2 = [data.patient_id, data.reminder_datetime, data.frequency, data.createdAt, data.createdBy];
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
        });
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
    if (assessment.result.affectedRows) {
        return {message: 'ASSESSMENT_CREATED_SUCCESSFULLY'}
    }
    return {};

}

async function getAssessmentByPatientId(data){
    const SQL =`SELECT * from assessment left join reminder on assessment.patient_id = reminder.patient_id WHERE assessment.patient_id ='${data.patientId}'`;
    const assessment = await new Promise((resolve, reject) => {
        pool.query(SQL, (err, result) => {
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
    });
    return assessment;
}

async function getLookUp(){
    const SQL = `SELECT id,lookupTypeId,displayValue,categoryId from lookup where isDeleted = 0`;
    const lookup = await new Promise((resolve, reject) => {
        pool.query(SQL, (err, result) => {
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
    });
    return lookup;
}

async function getLookUpTypeList(){
    const SQL = `SELECT id,lookupType,descripion,parentLookupTypeId from lookuptype where isDeleted = 0`;
    const lookup = await new Promise((resolve, reject) => {
        pool.query(SQL, (err, result) => {
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
    });
    return lookup;
}

async function createMedication(data){
    data.isDeleted = false;
    const SQL = 'INSERT INTO patient_medication(patient_id,medication_class_id,medication_id,dosage_number,dosage_unit_id,frequency,isActive,createdBy,createdAt,isDeleted) value(?,?,?,?,?,?,?,?,?,?)';
    param = [data.patient_id,data.medication_class_id,data.medication_id,data.dosage_number,data.dosage_unit_id,data.frequency,data.isActive,data.createdBy,data.createdAt,data.isDeleted];
    const  medication = await new Promise((resolve, reject) => {
        pool.query(SQL, param, (err, result) => {
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
    });
    console.log(medication);
    if(medication.result.affectedRows){
        return{
            isError:false,
            message:'medication_created_successfully'
        }
    }else{
        return{
            isError:true,
            message:'medication_creation_failed'
        }
    }
}


async function getMedicationList(patientId){
    const SQL = 'SELECT * from patient_medication where patient_id = ? AND isDeleted = ?';
    param = [patientId,false];
    const  list = await new Promise((resolve, reject) => {
        pool.query(SQL, param, (err, result) => {
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
    });
    return list;
}

async function getPatientLastAssessmentAndMedication(patientId){
    const SQL = `SELECT * from assessment where patient_id =? and isDeleted =? order by id desc`;
    params = [patientId,false];
    const assessment = await new Promise((resolve, reject)=> {
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
                    result: result,
                })
            }
        })
    });
    const SQL2 = `SELECT * FROM patient_medication where patient_id =? and isDeleted=? order by id desc`;
    const medication  = await new Promise((resolve, reject)=>{
        pool.query(SQL2, params, (err, result) =>{
            if(err){
                console.log(err);
                resolve({
                    isError:true,
                    error:err,
                })
            }else{
                resolve({
                    isError:false,
                    result:result,
                })
            }
        })
    });
     let data = {
        assessment :assessment && assessment.result[0]?assessment.result[0]:{},
        medication: medication && medication.result[0]?medication.result[0]:{}
     };

     return{
         isError:false,
         result:data,
     }
}




