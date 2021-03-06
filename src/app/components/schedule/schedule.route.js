(function() {
  'use strict';

  angular
    .module('w2.schedule',[])
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('schedule', {
        url: '/schedule',
        templateUrl: 'app/components/schedule/schedule.html',
        controller: 'ScheduleController',
        controllerAs: 'sch'
      });
    $urlRouterProvider.otherwise('/');
  }

})();
