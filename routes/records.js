const express = require('express');
const {
	getRecords,
	getRecord,
	createRecord,
	updateRecord,
	deleteRecord,
} = require('../controllers/records');


const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getRecords)
    .post(createRecord)

router
    .route('/:id')
    .get(getRecord)
    .put(updateRecord)
    .delete(deleteRecord);

module.exports = router;