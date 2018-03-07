var expect = require('chai').expect;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var User = require('../../../server/models/user');

describe('user', function() {
    it('should be invalid if first_name is empty', function(done) {
        var u = new User();

        u.validate(function(err) {
            expect(err.errors.first_name).to.exist;
            done();
        });
    });

    it('should be valid even if family_name is empty', function(done) {
        var u = new User();

        u.validate(function(err) {
            expect(err.errors.family_name).to.not.exist;
            done();
        });
    });

    it('should combine first_name and family_name into a single name', function(done) {
        var u = new User({first_name: "Ay", family_name: "Person"});
        expect(u.name).to.equal("Ay Person");
        done();
    });

});
