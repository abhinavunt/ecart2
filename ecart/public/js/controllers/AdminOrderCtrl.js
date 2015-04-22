// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	$scope.orderPerPageList = [{'order':10},{'order':20},{'order':30}];
	$scope.searchCriteriaList = [{'criteria':'Last 3 days orders'},{'criteria':'Last 7 days orders'},{'criteria':'Last 30 days orders'},{'criteria':'Choose Month..'}];
	
	$scope.yearList = [];
	for(var i=1;i>=0;i--){
		var year = {"year":new Date().getFullYear()-i};
		$scope.yearList.push(year);
	}
	
	
	$scope.monthList = [{'month':'January'},{'month':'Fabruary'},{'month':'March'},{'month':'April'},{'month':'May'},{'month':'June'},{'month':'July'},{'month':'August'},
	                    {'month':'September'},{'month':'October'},{'month':'November'},{'month':'December'}];
	$scope.orderPerPage = $scope.orderPerPageList[0].order;
	$scope.orderPerPg = $scope.orderPerPageList[0].order;
	$scope.firstOrderDate ="notAssigned";
	$scope.lastOrderDate ="notAssigned";
	
	$scope.fromOrderNo = 0;
	$scope.toOrderNo = 0;
	
	$scope.disablePrevButton =true;
	$scope.disableNextButton =true;
	
	$scope.getOrderList = function(limitVal,firstDateVal,lastDateVal){
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: limitVal,firstDate:firstDateVal,lastDate:lastDateVal}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 $scope.totalRecords = data.totalRecords; 
        	 if(data.items.length>0 && data.items.length<=limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = data.items.length;
        	 }else if(data.items.length>0 && data.items.length>limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = limitVal;
        	 }
        	 
        	 if($scope.totalRecords>$scope.fromOrderNo+(limitVal-1)) $scope.disableNextButton =false;
        	 else $scope.disableNextButton =true; 
        	 
        	 $scope.disablePrevButton =true;
        	 
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
		
	}
	
	
	$scope.nextPage = function(){
		
	     $http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: $scope.orderPerPg,firstDate:"notAssigned",lastDate:$scope.lastOrderDate}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 
        	 if(data.items.length<=$scope.orderPerPg){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.orderPerPg;
        		 $scope.toOrderNo = $scope.toOrderNo + data.items.length;
        	 }else if(data.items.length>$scope.orderPerPg){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.orderPerPg;
        		 $scope.toOrderNo = $scope.toOrderNo+$scope.orderPerPg;
        	 }
        	 
        	 if($scope.toOrderNo<$scope.totalRecords) $scope.disableNextButton =false;
        	 else $scope.disableNextButton =true;
        	 
        	 $scope.disablePrevButton = false;
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
        	 
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
	$scope.previousPage = function(){
		
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned"}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 
        	 if($scope.toOrderNo - $scope.fromOrderNo+1 == $scope.orderPerPg){
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.orderPerPg;
        		 $scope.toOrderNo = $scope.toOrderNo - $scope.orderPerPg; 
        	 }else if($scope.toOrderNo - $scope.fromOrderNo+1 < $scope.orderPerPg){
        		 $scope.toOrderNo = $scope.fromOrderNo - 1;
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.orderPerPg;
        	 }
        	 
        	 if($scope.fromOrderNo == 1) $scope.disablePrevButton =true;
        	 else $scope.disablePrevButton =false;
        	 
        	 $scope.disableNextButton =false;
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
	
	
	
	$scope.getOrderList($scope.orderPerPage,$scope.firstOrderDate,$scope.lastOrderDate);
});