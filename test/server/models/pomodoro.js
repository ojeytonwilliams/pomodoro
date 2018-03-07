var expect = require('chai').expect;
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var User = require('../../../server/models/user');
var Pomodoro = require('../../../server/models/pomodoro');

describe('pomodoro', function() {
  it('should be invalid without user, start_time, work_duration, notes_duration and break_duration', function(done) {
    var p = new Pomodoro();

    p.validate(function(err) {
      expect(err.errors.user).to.exist;
      expect(err.errors.start_time).to.exist;
      expect(err.errors.work_duration).to.exist;
      expect(err.errors.notes_duration).to.exist;
      expect(err.errors.break_duration).to.exist;
      done();
    });
  });

  it('should reject strings that are not dates for start_time', function(done) {

    var now = new Date();
    var p = new Pomodoro({
      start_time: "Not a date string"
    });

    p.validate(function(err) {
      expect(err.errors.start_time).to.exist;
      done();
    });
  });

  it('should only be valid if end_work_time, end_notes_time or end_break_time are Dates or undefined', function(done) {

    var p = new Pomodoro();
    p.validate(function(err) {
      expect(err.errors.end_work_time).to.not.exist;
      expect(err.errors.end_notes_time).to.not.exist;
      expect(err.errors.end_break_time).to.not.exist;
      var p2 = new Pomodoro({
        // Mongoose attempts to cast values into Dates.  Since numbers can be
        // passed into Date constructors, they count as Dates as far as
        // Mongoose validation is concerned.
        end_work_time: "Not a date string",
        end_notes_time: false,
        end_break_time: ["Really", "Not"]
      });

      p2.validate(function(err) {
          expect(err.errors.end_work_time).to.exist;
          expect(err.errors.end_notes_time).to.exist;
          expect(err.errors.end_break_time).to.exist;
          done();
        }
      )
    });
  });



});
