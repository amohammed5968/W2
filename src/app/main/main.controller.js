(function () {
  'use strict';

  angular
    .module('w2')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, webDevTec, toastr, $log, locker, $mdDialog) {
    var main = this,
      matchInput = {
        'teamOne': '',
        'teamTwo': '',
        'matchName': '',
        'overs': 0
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


    $log.info(locker.get('someKey'));
    //Three variable to hold score card details
    //match details- object to hold summary details
    var team = {'Name': '', 'BattingFirst': false, 'TotalScore': '0/0'};

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

    main.matchDetails.TeamOne.BattingFirst = true;


    main.saveMatchDetails = function (details) {
      $log.info(details);
      main.matchDetails.TeamOne.Name = details.teamOne;
      main.matchDetails.TeamTwo.Name = details.teamTwo;
      main.matchDetails.Overs = details.overs;
      $log.info(main.matchDetails);
      // localStorage.setItem('match', JSON.stringify(main.matchDetails));
      locker.put('match', main.matchDetails);
      main.matchInputDone = true;
    };

    $log.info(main.matchDetails);


    // main.scoreCard.match = {'Team1':'Millikan Superstar', 'Team2':'Aloha Knights'};
    // main.scoreCard.firstBatting = 'Millikan Superstar';
    // main.scoreCard.team1 ={'FOW':'1/26-(player1,0.6overs)'};


    main.bowlers = [{name: 'bowler1'}, {name: 'bowler2'}];

    main.runsScored = [1, 2, 3, 4, 5, 6];
    main.extras = ['WD', 'NB', 'BYE'];

    main.totalScore = 0;
    main.totalOvers = 0.0;
    main.balls = 0;
    main.overCounter = 0;
    main.addBowlerButton = true;
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
      // $log.info(main.currentBowlers.Player.map(function (val) {
      //   if (val.active)
      //     return val;
      // }));

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

          }

          item.bowlingstats.Runs = item.bowlingstats.Runs + +runs;
        }
      });

      $log.info(main.currentBowlers.Player);

    }

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
      // check if the over is complete
      $log.info(checkOver());

      if (checkOver()) {
        // if (main.balls % 6 == 0) {
        $log.info('its over');
        main.overCounter = main.overCounter + 1;
        main.balls = 0;
      }
      else {
        main.totalOvers = '0.' + main.balls;
      }

      // $log.info(+main.overCounter + +('0.' + main.balls));
      main.totalOvers = +main.overCounter + +('0.' + main.balls);

      // update the bowlerstats of the bowler
      updateCurrentBowlerRuns(runs, extras);
    }

    function setExtra(extra) {
      main.enableExtraRuns = true;
    }
    function selectedBowler(bowler) {
      $log.info(bowler);

    }

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
      main.awesomeThings = webDevTec.getTec();

      angular.forEach(main.awesomeThings, function (awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
