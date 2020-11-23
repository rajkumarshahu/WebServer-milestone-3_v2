// /**
//  * @swagger
//  * tags:
//  *     description: "Fetch all patients from database"
//  * /patients:
//  *   get:
//  *      summary: Get All Patients
//  *      tags:
//  *          - Patients
//  *      description: Fetch all patients from database
//  *      parameters:
//  *        - name: Authorization
//  *          in: header
//  *          required: false
//  *          default: 'Bearer {token}'
//  *          type: string
//  *      produces:
//  *        - application/json
//  *      responses:
//  *       200:
//  *         description: Return a list with count (total patients)
//  */

// /**
//  * @swagger
//  * /patients:
//  *   post:
//  *      summary: Create New Patient
//  *      tags:
//  *          - Patients
//  *      operationId: CreateNewPatient
//  *      deprecated: false
//  *      produces:
//  *          - application/json
//  *      consumes:
//  *          - application/json
//  *      parameters:
//  *          - name: Authorization
//  *            in: header
//  *            required: false
//  *            default: 'Bearer {token}'
//  *            type: string
//  *          - name: Content-Type
//  *            in: header
//  *            required: true
//  *            type: string
//  *            description: JSON Type
//  *          - name: Body
//  *            in: body
//  *            required: true
//  *            description: ''
//  *            schema:
//  *              $ref: '#/definitions/CreateNewPatientRequest'
//  *      responses:
//  *          '200':
//  *          description: ''
//  *          headers: {}
//  */


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

// Protect and authorize middlewares
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