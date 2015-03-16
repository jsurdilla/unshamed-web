var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var CurrentUserStore = require('../stores/CurrentUserStore');
var { OrderedMap, OrderedSet } = require('Immutable');
var UserStore = require('./UserStore');

var _friends = OrderedMap();

var FriendStore = assign({
  add(userID, friends) {
    var friendsList = _friends.get(userID) || OrderedSet();

    friendsList = friendsList.merge(friends.map(u => u.id));
    _friends = _friends.set(userID, friendsList);
  },

  remove(userID, friendUserID) {
    _friends = _friends.set(userID, _friends.get(userID).remove(parseInt(friendUserID)));
  },

  get(userID) {
    return _friends.get(parseInt(userID));
  }
}, ChangeAwareMixin);

FriendStore.dispatchToken = AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([UserStore.dispatchToken]);

    // clean up later
  var { action } = payload;
  payload = action || payload;
  var { users, userID, friendUserID, friendRequest, message } = payload;

  switch (payload.type) {
    case ActionTypes.LOGOUT: 
      _friends = OrderedMap();
      break;

    case ActionTypes.FETCH_FRIENDS_SUCCESS:
      FriendStore.add(userID, users);
      FriendStore.emitChange();
      break;

    case ActionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS:
      FriendStore.add(friendRequest.getIn(['receiver', 'id']), [friendRequest.get('user').toJS()])
      FriendStore.emitChange();
      break;

    case ActionTypes.UNFRIEND_SUCCESS:
      FriendStore.remove(userID, friendUserID);
      FriendStore.emitChange();
      break;

    case ActionTypes.ACCEPTED_FRIEND_REQUEST_PUSH:
      FriendStore.add(message.friendship_request.user.id, [message.friendship_request.receiver]);
      FriendStore.emitChange();
      break;

    case ActionTypes.UNFRIEND_PUSH:
      // TODO go back and think what to do with currentUser() in the stores - should they
      // be accessible from here directly
      FriendStore.remove(CurrentUserStore.getCurrentUser().get('id'), message.user.id);
      FriendStore.emitChange();
      break;
  }
});

module.exports = FriendStore;