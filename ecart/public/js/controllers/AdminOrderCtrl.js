// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	$scope.orderPerPageList = [{'order':3},{'order':2},{'order':1}];
	$scope.orderPerPage = $scope.orderPerPageList[0].order;
	$scope.firstOrderId ='notAssigned';
	$scope.lastOrderId ='notAssigned';
	
	$scope.getOrderList = function(limitVal,firstIdVal,lastIdVal){
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: limitVal,firstId:firstIdVal,lastId:lastIdVal}
         }).success(function(data) {
        	 $scope.orderlist = data;
        	 $scope.firstOrderId = data[0]._id;
        	 $scope.lastOrderId = data[length-1]._id;
		 }).error(function(data) {
			console.log('Error: ' + data);
		 });
		
	}
	
		
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
		$scope.getOrderList(orderPerPageObj.order,$scope.firstOrderId,$scope.lastOrderId);
	}
	
	$scope.getCssClass  = function(status){
		if(status=="Recieved"){
			return 'danger';
		}else if(status=="InProcess"){
			return 'warning';
			
		}else if(status=="Delivered"){
			return 'success';
		}
	}
	
	$scope.getOrderList($scope.orderPerPage,$scope.firstOrderId,$scope.lastOrderId);
});