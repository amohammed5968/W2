(function () {
  'use strict';

  angular
    .module('w2')
    .factory('ScheduleService', ScheduleService)
    .service('MatchScheduleService', MatchScheduleService);

  function ScheduleService(RestAPIURLFactory, $http) {
    var scheduleService = {};

    scheduleService.getSchedule = function () {
      return $http.get(RestAPIURLFactory.schedule);
    };

    scheduleService.insertSchedule = function (schedule) {
      return $http.post(RestAPIURLFactory.schedule, schedule);
    };

    return scheduleService;
  }

  function MatchScheduleService() {
    var vm = this;

    console.log('Inside MatchScheduleService');

    vm.logEvents = [{seq: 0, event:'info',description:'Starting log'}];

    vm.captureLogEvents = function(eve, desc)
    {
      vm.logEvents.push({seq:vm.logEvents.length, event:eve,description:desc});
    };

    //extracts the player details from the object
    vm.getCurrentPlayerDetails = function getCurrentPlayerDetails() {
      console.log(vm.matchDetails);
      //  parse the current batsmen by looking at
      var idx = ['TeamOne', 'TeamTwo'];

      idx.forEach(function (item) {
        if (vm.matchDetails[item].Batting) {
          //  loop to player to see the current active batsmen
          vm.currentBatsmen = vm.matchDetails[item].Players.filter(function (el) {
            if (!el.Out && el.Out !== null && el.Out !== undefined)
              return el;
          });
        }
        else {
          //  loop to player to see the current active bowler
          vm.currentBowlers = vm.matchDetails[item].Players.filter(function (el) {

            if (el.Active !== undefined)
              return (el.Active && el.Active !== null) ? true : el;
          });
        }
      });

    } ; //end of getCurrentPlayerDetails

  }
})();
