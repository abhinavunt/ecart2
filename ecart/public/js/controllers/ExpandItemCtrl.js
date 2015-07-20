// public/js/controllers/NerdCtrl.js
angular.module('ExpandItemCtrl', []).controller('ExpandItemController', function($scope,$http,$stateParams,expandItemService) {
	
	 if(typeof($stateParams.menuObj)=='string'|| typeof($stateParams.itemObj)=='string'||typeof($stateParams.brandList)=='string'){
     	$scope.sideMenu = expandItemService.getMenuObject();
     	$scope.itemObject = expandItemService.getItemObject();
     	
     }else{
     	$scope.sideMenu = $stateParams.menuObj;
     	$scope.itemObject = $stateParams.itemObj;
     	expandItemService.setMenuObject($stateParams.menuObj);
     	expandItemService.setItemObject($stateParams.itemObj);
     	
	 }
	 
	 $scope.quantityList = [{quantity:1 },
                            {quantity:2 },
                            {quantity:3 },
                            {quantity:4 },
                            {quantity:5 },
                            {quantity:6 },
                            {quantity:7 },
                            {quantity:8 },
                            {quantity:9 }];
	 
	 
});
