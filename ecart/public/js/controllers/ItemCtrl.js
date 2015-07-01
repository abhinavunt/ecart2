
angular.module('ItemCtrl',[]).controller('ItemController', function($scope,$http,ngDialog,$upload) {
	
	$scope.submitButtonVal=false;
	$scope.submitButtonValEdit=false;
	$scope.removeButtonValEdit=false;
	$scope.addItemButtonVal=true;
	$scope.amountPriceRow=[];
	$scope.showOfferTable = false;
	$scope.disableCriteriaSelect=true;
	$scope.noOfferPrice="";
	$scope.searchCriteriaList=[{"criteria":"Show All","value":1},{"criteria":"Only Offers","value":2},{"criteria":"Only Items","value":3}];
	$scope.showItemList=[{"itemPerPage":"10 Items/Page","value":10},{"itemPerPage":"20 Items/Page","value":20},{"itemPerPage":"30 Items/Page","value":30}]
	$scope.hideToFrom=true;
	$scope.disablePrevButton=true;
	$scope.disableNextButton=true;
	
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
	    	
	    	$scope.menuLevelTwoName = menuObj.name;
	    	$scope.menuLevelTwoId = menuObj._id;
	        $scope.category = 'Category:- '+$scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	$scope.category2 = $scope.menuLevelZeroName+' > '+$scope.menuLevelOneName+' > '+ $scope.menuLevelTwoName;
	    	$scope.keyword="";
	    	
	    	
	    	$http({
	    	    url: '/item/searchItems', 
	    	    method: "GET",
	    	    params: {searchMenuId: $scope.menuLevelTwoId, firstDate: firstOrderDate, lastDate: lastOrderDate, limit:itemPerPage, searchCriteriaVal:criteriaType}
	    	 }).success(function(data) {
	    		 
	    		 
	    		 if(data.items.length==0) $scope.itemList = [];
	    		 else $scope.itemList = data.items;
	    		 $scope.disableCriteriaSelect=false;
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
	  	    	   	$scope.itemList.unshift(data.item);
	  	    	    $scope.submitButtonVal=true;
	  	        	$scope.closeThisDialog();
	  	       }).error(function (data, status, headers, config) {
	  	              
	  	       });
	           
	          });
	    };
	    	
	    $scope.editItem = function(editItemRowId, itemNameEdit, brandEdit, othernamesEdit, availabilityEdit, imageIdEdit,newImg, descriptionEdit, isOfferCheckEdit){
	    	
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
		
		$scope.searchItemByKeyword = function(keyWord){
			
			$scope.disableCriteriaSelect=true;
			$scope.addItemButtonVal = true;
			$scope.itemList = [];
			if(!(keyWord.replace(/\s/g,"")==""|| typeof(keyWord)=='undefined')){
					
					$http({
	                   url: '/item/liveSearch',
	                   method: "POST",
	                   data: {keyWord:keyWord},
	                   headers: {'Content-Type': 'application/json'}
	                 }).success(function (data, status, headers, config) {
	                      if(data.length==0) $scope.itemList = [];
	                      else $scope.itemList = data;
	                      $scope.category="";
	                 }).error(function (data, status, headers, config) {
	               
	                 });
	               
           }
		}
		
		$scope.searchItemsFn = function(menuObj){
			
			 $scope.searchItems(menuObj,$scope.firstOrderDate,$scope.lastOrderDate,$scope.itemPerPage,$scope.criteriaType);
			
		}
	

});
