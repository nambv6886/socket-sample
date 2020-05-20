const user = require('../../models/user');
const expect = require('chai').expect;
var hashedPassword;
const request = require('supertest');
const app = require('../../app');
const API_ROOT = '/api/v1';

describe('Test Hash Password', () => {
  it('should return hashed password', (done) => {
    user.hashPassword("buivannam").then((data) => {
      expect(data).to.be.a('string');
      hashedPassword = data;
      done();
    });
  });
});

describe("POST /register", () => {
  it("Should response http status 200", (done) => {
    request(app)
      .post(`${API_ROOT}/register`)
      .send({
        "username": "nambv",
        "password": "123456",
        "name": "nambv"
      })
      .expect((res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("object");
      })
      .end(err => {
        if (err)
          done(err)
        else
          done()
      })
  })
}
);

describe('POST /login', () => {
  it('should return 200 when crendentials is valid', done => {
    request(app)
      .post(`${API_ROOT}/login`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'admin',
        password: 'admin',
      })
      .end((err) => {
        if (err) done(err);
        else {
          done();
        }
      })
  });
  it('should return 401 when is unautherized', done => {
    request(app)
      .post(`${API_ROOT}/login`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'addddddd',
        password: 'addddddd'
      })
      .expect(res => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Username or password is wrong');
      })
      .end(err => {
        if (err) done(err);
        else done();
      })
  });
  it('should return 400 when is password is missing', done => {
    request(app)
      .post(`${API_ROOT}/login`)
      .set('Content-Type', 'application/json')
      .send({
        username: 'admin',
      })
      .expect(400, done);
  });
});

describe('Test Compare Password', () => {
  it('should return compare password is true', (done) => {
    user.comparePassword("buivannam", hashedPassword).then((data) => {
      expect(data).to.be.a('boolean');
      done();
    });
  });

  it('should return error', (done) => {
    user.comparePassword(12334, hashedPassword).then(() => {
      done();
    }).catch((err) => {
      expect(err).to.be.an('error');
      done(err);
    });
  });
});
