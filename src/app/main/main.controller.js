(function () {
  'use strict';

  angular
    .module('w2')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, teamServices, toastr, $log, locker, $mdDialog) {
    var main = this;
      main.matchInput = {
        'teamOne': '',
        'teamTwo': '',
        'matchName': '',
        'overs': 0,
        'firstBatting':''
      };
    main.matchInputDone = false;
    main.scoreCard = [];
    main.currentBowlers = {};
    main.classAnimation = '';
    main.creationDate = 1490933525821;
    main.showToastr = showToastr;
    main.saveRuns = saveRuns;
    main.selectedBowler = selectedBowler;
    main.currentBowlers.Player = [];
    main.ballsArray = [];
    main.currentBatsmen = {};
    main.currentBatsmen.Player = [];

  
    $log.info(locker.get('someKey'));
    //Three variable to hold score card details
    //match details- object to hold summary details
    var team = {'Name': '', 'BattingFirst': false, 'TotalScore': '0/0', 'Bowling':false, 'Batting':false};

    if (main.matchDetails = locker.get('match')) {
      // if (main.matchDetails = JSON.parse(localStorage.getItem('match'))) {
      console.log(main.matchDetails);
      main.matchInputDone = true;
      //  if (locker.get('currentBowlers'))
      //  {
      // // if (JSON.parse(localStorage.getItem('currentBowlers'))) {
      //   main.currentBowlers = locker.get('currentBowlers');
      //   // main.currentBowlers.Player = [];
      // }
    }
    else
      main.matchDetails = {
        'TeamOne': angular.copy(team), 'TeamTwo': angular.copy(team), 'Overs': 0
      };

    //edit matchDetails object
    main.editMatchDetails = function editMatchDetails()
    {
       $log.info(main.matchDetails);
      main.matchInputDone = false;
      main.matchInput.matchName = main.matchDetails.matchName;
      main.matchInput.teamOne =  main.matchDetails.TeamOne.Name;
      main.matchInput.teamTwo =  main.matchDetails.TeamTwo.Name;
      main.matchInput.overs = main.matchDetails.Overs;
      // main.matchInput.firstBatting = main.matchDetails.TeamOne.BattingFirst?main.matchDetails.TeamOne.Name: main.matchDetails.TeamTwo.Name;           
      $log.info(main.matchDetails.TeamOne.BattingFirst?main.matchDetails.TeamOne.Name: main.matchDetails.TeamTwo.Name);
    };

    main.saveMatchDetails = function (details) {
      $log.info(details);
      main.matchDetails.matchName = details.matchName;
      main.matchDetails.TeamOne.Name = details.teamOne;
      main.matchDetails.TeamTwo.Name = details.teamTwo;
      main.matchDetails.Overs = details.overs;
      main.matchDetails.TeamTwo.BattingFirst = (main.matchDetails.TeamTwo.Name==details.firstBatting)?true:false;
      main.matchDetails.TeamOne.BattingFirst = (main.matchDetails.TeamOne.Name==details.firstBatting)?true:false;
      main.matchDetails.TeamOne.Batting = (main.matchDetails.TeamOne.Name==details.firstBatting)?true:false;
      main.matchDetails.TeamTwo.Batting = (main.matchDetails.TeamTwo.Name==details.firstBatting)?true:false;
      main.matchDetails.TeamOne.Bowling = (main.matchDetails.TeamOne.Name!=details.firstBatting)?true:false;
      main.matchDetails.TeamTwo.Bowling = (main.matchDetails.TeamTwo.Name!=details.firstBatting)?true:false;
      $log.info(main.matchDetails.TeamTwo.BattingFirst);
      $log.info(main.matchDetails.TeamOne.BattingFirst);
      // localStorage.setItem('match', JSON.stringify(main.matchDetails));
      locker.put('match', main.matchDetails);
      main.matchInputDone = true;
    };

    $log.info(main.matchDetails);

// initializing variables
    main.runsScored = [1, 2, 3, 4, 5, 6];
    main.extras = ['WD', 'NB', 'BYE', 'L-BYE'];
    main.totalScore = 0;
    main.totalOvers = 0.0;
    main.balls = 0;
    main.overCounter = 0;
    main.addBowlerButton = true;
    main.addBatsmenButton = true;

    var idx;


    function checkExists(checkArray, checkValue) {
      return checkArray.map(function (val) {
        return val.PlayerName;
      }).indexOf(checkValue);
    }


    main.addBowler = function (playerName) {
      var bowlingStats = {
        'Overs': 0, 'Runs': 0, 'Wickets': 0, '4s': 0,
        '6s': 0, '3s': 0, '2s': 0, '1s': 0, '0s': 0
      };
      // var idx =main.currentBowlers.Player.map(function(val) {
      //   $log.info(val);
      //   return val.PlayerName;
      // }).indexOf(playerName);
      $log.info(checkExists(main.currentBowlers.Player, playerName));

      // $log.info(main.currentBowlers);

      // main.currentBowlers.Player.push({'Name':playerName});
      // main.currentBowlers.Player.push({'bowlingstats':bowlingStats});
      ((idx = checkExists(main.currentBowlers.Player, playerName)) == -1 ) ?
        main.currentBowlers.Player.push({
          'PlayerName': playerName,
          'active': true,
          'bowlingstats': bowlingStats
        }) : addOvers(main.currentBowlers.Player[idx]);
      // main.currentBowlers.PlayerName.push({'bowlingstats':bowlingStats});
      $log.info(JSON.stringify(main.currentBowlers));
      // localStorage['currentBowlers']= JSON.stringify(angular.copy(main.currentBowlers));
      //  locker.put('currentBowlers',angular.copy(main.currentBowlers));
     main.addBowlerButton = false;
    };

    function addOvers(bowler) {
      $log.info(bowler);
      // bowler.bowlingstats.Overs = +1;
      bowler.active = true;
      $log.info(bowler);
    }

    function updateCurrentBowlerRuns(runs, extras) {
      angular.forEach(main.currentBowlers.Player, function (item) {
        $log.info(item);
        if (item.active) {
          if (checkOver()) {
            item.bowlingstats.Overs = Math.round((item.bowlingstats.Overs + 0.5) * 100) / 100;
            item.active = false;
            main.addBowlerButton = true;
            // main.showPrompt();
          }
          else{ item.bowlingstats.Overs = Math.round((item.bowlingstats.Overs + 0.1)* 100) / 100;}
          // item.bowlingstats.Overs = +item.bowlingstats.Overs.toFixed(1) + +(0.1).toFixed(1);
          switch (runs)
          {
            case 4:
                 item.bowlingstats['4s'] += 1;
              $log.info(runs);
                  break;
            case 6:
              $log.info(runs);
              item.bowlingstats['6s'] += 1;
                 break;
            case 3:
              $log.info(runs);
              item.bowlingstats['3s'] += 1;
                break;
            case 2:
              $log.info(runs);
              item.bowlingstats['2s'] += 1;
              break;
            case 1:
              $log.info(runs);
              item.bowlingstats['1s'] += 1;
                  break;

          }   //end of switch

          item.bowlingstats.Runs = item.bowlingstats.Runs + +runs;
        }
      }); //end of forEach

      $log.info(main.currentBowlers.Player);

    } //end of updateCurrentBowlerRuns

function updateCurrentBatsmenStats(runs, extras)
{
  var overComplete = checkOver();
  //  loop through the main.currentBatsmen object and update the batting stats for the player on strike
  angular.forEach(main.currentBatsmen.Player, function(item){
     $log.info('Inside currentBatsmen');  
     $log.info(item);
     //  add the runs to the batsmen on strike
     if(item.active){
         item.battingStats.Runs += runs;
      //  if (checkOver())
      //  {
      //    changeStrike();
      //   item.active = false;
      //   main.addBatsmenButton = true;
      //  } //ending inner if
    } //ending if
 }); //end of forEach of updateCurrentBatsmenStats
          $log.info(runs % 2);
          if(runs % 2 != 0) {
                  //  if runs scored is odd by the active batsmen then change the strike 
                !overComplete?changeStrike():null;
                }
                else //runs scored are even, no strike change is need unless over is complete
                {
                  overComplete?changeStrike():null;
                } //end of runs if-else

} //end of updateCurrentBatsmenStats

function changeStrike()
{
  angular.forEach(main.currentBatsmen.Player,function(item)
  {
    $log.info(item);
   if (!item.active){
    item.active = true;
    $log.info('Striker ' +item.PlayerName);
   }
   else {item.active = false; $log.info('Non-Striker ' +item.PlayerName);}
  }) //end of forEach of changeStrike
} //end of changeStrike
    //function to return true when the ballsArray has 6 deliveries without extras
    function checkOver() {
      var cnt = 0;
      angular.forEach(main.ballsArray, function (item) {
        cnt += !item.extras ? 1 : 0;
      });
      return cnt % 6 == 0;
    } //end of checkOver

    function saveRuns(runs, extras) {

      //adding to the total scrore
      main.totalScore = +runs + +main.totalScore;
      main.ballsArray.push({'runs': runs, 'extras': extras});

      //total balls
      main.balls = +main.balls + +1;
    
      // update the bowlerstats of the bowler
      updateCurrentBowlerRuns(runs, extras);

      // update the battingstats of the batsmen object
      updateCurrentBatsmenStats(runs, extras);
     
    // check if the over is complete
      if (checkOver()) {
        // if (main.balls % 6 == 0) {
        $log.info('its over');
        main.overCounter = main.overCounter + 1;
        main.balls = 0;
      }
      else {
        main.totalOvers = '0.' + main.balls;
      } //end of if-else for checkover
  main.totalOvers = +main.overCounter + +('0.' + main.balls);

  // update the teams totalscore in match details
   main.matchDetails.TeamOne.BattingFirst? main.matchDetails.TeamOne.TotalScore=main.totalScore:main.matchDetails.TeamTwo.TotalScore=main.totalScore;
    }

    function setExtra(extra) {
      main.enableExtraRuns = true;
    }
    function selectedBowler(bowler) {
      $log.info(bowler);

    }

    //
    main.addBatsmen = function(playerName, striker)
    {
      var battingStats = {
         'Runs': 0, 'Balls': 0, 'SR':0.00,'4s': 0,
        '6s': 0, '3s': 0, '2s': 0, '1s': 0, '0s': 0
      };
      
    //  check if the batsmen is already add in the match object
      $log.info(checkExists(main.currentBatsmen.Player, playerName));

      ((idx = checkExists(main.currentBatsmen.Player, playerName)) == -1 ) ?
        main.currentBatsmen.Player.push({
          'PlayerName': playerName,
          'active': main.striker?true:false,
          'battingStats': battingStats
        }) :null;
      $log.info(main.currentBatsmen);
      
     main.addBatsmenButton = (main.currentBatsmen.Player.length ==2)? false:true;
     main.striker = false;
    };  //end of addBatsmen


    activate();

    function activate() {
      getTeam();
      $timeout(function () {
        main.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      main.classAnimation = '';
    }

    function getTeam() {
      if (main.matchDetails.TeamOne.Batting)
      main.matchDetails.TeamOne.Players = teamServices.getTeam(main.matchDetails.TeamOne.Name);
      else
      main.matchDetails.TeamTwo.Players = teamServices.getTeam(main.matchDetails.TeamTwo.Name);
    }
  }
})();
