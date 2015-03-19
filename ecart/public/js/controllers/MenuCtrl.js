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
				   levelZeroName : $scope.levelZeroItemValue,
				   name : $scope.levelOneItemName
	    		};
		   
		  $http({
	            url: '/menu/addMenuItemLevelOne',
	            method: "POST",
	            data: JSON.stringify(levelOneItemData),
	            headers: {'Content-Type': 'application/json'}
	          }).success(function (data, status, headers, config) {
	        	 
	            }).error(function (data, status, headers, config) {
	               
	            }); 
		   
		   
		  
	   };
	   
		//level- two
		$scope.addNewMenuItemlevelTwo = function(){
			var levelTwoItemData={
					levelOneName : $scope.levelOneItemValue,
					name : $scope.levelTwoItemName
			};
			
			$http({
		            url: '/menu/addMenuItemLevelTwo',
		            method: "POST",
		            data: JSON.stringify(levelTwoItemData),
		            headers: {'Content-Type': 'application/json'}
		          }).success(function (data, status, headers, config) {
		        	 
		          }).error(function (data, status, headers, config) {
		               
		          });
			};
});
