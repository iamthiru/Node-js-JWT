const express = require('express');
const router = express.Router();
const patientService = require('../services/patient.service');


// routes
router.post('/add', addPatient);
router.get('/getPatientList', getPatienList);
router.post('/createAssessment', newAssessment);
router.get('/assessmentList',getAssessment);
router.get('/lookupData',getLookupData);
router.get('/getLookupType',getLookupType);
router.post('/createMedication',createMedication);
router.get('/medicationList/:patientId',getMedicationList);
router.get('/lastMedicationAndAssessment/:patientId',getPatientLastAssessmentAndMedication);
router.post('/editPatient',editPatientDetails);
router.get('/recentPatient/:createdBy',getRecentPatientDetails);
router.delete('/deletePatient/:id', deletePatient);
router.put('/updateAssessment', updateAssessment);


module.exports = router;

function deletePatient(req, res, next) {
  patientService
    .deletePatientById(req.params.id)
    .then((data) => res.json(data))
    .catch(next);
}

function updateAssessment(req, res, next) {
  patientService
    .updateAssessmentById(req.body)
    .then((data) => res.json(data))
    .catch(next);
}

function addPatient(req, res, next) {
    patientService.addNewPatient(req.body)
        .then(data => res.json(data))
        .catch(next);
}

// function getPatienList(req, res, next) {
//     const userId = req.query.userId;
//     patientService.getPatientListByUserId(userId)
//         .then(users => res.json(users))
//         .catch(next);
// }
function getPatienList(req, res, next) {
    patientService.getAllPatientList()
        .then(users => res.json(users))
        .catch(next);
}


function newAssessment(req, res, next) {
    patientService.createAssessment(req.body)
        .then(data => res.json(data))
        .catch(next);
}

function getAssessment(req,res,next){
    console.log(req.body);
    patientService.getAssessmentByPatientId()
        .then(data=> res.json(data))
        .catch(next);
}

function getLookupData(req,res,next){
    patientService.getLookUp()
        .then(data => res.json(data))
        .catch(next);
}

function getLookupType(req,res,next){
    patientService.getLookUpTypeList()
        .then(data => res.json(data))
        .catch(next);
}

function createMedication(req,res,next){
    patientService.createMedication(req.body)
        .then(data => res.json(data))
        .catch(next);

}

function getMedicationList(req,res,next){
    patientService.getMedicationList(req.params.patientId)
        .then(data => res.json(data))
        .catch(next);
}

function getPatientLastAssessmentAndMedication(req,res,next){
    patientService.getPatientLastAssessmentAndMedication(req.params.patientId)
        .then(data => res.json(data))
        .catch(next);
}

function editPatientDetails(req,res,next){
    patientService.updatePatientDetails(req.body)
        .then(data=>res.json(data))
        .catch(next);
}

function getRecentPatientDetails(req,res,next){
    patientService.getRecentPatientDetails(req.params.createdBy)
        .then(data=>res.json(data))
        .catch(next);
}