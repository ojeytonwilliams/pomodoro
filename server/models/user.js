var mongoose = require('mongoose');

var debug = require('debug')('app:user');

var Schema = mongoose.Schema;

var UserSchema = Schema({
  first_name: {
    type: String,
    required: true,
    max: 100
  },
  family_name: {
    type: String,
    required: false,
    max: 100
  },

});

// Virtual for user's full name
UserSchema
  .virtual('name')
  .get(function() {
    if(this.family_name){
      return this.first_name + " " + this.family_name;
    } else {
      return this.first_name;
    }
  });

//Export model
module.exports = mongoose.model('User', UserSchema);
