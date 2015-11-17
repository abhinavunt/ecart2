// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController',['$scope','$http','ngDialog','usSpinnerService', function($scope,$http,ngDialog,usSpinnerService) {
	
	$scope.orderPerPageList = [{'order':10},{'order':20},{'order':30}];
	$scope.searchCriteriaList = [{'criteria':'Last 3 days orders','value':3},{'criteria':'Last 7 days orders','value':7},{'criteria':'Last 30 days orders','value':30},{'criteria':'Choose Month..','value':4}];
	$scope.orderStatusList =[{'status':'Received','value':1},{'status':'In Process','value':2},{'status':'Delivered','value':3}];
	$scope.orderStatusCheck =true;
	
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
	
	$scope.criteriaMonth ="Not Selected";
	$scope.criteriaYear ="Not Selected"
	
	$scope.fromOrderNo = 0;
	$scope.toOrderNo = 0;
	
	$scope.disablePrevButton =true;
	$scope.disableNextButton =true;
	
	$scope.searchCriteriaVal = $scope.searchCriteriaList[0].value;
	
	
	$scope.getOrderList = function(limitVal,firstDateVal,lastDateVal,searchCriteriaVal,criteriaYearVal,criteriaMonthVal,keyword){
		
		usSpinnerService.spin('spinner-admin');
		var parameter;
		if(searchCriteriaVal==4){
			parameter = {limit: limitVal, firstDate:firstDateVal, lastDate:lastDateVal, searchCriteriaVal:searchCriteriaVal, criteriaYear:criteriaYearVal, criteriaMonth:criteriaMonthVal};
		}else if(searchCriteriaVal==1){
			parameter = {limit:limitVal,firstDate:firstDateVal, lastDate:lastDateVal, searchCriteriaVal:searchCriteriaVal, keyword:keyword};
		}else{
			parameter = {limit: limitVal, firstDate:firstDateVal, lastDate:lastDateVal, searchCriteriaVal:searchCriteriaVal};
		}
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: parameter
         }).success(function(data) {
        	 usSpinnerService.stop('spinner-admin');
        	 $scope.orderlist = data.items;
        	 $scope.totalRecords = data.totalRecords; 
        	 if(data.items.length>0 && data.items.length<=limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = data.items.length;
        		 $scope.hideToFrom=false;
        	 }else if(data.items.length>0 && data.items.length>limitVal){
        		 $scope.fromOrderNo = 1;
        		 $scope.toOrderNo = limitVal;
        		 $scope.hideToFrom=false;
        	 }else if(data.items.length==0){
        		 $scope.hideToFrom=true;
        	 }
        	 
        	 if($scope.totalRecords>$scope.fromOrderNo+(limitVal-1)) $scope.disableNextButton =false;
        	 else $scope.disableNextButton =true; 
        	 
        	 $scope.disablePrevButton =true;
        	 
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
        	 
         
         }).error(function(data) {
        	 usSpinnerService.stop('spinner-admin');
			console.log('Error: ' + data);
		 });
		
	}
	
	
	$scope.nextPage = function(){
		
		var parameter;
		
		if($scope.searchCriteriaVal==4){
			parameter = {limit: $scope.orderPerPg,firstDate:"notAssigned",lastDate:$scope.lastOrderDate,searchCriteriaVal:$scope.searchCriteriaVal,criteriaYear:$scope.criteriaYear, criteriaMonth:$scope.criteriaMonth};
		}else if($scope.searchCriteriaVal==1){
			parameter = {limit:$scope.orderPerPg,firstDate:"notAssigned",lastDate:$scope.lastOrderDate, searchCriteriaVal:$scope.searchCriteriaVal, keyword:$scope.keyword};
		}else{
			parameter = {limit: $scope.orderPerPg,firstDate:"notAssigned",lastDate:$scope.lastOrderDate,searchCriteriaVal:$scope.searchCriteriaVal};
		}
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: parameter
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
		
		var parameter;
		if($scope.searchCriteriaVal==4){
			parameter = {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned",searchCriteriaVal:$scope.searchCriteriaVal,criteriaYear:$scope.criteriaYear, criteriaMonth:$scope.criteriaMonth};
		}else{
			parameter = {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned",searchCriteriaVal:$scope.searchCriteriaVal};
		}
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: parameter
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
	
	
	
	$scope.selectedOrderPerPage = function(orderPerPageObj){
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		$scope.orderPerPg = orderPerPageObj.order;
		$scope.getOrderList($scope.orderPerPg, $scope.firstOrderDate, $scope.lastOrderDate, $scope.searchCriteriaVal, $scope.criteriaYear, $scope.criteriaMonth,"");
		
		
	}
	
	$scope.getCssClass  = function(status){
		if(status==1){
			return 'danger';
		}else if(status==2){
			return 'warning';
			
		}else if(status==3){
			return 'success';
		}
	}
	
	
	$scope.selectedSearchCriteria = function(searchCriteria){
		if(searchCriteria.value==4){
			$scope.yearVal=$scope.yearList[0];
			$scope.showYearSelect=true;
			$scope.searchCriteriaVal = searchCriteria.value;
			
		}else{
			$scope.criteriaMonth ="Not Selected";
			$scope.criteriaYear ="Not Selected";
			$scope.firstOrderDate="notAssigned";
			$scope.lastOrderDate="notAssigned";
			$scope.showYearSelect=false;
			$scope.showMonthSelect = false;
			$scope.searchCriteriaVal = searchCriteria.value;
			$scope.getOrderList($scope.orderPerPg,$scope.firstOrderDate, $scope.lastOrderDate,$scope.searchCriteriaVal,$scope.criteriaYear, $scope.criteriaMonth,"");
		}
		
		$scope.keyword="";
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
			$scope.firstOrderDate="notAssigned";
			$scope.lastOrderDate="notAssigned";
			
			$scope.getOrderList($scope.orderPerPg,$scope.firstOrderDate, $scope.lastOrderDate,$scope.searchCriteriaVal,$scope.criteriaYear,$scope.criteriaMonth,"");
		}
	}
	
	$scope.searchOrderByKeyword = function(keywordVal){
		if(typeof(keywordVal)!='undefined'){
			$scope.searchCriteriaVal=1;
			$scope.firstOrderDate="notAssigned";
			$scope.lastOrderDate="notAssigned";
			$scope.criteriaYear="Not Selected";
			$scope.criteriaMonth="Not Selected";
			$scope.keyword = keywordVal;
			
			$scope.getOrderList($scope.orderPerPg, $scope.firstOrderDate, $scope.lastOrderDate, $scope.searchCriteriaVal, $scope.criteriaYear, $scope.criteriaMonth, $scope.keyword);
		}
	}
	
	$scope.openOrderDetails = function(order){
		$scope.showOrderList = order;
		if(order.status==1){
			$scope.selectedStatus = $scope.orderStatusList[0];
		}else if(order.status==2){
			$scope.selectedStatus = $scope.orderStatusList[1];
		}else if(order.status==3){
			$scope.selectedStatus = $scope.orderStatusList[2];
		}
		
		var dialog = ngDialog.open({
            template: 'views/adminTemplates/showOrderListPopup.html',
            scope: $scope,
            className: 'ngdialog-theme-default'
          });
	}
	
	
	$scope.changeStatus = function(statusObj){
		if(statusObj.value!=$scope.selectedStatus.value) $scope.orderStatusCheck=false;
		else $scope.orderStatusCheck=true;
		$scope.tempSelectedStatus = statusObj;
	}
	
	$scope.saveStatus = function(){
		usSpinnerService.spin('spinner-saveOrderStatus');
		$http({
            url: '/order/saveOrderStatus',
            method: "POST",
            data: {orderId:$scope.showOrderList._id,status:$scope.tempSelectedStatus.value},
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
        	usSpinnerService.stop('spinner-saveOrderStatus');
        	for(var i=0;i<$scope.orderlist.length;i++){
        		if($scope.orderlist[i]._id==$scope.showOrderList._id){
        			$scope.orderlist[i].status = data.changedStatus;
        			$scope.orderlist[i].statusClass = data.changedStatusClass;
        			break;
        		}
        	}
        	$scope.orderStatusCheck =true;
        }).error(function (data, status, headers, config) {
        	usSpinnerService.stop('spinner-saveOrderStatus');
        });
		
	}
	
	
	
	$scope.getOrderList($scope.orderPerPage,$scope.firstOrderDate,$scope.lastOrderDate,$scope.searchCriteriaVal,$scope.criteriaYear,$scope.criteriaMonth,"");
}]);