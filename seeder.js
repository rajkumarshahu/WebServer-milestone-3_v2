const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Patient = require('./models/Patient');
const Record = require('./models/Record');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// Read JSON files
const patients = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/patients.json`, 'utf-8')
);

const records = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/records.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
	try {
		await Patient.create(patients);
		await Record.create(records);
		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Patient.deleteMany();
		await Record.deleteMany();
		console.log('Data Destroyed...'.red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
