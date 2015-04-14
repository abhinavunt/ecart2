// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	$scope.orderPerPageList = [{'order':10},{'order':2},{'order':1}];
	$scope.orderPerPage = $scope.orderPerPageList[0].order;
	$scope.orderPerPg = $scope.orderPerPageList[0].order;
	$scope.firstOrderDate ="notAssigned";
	$scope.lastOrderDate ="notAssigned";
	
	$scope.fromOrderNo = 0;
	$scope.toOrderNo = 0;
	
	$scope.disablePrevButton =true;
	$scope.disableNextButton =false;
	
	$scope.getOrderList = function(limitVal,firstDateVal,lastDateVal){
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: limitVal,firstDate:firstDateVal,lastDate:lastDateVal}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 if($scope.firstOrderDate=="notAssigned" && $scope.lastOrderDate=="notAssigned"){
        		 $scope.totalRecords = data.totalRecords; 
        	 }
        	 
        	 if(data.items.length>0 && data.items.length<=limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = data.items.length;
        	 }else if(data.items.length>0 && data.items.length>limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = limitVal;
        	 }
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
        	 
        	 
        	
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
		
	}
	
	$scope.myFunction = function(order){
		$scope.showOrderList = order;
		
		var dialog = ngDialog.open({
            template: 'views/adminTemplates/showOrderListPopup.html',
            scope: $scope,
            className: 'ngdialog-theme-default'
          });
	}
	
	$scope.selectedOrderPerPage = function(orderPerPageObj){
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		$scope.orderPerPg = orderPerPageObj.order;
		$scope.getOrderList($scope.orderPerPg,$scope.firstOrderDate,$scope.lastOrderDate);
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
	
	$scope.previousPage = function(){
		$scope.getOrderList($scope.orderPerPg,$scope.firstOrderDate,"notAssigned");
	}
	
	$scope.nextPage = function(){
		$scope.getOrderList($scope.orderPerPg,"notAssigned",$scope.lastOrderDate);
	}
	
	$scope.getOrderList($scope.orderPerPage,$scope.firstOrderDate,$scope.lastOrderDate);
});