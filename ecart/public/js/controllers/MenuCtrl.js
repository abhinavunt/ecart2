// public/js/controllers/NerdCtrl.js
angular.module('MenuCtrl', []).controller('MenuController', function($scope,$http) {

	$scope.formData = {};
	$scope.menulist=[];
	
	$http.get('/menu/menulist')
	.success(function(data) {
		
		$.each(data, function(){
			$scope.menulist = data;
		});
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	

	
	 $scope.getSubMenuList = function(menuList,id){
		 $scope.superSubMenuList={};
		 $scope.two_new=false;
		 $scope.add_menu_levelOne=false;
		 $scope.add_menu_levelTwo=false;
		 
		 $scope.levelZeroItemId = id;
		 
		 for(var i=0;i<menuList.length;i++){
			 if(menuList[i]._id==id){
				$scope.subMenuList = menuList[i].sub;
				$scope.one_new=true;
			  }
		 	}
		 };
		 
	 
		 
	  $scope.getSuperSubMenuList = function(subMenuList,id){
		  $scope.add_menu_levelTwo=false;
		  $scope.levelOneItemId = id;
		  
			for(var i=0;i<subMenuList.length;i++){
				if(subMenuList[i]._id==id){
					$scope.superSubMenuList = subMenuList[i].supersub;
					$scope.two_new=true;
				}
			 }
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
});
