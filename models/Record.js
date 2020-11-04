const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    bodyTemperature: {
        type: Number,
        required: [true, 'Please add Body Temperature']
    },
    pulseRate:{
        type: Number,
        required: [true, 'Please add pulse rate']
    },

    respirationRate: {
        type: Number,
        required: [true, 'Please add respiration rate']
    },
    systolicBP:{
        type: Number,
        required: [true, 'Please add systolic bp']
    },
    diastolicBP:{
        type: Number,
        required: [true, 'Please add diastolic bp']
    },

    o2Sat: {
        type: Number,
        required: [true, 'Please add oxygen saturation']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    patient: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: true
    }
});

module.exports = mongoose.model('Record', RecordSchema);