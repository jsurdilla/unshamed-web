'use strict';

var { assign, each } = require('lodash');
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var ChangeAwareMixin = require('./ChangeAwareMixin');
var { Map } = require('immutable');
var { createEntityWithClientID } = require('../utils/StoreUtils');

var _resources = Map();

const ResourceStore = assign({
  add(resource) {
    _resources = _resources.set(resource.id, createEntityWithClientID(resource));
  },

  get(id) {
    return _resources.get(id);
  },

  getAll() {
    return _resources;
  }
}, ChangeAwareMixin);

ResourceStore.dispatchToken = AppDispatcher.register((payload) => {

  // clean up later
  var { action } = payload;
  payload = action || payload;
  var { resources, type } = payload;

  switch (type) {
    case ActionTypes.LOGOUT: 
      _resources = Map();
      break;

    case ActionTypes.FETCH_RESOURCES:
      _resources = new Map();
      break;
    case ActionTypes.FETCH_RESOURCES_ERROR:
      break;
    case ActionTypes.FETCH_RESOURCES_SUCCESS:
      each(resources, ResourceStore.add);
      ResourceStore.emitChange();
      break;
  }
});

module.exports = ResourceStore;