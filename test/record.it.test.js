let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
var request = require('supertest');

// Assertion type
chai.should();

chai.use(chaiHttp);


const userCredentials = {
	email: 'johndoe@gmail.com',
	password: '123456',
};
const authenticatedUser = request.agent(server);

let recId = null;
let token;

let record = {
	bodyTemperature: 34,
	pulseRate: 89,
	respirationRate: 16,
	systolicBP: 80,
	diastolicBP: 120,
	o2Sat: 88,
};

describe('Should check record end points', () => {
	before(function (done) {
		authenticatedUser
			.post('/auth/login')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.send(userCredentials)
			.end(function (err, res) {
				if (err) throw err;
				token = res.body.token;
				done();
			});
	});

	describe('GET /patients/:patientId/records', () => {
		it('Should get all records of a patient', (done) => {
			const patientId = '5d713995b721c3bb38c1f5d0';
			chai
				.request(server)
				.get(`/patients/${patientId}/records`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.should.be.a('array');
					res.body.should.be.a('object');
					res.body.data.length.should.be.eq(res.body.count);
					done();
				});
		});

		it('Should show no records when trying to get record of non existing patient', (done) => {
			const patientId = '8d713995b721c3bb38c1f666';
			chai
				.request(server)
				.get(`/patients/${patientId}/records`)
				.end((err, res) => {
					res.body.data.length.should.be.eq(0);
					done();
				});
		});
	});

	describe('POST /patients/:patientId/records', () => {
		it('Should create a record of a patient', (done) => {
			const patientId = '5d713995b721c3bb38c1f5d0';
			chai
				.request(server)
				.post(`/patients/${patientId}/records`)
				.set({ Authorization: `Bearer ${token}` })
				.send(record)
				.end((err, res) => {
					console.log(res.body.data._id)
					recId = res.body.data._id;
					res.should.have.status(200);
					res.body.data.bodyTemperature.should.be.eq(record.bodyTemperature);
					res.body.data.o2Sat.should.be.eq(record.o2Sat);
					res.body.data.should.be.a('object');
					res.body.data.should.have.property('bodyTemperature');
					done();
				});
		});

		it('Should throw error when trying to create a record of a non existing patient', (done) => {
			const patientId = '8d713995b721c3bb38c1f666';
			chai
				.request(server)
				.post(`/patients/${patientId}/records`)
				.set({ Authorization: `Bearer ${token}` })
				.send(record)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.error.should.be.eq(
						`No patient found with id of ${patientId}`
					);

					done();
				});
		});
	});

	describe('PUT /records/:id', () => {
		it('Should update a record', (done) => {
			const rid = "5d713995b721c3bb38b2f129"
			record = {
				...record,
				bodyTemperature: 37,
				pulseRate: 80,
			};
			chai
				.request(server)
				.put(`/records/${rid}`)
				.set({ Authorization: `Bearer ${token}` })
				.send(record)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.data.bodyTemperature.should.be.eq(record.bodyTemperature);
					res.body.data.pulseRate.should.be.eq(record.pulseRate);
					done();
				});
		});

		it('Should throw error if trying to update non existing patient record', (done) => {
			const rid = '5d725a037b292f5f8ceff704';
			chai
				.request(server)
				.put(`/records/${rid}`)
				.set({ Authorization: `Bearer ${token}` })
				.send(record)
				.end((err, res) => {
					res.should.have.status(400);
					res.body.success.should.be.eq(
						false
					);
					done();
				});
		});

		describe('DELETE /records/:id', () => {
			it('Should delete a record', (done) => {
				chai
					.request(server)
					.delete(`/records/${recId}`)
					.set({ Authorization: `Bearer ${token}` })
					.end((err, res) => {
						res.should.have.status(200);
						res.body.success.should.be.eq(true);
						done();
					});
			});
			it('Should throw error if trying to delete non existing record', (done) => {
				const rid = '5d725a037b292f5f8ceff704';
				chai
					.request(server)
					.delete(`/records/${rid}`)
					.set({ Authorization: `Bearer ${token}` })
					.end((err, res) => {
						console.log(res.body)
						res.should.have.status(400);
						res.body.success.should.be.eq(false);
						done();
					});
			});
		});
	});
});
