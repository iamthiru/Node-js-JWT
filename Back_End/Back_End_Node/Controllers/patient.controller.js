const express = require('express');
const router = express.Router();
const patientService = require('../users/patient.service');


// routes
router.post('/add', addPatient);
router.get('/getPatientList', getPatienList);

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