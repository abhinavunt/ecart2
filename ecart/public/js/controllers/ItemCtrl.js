
angular.module('ItemCtrl',[]).controller('ItemController', function($scope,$http,ngDialog,$upload) {
	
	$scope.submitButtonVal=false;
	$scope.submitButtonValEdit=false;
	$scope.removeButtonValEdit=false;
	$scope.addItemButtonVal=true;
	$scope.amountPriceRow=[];
	$scope.showOfferTable = false;
	$scope.disableCriteriaSelect=true;
	$scope.disableShowItemSelect=true;
	$scope.noOfferPrice="";
	$scope.searchCriteriaList=[{"criteria":"Show All","value":1},{"criteria":"Only Offers","value":2},{"criteria":"Only Items","value":3}];
	$scope.showItemList=[{"itemPerPage":"10 Items/Page","value":10},{"itemPerPage":"20 Items/Page","value":20},{"itemPerPage":"30 Items/Page","value":30}]
	$scope.hideToFrom=true;
	$scope.disablePrevButton=true;
	$scope.disableNextButton=true;
	$scope.addItemFailMessage="";
	$scope.editItemFailMessage="";
	
	$scope.firstOrderDate ="notAssigned";
	$scope.lastOrderDate ="notAssigned";
	$scope.itemPerPage = $scope.showItemList[0].value;
	$scope.criteriaType = $scope.searchCriteriaList[0].value;
	
	$http.get('/menu/menulist')
	.success(function(data) {
			$scope.menulist = data;
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
	    
	    
		
	    
	    $scope.searchItems = function(menuObj,firstOrderDate,lastOrderDate,itemPerPage,criteriaType){
	    	
	    	if(menuObj._id!="SameObjectId"){
	    		$scope.menuLevelTwoName = menuObj.name;
		    	$scope.menuLevelTwoId = menuObj._id;
		    	$scope.category = 'Category:- '+$scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
		    	$scope.category2 = $scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
		    	$scope.keyword="";
	    	}
	    	
	    	$http({
	    	    url: '/item/searchItems', 
	    	    method: "GET",
	    	    params: {searchMenuId: $scope.menuLevelTwoId, firstDate: firstOrderDate, lastDate: lastOrderDate, limit:itemPerPage, searchCriteriaVal:criteriaType}
	    	 }).success(function(data) {
	    		 
	    		 if(data.items.length==0) $scope.itemList = [];
	    		 else $scope.itemList = data.items;
	    		 $scope.disableCriteriaSelect=false;
	    		 $scope.disableShowItemSelect=false;
    			 $scope.addItemButtonVal=false;
	    		 
	        	 if(data.items.length==0){
	        		 $scope.noDataFound=true;
	        	 }else{
	        		 $scope.totalRecords = data.totalRecords; 
	            	 if(data.items.length>0 && data.items.length<=itemPerPage){
	            		 $scope.fromOrderNo = 1;
	            		 $scope.toOrderNo = data.items.length;
	            		 $scope.hideToFrom=false;
	            	 }else if(data.items.length>0 && data.items.length>itemPerPage){
	            		 $scope.fromOrderNo = 1;
	            		 $scope.toOrderNo = itemPerPage;
	            		 $scope.hideToFrom=false;
	            	 }else if(data.items.length==0){
	            		 $scope.hideToFrom=true;
	            	 }
	            	 
	            	 if($scope.totalRecords>$scope.fromOrderNo+(itemPerPage-1)) $scope.disableNextButton =false;
	            	 else $scope.disableNextButton =true; 
	            	 
	            	 $scope.disablePrevButton =true;
	            	 
	            	 $scope.firstOrderDate = data.items[0].createdAt;
	            	 $scope.lastOrderDate = data.items[data.items.length-1].createdAt;
	            	 $scope.noDataFound=false;
	        	 }
	        	 
	        	 
	    	}).error(function(data) {
	    		 console.log('Error: ' + data);
			});
		};
		
		$scope.searchItemByKeyword = function(){
			$scope.firstOrderDate ="notAssigned";
        	$scope.lastOrderDate = "notAssigned";
			
			$scope.disableCriteriaSelect=true;
			$scope.addItemButtonVal = true;
			if(!($scope.keyword.replace(/\s/g,"")==""|| typeof($scope.keyword)=='undefined')){
					
					$http({
	                   url: '/item/searchItemByKeyword',
	                   method: "POST",
	                   data: {keyWord:$scope.keyword,firstDate:$scope.firstOrderDate, lastDate:$scope.lastOrderDate,limit:$scope.itemPerPage},
	                   headers: {'Content-Type': 'application/json'}
	                 }).success(function (data, status, headers, config) {
	                	 if(data.items.length==0) $scope.itemList = [];
	    	    		 else $scope.itemList = data.items;
	    	    		 $scope.disableCriteriaSelect=true;
	        			 $scope.addItemButtonVal=true;
	        			 $scope.disableShowItemSelect=false;
	        			 $scope.category="";
	        			
	    	    		 
	    	        	 if(data.items.length==0){
	    	        		 $scope.noDataFound=true;
	    	        	 }else{
	    	        		 $scope.totalRecords = data.totalRecords; 
	    	            	 if(data.items.length>0 && data.items.length<=$scope.itemPerPage){
	    	            		 $scope.fromOrderNo = 1;
	    	            		 $scope.toOrderNo = data.items.length;
	    	            		 $scope.hideToFrom=false;
	    	            	 }else if(data.items.length>0 && data.items.length>$scope.itemPerPage){
	    	            		 $scope.fromOrderNo = 1;
	    	            		 $scope.toOrderNo = $scope.itemPerPage;
	    	            		 $scope.hideToFrom=false;
	    	            	 }else if(data.items.length==0){
	    	            		 $scope.hideToFrom=true;
	    	            	 }
	    	            	 
	    	            	 if($scope.totalRecords>$scope.fromOrderNo+($scope.itemPerPage-1)) $scope.disableNextButton =false;
	    	            	 else $scope.disableNextButton =true; 
	    	            	 
	    	            	 $scope.disablePrevButton =true;
	    	            	 
	    	            	 $scope.firstOrderDate = data.items[0].createdAt;
	    	            	 $scope.lastOrderDate = data.items[data.items.length-1].createdAt;
	    	            	 $scope.noDataFound=false;
	    	        	 }
	                     
	                 }).error(function (data, status, headers, config) {
	               
	                 });
	               
           }
		}
		
		$scope.searchItemsFn = function(menuObj){
			
			$scope.firstOrderDate ="notAssigned";
        	$scope.lastOrderDate = "notAssigned";
			$scope.searchItems(menuObj,$scope.firstOrderDate,$scope.lastOrderDate,$scope.itemPerPage,$scope.criteriaType);
			
		}
		
		$scope.selectedSearchCriteria = function(searchCriteria){
			 $scope.criteriaType = searchCriteria.value;
			 var menuObj ={"_id":"SameObjectId"};
			 $scope.firstOrderDate ="notAssigned";
	         $scope.lastOrderDate = "notAssigned";
			 $scope.searchItems(menuObj,$scope.firstOrderDate,$scope.lastOrderDate,$scope.itemPerPage,$scope.criteriaType);
		}
		
		$scope.showItemCriteria = function(showItemObj){
			$scope.firstOrderDate ="notAssigned";
	        $scope.lastOrderDate = "notAssigned";
			$scope.itemPerPage = showItemObj.value;
			if(!($scope.keyword.replace(/\s/g,"")==""|| typeof($scope.keyword)=='undefined')){
				$scope.searchItemByKeyword();
			}else if($scope.category!=""){
				var menuObj ={"_id":"SameObjectId"};
				$scope.searchItems(menuObj,$scope.firstOrderDate,$scope.lastOrderDate,$scope.itemPerPage,$scope.criteriaType);
			}
		}
		
		$scope.nextPage = function(){
				
			if($scope.category==""){
				var urlVal="/item/searchItemByKeyword";
				var methodVal="POST";
				var paramVal={keyWord:$scope.keyword,firstDate:"notAssigned", lastDate:$scope.lastOrderDate,limit:$scope.itemPerPage};
			}else{
				var urlVal='/item/searchItems';
				var paramVal={searchMenuId:$scope.menuLevelTwoId, firstDate:"notAssigned", lastDate:$scope.lastOrderDate, limit:$scope.itemPerPage, searchCriteriaVal:$scope.criteriaType};
				var methodVal="GET";
			}
			
			$http({
				url:urlVal, 
	    	    method:methodVal,
	            params:paramVal
	         }).success(function(data) {
	        	 $scope.itemList = data.items;
	        	 
	        	 if(data.items.length<=$scope.itemPerPage){
	        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.itemPerPage;
	        		 $scope.toOrderNo = $scope.toOrderNo + data.items.length;
	        	 }else if(data.items.length>$scope.itemPerPage){
	        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.itemPerPage;
	        		 $scope.toOrderNo = $scope.toOrderNo+$scope.itemPerPage;
	        	 }
	        	 
	        	 if($scope.toOrderNo<$scope.totalRecords) $scope.disableNextButton =false;
	        	 else $scope.disableNextButton =true;
	        	 
	        	 $scope.disablePrevButton = false;
	        	 $scope.firstOrderDate = data.items[0].createdAt;
	        	 $scope.lastOrderDate = data.items[data.items.length-1].createdAt;
	        	 
	         }).error(function(data) {
				console.log('Error: ' + data);
			 });
		}
		
		$scope.previousPage = function(){
			
			if($scope.category==""){
				var urlVal="/item/searchItemByKeyword";
				var methodVal="POST";
				var paramVal={keyWord:$scope.keyword,firstDate:$scope.firstOrderDate, lastDate:"notAssigned",limit:$scope.itemPerPage};
			}else{
				var urlVal='/item/searchItems';
				var paramVal={searchMenuId:$scope.menuLevelTwoId, firstDate:$scope.firstOrderDate, lastDate:"notAssigned", limit:$scope.itemPerPage, searchCriteriaVal:$scope.criteriaType};
				var methodVal="GET";
			}
			
			$http({
				url:urlVal, 
	    	    method:methodVal,
	            params:paramVal
	         }).success(function(data) {
	        	 $scope.itemList = data.items;
	        	 
	        	 if($scope.toOrderNo - $scope.fromOrderNo+1 == $scope.itemPerPage){
	        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.itemPerPage;
	        		 $scope.toOrderNo = $scope.toOrderNo - $scope.itemPerPage; 
	        	 }else if($scope.toOrderNo - $scope.fromOrderNo+1 < $scope.itemPerPage){
	        		 $scope.toOrderNo = $scope.fromOrderNo - 1;
	        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.itemPerPage;
	        	 }
	        	 
	        	 if($scope.fromOrderNo == 1) $scope.disablePrevButton =true;
	        	 else $scope.disablePrevButton =false;
	        	 
	        	 $scope.disableNextButton =false;
	        	 $scope.firstOrderDate = data.items[0].createdAt;
	        	 $scope.lastOrderDate = data.items[data.items.length-1].createdAt;
	         
	         }).error(function(data) {
				console.log('Error: ' + data);
			 });
		}
		
		
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
				$scope.isOfferCheckEdit =value;
				if($scope.amountPriceRowEdit.length!=0){
					for(var i=0;i<$scope.amountPriceRowEdit.length;i++){
						$scope.amountPriceRowEdit[i]["OfferCheck"] = true;
						$scope.amountPriceRowEdit[i]["OfferPrice"] = "";
					}
				}
			}
			else{
				
				$scope.showOfferTableEdit = false;
				$scope.isOfferCheckEdit =value;
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
			$scope.addItemValidation();
			if($scope.addItemValidationCheck){
				$scope.upload = $upload.upload({
		    		url: '/item/addImage',
	                method: 'POST',                 
	                file: $scope.itemImage
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
			  	    	   	$scope.itemList.unshift(data.item);
			  	    	    $scope.submitButtonVal=true;
			  	        	$scope.closeThisDialog();
			  	       }).error(function (data, status, headers, config) {
			  	    	 
			  	    	   $scope.addItemFailMessage = 'Item could not be added due to internal error !!!';    
			  	       });
		           
		          }).error(function(data, status, headers, config) {
		        	  
		        	  $scope.addItemFailMessage = 'Image uploading Failed !!!'; 
		          });
			  }
		};
	    
	   
	    
	   
	    	
	    $scope.editItem = function(editItemRowId, itemNameEdit, brandEdit, othernamesEdit, availabilityEdit, imageIdEdit,newImg, descriptionEdit, isOfferCheckEdit){
	    	$scope.editItemValidation(itemNameEdit,brandEdit);
	    	if($scope.editItemValidationCheck){
	    		$scope.amountPriceRowEditFnl=[];
		    	if($scope.isOfferCheckEdit=='yes'){
		    		for(var i=0; i<$scope.amountPriceRowEdit.length; i++){
			    		if($scope.amountPriceRowEdit[i].OfferCheck==true){
			    			var obj = { "OfferCheck":$scope.amountPriceRowEdit[i].OfferCheck,
			    						"Amount" : $scope.amountPriceRowEdit[i].Amount,
			    						"Price" : $scope.amountPriceRowEdit[i].Price,
			    						"OfferPrice":$scope.amountPriceRowEdit[i].OfferPrice,
			    						"Availability" : $scope.amountPriceRowEdit[i].Availability };
			    			$scope.amountPriceRowEditFnl.unshift(obj);
			    			
			    		}else{
			    			var obj = { "OfferCheck":$scope.amountPriceRowEdit[i].OfferCheck,
		    						"Amount" : $scope.amountPriceRowEdit[i].Amount,
		    						"Price" : $scope.amountPriceRowEdit[i].Price,
		    						"Availability" : $scope.amountPriceRowEdit[i].Availability };
			    			$scope.amountPriceRowEditFnl.push(obj);
			    		}
			    	}
		    	}else $scope.amountPriceRowEditFnl = $scope.amountPriceRowEdit;
		    		 
		    	if(typeof newImg=='undefined'){
			    	
			    	 var item ={
			    			 	itemId:editItemRowId,
			    			 	categoryZeroId:$scope.menuLevelZeroId,
			  	    			categoryOneId:$scope.menuLevelOneId,
			  	    			categoryTwoId:$scope.menuLevelTwoId,
			  	    			createdAt:$scope.createdAt,
			  	    			name:itemNameEdit,
			  	    			brand:brandEdit,
			  	    			othernames:othernamesEdit,
			  	    			description:descriptionEdit,
			  	    			availability:availabilityEdit,
			  	    			isOfferCheck:isOfferCheckEdit,
			  	    			amountprice:$scope.amountPriceRowEditFnl,
			  	    			imageId:imageIdEdit,
			  	    			oldImageId:"NoOldImage"
				  	    	};
			    	 
			    	 $http({
				  	            url: '/item/editItem',
				  	            method: "POST",
				  	            data: angular.toJson(item),
				  	            headers: {'Content-Type': 'application/json'}
				  	          }).success(function (data, status, headers, config,imageName) {
				  	        	for(var i=0; i<$scope.itemList.length; i++){
				  	        		if($scope.itemList[i]._id==editItemRowId){
				  	        			$scope.itemList[i] =data.itemObj; 
				  	        		}
				  	        	}
				  	        	$scope.submitButtonValEdit=true;
				  	        	ngDialog.close();
				  	          }).error(function (data, status, headers, config) {
				  	              
				  	          });
			    		
			    	}else{
			    		
			    			$scope.upload = $upload.upload({
				    		url: '/item/addImage',
			                method: 'POST',                 
			                file: newImg
			              }).progress(function(evt) {
				            console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
				          }).success(function(data, status, headers, config) {
				        	 
				        	  var item ={
					    			 	itemId:editItemRowId,
					    			 	categoryZeroId:$scope.menuLevelZeroId,
					  	    			categoryOneId:$scope.menuLevelOneId,
					  	    			categoryTwoId:$scope.menuLevelTwoId,
					  	    			createdAt:$scope.createdAt,
					  	    			name:itemNameEdit,
					  	    			brand:brandEdit,
					  	    			othernames:othernamesEdit,
					  	    			description:descriptionEdit,
					  	    			availability:availabilityEdit,
					  	    			isOfferCheck:isOfferCheckEdit,
					  	    			amountprice:$scope.amountPriceRowEditFnl,
					  	    			imageId:data.ImgId,
					  	    			oldImageId:imageIdEdit
						  	    	};
					    	
				        	  $http({
						  	            url: '/item/editItem',
						  	            method: "POST",
						  	            data: angular.toJson(item),
						  	            headers: {'Content-Type': 'application/json'}
						  	          }).success(function (data, status, headers, config,imageName) {
						  	        	for(var i=0; i<$scope.itemList.length; i++){
						  	        		if($scope.itemList[i]._id==editItemRowId){
						  	        			$scope.itemList[i] =data.itemObj; 
						  	        		}
						  	        	}
						  	        	$scope.submitButtonValEdit=true;
						  	        	ngDialog.close();
						  	          }).error(function (data, status, headers, config) {
						  	              
						  	          });
				        	  
				          });
			    	}
	    	}
	    };
	    
	    $scope.removeItem = function(editItemRowId,imageIdEdit){
	    	$http({
	  	            url: '/item/removeItem',
	  	            method: "POST",
	  	            data: {itemId:editItemRowId,imageId:imageIdEdit},
	  	            headers: {'Content-Type': 'application/json'}
	  	          }).success(function (data, status, headers, config,imageName) {
		  	        	$scope.removeButtonValEdit=true;
		  	        	ngDialog.close();
		  	        	var index;
		  	        	for(var i=0;i<$scope.itemList.length;i++){
		  	        		if($scope.itemList[i]._id==$scope.selectedRowItemId){
		  	        			index = $scope.itemList.indexOf($scope.itemList[i]);
		  	        			break;
		  	        		}
		  	        	}
		  	        	$scope.itemList.splice(index,1);
		  	      }).error(function (data, status, headers, config) {
	  	        	alert("Failed : Item could not be removed !!!");
	  	          });
	    };
	    
	    
	    
	    
	    		
	    $scope.editItemOpenPopUp = function(item){
	    		$scope.editItemFailMessage="";
	    		$scope.amountPriceRowEdit = [];
	    		$scope.itemNameEdit = item.name;
	    		$scope.brandEdit = item.brand;
	    		$scope.othernamesEdit = item.othernames;
	    		$scope.availabilityEdit = item.availability;
	    		$scope.descriptionEdit = item.description;
	    		$scope.imageIdEdit = item.imageId;
	    		$scope.isOfferCheckEdit = item.isOfferCheck;
	    		$scope.editItemRowId = item._id;
	    		$scope.submitButtonValEdit=false;
	    		$scope.removeButtonValEdit=false;
	    		$scope.createdAt = item.createdAt;
	    		
	    		getCategory2(item._id);
	    		
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
	    
	    var getCategory2 = function(itemId){
			for(var i=0;i<$scope.itemList.length;i++){
				if($scope.itemList[i]._id==itemId){
	    			var catZeroId = $scope.itemList[i].categoryZeroId;
	    			var catOneId = $scope.itemList[i].categoryOneId;
	    			var catTwoId = $scope.itemList[i].categoryTwoId;
	    			
	    			var catZeroName ="";
	    			var catOneName ="";
	    			var catTwoName ="";
	    			for(var j=0;j<$scope.menulist.length;j++){
						if($scope.menulist[j]._id==catZeroId){
	    					catZeroName = $scope.menulist[j].name;
	    					for(var k=0;k<$scope.menulist[j].sub.length;k++){
	    						if($scope.menulist[j].sub[k]._id==catOneId){
	    							catOneName = $scope.menulist[j].sub[k].name;
	    							for(var l=0;l<$scope.menulist[j].sub[k].supersub.length;l++){
	    								if($scope.menulist[j].sub[k].supersub[l]._id==catTwoId){
	    									catTwoName = $scope.menulist[j].sub[k].supersub[l].name;
	    									$scope.category2 = catZeroName+' > '+catOneName+' > '+catTwoName;
											break;
	    									}
	    								}
	    							}
	    						}
	    					}
	    				}
	    			}	
	    		}
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
		
		$scope.addItemValidation = function(){
			var minOfferCheck = false;
			$scope.addItemValidationCheck=false;
			
			if( typeof($scope.itemForm.itemName)=='undefined'||$scope.itemForm.itemName==''||
				typeof($scope.itemForm.brand)=='undefined'||$scope.itemForm.brand=='')
	    	{
	    		$scope.addItemFailMessage = "Required(*) field/(s) are missing !!!";
	    		return false;
	    	}
	    	
	    	else if(typeof($scope.itemImage)=="undefined"){
	    		$scope.addItemFailMessage = "Please select Image !!!";
	    		return false;
	    	}
			
	    	else if($scope.amountPriceRow.length==0){
	    		$scope.addItemFailMessage = "Please fill entries in Amount/Price table !!!";
	    		return false;
	    	}
	    		
	    	else if($scope.amountPriceRow.length!=0 && !$scope.showOfferTable){
	    		
	    		for(var i=0;i<$scope.amountPriceRow.length;i++){
	    			if($scope.amountPriceRow[i].Amount==""||$scope.amountPriceRow[i].Price==""||typeof($scope.amountPriceRow[i].Amount)=="undefined"||typeof($scope.amountPriceRow[i].Price)=="undefined"){
	    				$scope.addItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    	    		return false;
	    	        }else if(!isNumber($scope.amountPriceRow[i].Price)){
	    	        	$scope.addItemFailMessage = "Price value must be a positive number !!!";
	    	    		return false;
	    	        }
	    		}
	    	}else if($scope.amountPriceRow.length!=0 && $scope.showOfferTable){
	    		
	    		for(var i=0;i<$scope.amountPriceRow.length;i++){
	    			
	    			if($scope.amountPriceRow[i].OfferCheck==true){
	    				minOfferCheck=true;
	    				if($scope.amountPriceRow[i].Amount==""|| typeof($scope.amountPriceRow[i].Amount)=="undefined"||
	    					$scope.amountPriceRow[i].Price=="" || typeof($scope.amountPriceRow[i].Price)=="undefined"||
	    					$scope.amountPriceRow[i].OfferPrice==""||typeof($scope.amountPriceRow[i].OfferPrice)=="undefined")
	    				{
	    						
	    						$scope.addItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    						return false;
	    				}else if(!isNumber($scope.amountPriceRow[i].Price)||!isNumber($scope.amountPriceRow[i].OfferPrice)){
	    						$scope.addItemFailMessage = "Price or Offer Price value must be a positive number !!!";
	    						return false;
	    				
	    				}else if(parseInt($scope.amountPriceRow[i].Price)<parseInt($scope.amountPriceRow[i].OfferPrice)+1){
							
							$scope.addItemFailMessage = "Offer Price must be lesser than Price value !!!";
    						return false;
						}
	    			
	    			}else{
	    				
	    				if($scope.amountPriceRow[i].Amount==""|| typeof($scope.amountPriceRow[i].Amount)=="undefined"||
	    					$scope.amountPriceRow[i].Price=="" || typeof($scope.amountPriceRow[i].Price)=="undefined")
	    				{
	    						$scope.addItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    						return false;
	    				}else if(!isNumber($scope.amountPriceRow[i].Price)){
	    						$scope.addItemFailMessage = "Price value must be a positive number !!!";
	    						return false;
	    				}
	    			
	    			}
	    			
	    		}
	    		
	    		if(!minOfferCheck){
	    			$scope.addItemFailMessage = "Atleast one offer entry of Amount/Price table must be checked !!!";
					return false;
	    		}
	    		
	    	}
			
			$scope.addItemFailMessage = "";
			$scope.addItemValidationCheck=true;
			
		}
		
		
		$scope.editItemValidation = function(itemNameEdit,brandEdit){
			var minOfferCheck = false;
			$scope.editItemValidationCheck=false;
			
			if( typeof(itemNameEdit)=='undefined'||itemNameEdit==''||
				typeof(brandEdit)=='undefined'||brandEdit=='')
	    	{
	    		$scope.editItemFailMessage = "Required(*) field/(s) are missing !!!";
	    		return false;
	    	}
	    	
	    	
			else if($scope.amountPriceRowEdit.length==0){
	    		$scope.editItemFailMessage = "Please fill entries in Amount/Price table !!!";
	    		return false;
	    	}
	    		
	    	else if($scope.amountPriceRowEdit.length!=0 && !$scope.showOfferTableEdit){
	    		
	    		for(var i=0;i<$scope.amountPriceRowEdit.length;i++){
	    			if($scope.amountPriceRowEdit[i].Amount==""||$scope.amountPriceRowEdit[i].Price==""||typeof($scope.amountPriceRowEdit[i].Amount)=="undefined"||typeof($scope.amountPriceRowEdit[i].Price)=="undefined"){
	    				$scope.editItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    	    		return false;
	    	        }else if(!isNumber($scope.amountPriceRowEdit[i].Price)){
	    	        	$scope.editItemFailMessage = "Price value must be a positive number !!!";
	    	    		return false;
	    	        }
	    		}
	    	}else if($scope.amountPriceRowEdit.length!=0 && $scope.showOfferTableEdit){
	    		
	    		for(var i=0;i<$scope.amountPriceRowEdit.length;i++){
	    			
	    			if($scope.amountPriceRowEdit[i].OfferCheck==true){
	    				minOfferCheck=true;
	    				if($scope.amountPriceRowEdit[i].Amount==""|| typeof($scope.amountPriceRowEdit[i].Amount)=="undefined"||
	    					$scope.amountPriceRowEdit[i].Price=="" || typeof($scope.amountPriceRowEdit[i].Price)=="undefined"||
	    					$scope.amountPriceRowEdit[i].OfferPrice==""||typeof($scope.amountPriceRowEdit[i].OfferPrice)=="undefined")
	    				{
	    						
	    						$scope.editItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    						return false;
	    				}else if(!isNumber($scope.amountPriceRowEdit[i].Price)||!isNumber($scope.amountPriceRowEdit[i].OfferPrice)){
	    						$scope.editItemFailMessage = "Price or Offer Price value must be a positive number !!!";
	    						return false;
	    				
	    				}else if(parseInt($scope.amountPriceRowEdit[i].Price)<parseInt($scope.amountPriceRowEdit[i].OfferPrice)+1){
							
							$scope.editItemFailMessage = "Offer Price must be lesser than Price value !!!";
    						return false;
						}
	    			
	    			}else{
	    				
	    				if($scope.amountPriceRowEdit[i].Amount==""|| typeof($scope.amountPriceRowEdit[i].Amount)=="undefined"||
	    					$scope.amountPriceRowEdit[i].Price=="" || typeof($scope.amountPriceRowEdit[i].Price)=="undefined")
	    				{
	    						$scope.editItemFailMessage = "Amount/Price table entries can not be blank !!!";
	    						return false;
	    				}else if(!isNumber($scope.amountPriceRowEdit[i].Price)){
	    						$scope.editItemFailMessage = "Price value must be a positive number !!!";
	    						return false;
	    				}
	    			
	    			}
	    			
	    		}
	    		
	    		if(!minOfferCheck){
	    			$scope.editItemFailMessage = "Atleast one offer entry of Amount/Price table must be checked !!!";
					return false;
	    		}
	    		
	    	}
			
			$scope.editItemFailMessage = "";
			$scope.editItemValidationCheck=true;
			
		}
		
		var isNumber = function(n) {
	    	  return Object.prototype.toString.call(n) !== '[object Array]' &&!isNaN(parseFloat(n)) && isFinite(n) && n>=0;
	    }
});
