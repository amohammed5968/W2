/**
 * Created by ahsannaveedmohammed on 4/9/17.
 */
(function() {
  'use strict';

  angular
    .module('w2')
    .service('teamServices', teamServices);

  /** @ngInject */
  function teamServices() {
    var data = [
      {
        'PlayerName': 'Ahsan Naveed Mohammed'
      },
      {
        'PlayerName': 'Hanumanth Reddy'
      },
      {
        'PlayerName': 'Akhil Bhimala'
      },
      {
        'PlayerName': 'Manikeshwar Thota'
      },
      {
        'PlayerName': 'Rejeesh Nagarajan'
      },
      {
        'PlayerName': 'Mahesh M'
      },
      {
        'PlayerName': 'Sumit Saraswat'
      },
      {
        'PlayerName': 'Raksha Pandey'
      },
      {
        'PlayerName': 'Rekha Garlapati'
      },
      {
        'PlayerName': 'Jacob Niesen'
      },
      {
        'PlayerName': 'Cedric Ballard'
      },
      {
        'PlayerName': 'Surya Pydi'
      }
    ];

    this.getTeam = getTeam;

    function getTeam() {
      return data;
    }
  }

})();
