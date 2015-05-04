// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	$scope.orderPerPageList = [{'order':10},{'order':20},{'order':30}];
	$scope.searchCriteriaList = [{'criteria':'Last 3 days orders','value':3},{'criteria':'Last 7 days orders','value':7},{'criteria':'Last 30 days orders','value':30},{'criteria':'Choose Month..','value':4}];
	
	$scope.yearList = [{"year":"Select Year"}];
	for(var i=1;i>=0;i--){
		var year = {"year":new Date().getFullYear()-i};
		$scope.yearList.push(year);
	}
	
	
	$scope.monthList = [{"month":"Select Month","value":0},{'month':'January',"value":1},{'month':'Fabruary',"value":2},{'month':'March',"value":3},{'month':'April',"value":4},{'month':'May',"value":5},{'month':'June',"value":6},{'month':'July',"value":7},{'month':'August',"value":8},
	                    {'month':'September',"value":9},{'month':'October',"value":10},{'month':'November',"value":11},{'month':'December',"value":12}];
	$scope.orderPerPage = $scope.orderPerPageList[0].order;
	$scope.orderPerPg = $scope.orderPerPageList[0].order;
	$scope.firstOrderDate ="notAssigned";
	$scope.lastOrderDate ="notAssigned";
	
	$scope.fromOrderNo = 0;
	$scope.toOrderNo = 0;
	
	$scope.disablePrevButton =true;
	$scope.disableNextButton =true;
	
	$scope.searchCriteriaVal = $scope.searchCriteriaList[0].value;
	
	$scope.getOrderList = function(limitVal,firstDateVal,lastDateVal,searchCriteriaVal){
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: {limit: limitVal,firstDate:firstDateVal,lastDate:lastDateVal,searchCriteriaVal:searchCriteriaVal}
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
            params: {limit: $scope.orderPerPg,firstDate:"notAssigned",lastDate:$scope.lastOrderDate,searchCriteriaVal:$scope.searchCriteriaVal}
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
            params: {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned",searchCriteriaVal:$scope.searchCriteriaVal}
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
		$scope.getOrderList($scope.orderPerPg,$scope.firstOrderDate,$scope.lastOrderDate,$scope.searchCriteriaVal);
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
	
	
	$scope.selectedSearchCriteria = function(searchCriteria){
		if(searchCriteria.value==4){
			$scope.yearVal=$scope.yearList[0];
			$scope.showYearSelect=true;
			$scope.searchCriteriaVal = searchCriteria.value;
			
		}else{
			$scope.showYearSelect=false;
			$scope.showMonthSelect = false;
			$scope.searchCriteriaVal = searchCriteria.value;
			$scope.getOrderList($scope.orderPerPg,"notAssigned","notAssigned",$scope.searchCriteriaVal);
		}
	}
	
	$scope.selectedYear = function(yearVal){
		
		if(yearVal.year!="Select Year"){
			$scope.monthVal=$scope.monthList[0];
			$scope.showMonthSelect = true;
			$scope.criteriaYear = yearVal.year;
		}else{
			$scope.showMonthSelect = false;
		}
	}
	
	$scope.selectedMonth = function(monthVal){
		if(monthVal.value!=0){
			
			$scope.criteriaMonth = monthVal.value;
		
		}
	}
	
	
	
	$scope.getOrderList($scope.orderPerPage,$scope.firstOrderDate,$scope.lastOrderDate,$scope.searchCriteriaVal);
});