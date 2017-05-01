(function () {
  'use strict';

  angular
    .module('w2', ['w2.schedule', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router'
      , 'ngMaterial', 'toastr', 'angular-locker', 'Chronicle', 'w2.teams'])
    .factory('RestAPIURLFactory', restAPIURL)
    .config(Config);

  function restAPIURL() {
    var dbserviceurl = 'http://cricnotes.com:8080';

    return {
      matches: dbserviceurl + '/matches',
      users: dbserviceurl + '/users',
      schedule: dbserviceurl + '/schedule',
      teams: dbserviceurl + '/teams'
    };

  }

  function Config($mdThemingProvider) {
    $mdThemingProvider.theme('teal')
  }
})();
