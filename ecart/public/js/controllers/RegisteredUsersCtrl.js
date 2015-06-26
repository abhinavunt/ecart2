angular.module('RegisteredUsersCtrl', []).controller('RegisteredUsersController', function($scope,$http) {

	    $http.get('/user/getUsers')
		.success(function(data) {
			$scope.userlist = data;
		}).error(function(data) {
			console.log('Error: ' + data);
		});
});