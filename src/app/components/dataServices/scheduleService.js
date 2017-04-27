(function() {
  'use strict';

  angular
    .module('w2')
    .factory('ScheduleService', ScheduleService)
    .service('MatchScheduleService', MatchScheduleService);

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

  function MatchScheduleService ()
  {
    // this.scheduleList = 'Match1';
  }
})();
