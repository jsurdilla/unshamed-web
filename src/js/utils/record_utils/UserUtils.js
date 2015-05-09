'use strict';

var { isEmpty } = require('lodash');

module.exports = {

  fullNameOrUsername(userObject) {
    const fullName = userObject.get('full_name');

    if (fullName && !isEmpty(fullName.trim())) {
      return fullName;
    }
    return userObject.get('username');
  }

}