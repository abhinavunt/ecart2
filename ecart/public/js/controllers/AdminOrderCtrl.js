// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	$scope.orderPerPageList = [{'order':10},{'order':25},{'order':50}];
	$scope.orderPerPage = $scope.orderPerPageList[0].order;
	
	
	$http({
            url: '/order/orderList',
            method: "GET",
            params: {year: yearVal}
         }).success(function(data) {
        	 $scope.orderlist = data;
        	
		 }).error(function(data) {
			console.log('Error: ' + data);
		 });
		
	//http://blog.mongodirector.com/fast-paging-with-mongodb/
	
	$scope.myFunction = function(order){
		$scope.showOrderList = order;
		
		var dialog = ngDialog.open({
            template: 'views/adminTemplates/showOrderListPopup.html',
            scope: $scope,
            className: 'ngdialog-theme-default'
          });
	}
	
	$scope.selectedOrderPerPage = function(orderPerPageObj){
		$scope.orderPerPage = orderPerPageObj.order;
	}
});