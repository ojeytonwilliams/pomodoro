const test = require('tape');

const before = test;
const after = test;
const Account = require('../../../server/models/account');
const mongoose = require('mongoose');

const name = '12345';
const pw = 'testy';

before('Removing the test db', function(t) {
  var MongoClient = require('mongodb').MongoClient
    MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
      if (err) throw err;
      db.dropDatabase(function(err) {
        if (err) throw err;
        db.close();
        t.end();
      })
    });
});

before('Setting up db', function(t) {

  mongoose.connect('mongodb://localhost/test');
  let db = mongoose.connection;

  db.once('open', function() {
    // we're connected!
    var account = new Account({
      username: name
    });

    Account.register(account, pw, function(err, account) {
      if (err) throw err;
      t.end();
    });
  });

})



test('Account should find a user by username', function(t) {
  //  t.plan(1);

  Account.findOne({
    username: name
  }, function(err, account) {
    if (err) throw err;
    console.log("account");
    console.log(account);
    t.equal(account.username, name);
    t.end();
  });
});

test('Account should not store the password in plain text', function(t) {
  t.plan(1);
  Account.findOne({
    username: name
  }, function(err, account) {
    t.notEqual(account.hash, pw);
  });
});

test('Account should authenticate only when given the original password', function(t) {
  // TODO: authenticate is painfully slow, we probably don't want to be running
  // this test every time.  Organize tests into suites?
  t.plan(2);
  Account.findOne({
    username: name
  }, function(err, account) {
    account.authenticate(pw, function(err, auth) {
      t.ok(auth);
      //  expect(auth).to.be.ok;
      account.authenticate(pw + "Some extra text", function(err, auth) {
        t.notOk(auth);
        //  expect(auth).to.be.false;
      });
    });
  });
});



after('Closing db', function(t) {
  Account.remove({}, function(err) {
    if (err) throw err;
  });
  mongoose.connection.close();

  t.end();
});
