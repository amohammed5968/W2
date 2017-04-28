(function() {
  'use strict';

  angular
    .module('w2')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('schedule', {
        url: '/',
        templateUrl: 'app/components/schedule/schedule.html',
        controller: 'ScheduleController',
        controllerAs: 'sch'
      });
    $urlRouterProvider.otherwise('/');
  }

})();
