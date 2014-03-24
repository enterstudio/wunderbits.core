define([

  'wunderbits/core/WBMixin',
  'wunderbits/core/lib/fromSuper'

], function (
  WBMixin,
  fromSuper,
  undefined
) {

  'use strict';

  return WBMixin.extend({

    'initialize': function () {

      var self = this;

      self.controllers = [];
      self.implemented = [];

      self.implements = fromSuper.concat(self, 'implements');
      self.createControllerInstances();

      self.bindTo(self, 'destroy', 'destroyControllers');
    },

    'createControllerInstances': function () {

      var self = this;
      var ControllerClass, controllerInstance, i;
      var Controllers = self.implements;

      for (i = Controllers.length; i--;) {
        ControllerClass = Controllers[i];

        // If we have already implemented a controller that inherits from
        // this controller, we don't need another one...
        if (self.implemented.indexOf(ControllerClass.toString()) < 0) {

          controllerInstance = new ControllerClass(self);
          self.controllers.push(controllerInstance);

          self.trackImplementedSuperConstructors(controllerInstance);
        }
      }

      return self.implemented;
    },

    'trackImplementedSuperConstructors': function (Controller) {

      var self = this;
      var _super = Controller.__super__;
      var superConstructor = _super && _super.constructor;

      if (superConstructor) {
        self.implemented.push(superConstructor.toString());
        self.trackImplementedSuperConstructors(superConstructor);
      }
    },

    'destroyControllers': function () {

      var self = this;
      var _super = self.constructor.__super__;

      _super.onDestroy && _super.onDestroy.apply(self, arguments);

      // Loop and destroy
      var controller;
      var controllers = self.controllers;

      for (var i = controllers.length; i--;) {

        // A controller can exist multiple times in the list,
        // since it's based on the event name,
        // so make sure to only destroy each one once
        controller = controllers[i];
        controller.destroyed || controller.destroy();
      }

      delete self.controllers;
    }
  });
});