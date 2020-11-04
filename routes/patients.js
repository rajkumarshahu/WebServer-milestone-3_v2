const express = require('express');
const {
	getPatients,
	getPatient,
	createpatient,
	updatePatient,
    deletePatient,
    patientPhotoUpload
} = require('../controllers/patients');

// Include records resource routers
const recordRouter = require('./records')

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:patientId/records', recordRouter);

router.route('/:id/photo').put(protect, authorize('doctor', 'admin'), patientPhotoUpload);

router
    .route('/')
    .get(getPatients)
    .post(protect, authorize('doctor', 'admin'), createpatient)

router
    .route('/:id')
    .get(getPatient)
    .put(protect, authorize('doctor', 'admin'), updatePatient)
    .delete(protect, authorize('doctor', 'admin'), deletePatient);

module.exports = router;