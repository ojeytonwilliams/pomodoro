//var should = require("should");
var expect = require('chai').expect;
var mongoose = require('mongoose');
var Account = require('../../../server/models/account');
//var app = require('../../../server/app');
var db;

describe('Account', function() {
  let name = '12345';
  let pw = 'testy';
  before(function(done) {
    db = mongoose.connect('mongodb://localhost/test');
    done();
  });

  after(function(done) {
    mongoose.connection.close();
    done();
  });

  beforeEach(function(done) {
    var account = new Account({
      username: name
    });

    Account.register(account, pw, function(err, account) {
      done();
    });

  });

  it('should find a user by username', function(done) {
    Account.findOne({
      username: name
    }, function(err, account) {
      expect(account.username).to.eql(name);
      done();
    });
  });

  it('should not store the password in plain text', function(done) {
    Account.findOne({
      username: name
    }, function(err, account) {
      expect(account.hash).to.not.eql(pw);
      done();
    });
  });

  it('should authenticate only when given the original password', function(done) {
    // TODO: authenticate is painfully slow, we probably don't want to be running
    // this test every time.  Organize tests into suites?
    Account.findOne({
      username: name
    }, function(err, account) {
      account.authenticate(pw, function(err, auth) {
        expect(auth).to.be.ok;
        account.authenticate(pw + "Some extra text", function(err, auth) {
          expect(auth).to.be.false;
          done();
        });
      });

    });
  })

  afterEach(function(done) {
    Account.remove({}, function() {
      done();
    });
  });

});
