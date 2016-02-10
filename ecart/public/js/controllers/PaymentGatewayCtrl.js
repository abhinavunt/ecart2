// public/js/controllers/NerdCtrl.js
angular.module('PaymentGatewayCtrl', []).controller('paymentGatewayController',['$scope','$http','$state','$stateParams','$cookieStore','usSpinnerService','shoppingCartService', function($scope,$http,$state,$stateParams,$cookieStore,usSpinnerService,shoppingCartService) {
	
	
	
	$scope.paymentMode="debit";
	
	//month list for payment gateway page
    var months = [{"selectMonth":"01(Jan)"},{"selectMonth":"02(Fab)"},{"selectMonth":"03(Mar)"},
                  {"selectMonth":"04(Aprl)"},{"selectMonth":"05(May)"},{"selectMonth":"06(Jun)"},
                  {"selectMonth":"07(Jul)"},{"selectMonth":"08(Aug)"},{"selectMonth":"09(Sep)"},
                  {"selectMonth":"10(Oct)"},{"selectMonth":"11(Nov)"},{"selectMonth":"12(Dec)"}];
    $scope.monthList = months;
   
   
   
    // year list for payment gateway page
    var currentTime = new Date();
    var year = currentTime.getFullYear();
    var years = [{"selectYear":year}];
    for(var i=0;i<20;i++) {
           year = year+1;
           yearEntry = {"selectYear":year};
           years.push(yearEntry);
           }
    $scope.yearList = years;
    
    
    $scope.submitOrder = function() {
    	if($stateParams.slot==1){
    		var deliveryDateVal = new Date();
    		var slotVal = 1;
    	}else if($stateParams.slot==2){
    		var deliveryDateVal = new Date();
    		var slotVal = 2;
    	}else if($stateParams.slot==3){
    		var deliveryDateVal = new Date();
    		deliveryDateVal.setDate(deliveryDateVal.getDate() + 1);
    		var slotVal = 1;
    	}else if($stateParams.slot==4){
    		var deliveryDateVal = new Date();
    		deliveryDateVal.setDate(deliveryDateVal.getDate() + 1);
    		var slotVal = 2;
    	}	
    
    	if(typeof($cookieStore.get('user'))=="undefined"){
 		   var finalOrderObject = {
 	    			 fullName: $cookieStore.get('guest').fullName,
 	                 emailId : $cookieStore.get('guest').emailId,
 	                 mobileNo : $cookieStore.get('guest').mobileNo,
 	                 alternateNo : $cookieStore.get('guest').alternateNo,
 	                 address : $cookieStore.get('guest').address,
 	                 slot: slotVal,
 	                 date : new Date(),
 	                 deliveryDate: deliveryDateVal,
 	                 grandTotal: $cookieStore.get('grandTotal'),
 	                 order: $scope.products
 	    	  }
 	   }else{
 		   var finalOrderObject = {
 	    			 fullName: $cookieStore.get('user').fullName,
 	                 emailId : $cookieStore.get('user').emailId,
 	                 mobileNo : $cookieStore.get('user').mobileNo,
 	                 alternateNo : $cookieStore.get('user').alternateNo,
 	                 address : $cookieStore.get('user').address,
 	                 slot: slotVal,
 	                 date : new Date(),
 	                 deliveryDate: deliveryDateVal,
 	                 grandTotal: $cookieStore.get('grandTotal'),
 	                 order: $scope.products
 	    	  }
 	   }
    	
   	 
   	 
   	  $http({
		   url: '/order/submitOrder',
		   method: "POST",
		   data: angular.toJson(finalOrderObject),
		   headers: {'Content-Type': 'application/json'}
		 }).success(function (data, status, headers, config) {
		        shoppingCartService.setOrderId(data);
		        shoppingCartService.emptyCart();
		        $state.go("completeOrder");
		        
		 }).error(function (data, status, headers, config) {
		
		 });
      };
}]);
