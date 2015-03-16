var { pluck } = require('lodash');

function partipantsDisplayText(conversation) {
  if (conversation) {
    return pluck(conversation.get('participants').toJS(), 'full_name').join(', ');
  }
  return '';
};

// http://stackoverflow.com/questions/11077475/how-to-get-exact-height-of-body-of-the-webbrowser-window
function documentHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
};

function updateRootContainerHeight(rootContainer) {
  rootContainer.style.height = documentHeight() + 'px';
};

module.exports = {
  partipantsDisplayText,
  updateRootContainerHeight
};