'use strict';

var debug = require('debug')('calendar:routes:common');

module.exports = {
  sendAppropriateResponse : function (req, res, output) {
    if (req.accepts('text')) {
      debug('sending text output');
      res.send(output.text);
      return;
    }

    if (req.accepts('json')) {
      debug('sending json output');
      res.send(output.json);
      return;
    }

    res.type('txt').send(output.text);
  }
};