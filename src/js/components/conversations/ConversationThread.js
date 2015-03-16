var { each, first, last, merge } = require('lodash');
var moment = require('moment');

class ConversationThread {
  constructor(messages) {
    this.sections = [];

    var lastMessage = null;
    each(messages, function(message) {
      var currentSentAt = new moment(message.created_at);
      message.sentAt = currentSentAt;

      if (lastMessage && this.areOnSameDay(currentSentAt, lastMessage.sentAt)) {
        if (message.sender.id === lastMessage.sender.id) {
          last(this.sections).messages.push(message);
        } else {
          this.pushNewSection(this.sections, message, { newDay: false });
        }
      } else {
        this.pushNewSection(this.sections, message, { newDay: true });
      }

      lastMessage = message;
    }.bind(this));
  }

  static addMessage(message) {
    var mostRecentSection = this.getMostRecentSection(),
        mostRecentMessage = this.getMostRecentMessage(),
        currentSentAt = moment(message.created_at);

    message.sentAt = moment(message.created_at);
    if (mostRecentMessage && this.areOnSameDay(currentSentAt, mostRecentMessage.sentAt)) {
      if (message.sender.id === mostRecentMessage.sender.id) {
        last(self.sections).messages.push(message);
      } else {
        this.pushNewSection(self.sections, message, { newDay: false });
      }
    } else {
      this.pushNewSection(self.sections, message, { newDay: true });
    }
  }

  // Tests whether two dates are on the same day. Parameters must be both be moment objects.
  areOnSameDay(date1, date2) {
    return date1.year() === date2.year() && date1.dayOfYear() === date2.dayOfYear();
  }

  pushNewSection(sections, message, options) {
    sections.push(merge({
      timestamp: message.sentAt,
      messages: [message]
    }, options || {}));
  }

  getMostRecentSection() {
    return last(this.sections);
  }

  getEarliestSection() {
    return first(this.sections);
  }

  getMostRecentMessage() {
    return last(this.getMostRecentSection().messages);
  }

  getEarliestMessage() {
    return first(this.getEarliestSection().messages);
  }
}

module.exports = ConversationThread;