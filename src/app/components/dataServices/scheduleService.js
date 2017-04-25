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

  scheduleService.insertSchedule = function (schedule) {
      return $http.post(RestAPIURLFactory.schedule, schedule);
  };

    return scheduleService;
}
})();
