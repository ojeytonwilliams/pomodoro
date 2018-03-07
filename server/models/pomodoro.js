var mongoose = require('mongoose');

var debug = require('debug')('app:pomodoro');

var Schema = mongoose.Schema;

var PomodoroSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  start_time: {
    type: Date,
    required: true
  },
  work_duration: {
    type: Number,
    required: true
  },
  notes_duration: {
    type: Number,
    required: true
  },
  break_duration: {
    type: Number,
    required: true
  },
  end_work_time: {
    type: Date,
    required: false
  },
  end_notes_time: {
    type: Date,
    required: false
  },
  end_break_time: {
    type: Date,
    required: false
  },

});



//Export model
module.exports = mongoose.model('Pomodoro', PomodoroSchema);
