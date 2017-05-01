/**
 * Created by ahsannaveedmohammed on 4/30/17.
 */
(function () {
  'use strict';

  angular
    .module('w2')
    .controller('TeamsController', TeamsController);

  /** @ngInject */
  function TeamsController($scope, $timeout, teamServices,  $log,  $mdDialog, $location,
                              matchServices, ScheduleService, Chronicle, $mdToast, $filter, MatchScheduleService) {
    var vm = this;
    vm.tabs =[{title:'Tournament',disabled :true},{title:'Team & Players',disabled :false}];

    vm.Team = {};

    defaultPlayers();

    function defaultPlayers() {
      vm.defaultPlayerList =[];
      for (var i = 0; i < 12; i++) {
        vm.defaultPlayerList.push({'PlayerName': 'Player' + i});
      }
      //capturing logs
      MatchScheduleService.captureLogEvents('defaultPlayers','Populated the default player list');
    }
    vm.addPlayer = function ()
    {
        vm.defaultPlayerList.push({'PlayerName': 'Player' + vm.defaultPlayerList.length});
    }; //end of addPlayer function


    function clearTeamForm (){
      vm.Team = {};
      defaultPlayers();
    }//end of function clearTeamForm


    var last = {
      bottom: true,
      top: false,
      left: true,
      right: false
    };

    vm.toastPosition = angular.extend({},last);

    vm.getToastPosition = function() {
      sanitizePosition();

      return Object.keys(vm.toastPosition)
        .filter(function(pos) { return vm.toastPosition[pos]; })
        .join(' ');
    }; //end of function getToastPosition

    function sanitizePosition() {
      var current = vm.toastPosition;

      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;

      last = angular.extend({},current);
    }  //end of function sanitizePosition

    function showConfirmation(message)
    {

      var pinTo = vm.getToastPosition();

      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .position(pinTo)
          .hideDelay(3000)
      );
    }  //end of function showConfirmation

    vm.saveTeamDetails = function(team)
    {
      var teamDetails={};

      // teamDetails.Name =
      teamDetails.Batting= false;
      teamDetails.BattingFirst =false;
      teamDetails.Bowling= false;
      teamDetails.Players = vm.defaultPlayerList;
      teamDetails.Name = team.Name;

      // team.Players.forEach(function (el) {
      //   console.log(el);
      //   // teamDetails.Players.push({'PlayerName':el.})
      // });

      console.log(teamDetails);
      teamServices.insertTeamData(teamDetails).then(
        function (success) {
          console.log(success);
          //capturing logs
          MatchScheduleService.captureLogEvents('insertTeamData','API returned success');
          clearTeamForm();
          vm.getTeams();
          showConfirmation('Successfully saved');
        }, function(error){
          console.log(error);
          //capturing logs
          MatchScheduleService.captureLogEvents('insertTeamData','API returned error'+ JSON.stringify(error));
          showConfirmation('Error while saving, check logs');
        }
      );

    };

    vm.getTeams = function ()
    {
      teamServices.getAllTeams().then(function (success) {
        vm.teamList = success.data;
          //capturing logs
          MatchScheduleService.captureLogEvents('getAllTeams','API returned success');
      }, function(error)
      {
        console.log(error);
        //capturing logs
        MatchScheduleService.captureLogEvents('getAllTeams','API returned error'+ JSON.stringify(error));
      }
      )
    };

    vm.getTeams();
   //get a team details for edit

    vm.getTeam = function (team)
    {
      console.log(team);
      vm.Team.Name = team.Name;
        vm.defaultPlayerList =team.Players;
    };

  } //end of teamsController
  })();
