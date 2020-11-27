const User = require('../models/User');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let request = require('supertest');


// Assertion type
chai.should();

chai.use(chaiHttp);

const userCredentials = {
	email: 'raj@gmail.com',
	password: '123456',
};
const authenticatedUser = request.agent(server);
let token, userId;
const user = {
	name: 'rajshahau',
	email: 'raj15@gmail.com',
	password: '123456',
	role: 'nurse'
}

describe('Should test auth endpoints', () => {
	before(function (done) {
		authenticatedUser
			.post('/auth/login')
			.set('Accept', 'application/json')
			.set('Content-Type', 'application/json')
			.send(userCredentials)
			.end(function (err, res) {
				if (err) throw err;
				token = res.body.token;
				res.should.have.status(200);
				// expect(token).to.not.be.null;
				done();
			});
	});


	it('should get currently logged in user via token', function (done) {
		chai
			.request(server)
			.get('/auth/me')
			.set({ Authorization: `Bearer ${token}` })
			.end((err, res) => {
                userId = res.body.data._id
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.email.should.be.eq(userCredentials.email);
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('role');
				done();
			});
	});

	it('should register user', function (done) {
		chai
			.request(server)
			.post('/auth/register')
			.set({ Authorization: `Bearer ${token}` })
			.send(user)
			.end((err, res) => {
				done();
			});
    });

    it('should logout user', function (done) {
		chai
			.request(server)
			.get('/auth/logout')
			.end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eq(true);
				done();
			});
    });

});
