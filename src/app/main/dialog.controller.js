/**
 * Created by ahsannaveedmohammed on 4/27/17.
 */

(function () {
  'use strict';

  angular
    .module('w2')
    .controller('DialogController', DialogController);

  /** @ngInject */
function DialogController($scope, $mdDialog) {
    var dialog = this;
  dialog.hide = function() {
    $mdDialog.hide();
  };

  dialog.cancel = function() {
    $mdDialog.cancel();
  };

  dialog.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
})();
