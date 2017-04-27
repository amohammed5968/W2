(function() {
  'use strict';

  angular
    .module('w2', ['w2.schedule','ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ui.router', 'ngMaterial', 'toastr','angular-locker', 'Chronicle'])
    .factory('RestAPIURLFactory', restAPIURL);

  function restAPIURL()
  {
    // var dbserviceurl = 'http://ec2-54-84-167-254.compute-1.amazonaws.com:8080';
    var dbserviceurl = 'http://localhost:8080';

    return {
      matches: dbserviceurl +'/matches',
      users: dbserviceurl + '/users',
      schedule: dbserviceurl + '/schedule',
      teams: dbserviceurl + '/teams'
    };

  }
})();
