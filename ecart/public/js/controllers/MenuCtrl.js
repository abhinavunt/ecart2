// public/js/controllers/NerdCtrl.js
angular.module('MenuCtrl', []).controller('MenuController', function($scope,$http,ngDialog) {

	$scope.formData = {};
	$scope.menulist=[];
	$scope.menuLevel='';
	
	$http.get('/menu/menulist')
	.success(function(data) {
		
		$.each(data, function(){
			$scope.menulist = data;
		});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	

	
	 $scope.getSubMenuList = function(menuList,oneMenu){
		 $scope.superSubMenuList={};
		 $scope.two_new=false;
		 $scope.add_menu_levelOne=false;
		 $scope.add_menu_levelTwo=false;
		 $scope.edit_menu_levelZero=true;
		 $scope.edit_menu_levelOne=false;
		 
		 $scope.levelZeroItemId = oneMenu._id;
		 $scope.levelZeroMenuName = oneMenu.name;
		 
		 for(var i=0;i<menuList.length;i++){
			 if(menuList[i]._id==oneMenu._id){
				$scope.subMenuList = menuList[i].sub;
				$scope.one_new=true;
			  }
		 	}
		 };
		 
	 
		 
	  $scope.getSuperSubMenuList = function(subMenuList,subMenu){
		  $scope.add_menu_levelTwo=false;
		  $scope.levelOneItemId = subMenu._id;
		  $scope.levelOneMenuName = subMenu.name;
		  $scope.edit_menu_levelOne=true;
		  $scope.edit_menu_levelTwo=false;
		  
			for(var i=0;i<subMenuList.length;i++){
				if(subMenuList[i]._id==subMenu._id){
					$scope.superSubMenuList = subMenuList[i].supersub;
					$scope.two_new=true;
				}
			 }
		};
		
	  $scope.getSuperSubMenuObject = function(superSubMenu){
		  $scope.edit_menu_levelTwo=true;
		  $scope.levelTwoItemId = superSubMenu._id;
		  $scope.levelTwoMenuName = superSubMenu.name;	
			
	  };
		
		
	  // Adding new menu Item - Start
	  
	  //level- zero
	  $scope.addNewMenuItemlevelZero = function(){
		  
		 var levelZeroItemData={
		    		name : $scope.levelZeroItemName
	    		};
			
		$http({
	            url: '/menu/addMenuItemLevelZero',
	            method: "POST",
	            data: JSON.stringify(levelZeroItemData),
	            headers: {'Content-Type': 'application/json'}
	          }).success(function (data, status, headers, config) {
	        	  $scope.add_menu_levelZero=false;
	        	  $scope.menulist.push(data);
	        	  $scope.levelZeroItemName="";
	          }).error(function (data, status, headers, config) {
	               // $scope.status = status + ' ' + headers;
	          });
		   
	   };
	   
	   //level- one
	   $scope.addNewMenuItemlevelOne = function(){
		   
		  var levelOneItemData={
				   levelZeroId : $scope.levelZeroItemId,
				   name : $scope.levelOneItemName
	    		};
		   
		  $http({
	            url: '/menu/addMenuItemLevelOne',
	            method: "POST",
	            data: JSON.stringify(levelOneItemData),
	            headers: {'Content-Type': 'application/json'}
	          }).success(function (data, status, headers, config) {
	        	  
	        	  for(var i=0;i<$scope.menulist.length;i++){
	        		  if($scope.menulist[i]._id==$scope.levelZeroItemId){
	        			  $scope.menulist[i].sub.push(data); 
	        		  }
	        	  }
	        	  $scope.add_menu_levelOne=false;
	        	  $scope.levelOneItemName="";
	        	  
	        	}).error(function (data, status, headers, config) {
	               
	            }); 
		   
		   
		  
	   };
	   
		//level- two
		$scope.addNewMenuItemlevelTwo = function(){
			var levelTwoItemData={
					levelOneId : $scope.levelOneItemId,
					name : $scope.levelTwoItemName
			};
			
			$http({
		            url: '/menu/addMenuItemLevelTwo',
		            method: "POST",
		            data: JSON.stringify(levelTwoItemData),
		            headers: {'Content-Type': 'application/json'}
		          }).success(function (data, status, headers, config) {
		        	  
		        	  for(var i=0;i<$scope.menulist.length;i++){
		        		if($scope.menulist[i]._id==$scope.levelZeroItemId){
		        		   for(var j=0;j<$scope.menulist[i].sub.length;j++){
		        			   if($scope.menulist[i].sub[j]._id==$scope.levelOneItemId){
		        				   $scope.menulist[i].sub[j].supersub.push(data);   
		        			   }
		        		   }
		        		}  
		        	  }
		        	  
		        	  $scope.add_menu_levelTwo=false;
		        	  $scope.levelTwoItemName="";
		        	 
		          }).error(function (data, status, headers, config) {
		               
		          });
			};
			
		$scope.editLevelZeroPopUp = function(){
			 $scope.editMenuPopUpHeader ='Menu Level-0 Edit/Remove'
			 $scope.removeButtons=false;
			 $scope.menuName = $scope.levelZeroMenuName;
			 $scope.menuNameOrignal = $scope.levelZeroMenuName;
			 $scope.menuLevel ='levelZero';
			 
			 
             var dialog = ngDialog.open({
             template: 'views/adminTemplates/editMenuPopUp.html',
             scope: $scope,
             className: 'ngdialog-theme-default'
           });
			
		}
		
		$scope.editLevelOnePopUp = function(){

			 $scope.editMenuPopUpHeader ='Menu Level-1 Edit/Remove'
			 $scope.removeButtons=false;
			 $scope.menuName = $scope.levelOneMenuName;
			 $scope.menuNameOrignal= $scope.levelOneMenuName;
			 $scope.menuLevel ='levelOne';
			 
             var dialog = ngDialog.open({
             template: 'views/adminTemplates/editMenuPopUp.html',
             scope: $scope,
             className: 'ngdialog-theme-default'
          });
		}

		$scope.editLevelTwoPopUp = function(){

			 $scope.editMenuPopUpHeader ='Menu Level-2 Edit/Remove'
			 $scope.removeButtons=false;
			 $scope.menuName =$scope.levelTwoMenuName;
			 $scope.menuNameOrignal = $scope.levelTwoMenuName; 
			 $scope.menuLevel ='levelTwo';
			 
            var dialog = ngDialog.open({
            template: 'views/adminTemplates/editMenuPopUp.html',
            scope: $scope,
            className: 'ngdialog-theme-default'
         });
		}
		
		$scope.saveEditMenu = function(menuName){
			
			if($scope.menuLevel=='levelZero'){
				
				var editMenuItemData = {
						levelZeroId : $scope.levelZeroItemId,
						menuLevel: $scope.menuLevel,
						name : menuName
				};
				
				$http({
			            url: '/menu/editMenuItem',
			            method: "POST",
			            data: JSON.stringify(editMenuItemData),
			            headers: {'Content-Type': 'application/json'}
			     }).success(function (data, status, headers, config) {
			    	 
			    	 for(var i=0;i<$scope.menulist.length;i++){
			    		 if($scope.menulist[i]._id==data._id){
			    			 $scope.menulist[i].name=data.name;
			    			 ngDialog.closeAll();
			    			 break;
			    		}
			    	 }
			    	 
			    	 
		        	  
		         }).error(function (data, status, headers, config) {
		               
		         });
				
				
			}else if($scope.menuLevel=='levelOne'){
				
				var editMenuItemData = {
						levelZeroId : $scope.levelZeroItemId,
						levelOneId : $scope.levelOneItemId,
						menuLevel: $scope.menuLevel,
						name : menuName
				};
				
				$http({
			            url: '/menu/editMenuItem',
			            method: "POST",
			            data: JSON.stringify(editMenuItemData),
			            headers: {'Content-Type': 'application/json'}
			     }).success(function (data, status, headers, config) {
			    	
			    	 for(var i=0;i<$scope.menulist.length;i++){
			    		 if($scope.menulist[i]._id==$scope.levelZeroItemId){
			    		 for(var j=0;j<$scope.menulist[i].sub.length;j++){
			    			 if($scope.menulist[i].sub[j]._id==$scope.levelOneItemId){
			    				 $scope.menulist[i].sub[j].name=menuName;
			    				 ngDialog.closeAll();
				    			 break;
			    			 }
			    		   }
			    		}
			    	 }
			    	 
			     }).error(function (data, status, headers, config) {
		               
		         });
				
			}else if($scope.menuLevel=='levelTwo'){
				
				var editMenuItemData = {
						
						levelOneId : $scope.levelOneItemId,
						levelTwoId : $scope.levelTwoItemId,
						menuLevel: $scope.menuLevel,
						name : menuName
				};
				
				$http({
			            url: '/menu/editMenuItem',
			            method: "POST",
			            data: JSON.stringify(editMenuItemData),
			            headers: {'Content-Type': 'application/json'}
			     }).success(function (data, status, headers, config) {
			    	
			    	 for(var i=0;i<$scope.menulist.length;i++){
			    		 if($scope.menulist[i]._id==$scope.levelZeroItemId){
			    		 for(var j=0;j<$scope.menulist[i].sub.length;j++){
			    			 if($scope.menulist[i].sub[j]._id==$scope.levelOneItemId){
			    				for(var k=0; k<$scope.menulist[i].sub[j].supersub.length;k++){
			    					if($scope.menulist[i].sub[j].supersub[k]._id==data._id){
			    						$scope.menulist[i].sub[j].supersub[k].name=data.name;
			    						ngDialog.closeAll();
						    			break;
			    						}
			    					  }
			    			 		}
			    		   		}
			    		 	}
			    	 	}
			    	 
			     }).error(function (data, status, headers, config) {
		               
		         });
			}
			
		}
		
});
