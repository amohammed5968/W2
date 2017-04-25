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
                          matchServices, ScheduleService, Chronicle, $mdToast, $filter) {
   var sch = this,
    last = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };

    //get schedule from backend
    sch.getSchedule = function ()
    {
      ScheduleService.getSchedule().then(function(success){
        console.log(success);
        sch.schedulelist = success.data;
      }, function(error)
      {
        console.log(error);
      })
    };
    sch.getSchedule ();



  sch.saveSchedule = function(schedule)
  {
    schedule.title = schedule.hometeam + ' Vs ' + schedule.awayteam;
    schedule.date = $filter('date')(schedule.displaydate, "yyyy-MM-dd");
    ScheduleService.insertSchedule(schedule).then(
      function (success) {
        $scope.scheduleForm.$setUntouched();
        $scope.scheduleForm.$setPristine();
        sch.form = {};

        console.log(success);
        var pinTo = sch.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
            .textContent('Sucessfully saved')
            .position(pinTo )
            .hideDelay(3000)
        );
      }, function (error){
        console.log(error);
      }
    )
  };



    sch.toastPosition = angular.extend({},last);

    sch.getToastPosition = function() {
      sanitizePosition();

      return Object.keys(sch.toastPosition)
        .filter(function(pos) { return sch.toastPosition[pos]; })
        .join(' ');
    };

    function sanitizePosition() {
      var current = sch.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }

    sch.showSimpleToast = function() {
      var pinTo = sch.getToastPosition();
    };

  } //end of ScheduleController
  })();
