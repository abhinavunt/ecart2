angular.module('RegisteredUsersCtrl', []).controller('RegisteredUsersController', function($scope,$http) {

	    $http.get('/user/getUsers')
		.success(function(data) {
			
			$.each(data, function(){
			
				$scope.userlist = data;
			
				console.log(data);});
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
});