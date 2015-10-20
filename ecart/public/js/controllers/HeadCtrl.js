// public/js/controllers/NerdCtrl.js
angular.module('HeadCtrl', []).controller('HeadController', function($scope,$http,$state,$location,$cookieStore,ngDialog,shoppingCartService,menuItemService,expandItemService,usSpinnerService) {
 
       $scope.tagline = 'Nothing beats a pocket protector!';
       $scope.products = shoppingCartService.getProducts();
       $scope.user = $cookieStore.get('user');
       $cookieStore.put('editUserFlip',false);
       
       if(typeof($cookieStore.get('grandTotal'))=='undefined'){
    	   $scope.grandTotal = 0;
    	   $scope.itemCount = 0;
       }
       
       //User Login
       if($cookieStore.get('loggedIn')==true){
    	  $scope.showLogIn = false;
    	  $scope.showLogOut = true;
    	  $scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;
    	  $scope.userType = $cookieStore.get('userType');
	   	  if($scope.userType=="customer")$scope.headerTabUser=true;
	      else if($scope.userType=="admin")$scope.headerTabAdmin=true;
       }else{
    	  $cookieStore.put('loggedIn',false);
    	  $scope.showLogIn = true;
    	  $scope.showLogOut = false;  
       }
       
       $scope.$watch(function() { return $cookieStore.get('grandTotal') }, function() {
    	   if(typeof($cookieStore.get('grandTotal'))!='undefined'){
    		   $scope.grandTotal = $cookieStore.get('grandTotal');
    		   $scope.itemCount = $cookieStore.get('productList').length;
    	   }
       });
       
       $scope.$watch(function() { return $cookieStore.get('loggedIn') }, function() {
    	   if($cookieStore.get('loggedIn')==true){
    		   
    		   $scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName; 
   			   $scope.showLogIn = false;
   	   		   $scope.showLogOut = true;
   	   		   $scope.user = $cookieStore.get('user');
   	   		   $scope.userType = $cookieStore.get('userType');
   	   		   
   	   		   if($scope.userType=="customer"){
   	   			$scope.headerTabUser=true;
   	   			$scope.headerTabAdmin=false;
   	   		   }
   	   		   else if($scope.userType=="admin"){
   	   			$scope.headerTabUser=false;
   	   			$scope.headerTabAdmin=true;
   	   		   }
   	   	   }
       });
       
       $scope.$watch(function() { return $cookieStore.get('editUserFlip') }, function() {
    	   if(typeof($cookieStore.get('user')) != "undefined"){
    		   $scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;  
    	   }
       });
       
      
       $scope.getAdminPage = function(){
    	   
    	   $http({
               url: '/user/adminValidation',
               method: "POST",
               data: {key:$cookieStore.get('authKey')},
               headers: {'Content-Type': 'application/json'}
             }).success(function (data, status, headers, config) {
            	 if(data.authResult=="pass"){
            		 $state.go('adminPortal',{reload: true});
            	 }else if(data.authResult=="fail"){
            		 $state.go('adminAuthFailed');
            	 }
             }).error(function (data, status, headers, config) {
           
             }); 
    	   
    	   
       }
       
       $scope.getMyAccount = function(){
    	   $state.go('userPortal',{reload: true}); 
       }
       
       $scope.loginSignUp = function(key){
    	  
    	  if(key=='signup') $scope.showLoginPage = false;
      	  else if(key=='login') $scope.showLoginPage = true;
    	  $state.go('loginOrSignUp',{reload: true}); 
       }
       
       $scope.loginSignUpSwitch = function(key){
     	  if(key=='signup') $scope.showLoginPage = false;
     	  else if(key=='login') $scope.showLoginPage = true;
       }
       
      //User Log Out
	  $scope.logout = function(){
		  $cookieStore.put('loggedIn',false);
		  $scope.headerTabUser=false;
		  $scope.headerTabAdmin=false;
		  $scope.showLogIn = true;
		  $scope.showLogOut = false;
		  $cookieStore.remove('user');
		  $scope.headerTab="";
		  $scope.welcomeMessage =''; 
		  $location.path("/");
		  
	  }
	 
      
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
      
      
      
       $scope.showCart = function() {
             
              $scope.grandTotal = shoppingCartService.getGrandTotal();
              var dialog = ngDialog.open({
             template: 'views/shoppingCart.html',
             scope: $scope,
             className: 'ngdialog-theme-default'
           });
       };
       
       $scope.counterPlus = function(itemObj){
           shoppingCartService.setQuantity(itemObj,"plus");
           $scope.grandTotal = shoppingCartService.getGrandTotal();
          
       };
       
       $scope.counterMinus = function(itemObj){
           shoppingCartService.setQuantity(itemObj,"minus");
           $scope.grandTotal = shoppingCartService.getGrandTotal();
       };
      
      
       $scope.removeFromCart = function(item) {
              shoppingCartService.removeProduct(item);
              $scope.grandTotal = shoppingCartService.getGrandTotal();
       };
       
       $scope.checkForReviw = function(){
    	  
    	  if($cookieStore.get('loggedIn')==false){
    		 $scope.showLoginPage=true;
    		 var dialog = ngDialog.open({
    	            template: 'views/loginOrSignupCheckout.html',
    	            scope: $scope,
    	            className: 'ngdialog-theme-default',
    	          });
    		}else{
    			
    			$location.path("/reviewOrder");
    		}
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
       
       $scope.isSelected = function(itemObj){
       
      
           var shoppingCart = shoppingCartService.getProducts();
           var itemsFound = getById(shoppingCart,itemObj.productId);
           if (itemsFound) {
             return true;
           } else {
             return false;
           }
       };
       
       function getById(arr, id) {
           for (var d=0;d<arr.length;d++) {
          if (arr[d].productId == id) {
          return true;
          break;
          }
         }
           return false;
       }
       
       $scope.addToCart = function(amountObj,quantityObj,itemObj){
    	  var cartEntry = {

                        itemName: itemObj.name,
                        brand: itemObj.brand,
                        amount: amountObj.Amount,
                        price: amountObj.Price,
                        quantity: quantityObj.quantity,
                        totalPrice: quantityObj.quantity*amountObj.Price,
                        productId: amountObj.productId,
                        imageId:itemObj.imageId

           };

           shoppingCartService.addProduct(cartEntry);

         

       };
       
      
       $scope.liveSearch = function(){
	           if($scope.keyWord!=''){
	        	  $scope.showLiveSearchTable=false;
	        	  usSpinnerService.spin("spinner-4");
	                  $http({
	                      url: '/item/liveSearch',
	                      method: "POST",
	                      data: {keyWord:$scope.keyWord},
	                      headers: {'Content-Type': 'application/json'}
	                    }).success(function (data, status, headers, config) {
	                    	usSpinnerService.stop("spinner-4");
	                         if(data.length==0){
	                           $scope.liveResultList = [];
	                           angular.element('.liveResultList').show();
	                           $scope.showLiveSearchTable=true;
	                           $scope.noDataFound=true;
	                           
	                   }else{
	                           $scope.liveResultList = data;
	                           angular.element('.liveResultList').show();
	                           $scope.showLiveSearchTable=true;
	                           $scope.noDataFound=false;
	                   }
	                    }).error(function (data, status, headers, config) {
	                  
	                    });  
	             }else{
	            	$scope.liveResultList = {};
	                 $scope.showLiveSearchTable=false;
	                 $scope.noDataFound=false;
	             }
	           
	           
	      }
       
       $scope.expandItemFromLiveSrch = function(item,retState){
           var sideMenu;
           expandItemService.setItem(item);
       	   expandItemService.setCategoryString(item.categoryTwoId);
       	   expandItemService.setCategoryLevel("2");
       	   if(retState!='getPreSet')expandItemService.setReturnState(retState);
       	   
       	   for(var i=0;i<menuItemService.getMenu().length;i++){
       		   if(menuItemService.getMenu()[i]._id==item.categoryZeroId){
       			   sideMenu = menuItemService.getMenu()[i];
       		   }
       	    }
       	   
       	   $scope.showLiveSearchTable=false;
       	   $scope.keyWord ="";
       	   $state.go('expandItem',{itemObj:item,menuObj:sideMenu});
       }
       
       $scope.submitOrder = function() {
    	 var finalOrderObject = {
    			 fullName: $cookieStore.get('user').fullName,
                 emailId : $cookieStore.get('user').emailId,
                 mobileNo : $cookieStore.get('user').mobileNo,
                 alternateNo : $cookieStore.get('user').alternateNo,
                 address : $cookieStore.get('user').address,
                 date : new Date(),
                 grandTotal: $cookieStore.get('grandTotal'),
                 order: $scope.products
    	  }
    	 
    	$http({
		   url: '/order/submitOrder',
		   method: "POST",
		   data: angular.toJson(finalOrderObject),
		   headers: {'Content-Type': 'application/json'}
		 }).success(function (data, status, headers, config) {
		        shoppingCartService.setOrderId(data);
		        shoppingCartService.emptyCart();
		        $scope.grandTotal = 0;
		    	$scope.itemCount = 0;
		        $location.path("/completeOrder");
		 }).error(function (data, status, headers, config) {
		
		 });
       };
       
       $scope.openUserFeedback = function(){
    	   $scope.feedbackFullName="";
    	   $scope.feedbackEmailId="";
    	   $scope.feedbackMessage="";
    	   $scope.feedbackValidateMsg="";
    	   $scope.feedbackSuccess = false;
    	   $state.go('userFeedback');
       }
       
       
       $scope.submitFeedback = function(){
    	  
       	if( typeof($scope.feedbackFullName)=='undefined'||$scope.feedbackFullName==''||
   	        typeof($scope.feedbackEmailId)=='undefined'||$scope.feedbackEmailId==''||
   			typeof($scope.feedbackMessage)=='undefined'||$scope.feedbackMessage=='')
       	{
       		$scope.feedbackValidateMsg = "Required(*) field/(s) are missing !!!";
       		return false;
       	}
       	
       	else if($scope.feedbackFullName.length<3){
       		$scope.feedbackValidateMsg = "Your Full Name should contain atleast 3 characters!!!";
       		return false;
       	}
       	
       	else if(validateEmail($scope.feedbackEmailId)==false){
       		$scope.feedbackValidateMsg = "Please provide a valid email address!!!";
       		return false;
       	}
       	
       	else{
       	
       	var feedbackData ={
       			fullName : $scope.feedbackFullName,
   				emailId : $scope.feedbackEmailId,
   				message : $scope.feedbackMessage
   		};
   		
   		$http({
               url: '/user/userFeedback',
               method: "POST",
               data: JSON.stringify(feedbackData),
               headers: {'Content-Type': 'application/json'}
             }).success(function (data, status, headers, config) {
           	  if(data.status=="fail"){
           		  $scope.feedbackValidateMsg = data.message;  
           	  }else if(data.status=="pass"){
           		$scope.feedbackSuccess = true;
           		
           	  }
           	  
             }).error(function (data, status, headers, config) {
                 
             });
       		
       	}
   	 }
       
       $scope.generateInsertDBScript = function(){
    	   
    	   $http({
               url: '/db/generateDBInsertScript',
               method: "GET"
           }).success(function(data) {
        	   alert(data.response);
           }).error(function(data) {
        	   alert(data.response);
           }); 
       }
       
       function validateEmail(email) {
	       	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	       	if (!filter.test(email))  return false;
	        else true;
       }
      
});
