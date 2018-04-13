process.env.DATABASE = "mongodb://localhost:27017/node-react-api-test";
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const User = require("../../models/user");

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

  // Test Signuup /POST route

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

    it("should create a user with email & password", done => {
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
          res.body.should.be.a("object");
          res.body.should.have.property("success");
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

    describe("new users password", () => {
      let user = {
        email: "test@test.com",
        password: "1234"
      };

      beforeEach(done => {
        chai
          .request(server)
          .post("/signup")
          .send(user)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.a("object");
            res.body.should.have.property("success");
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
    });
  });
});
