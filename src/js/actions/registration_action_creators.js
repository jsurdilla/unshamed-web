var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

module.exports = {
  register: function(data) {
    console.log(data, ActionTypes.USER_REGISTRATION, data);
  }
};
