const express = require('express');
const {
	getRecords,
	getRecord,
	createRecord,
	updateRecord,
	deleteRecord,
} = require('../controllers/records');


const router = express.Router({ mergeParams: true });

// Protect and authorize middlewares
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getRecords)
    .post(protect, createRecord)

router
    .route('/:id')
    .get(getRecord)
    .put(protect, updateRecord)
    .delete(protect, authorize('doctor', 'admin'), deleteRecord);

module.exports = router;