
var exec = require('cordova/exec');

var PLUGIN_NAME = 'ContactsManager';

var ContactsManager = {
  getContacts: function(cb) {
    exec(cb, null, PLUGIN_NAME, 'getContacts', []);
  },
  addContact: function (contact, cb) {
    exec(cb, null, PLUGIN_NAME, 'addContact', [contact]);
  }
};

module.exports = ContactsManager;
