(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .constant('ApiPath', "https://davids-restaurant.herokuapp.com")
    .directive('foundItems', FoundItemsDirective)
    .service('MenuSearchService', MenuSearchService);

  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService) {
    var narrowCtrl = this;
    narrowCtrl.searchTerm = '';

    narrowCtrl.narrowIt = function () {
      narrowCtrl.nothingFound = '';
      if (narrowCtrl.searchTerm !== '') {
        var promise = MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm.toLowerCase());
        promise.then(function (foundItems) {
          if (foundItems.length === 0) {
            narrowCtrl.nothingFound = "Nothing Found";
          }
          narrowCtrl.foundItems = foundItems;
        })
      } else {
        narrowCtrl.nothingFound = "Nothing Found";
        narrowCtrl.foundItems = '';
      }
    };

    narrowCtrl.removeItem = function (index) {
      narrowCtrl.foundItems.splice(index, 1);
    };

  }





  MenuSearchService.$inject = ['$http', 'ApiPath'];

  function MenuSearchService($http, ApiPath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {

      return $http({
        method: 'GET',
        url: (ApiPath + '/menu_items.json')
      }).then(function (result) {
        var foundItems = [];
        var items = result.data.menu_items;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          if (item.description.indexOf(searchTerm) != -1) {
            foundItems.push({
              name: item.name,
              short_name: item.short_name,
              description: item.description
            });
          }
        }
        return foundItems;
      });

    };
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'narrowCtrl',
      bindToController: true
    };

    return ddo;
  }

  function FoundItemsDirectiveController() {
    var narrowCtrl = this;
  }



})();