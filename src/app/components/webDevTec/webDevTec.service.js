(function() {
  'use strict';

  angular
      .module('w2')
      .service('webDevTec', webDevTec);

  /** @ngInject */
  function webDevTec() {
    var data = [
      {
        'PlayerName': 'p1'
      },
      {
        'PlayerName': 'p2'
      },
      {
        'PlayerName': 'p3'
      },
      {
        'PlayerName': 'p4'
      },
      {
        'PlayerName': 'p5'
      },
      {
        'PlayerName': 'p6'
      },
      {
        'PlayerName': 'p7'
      },
      {
        'PlayerName': 'p8'
      },
      {
        'PlayerName': 'p9'
      },
      {
        'PlayerName': 'p10'
      },
      {
        'PlayerName': 'p11'
      }
    ];

    this.getTec = getTec;

    function getTec() {
      return data;
    }
  }

})();
