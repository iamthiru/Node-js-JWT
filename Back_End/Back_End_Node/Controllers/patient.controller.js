const express = require('express');
const router = express.Router();
const patientService = require('../users/patient.service');


// routes
router.post('/add', addPatient);
router.get('/getPatientList', getPatienList);
router.post('/createAssessment', newAssessment);
router.get('/assessmentList',getAssessment);
router.get('/lookupData',getlookupData);
router.get('/getLookupType',getLookupType)

module.exports = router;

function addPatient(req, res, next) {
    patientService.addNewPatient(req.body)
        .then(data => res.json(data))
        .catch(next);
}

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
    patientService.getAssessmentByPatientId(req.body)
        .then(data=> res.json(data))
        .catch(next);
}

function getlookupData(req,res,next){
    patientService.getLookUp()
        .then(data => res.json(data))
        .catch(next);
}

function getLookupType(req,res,next){
    patientService.getLookUpTypeList()
        .then(data => res.json(data))
        .catch(next);
}

