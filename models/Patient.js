const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters'],
    },
    age:{
        type: Number,
        required: [true, 'Please add age']
    },

    phone: {
        type: String,
        maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    diagnosis: {
        type: String,
        required: [true, 'Please add diagnosis'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description can not be more than 500 characters'],
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    isCritical: {
        type: Boolean,
        default: false
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

// Delete records when a patient is deleted
PatientSchema.pre('remove', async function (next) {
	console.log(`Patient records being removed from patient with id: ${this._id}`);
	await this.model('Record').deleteMany({ patient: this._id });
	next();
});

// Reverse populate with virtualsß
PatientSchema.virtual('records', {
	ref: 'Record',
	localField: '_id',
	foreignField: 'patient',
	justOne: false,
});

module.exports = mongoose.model('Patient', PatientSchema);