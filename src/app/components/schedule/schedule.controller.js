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
                          matchServices, ScheduleService, Chronicle, $mdToast, $filter, MatchScheduleService) {
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
      sch.progressBar = true;
      ScheduleService.getSchedule().then(function(success){
        sch.schedulelist = success.data.filter(function (el)
        {
          if (el.date.substr(0,4) == '2017')
          return el;
        }) ;
      }, function(error)
      {
        $log.info('schedule API Error:' + error);
      });
      sch.progressBar = false;
    };
    sch.getSchedule ();


      sch.selectSchedule = function (match)
      {
         MatchScheduleService.match = match;
      };


  sch.saveSchedule = function(schedule)
  {
    schedule.title = schedule.hometeam + ' Vs ' + schedule.awayteam;
    schedule.date = $filter('date')(schedule.displaydate, "yyyy-MM-dd");
    ScheduleService.insertSchedule(schedule).then(
      function (success) {
        $scope.scheduleForm.$setUntouched();
        $scope.scheduleForm.$setPristine();
        sch.form = {};
        sch.getSchedule ();

        var pinTo = sch.getToastPosition();

        $mdToast.show(
          $mdToast.simple()
            .textContent('Sucessfully saved')
            .position(pinTo)
            .hideDelay(3000)
        );
      }, function (error){
        $log.info('schedule API Error:' + error);
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
