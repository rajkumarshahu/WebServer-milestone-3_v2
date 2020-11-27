let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
var request = require('supertest');

// Assertion type
chai.should();

chai.use(chaiHttp);

const userCredentials = {
	adminUser : {
		email: 'johndoe@gmail.com',
		password: '123456'
	},
	doctorUser : {
		email: 'raj@gmail.com',
		password: '123456'
	},
	nurseUser : {
		email: 'janesmith@gmail.com',
		password: '123456'
	},
};
const authenticatedUser = request.agent(server);

let patId = null;
let token;
let patient = {
	name: 'Test patient 5532355',
	age: 44,
	phone: '(555) 555-5555',
	email: 'test@gmail.com',
	address: '240 Test Address M5Y 1H9',
	diagnosis: 'Test Diagnosis',
	description: 'Test Description',
	isCritical: true,
};

describe('Should check patient end points', () => {
	before(function (done) {
		authenticatedUser
			.post('/auth/login')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.send(userCredentials.adminUser)
			.end(function (err, res) {
				if (err) throw err;
				token = res.body.token;
				done();
			});
	});

	describe('GET /patients', () => {
		it('Should get all the patients', (done) => {
			chai
				.request(server)
				.get('/patients')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					res.body.should.be.a('object');
					res.body.data.length.should.be.eq(res.body.patientCount);
					done();
				});
		});
		it('Should not get all the patients', (done) => {
			chai
				.request(server)
				.get('/patient')
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});

	describe('POST /patients', () => {
		it('Should create a patient', (done) => {
			chai
				.request(server)
				.post('/patients')
				.set({ Authorization: `Bearer ${token}` })
				.send(patient)
				.end((err, res) => {
					patId = res.body.data._id;
					res.should.have.status(201);
					res.body.data.name.should.be.eq(patient.name);
					res.body.data.email.should.be.eq(patient.email);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('photo');
					done();
				});
		});

		it('Should not create a patient with duplicate email', (done) => {
			chai
				.request(server)
				.post('/patient')
				.set({ Authorization: `Bearer ${token}` })
				.send(patient)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});

		it('Should not create a patient without name', (done) => {
			delete patient.name;
			chai
				.request(server)
				.post('/patient')
				.set({ Authorization: `Bearer ${token}` })
				.send(patient)
				.end((err, res) => {
					res.should.have.status(404);
					done();
				});
		});
	});

	describe('GET /patient/:id', () => {
		it('Should get single patient', (done) => {
			chai
				.request(server)
				.get(`/patients/${patId}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('photo');
					res.body.success.should.be.eq(true);
					done();
				});
		});
		it('Should throw error when trying to get non existing patient', (done) => {
			const patientId = '5d725a037b292f5f8ceff704';
			chai
				.request(server)
				.get(`/patients/${patientId}`)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.error.should.be.eq(
						`Patient not found with id of ${patientId}`
					);
					done();
				});
		});
	});

	describe('PUT /patients/:id', () => {
		it('Should update a patient', (done) => {
			patient = {
				...patient,
				diagnosis: 'Test Diagnosis update',
				description: 'Test Description update',
				isCritical: true,
			};
			chai
				.request(server)
				.put(`/patients/${patId}`)
				.set({ Authorization: `Bearer ${token}` })
				.send(patient)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.diagnosis.should.be.eq(patient.diagnosis);
					res.body.data.description.should.be.eq(patient.description);
					done();
				});
		});

		it('Should throw error if trying to update non existing patient', (done) => {
			const patientId = '5d725a037b292f5f8ceff704';
			chai
				.request(server)
				.put(`/patients/${patientId}`)
				.set({ Authorization: `Bearer ${token}` })
				.send(patient)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.error.should.be.eq(
						`Patient not found with id of ${patientId}`
					);
					done();
				});
		});
	});

	describe('DELETE /patients/:id', () => {
		it('Should delete a patient', (done) => {
			chai
				.request(server)
				.delete(`/patients/${patId}`)
				.set({ Authorization: `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.success.should.be.eq(true);
					done();
				});
		});
		it('Should throw error if trying to delete non existing patient', (done) => {
			const patientId = '5d725a037b292f5f8ceff704';
			chai
				.request(server)
				.delete(`/patients/${patientId}`)
				.set({ Authorization: `Bearer ${token}` })
				.end((err, res) => {
					res.should.have.status(404);
					res.body.error.should.be.eq(
						`Patient not found with id of ${patientId}`
					);
					done();
				});
		});
	});
});
