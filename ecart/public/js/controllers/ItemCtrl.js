
angular.module('ItemCtrl',[]).controller('ItemController', function($scope,$http,ngDialog,$upload) {
	
	$scope.submitButtonVal=false;
	$scope.submitButtonValEdit=false;
	$scope.removeButtonValEdit=false;
	$scope.addItemButtonVal=true;
	$scope.searchItemVal=true;
	$scope.amountPriceRow=[];
	
	$http.get('/menu/menulist')
	.success(function(data) {
		
		$.each(data, function(){
			$scope.menulist = data;
		 });
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
		
	   $scope.hoverInLevelZero = function(menuObj){
		    $scope.menuLevelZeroId = menuObj._id;
	        $scope.menuLevelZeroName = menuObj.name;
	    };
	    
	    $scope.hoverInLevelOne = function(menuObj){
	    	 $scope.menuLevelOneId = menuObj._id;
		     $scope.menuLevelOneName = menuObj.name;
	    };
	    
	    
		
	    
	    $scope.searchItems = function(menuObj){
	    	
	    	
	    	$scope.menuLevelTwoName = menuObj.name;
	    	$scope.menuLevelTwoId = menuObj._id;
	        $scope.category = 'Category:- '+$scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	$scope.category2 = $scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	$scope.addItemButtonVal=false;
	    	$scope.searchItemVal=false;
	    	
	    	$http({
	    	    url: '/item/searchItems', 
	    	    method: "GET",
	    	    params: {category: $scope.menuLevelTwoId}
	    	 }).success(function(data) {
	    		 if(data.length==0){
	    			 $scope.itemList = []; 
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

		$scope.addAmountPriceRow = function() {
			 var newRow = { "Amount" : "","Price" : "", "Availability" : "Available"};
			 $scope.amountPriceRow.push(newRow);
		};
		
		$scope.deleteAmountPriceRow = function(index) {
			
			$scope.amountPriceRow.splice(index,1);
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
	  	    			
	  	    			categoryZeroId:$scope.menuLevelZeroId,
	  	    			categoryOneId:$scope.menuLevelOneId,
	  	    			categoryTwoId:$scope.menuLevelTwoId,
	  	    			category : $scope.category2,
	  	    			name:$scope.itemForm.itemName,
	  	    			brand:$scope.itemForm.brand,
	  	    			othernames:$scope.itemForm.otherNames,
	  	    			description:$scope.itemForm.description,
	  	    			availability:$scope.itemForm.availabilityCheck,
	  	    			amountprice:$('#amtPriceTableId').tableToJSON(),
	  	    			imageId:ImgId
	  	    		};
	        	  
	           $http({
	  	            url: '/item/addItem',
	  	            method: "POST",
	  	            data: JSON.stringify(item),
	  	            headers: {'Content-Type': 'application/json'}
	  	       }).success(function (data, status, headers, config,imageName) {
	  	    	    $scope.itemList.unshift(item);
	  	        	$scope.submitButtonVal=true;
	  	        	$scope.closeThisDialog();
	  	       }).error(function (data, status, headers, config) {
	  	              
	  	       });
	           
	          });
	    	};
	    	
	    $scope.editItem = function(item){
	    	 
	    	if(typeof $scope.newImg=='undefined'){
	    		
	    	 var item ={
	    			 	itemId:item._id,
	    			 	categoryZeroId:$scope.menuLevelZeroId,
	  	    			categoryOneId:$scope.menuLevelOneId,
	  	    			categoryTwoId:$scope.menuLevelTwoId,
	  	    			name:$scope.itemDetails.name,
	  	    			brand:$scope.itemDetails.brand,
	  	    			othernames:$scope.itemDetails.othernames,
	  	    			description:$scope.itemDetails.description,
	  	    			availability:$scope.itemDetails.availability,
	  	    			amountprice:$('#amtPriceTableId').tableToJSON(),
	  	    			imageId:item.imageId
		  	    		};
	    	 
	    		
	    	  $http({
		  	            url: '/item/editItem',
		  	            method: "POST",
		  	            data: JSON.stringify(item),
		  	            headers: {'Content-Type': 'application/json'}
		  	          }).success(function (data, status, headers, config,imageName) {
		  	        	$scope.submitButtonValEdit=true;
		  	        	$scope.closeThisDialog();
		  	          }).error(function (data, status, headers, config) {
		  	              
		  	          });
	    		
	    	}else{
	    		
	    	}
	    };
	    
	    $scope.removeItem = function(item){
	    	$http({
		  	            url: '/item/removeItem',
		  	            method: "POST",
		  	            data: {itemId:item._id,imageId:item.imageId},
		  	            headers: {'Content-Type': 'application/json'}
		  	          }).success(function (data, status, headers, config,imageName) {
			  	        	$scope.removeButtonValEdit=true;
			  	        	$scope.closeThisDialog();
			  	        	var index=$scope.itemList.indexOf(item);
			  	        	$scope.itemList.splice(index,1);
		  	          }).error(function (data, status, headers, config) {
		  	        	alert("Failed : Item could not be removed !!!");
		  	          });
	    };
	    
	    
	    
	    
	    		
	    $scope.editItemOpenPopUp = function(item){
	    		$scope.itemDetails = item;
	    		$scope.amountPriceRowEdit = item.amountprice;
	    		$scope.itemImageEdit = 'temp_upload/'+item.imageId;
	    		
	    		var dialog = ngDialog.open({
	    	            template: 'views/adminTemplates/editItemPopUp.html',
	    	            scope: $scope,
	    	            className: 'ngdialog-theme-default'
	    	    });
	    }
	    
	    $scope.addAmountPriceRowEdit = function() {
			 var newRow = { "Amount" : "","Price" : "", "Availability" : "Available"};
			 $scope.amountPriceRowEdit.push(newRow);
		};
	    
	    $scope.deleteAmountPriceRowEdit = function(index) {
			
			$scope.amountPriceRowEdit.splice(index,1);
		};
	

});
