/**
 * Created by ahsannaveedmohammed on 4/9/17.
 */
(function() {
  'use strict';

  angular
    .module('w2')
    .service('teamServices', teamServices)
    .factory('matchServices', matchServices);

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

    var data2 = [
      {
        'PlayerName': 'Shrini'
      },
      {
        'PlayerName': 'Saravana Prakash'
      },
      {
        'PlayerName': 'Sasi Kiran'
      },
      {
        'PlayerName': 'Naren'
      },
      {
        'PlayerName': 'Vijay'
      }
    ];

    this.getTeam = getTeam;

    function getTeam(teamName) {
      if (teamName=='Millikan')
      return data;
      else
      return data2;
    }
  }

  function matchServices(RestAPIURLFactory, $http)
  {
    var matchServices = {};

    matchServices.getMatchesData = function () {
      return $http.get(RestAPIURLFactory.matches);
    };

    matchServices.getMatchData = function (id) {
      return $http.get(RestAPIURLFactory.matches + '/' + id);
    };

    matchServices.insertMatchData = function (match) {
      return $http.post(RestAPIURLFactory.matches, match);
    };

    // matchServices.updateCustomer = function (cust) {
    //   return $http.put(urlBase + '/' + cust.ID, cust)
    // };

    // matchServices.deleteCustomer = function (id) {
    //   return $http.delete(urlBase + '/' + id);
    // };

    // matchServices.getOrders = function (id) {
    //   return $http.get(urlBase + '/' + id + '/orders');
    // };

    return matchServices;
  }
})();
