const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Patient = require('../models/Patient');
const Record = require('../models/Record');

//@desc        Get all records
//@route       GET /records
//@route       GET /patients/:patientId/records
//@access      Public
exports.getRecords = asyncHandler(async (req, res, next) => {
    let query;
	if (req.params.patientId) {
		query = await Record.find({ patient: req.params.patientId });

	} else {
		query = Record.find().populate({
            path: 'patient',
            select: 'name diagnosis description'
        });
    }

    const records = await query;
    res.status(200).json({
        success: true,
        count: records.length,
        data: records,
    });

});


//@desc        Get single record
//@route       GET /records/:id
//@access      Public
exports.getRecord = asyncHandler(async (req, res, next) => {
    const record = await Record.findById(req.params.id).populate({
        path: 'patient',
        select: 'name diagnosis description'
    });

    if (!record){
        return next(
            new ErrorResponse(`No record found with id of ${req.params.id}`), 404
        );
    };

    res.status(200).json({
        success: true,
        data: record
    })
});

//@desc        Add new record
//@route       POST /patients/:patientId/records
//@access      Private
exports.createRecord = asyncHandler(async (req, res, next) => {
    req.body.patient = req.params.patientId;

    const patient = await Patient.findById(req.params.patientId);

    if (!patient){
        return next(
            new ErrorResponse(`No patient found with id of ${req.params.patientId}`), 404
        );
    };

    const record = await Record.create(req.body)

    res.status(200).json({
        success: true,
        data: record
    })
});


//@desc        Update record
//@route       PUT /records/:id
//@access      Private
exports.updateRecord = async (req, res, next) => {
    try {
        const record = await Record.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!record){
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success:true, data: record });
    } catch (err) {
        res.status(400).json({ success: false });
    }

}

//@desc        Delete record
//@route       DELETE /records/:id
//@access      Private
exports.deleteRecord = async (req, res, next) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record){
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success:true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}