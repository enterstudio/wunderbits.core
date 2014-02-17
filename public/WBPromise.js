define([
  './WBClass'
], function (WBClass) {

  'use strict';

  function proxy (name) {
    return function () {
      var deferred = this.deferred;
      deferred[name].apply(deferred, arguments);
      return this;
    };
  }

  var proto = {
    'constructor': function (deferred) {
      this.deferred = deferred;
    },

    'promise': function () {
      return this;
    },

    'state': function () {
      return this.deferred.state();
    }
  };

  [
    'done',
    'fail',
    'then'
  ].forEach(function (name) {
    proto[name] = proxy(name);
  });

  proto.always = proto.then;

  return WBClass.extend(proto);

});