process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const User = require("../../models/user");
const jwt = require("jwt-simple");
const config = require("../../config");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const should = chai.should();

process.env.DATABASE = config.test.db

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

  before(done => {
    User.remove({}, err => {
      done();
    });
  });

  describe("/POST signin", () => {
    let token = "";
    let login_details = {
      email: "test@test1.com",
      password: "1234"
    };

    beforeEach(done => {
      User.create(
        {
          email: "test@test1.com",
          password: "1234"
        },
        (err, record) => {
          if (err) {
            console.error(`OH NO → ${err.message}`);
          }
        }
      );
      done();
    });


    it("should return a token upon signin", done => {
      chai
        .request(server)
        .post("/signin")
        .send(login_details)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          token = res.body.token
          done();
        });
    });

    it("root is accessable with token", done => {
      chai
        .request(server)
        .get("/")
        .set('authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message", "there");
          done();
        });
    })
  });
});

