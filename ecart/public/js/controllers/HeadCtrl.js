// public/js/controllers/NerdCtrl.js
angular.module('HeadCtrl', []).controller('HeadController', function($scope,$http,$location,$cookieStore,ngDialog,shoppingCartService) {
 
       $scope.tagline = 'Nothing beats a pocket protector!';
       $scope.products = shoppingCartService.getProducts();
       $scope.user = $cookieStore.get('user');
      
       
       //User Login
       if($cookieStore.get('loggedIn')==true){
    	  $scope.showLogIn = false;
    	  $scope.showLogOut = true;
    	  $scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;
       }else{
    	  $cookieStore.put('loggedIn',false);
    	  $scope.showLogIn = true;
    	  $scope.showLogOut = false;  
       }
     
       $scope.login = function() {
           
	   	$http({
	   	    url: '/user/login', 
	   	    method: "POST",
	   	    params: {emailId: $scope.emailId,password:$scope.password}
	   	 }).success(function(data) {
	   		 if(data.status=="pass"){
	   			$cookieStore.put('loggedIn',true);
	   			$cookieStore.remove('user');
		   		$cookieStore.put('user',data.user);
	   			$scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;
	   			$scope.loginFailMessage="";
	   			$scope.showLogIn = false;
	   			$scope.showLogOut = true;
	   			$scope.user = data.user;
	   			
	   		 }else{
	   			$scope.loginFailMessage = data.message;
	   			$scope.loginFailMessage2 = data.message;
	   			//Added to test Git hub checkin - start
	   			console.log("abhinav");
	   			// ends 3454
	   		 }
	   
	   	 }).error(function(data) {
	   		 console.log('Error: ' + data);
			});
	    };
	    
	  //User Log Out
	  $scope.logout = function(){
		  $cookieStore.put('loggedIn',false);
		  $scope.showLogIn = true;
		  $scope.showLogOut = false;
		  $cookieStore.remove('user');
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
    		 
    		 var dialog = ngDialog.open({
    	            template: 'views/loginOrSignup.html',
    	            scope: $scope,
    	            className: 'ngdialog-theme-default'
    	          });
    		}else{
    			
    			$location.path("/reviewOrder");
    		}
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
		        $location.path("/completeOrder");
		 }).error(function (data, status, headers, config) {
		
		 });
       };
      
});
