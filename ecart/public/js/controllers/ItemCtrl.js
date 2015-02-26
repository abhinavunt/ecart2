
angular.module('ItemCtrl',[]).controller('ItemController', function($scope,$http,ngDialog,$upload) {
	
	$scope.submitButtonVal=false;
	$scope.addItemButtonVal=true;
	$scope.searchItemVal=true;
	
	$http.get('/menu/menulist')
	.success(function(data) {
		
		$.each(data, function(){
			
			$scope.menulist = data;
			console.log(data);});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	
	 $scope.clickToOpen = function() {
	    var dialog = ngDialog.open({
	      template: 'views/adminTemplates/addItemPopUp.html',
	      scope: $scope,
	      className: 'ngdialog-theme-default'
	    });
	  };
    
    
	
	 $scope.getSubMenuList = function(menuList,name){
		 $scope.superSubMenuList={};
		 $scope.two_new=false;
		 $scope.add_menu_levelOne=false;
		 $scope.add_menu_levelTwo=false;
		 
		 $scope.levelZeroItemValue = name;
		 
		 for(var i=0;i<menuList.length;i++){
			 if(menuList[i].name==name){
				$scope.subMenuList = menuList[i].sub;
				$scope.one_new=true;
			  }
		 	}
		 };
		 
	 
		 
	  $scope.getSuperSubMenuList = function(subMenuList,name){
		  $scope.add_menu_levelTwo=false;
		  $scope.levelOneItemValue = name;
		  
			for(var i=0;i<subMenuList.length;i++){
				if(subMenuList[i].name==name){
					$scope.superSubMenuList = subMenuList[i].supersub;
					$scope.two_new=true;
				}
			 }
		};
		
	   
	 
		
		$scope.hoverInLevelZero = function(name){
	        $scope.menuLevelZeroName = name;
	    };
	    
	    $scope.hoverInLevelOne = function(name){
	        $scope.menuLevelOneName = name;
	    };
	    
	    $scope.clickInLevelTwo = function(name){
	        $scope.menuLevelTwoName = name;
	        
	        
	    };
		
	    
	    $scope.searchItems = function(name){
	    	
	    	$scope.menuLevelTwoName = name;
	        
	    	$scope.category = 'Category:- '+$scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	$scope.category2 = $scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	
	    	$scope.addItemButtonVal=false;
	    	$scope.searchItemVal=false;
	    	
	    	$http({
	    	    url: '/item/searchItems', 
	    	    method: "GET",
	    	    params: {category: $scope.menuLevelTwoName}
	    	 }).success(function(data) {
	    		 if(data.length==0){
	    			 $scope.itemList = {}; 
	    		 }else{
	    			 $.each(data, function(){
							$scope.itemList = data;
					 });
	    		 }
	    	 }).error(function(data) {
	    		 console.log('Error: ' + data);
			});
		};
		
		
		$scope.itemForm = {
				 availabilityCheck: 'yes'
		};

	    
		
		
		
		$scope.addItem = function(){
	    	
	    	var file = $scope.itemImage;
	    	
	    	$scope.upload = $upload.upload({
	    		url: '/item/addImage',
                method: 'POST',                 
                file: file
              }).progress(function(evt) {
	            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	          }).success(function(data, status, headers, config) {
	        	  var ImgId = data.ImgId;
	        	  var item ={
	  	    			
	  	    			category:$scope.menuLevelTwoName,
	  	    			name:$scope.itemForm.itemName,
	  	    			brand:$scope.itemForm.brand,
	  	    			othernames:$scope.itemForm.otherNames,
	  	    			description:$scope.itemForm.description,
	  	    			availablity:$scope.itemForm.availabilityCheck,
	  	    			amountprice:$('#amtPriceTableId').tableToJSON(),
	  	    			imageId:ImgId
	  	    		};
	        	  
	        	  $http({
	  	            url: '/item/addItem',
	  	            method: "POST",
	  	            data: JSON.stringify(item),
	  	            headers: {'Content-Type': 'application/json'}
	  	          }).success(function (data, status, headers, config,imageName) {
	  	        	  
	  	        	$scope.submitButtonVal=true;
	  	        	$scope.closeThisDialog();
	  	        	searchItems($scope.menuLevelTwoName);
	  	        	
	  	          }).error(function (data, status, headers, config) {
	  	              
	  	          }); 
	           
	          });
	    	};
});




