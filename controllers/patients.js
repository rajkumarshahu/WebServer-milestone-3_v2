const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc        Get all patients
//@route       GET /patients
//@access      Public
exports.getPatients = async (req, res, next) => {
	try {
		const patients = await Patient.find().populate('records');
		res
			.status(200)
			.json({ success: true, patientCount: patients.length, data: patients });
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

//@desc        Get single patient
//@route       GET /patients/:id
//@access      Public
exports.getPatient = async (req, res, next) => {
	try {
		const patient = await Patient.findById(req.params.id);
		if (!patient) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({ success: true, data: patient });
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

//@desc        Add new patient
//@route       POST /patients
//@access      Private
exports.createpatient = async (req, res, next) => {
	try {
		const patient = await Patient.create(req.body);
		res.status(201).json({
			success: true,
			data: patient,
		});
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

//@desc        Update patient
//@route       PUT /patients/:id
//@access      Private
exports.updatePatient = async (req, res, next) => {
	try {
		const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!patient) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({ success: true, data: patient });
	} catch (err) {
		res.status(400).json({ success: false });
	}
};

//@desc        Delete patient
//@route       DELETE /patients/:id
//@access      Private
exports.deletePatient = asyncHandler(async (req, res, next) => {
	const patient = await Patient.findById(req.params.id);
	if (!patient) {
		return next(
			new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
		);
	}
	patient.remove();
	res.status(400).json({ success: true, data: {} });
});

// @desc    Upload photo of a patient
// @route   PUT /patients/:id/photo
// @access  Private
exports.patientPhotoUpload = asyncHandler(async (req, res, next) => {
	const patient = await Patient.findById(req.params.id);

	if (!patient) {
		return next(
			new ErrorResponse(`Patient not found with id of ${req.params.id}`, 404)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}

	// Check file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	// Create custom filename
	file.name = `photo_${patient._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		const patient = await Patient.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});

		res.status(200).json({
			success: true,
			data: patient,
		});
	});

	console.log(req.files.file);
});
