process.env.DATABASE = "mongodb://localhost:27017/node-react-api-test";
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const User = require("../../models/user");
const jwt = require("jwt-simple");
const config = require("../../config");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const should = chai.should();

chai.use(chaiHttp);

describe("User", () => {
  before(done => {
    mongoose.connect(process.env.DATABASE);
    mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
    mongoose.connection
      .once("open", () => {
        done();
      })
      .on("error", err => {
        console.error(`OH NO → ${err.message}`);
      });
  });

  beforeEach(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("/POST user", () => {
    it("should not create a user without a password", done => {
      let user = {
        email: "test@test.com"
      };
      chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error", "password must be supplied");
          done();
        });
    });

    it("should not create a user without a email", done => {
      let user = {
        password: "1234"
      };
      chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("error", "email must be supplied");
          done();
        });
    });

    it("should not create user if user already exists", done => {
      let user = {
        email: "test@test.com",
        password: "1234"
      };
      chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
      chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(422);
          done();
        });
    });

    describe("successfully creating a user", done => {
      let user = {
        email: "test@test.com",
        password: "1234"
      };

      let token = ''

      it("should return a token string", done => {
        chai
        .request(server)
        .post("/signup")
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          token = res.body
          done();
        });
      });
    })

    describe("newly created user", () => {
      let user = {
        email: "test@test.com",
        password: "1234"
      };

      let token = ''

      beforeEach(done => {
        chai
          .request(server)
          .post("/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            token = res.body.token
            done();
          });
      });

      it("should be salted password", done => {
        User.findOne({ email: "test@test.com" }, function(err, record) {
          let savedPassword = record.password;
          savedPassword.should.not.be.equal(user.password);
          done();
        });
      });

      it('should reference user when token is decrypted', done => {
        let decoded_token = jwt.decode(token, config.secret)
        User.findOne({ email: user.email }, function(err, record) {
          decoded_token.sub.should.equal(`${record._id}`);
          done();
        });
      });
    });
  });
});
