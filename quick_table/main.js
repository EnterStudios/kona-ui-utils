//cool sortable table - please see README.md

angular.module('quickTable', []).controller('quickTableCtrl', ['$scope', '$element',
  function($scope, $element) {

    $scope.tableReady = false;
    $scope.resizeT = null;
    
    setTimeout(function(){
      
      var nodeId = $element[0].parentNode.id;
      if(nodeId.indexOf("{") != -1){
        return; //dom not ready
      }
      $scope.query = $scope.queries[nodeId];
      $scope.query.sort = {
        order:   undefined != $scope.query.order ? $scope.query.order : $scope.query.cells[0].id,
        reverse: undefined != $scope.query.reverse ? $scope.query.reverse : false,
        search:  '',
        page:    0,
        pageSize: 100,
        crud: $scope.query.crud
      }
     
      $scope.numOfPages = function(){
        return Math.ceil($scope.query.dataArray.length/$scope.query.sort.pageSize);                
      }

      $scope.$on('resetSort', function () {
          $scope.query.sort.order      = $scope.query.order;
          $scope.query.sort.reverse    = $scope.query.reverse;
          $scope.query.sort.search     = '';
          $scope.query.sort.page       = 0;
      });

      $scope.tableReady = true;
    },0);

    $scope.sortCell = function(cell){
      if($scope.query.sort.order === cell.id){
        $scope.query.sort.reverse = !$scope.query.sort.reverse;
      }
      $scope.query.sort.order = cell.id; 
    }

    $scope.checkResize = function(){
        clearTimeout($scope.resizeT);
        
        $scope.searchT = setTimeout(function(){
          if(typeof $scope.resize=='function'){
            $scope.resize();
          }
        },400);
      }

}]).filter('startFrom', function() { 
    return function(input, start) {
        start = +start; //parse to int
        if (!input){
          return [];
        }
        else{
          return input.slice(start);
        }
    }
}).filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});