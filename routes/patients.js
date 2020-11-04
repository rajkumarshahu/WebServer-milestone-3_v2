const express = require('express');
const {
	getPatients,
	getPatient,
	createpatient,
	updatePatient,
	deletePatient,
} = require('../controllers/patients');

// Include records resource routers
const recordRouter = require('./records')

const router = express.Router();

// Re-route into other resource routers
router.use('/:patientId/records', recordRouter);

router
    .route('/')
    .get(getPatients)
    .post(createpatient)

router
    .route('/:id')
    .get(getPatient)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;