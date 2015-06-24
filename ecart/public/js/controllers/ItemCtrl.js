
angular.module('ItemCtrl',[]).controller('ItemController', function($scope,$http,ngDialog,$upload) {
	
	$scope.submitButtonVal=false;
	$scope.submitButtonValEdit=false;
	$scope.removeButtonValEdit=false;
	$scope.addItemButtonVal=true;
	$scope.searchItemVal=true;
	$scope.amountPriceRow=[];
	$scope.showOfferTable = false;
	$scope.noOfferPrice="";
	
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
				 availabilityCheck: 'yes',
				 isOfferCheck: 'no'
		};
		
		$scope.offerRadioChange = function(value){
			if(value=='yes') {
				$scope.showOfferTable = true;
				if($scope.amountPriceRow.length!=0){
					for(var i=0;i<$scope.amountPriceRow.length;i++){
						$scope.amountPriceRow[i]["OfferCheck"] = true;
						$scope.amountPriceRow[i]["OfferPrice"] = "";
					}
				}
			}
			else{
				
				$scope.showOfferTable = false;
				if($scope.amountPriceRow.length!=0){
					for(var i=0;i<$scope.amountPriceRow.length;i++){
						delete $scope.amountPriceRow[i]["OfferCheck"];
						delete $scope.amountPriceRow[i]["OfferPrice"];
					}
				}
			}
		}
		
		
		$scope.offerRadioChangeEdit = function(value){
			if(value=='yes') {
				$scope.showOfferTableEdit =true;
				if($scope.amountPriceRowEdit.length!=0){
					for(var i=0;i<$scope.amountPriceRowEdit.length;i++){
						$scope.amountPriceRowEdit[i]["OfferCheck"] = true;
						$scope.amountPriceRowEdit[i]["OfferPrice"] = "";
					}
				}
			}
			else{
				
				$scope.showOfferTableEdit = false;
				if($scope.amountPriceRowEdit.length!=0){
					for(var i=0;i<$scope.amountPriceRowEdit.length;i++){
						delete $scope.amountPriceRowEdit[i]["OfferCheck"];
						delete $scope.amountPriceRowEdit[i]["OfferPrice"];
					}
				}
			}
		}
		
		
		
		$scope.addAmountPriceRow = function() {
			
			if($scope.showOfferTable){
				
				 var newRow = { "OfferCheck":true,"Amount" : "","Price" : "","OfferPrice":"","Availability" : "Available"};
				 $scope.amountPriceRow.push(newRow);
			}else{
				 var newRow = { "Amount" : "","Price" : "", "Availability" : "Available"};
				 $scope.amountPriceRow.push(newRow);
			}
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
	  	    			isOfferCheck:$scope.itemForm.isOfferCheck,
	  	    			amountprice:$scope.amountPriceRow,
	  	    			imageId:ImgId
	  	    		};
	           
	           $http({
	  	            url: '/item/addItem',
	  	            method: "POST",
	  	            data: angular.toJson(item),
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
	    	
	    	var amountPriceRowEditFnl=[];
	    	for(var i=0;$scope.amountPriceRowEdit.length;i++){
	    		if($scope.amountPriceRowEdit[i].OfferCheck=='true'){
	    			var obj = { "OfferCheck":item.amountPriceRowEdit[i].OfferCheck,
	    						"Amount" : item.amountPriceRowEdit[i].Amount,
	    						"Price" : item.amountPriceRowEdit[i].Price,
	    						"OfferPrice":item.amountPriceRowEdit[i].OfferPrice,
	    						"Availability" : item.amountPriceRowEdit[i].Availability };
	    			amountPriceRowEditFnl.unshift(obj);
	    			
	    		}else{
	    			var obj = { "OfferCheck":item.amountPriceRowEdit[i].OfferCheck,
    						"Amount" : item.amountPriceRowEdit[i].Amount,
    						"Price" : item.amountPriceRowEdit[i].Price,
    						"Availability" : item.amountPriceRowEdit[i].Availability };
	    			amountPriceRowEditFnl.push(obj);
	    		}
	    	}
	    	
	    	
	    	
	    	
	    	 
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
	    	
	    		$scope.amountPriceRowEdit = [];
	    		$scope.itemNameEdit = item.name;
	    		$scope.brandEdit = item.brand;
	    		$scope.othernamesEdit = item.othernames;
	    		$scope.availabilityEdit = item.availability;
	    		$scope.descriptionEdit = item.description;
	    		$scope.imageIdEdit = item.imageId;
	    		$scope.isOfferCheckEdit = item.isOfferCheck;
	    		
	    		if($scope.isOfferCheckEdit){
	    			
	    			for(var i=0;i<item.amountprice.length;i++){
		    			var amountpriceObj = { "OfferCheck":item.amountprice[i].OfferCheck,
						    					"Amount" : item.amountprice[i].Amount,
						    					"Price" : item.amountprice[i].Price,
						    					"OfferPrice":item.amountprice[i].OfferPrice,
						    					"Availability" : item.amountprice[i].Availability };
		    		      $scope.amountPriceRowEdit.push(amountpriceObj);
		    		}
	    			
	    		}else{
	    			for(var i=0;i<item.amountprice.length;i++){
	    				var amountpriceObj = { 
		    					"Amount" : item.amountprice[i].Amount,
		    					"Price" : item.amountprice[i].Price,
		    					"Availability" : item.amountprice[i].Availability };
		
		    					$scope.amountPriceRowEdit.push(amountpriceObj);
		    		}
	    		}
	    		
	    		if($scope.isOfferCheckEdit=='yes') $scope.showOfferTableEdit =true;
	    		else $scope.showOfferTableEdit =false;
	    		
	    		var dialog = ngDialog.open({
	    	            template: 'views/adminTemplates/editItemPopUp.html',
	    	            scope: $scope,
	    	            className: 'ngdialog-theme-default'
	    	    });
	    }
	    
	    $scope.addAmountPriceRowEdit = function() {
			 if($scope.showOfferTableEdit){
				 var newRow = { "OfferCheck":true,"Amount" : "","Price" : "","OfferPrice":"","Availability" : "Available"};
				 $scope.amountPriceRowEdit.push(newRow);
			}else{
				 var newRow = { "Amount" : "","Price" : "", "Availability" : "Available"};
				 $scope.amountPriceRowEdit.push(newRow);
			}
		};
	    
	    $scope.deleteAmountPriceRowEdit = function(index) {
			
			$scope.amountPriceRowEdit.splice(index,1);
		};
	

});
