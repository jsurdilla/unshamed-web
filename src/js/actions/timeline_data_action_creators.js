var AppDispatcher = require('../dispatcher/AppDispatcher');
var ActionTypes = require('../constants/ActionTypes');

module.exports = {

  receiveTimelineItems: function(items) {
    AppDispatcher.dispatch({
      type: ActionTypes.FETCH_TIMELINE_SUCCESS,
      items: items
    })
  }

};