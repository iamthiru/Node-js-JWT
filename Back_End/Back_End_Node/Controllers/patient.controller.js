const express = require('express');
const router = express.Router();
const patientService = require('../users/patient.service');


// routes
router.post('/add', addPatient);
router.get('/getPatientList', getPatienList);
router.post('/createAssessment', newAssessment);
router.post('/assessmentList',getAssessment);

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
    patientService.getAssessmentByPatientId(req.body)
        .then(data=> res.json(data))
        .catch(next);
}

