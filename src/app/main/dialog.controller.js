/**
 * Created by ahsannaveedmohammed on 4/27/17.
 */

(function () {
  'use strict';

  angular
    .module('w2')
    .controller('DialogController', DialogController);

  /** @ngInject */
  function DialogController($scope, $mdDialog, MatchScheduleService) {
    var vm = this;

    vm.currentBatsmenList = MatchScheduleService.currentBatsmen;
    vm.hide = function () {
      $mdDialog.hide();
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    vm.updateScore = function () {
      // $mdDialog.hide(answer);
      // console.log(MatchScheduleService.currentBatsmen);
      console.log(MatchScheduleService);

      MatchScheduleService.currentBatsmen.forEach(function (batsmen) {
        console.log(batsmen);
        if (batsmen.PlayerName == vm.batsmen) {
          batsmen.Out = true;
          batsmen.WicketTakenBy = vm.bowler;
          $mdDialog.hide();
        }
      }); //end of currentbatsmen foreach loop
      console.log(MatchScheduleService.currentBatsmen);

      console.log(MatchScheduleService.currentBowlers);
      MatchScheduleService.currentBowlers.forEach(function (bowler) {
        if ((bowler.PlayerName == vm.bowler) && (bowler.Active)) {
          bowler.bowlingStats.Wickets++;
        } //end of if inside currentBowler loop
      }); //end of currentBowler foreach loop

      MatchScheduleService.WKDetails = {
        'batsmen': vm.batsmen,
        'bowler': vm.bowler, 'outBy': vm.outBy,
        'runsScored': vm.runScored
      }
    };  //end of updateScore
  }
})();
