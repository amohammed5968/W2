/**
 * Created by ahsannaveedmohammed on 4/18/17.
 */
(function () {
  'use strict';

  angular
    .module('w2')
    .controller('ScheduleController', ScheduleController);

  /** @ngInject */
  function ScheduleController($scope, $timeout, teamServices, toastr, $log, locker, $mdDialog,
                          matchServices, ScheduleService, Chronicle) {
   var sch = this;

    //get schedule from backend
    sch.getSchedule = function ()
    {
      ScheduleService.getSchedule().then(function(success){
        console.log(success);
      }, function(error)
      {
        console.log(error);
      })
    };
    sch.getSchedule ();
  } //end of ScheduleController 

  })();
