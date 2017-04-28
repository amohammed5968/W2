(function () {
  'use strict';

  angular
    .module('w2')
    .controller('MainController', MainController)
    .filter('currentBowler', currentBowler);

  /** @ngInject */
  function MainController($scope, $timeout, teamServices, toastr, $log, locker, $mdDialog,
                          matchServices, ScheduleService, Chronicle, DataService, MatchScheduleService) {
    var main = this;
    main.matchInput = {
      'teamOne': '',
      'teamTwo': '',
      'matchName': '',
      'overs': 0,
      'firstBatting': ''
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
    main.strikerSet = '';
    main.totalOvers = '';
    main.totalScore = 0;
    main.striker = true;

    var team = {
      'Name': '', 'BattingFirst': false, 'TotalScore': '0/0', 'Bowling': false, 'Batting': false,
      'Players': []
    };

    //  function to disable extra buttons based on selection
    main.buttonDisable = function (run) {
      //  return run==1?true:false;
      return false;
    };

    main.clearSelection = function () {
    };


    //  switching batsmen
    matchServices.switchBatsmen(main.currentBatsmen);

    //get MatchDetails
    main.getMatchDetails = function (matchName) {
      // DataService.getMatchDetails("MillikanVsAloha");
      console.log(MatchScheduleService.match);

      matchServices.getMatchData(MatchScheduleService.match.title).then(
        function (success) {
          //if success then populate the Match details
          main.matchDetails = success.data;
          if (main.matchDetails) {
            main.matchInputDone = true;
            // main.matchDetails.TeamOne.Name = MatchScheduleService.match.hometeam;
            // main.matchDetails.TeamTwo.Name = MatchScheduleService.match.awayteam;
            main.matchInput.matchName = MatchScheduleService.match.title;
            main.matchInput.teamOne = MatchScheduleService.match.hometeam;
            main.matchInput.teamTwo = MatchScheduleService.match.awayteam;
            // main.matchDetails.Overs = MatchScheduleService.match.Overs;
            // main.matchDetails.TeamOne.Batting = true;
            // main.matchDetails.TeamTwo.Batting =  false;

            //get the player list of both the teams
            teamServices.getTeam(main.matchDetails.TeamOne.Name).then(function (success) {
              if (success.data != null)
                main.matchDetails.TeamOne.Players = success.data.Players;
            }, function (error) {
              console.log('teams API error')
            });

            teamServices.getTeam(main.matchDetails.TeamTwo.Name).then(function (success) {
              if (success.data != null)
                main.matchDetails.TeamTwo.Players = success.data.Players;
            }, function (error) {
              console.log('teams API error')
            });
          }
          else if (main.matchDetails == null) {
            console.log('Fill other details');
            main.matchDetails = {
              'TeamOne': angular.copy(team), 'TeamTwo': angular.copy(team), 'Overs': 0
            };
            // main.matchDetails.TeamOne.Name = MatchScheduleService.match.hometeam;
            // main.matchDetails.TeamTwo.Name = MatchScheduleService.match.awayteam;
            main.matchInput.matchName = MatchScheduleService.match.title;
            main.matchInput.teamOne = MatchScheduleService.match.hometeam;
            main.matchInput.teamTwo = MatchScheduleService.match.awayteam;
          }
          else
            main.matchDetails = {
              'TeamOne': angular.copy(team), 'TeamTwo': angular.copy(team), 'Overs': 0
            };

          initialChronicle();
        }
        , function (error) {
          console.log(error);
        }
      );

    };

    main.getMatchDetails();
// $scope.str = main.matchDetails;


    main.undo = function () {
      console.log(main.getMatchDetails);
      main.chronicle.undo();
      console.log(main.getMatchDetails);
    };
    console.log(main.chronicle);
    //Three variable to hold score card details
    //match details- object to hold summary details


    // if (main.matchDetails = locker.get('match')) {
    // if (main.matchDetails = JSON.parse(localStorage.getItem('match'))) {
    // console.log(main.matchDetails);
    // main.matchInputDone = true;
    //  if (locker.get('currentBowlers'))
    //  {
    // // if (JSON.parse(localStorage.getItem('currentBowlers'))) {
    //   main.currentBowlers = locker.get('currentBowlers');
    //   // main.currentBowlers.Player = [];
    // }
    // }
    // }
    // else


    //edit matchDetails object
    main.editMatchDetails = function editMatchDetails() {
      $log.info(main.matchDetails);
      main.matchInputDone = false;
      main.matchInput.matchName = main.matchDetails.matchName;
      main.matchInput.teamOne = main.matchDetails.TeamOne.Name;
      main.matchInput.teamTwo = main.matchDetails.TeamTwo.Name;
      main.matchInput.overs = main.matchDetails.Overs;
      // main.matchInput.firstBatting = main.matchDetails.TeamOne.BattingFirst?main.matchDetails.TeamOne.Name: main.matchDetails.TeamTwo.Name;
    };

    main.saveMatchDetails = function (details) {
      main.matchDetails.matchName = details.matchName;
      main.matchDetails.TeamOne.Name = details.teamOne;
      main.matchDetails.TeamTwo.Name = details.teamTwo;
      main.matchDetails.Overs = details.overs;
      main.matchDetails.TeamTwo.BattingFirst = (main.matchDetails.TeamTwo.Name == details.firstBatting);
      main.matchDetails.TeamOne.BattingFirst = (main.matchDetails.TeamOne.Name == details.firstBatting);

      if (main.matchDetails.TeamOne.Name == details.firstBatting) {
        main.matchDetails.TeamOne.Batting = true;
        main.matchDetails.TeamOne.Bowling = false;
        main.matchDetails.TeamTwo.Batting = false;
        main.matchDetails.TeamTwo.Bowling = true;
      }
      else {
        main.matchDetails.TeamOne.Batting = false;
        main.matchDetails.TeamOne.Bowling = true;
        main.matchDetails.TeamTwo.Batting = true;
        main.matchDetails.TeamTwo.Bowling = false;
      }

      console.log(main.matchDetails);
      matchServices.insertMatchData(JSON.stringify(main.matchDetails)).then(
        function (success) {
          console.log(success);
        }
        , function (error) {
          console.log(error);
        }
      );


      // localStorage.setItem('match', JSON.stringify(main.matchDetails));
      locker.put('match', main.matchDetails);
      main.matchInputDone = true;
      initialChronicle();
    };

    $log.info(JSON.stringify(main.matchDetails));

    // initializing variables
    main.runsScored = [0, 1, 2, 3, 4, 5, 6];
    main.extras = ['WD', 'NB', 'BYE', 'L-BYE'];
    main.totalScore = 0;
    main.totalOvers = 0.0;
    main.balls = 0;
    main.overCounter = 0;
    main.addBowlerButton = true;
    main.addBatsmenButton = true;

    var idx;

    function initialChronicle() {
      /********************************/
      //  main.chronicle = Chronicle.record('totalOvers', main);
      //  console.log(main.chronicle);
      //Initializtion of variables
      main.canUndo = false;
      main.canRedo = false;

      //Creation of chronicle object
      main.numChronicle = Chronicle.record('matchDetails', main);
      main.currentBatsmenChronicle = Chronicle.record('currentBatsmen', main);
      main.currentBowlersChronicle = Chronicle.record('currentBowlers', main);
      main.canUndoRedo = function () {
        main.canUndo = main.numChronicle.canUndo();
        main.canRedo = main.numChronicle.canRedo();
        main.canUndo = main.currentBatsmenChronicle.canUndo();
        main.canRedo = main.currentBatsmenChronicle.canRedo();
        main.canUndo = main.currentBowlersChronicle.canUndo();
        main.canRedo = main.currentBowlersChronicle.canRedo();
      };
      main.numChronicle.addOnAdjustFunction(main.canUndoRedo);
      main.numChronicle.addOnUndoFunction(main.canUndoRedo);
      main.numChronicle.addOnRedoFunction(main.canUndoRedo);
      // main.numChronicle.addOnAdjustFunction(main.canUndoRedo);
      // main.numChronicle.addOnUndoFunction(main.canUndoRedo);
      // main.numChronicle.addOnRedoFunction(main.canUndoRedo);

      /************************************* */
    }

    // function to set main.currentExtras
    main.setExtra = function (extra) {

      main.currentExtras = extra;
    } //end of setExtra()

    function checkExists(checkArray, checkValue) {
      return checkArray.map(function (val) {
        return val.PlayerName;
      }).indexOf(checkValue);
    }


    main.addBowler = function (playerName) {
      var bowlingStats = {
        'Overs': 0, 'Runs': 0, 'Wickets': 0, '4s': 0,
        '6s': 0, '3s': 0, '2s': 0, '1s': 0, '0s': 0, 'WD': 0, 'NB': 0, 'BYE': 0
      };
      // var idx =main.currentBowlers.Player.map(function(val) {
      //   $log.info(val);
      //   return val.PlayerName;
      // }).indexOf(playerName);
      $log.info(checkExists(main.currentBowlers.Player, playerName));

      // $log.info(main.currentBowlers);

      // main.currentBowlers.Player.push({'Name':playerName});
      // main.currentBowlers.Player.push({'bowlingstats':bowlingStats});
      ((idx = checkExists(main.currentBowlers.Player, playerName)) == -1) ?
        main.currentBowlers.Player.push({
          'PlayerName': playerName,
          'active': true,
          'bowlingStats': bowlingStats
        }) : addOvers(main.currentBowlers.Player[idx]);
      // main.currentBowlers.PlayerName.push({'bowlingstats':bowlingStats});
      $log.info(JSON.stringify(main.currentBowlers));
      // localStorage['currentBowlers']= JSON.stringify(angular.copy(main.currentBowlers));
      //  locker.put('currentBowlers',angular.copy(main.currentBowlers));
      main.addBowlerButton = false;
    };

    function addOvers(bowler) {
      // bowler.bowlingstats.Overs = +1;
      bowler.active = true;
      $log.info(bowler);
    }


    function updateCurrentBowlerRuns(runs, extras) {
      angular.forEach(main.currentBowlers.Player, function (item) {
        $log.info(item);
        if (item.active) {
          if (checkOver() && extras ==0) {
            item.bowlingStats.Overs = Math.round((item.bowlingStats.Overs + 0.5) * 100) / 100;
            item.active = false;
            main.addBowlerButton = true;
            // main.showPrompt();
          }
          else {
            item.bowlingStats.Overs = Math.round((item.bowlingStats.Overs + (extras == 1 ? 0 : 0.1)) * 100) / 100;
          }
          switch (runs) {
            case 4:
              item.bowlingStats['4s'] += 1;
              $log.info(runs);
              break;
            case 6:
              $log.info(runs);
              item.bowlingStats['6s'] += 1;
              break;
            case 3:
              $log.info(runs);
              item.bowlingStats['3s'] += 1;
              break;
            case 2:
              $log.info(runs);
              item.bowlingStats['2s'] += 1;
              break;
            case 1:
              $log.info(runs);
              item.bowlingStats['1s'] += 1;
              break;

          }   //end of switch

          switch (main.currentExtras) {
            case 'WD':
              $log.info(main.currentExtras);
              item.bowlingStats.WD += 1;
              break;
            case 'NB':
              $log.info(main.currentExtras);
              item.bowlingStats.NB += 1;
              break;
            case 'BYE'    :
              $log.info(main.currentExtras);
              item.bowlingStats.BYE += 1;
              break;
          } //end of extras switch

          item.bowlingStats.Runs = item.bowlingStats.Runs + +runs + extras;
        }
      }); //end of forEach

      $log.info(main.currentBowlers.Player);

    } //end of updateCurrentBowlerRuns

    function updateCurrentBatsmenStats(runs, extras) {
      var overComplete = (extras==0)?checkOver():false;
      //  loop through the main.currentBatsmen object and update the batting stats for the player on strike
      angular.forEach(main.currentBatsmen.Player, function (item) {
        $log.info('Inside currentBatsmen');
        $log.info(item);
        //  add the runs to the batsmen on strike
        if (item.active) {
          item.battingStats.Runs += runs;

          item.battingStats.RunsByBalls = item.battingStats.RunsByBalls + ' ' + runs;
          //  if (checkOver())
          //  {
          //    changeStrike();
          //   item.active = false;
          //   main.addBatsmenButton = true;
          //  } //ending inner if
        } //ending if
      }); //end of forEach of updateCurrentBatsmenStats
      $log.info(runs % 2);
      if (runs % 2 != 0) {
        //  if runs scored is odd by the active batsmen then change the strike
        !overComplete ? changeStrike() : null;
      }
      else //runs scored are even, no strike change is need unless over is complete
      {
        overComplete ? changeStrike() : null;
      } //end of runs if-else

    } //end of updateCurrentBatsmenStats

    function changeStrike() {
      angular.forEach(main.currentBatsmen.Player, function (item) {
        $log.info(item);
        if (!item.active) {
          item.active = true;
          $log.info('Striker ' + item.PlayerName);
        }
        else {
          item.active = false;
          $log.info('Non-Striker ' + item.PlayerName);
        }
      }); //end of forEach of changeStrike
    } //end of changeStrike
    //function to return true when the ballsArray has 6 deliveries without extras
    function checkOver() {
      var cnt = 0;
      angular.forEach(main.ballsArray, function (item) {
        cnt += !item.extras ? 1 : 0;
      });
      return (cnt == 0 ? false : (cnt % 6 == 0));
    } //end of checkOver

    function saveRuns(runs) {
      var extra;

      main.num++;

      if (main.currentExtras == 'WD' || main.currentExtras == 'NB') {
        extra = 1;
      }
      else {
        extra = 0;
        //total balls
        main.balls = +main.balls + +1;
      }

      //adding to the total scrore
      main.totalScore = +runs + +extra + +main.totalScore;

      main.ballsArray.push({'runs': runs, 'extras': extra});


      // update the bowlerstats of the bowler
      updateCurrentBowlerRuns(runs, extra);

      // update the battingstats of the batsmen object
      updateCurrentBatsmenStats(runs, extra);

      // check if the over is complete
      if (checkOver() && extra==0) {
        $log.info('its over');
        main.overCounter = main.overCounter + 1;
        main.balls = 0;

        // save/update it to database
        var idx = ['TeamOne', 'TeamTwo'];

        idx.forEach(function (idxval) {
          console.log(idxval);
          angular.forEach(main.matchDetails[idxval].Players, function (item, key) {
            // console.log(item);
            if (main.matchDetails[idxval].Batting) {
              item.battingStats = {};
              main.currentBatsmen.Player.filter(function (el, index, arr) {
                if (el.PlayerName === item.PlayerName)
                  main.matchDetails[idxval].Players[key].battingStats = el.battingStats;
              }); //end of filter loop
            }  //end of batting if
            else {
              item.bowlingStats = {};
              main.currentBowlers.Player.filter(function (el) {
                if (el.PlayerName === item.PlayerName)
                  main.matchDetails[idxval].Players[key].bowlingStats = el.bowlingStats;
              });  //end of filter
            }
          });
        });

        console.log(JSON.stringify(main.matchDetails));
        matchServices.insertMatchData(JSON.stringify(main.matchDetails)).then(
          function (success) {
            console.log(success);
          }
          , function (error) {
            console.log(error);
          }
        );

      }
      else {
        main.totalOvers = '0.' + main.balls;
      } //end of if-else for checkover
      main.totalOvers = +main.overCounter + +('0.' + main.balls);

      // update the teams totalscore in match details
      main.matchDetails.TeamOne.BattingFirst ? main.matchDetails.TeamOne.TotalScore = main.totalScore : main.matchDetails.TeamTwo.TotalScore = main.totalScore;
      main.currentExtras = null;

    }

    main.undoScore = function () {
      console.log('undo');
      console.log(main.matchDetails);
      main.numChronicle.undo();
      main.currentBatsmenChronicle.undo();
      main.currentBowlersChronicle.undo();
      console.log(main.matchDetails);
    };

    function setExtra(extra) {
      main.enableExtraRuns = true;
    }

    function selectedBowler(bowler) {
      $log.info(bowler);

    }

    //
    main.addBatsmen = function (playerName, striker) {
      var battingStats = {
        'Runs': 0, 'Balls': 0, 'SR': 0.00, '4s': 0,
        '6s': 0, '3s': 0, '2s': 0, '1s': 0, '0s': 0, 'RunsByBalls': ''
      };


      //  check if the batsmen is already add in the match object
      $log.info(checkExists(main.currentBatsmen.Player, playerName));

      //  if striker is set for both the players, make the second player as striker
      if (main.currentBatsmen.Player.length == 1 && main.strikerSet) {

      }

      ((idx = checkExists(main.currentBatsmen.Player, playerName)) == -1) ?
        main.currentBatsmen.Player.push({
          'PlayerName': playerName,
          'active': !!main.striker,    // :-)
          'battingStats': battingStats
        }) : null;
      $log.info(main.currentBatsmen);
      main.addBatsmenButton = (main.currentBatsmen.Player.length != 2);
      main.striker = false;
      main.strikerSet = main.striker;
    };  //end of addBatsmen

    activate();

    main.showWicketMenu = function (ev) {
      $mdDialog.show({
        controllerUrl: '/app/main/dialog.controller.js',
        templateUrl: '/app/main/dialog.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false// Only for -xs, -sm breakpoints.
      })
        .then(function (answer) {
          main.status = 'You said the information was "' + answer + '".';
        }, function () {
          main.status = 'You cancelled the dialog.';
        });
    };


    function activate() {
      //  getTeam();
      $timeout(function () {
        main.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      main.classAnimation = '';
    }

    function getTeam() {
      if (typeof main.matchDetails.TeamOne !== 'undefined')
        if (main.matchDetails.TeamOne.Batting)
          main.matchDetails.TeamOne.Players = teamServices.getTeam(main.matchDetails.TeamOne.Name);
        else
          main.matchDetails.TeamTwo.Players = teamServices.getTeam(main.matchDetails.TeamTwo.Name);
    }
  }

  function currentBowler() {
    return function (input) {
      console.log(input);
      return input;
    }
  }
})();
