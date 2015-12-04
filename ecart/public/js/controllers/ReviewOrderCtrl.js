angular.module('ReviewOrderCtrl', []).controller('ReviewOrderController',['$scope','$http','usSpinnerService','shoppingCartService','$cookieStore','$state', function($scope,$http,usSpinnerService,shoppingCartService,$cookieStore,$state) {
	 $scope.reviewProducts = shoppingCartService.getProducts();
     $scope.reviewUser = $cookieStore.get('user');
     $scope.reviewGrandTotal = $cookieStore.get('grandTotal');
	 $scope.deliverySlotList = [{'slot':'-- Select Delivery Slot --','value':0},{'slot':'Today (between 10am to 1pm )','value':1,'disable':'N'},{'slot':'Today (between 5pm to 8pm )','value':2,'disable':'N'},{'slot':'Tomorrow (between 10am to 1pm)','value':3,'disable':'N'},{'slot':'Tomorrow (between 5pm to 8pm)','value':4,'disable':'N'}];
     $scope.deliverySlotObj = $scope.deliverySlotList[0];
     $scope.validateDeliSlotMsg="";
     
	 $scope.updateDeliverySlot = function(hour){
  	   if(hour>8 && hour<=15) $scope.deliverySlotList[1].disable='Y';
		   else if(hour>15){
				$scope.deliverySlotList[1].disable='Y';
				$scope.deliverySlotList[2].disable='Y';
			}
     }
	 
	 $scope.updateDeliverySlotValidate = function(hour){
		   if(hour>8 && hour<=15 && $scope.deliverySlotObj.value!=3 && $scope.deliverySlotObj.value!=4){
	  		 $scope.deliverySlotList[1].disable='Y';
	  		 $scope.deliverySlotObj = $scope.deliverySlotList[0];
	  		 $scope.validateDeliSlotMsg = "Please re-select the delivery slot !!!"
	  	   }else if(hour>15 && $scope.deliverySlotObj.value!=3 && $scope.deliverySlotObj.value!=4){
			 $scope.deliverySlotList[1].disable='Y';
			 $scope.deliverySlotList[2].disable='Y';
			 $scope.deliverySlotObj = $scope.deliverySlotList[0];
			 $scope.validateDeliSlotMsg = "Please re-select the delivery slot !!!"
	  	   }else{
	  		   $state.go('paymentGateway',{slot:$scope.deliverySlotObj.value});
	  	   }
	     }
	 
	 $scope.selectedDeliverySlot = function(obj){
  	   $scope.deliverySlotObj = obj;
  	   $scope.validateDeliSlotMsg="";
  	  
     }
     
     $scope.proceedToPayment = function(){
    	 
    	 $scope.updateDeliverySlotValidate(new Date().getHours());
    	 
    	 
     }
     
     $scope.updateDeliverySlot(new Date().getHours());
    // $scope.updateDeliverySlot(9); 
	
}]);
