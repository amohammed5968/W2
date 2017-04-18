(function() {
  'use strict';

  angular
    .module('w2')
    .factory('ScheduleService', ScheduleService);

function ScheduleService(RestAPIURLFactory, $http)
{
    var scheduleService = {};

    scheduleService.getSchedule = function () {
      return $http.get(RestAPIURLFactory.schedule);
    };

    return scheduleService;
}
})();