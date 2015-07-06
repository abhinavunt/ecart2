angular.module('RegisteredUsersCtrl', []).controller('RegisteredUsersController', function($scope,$http) {
	$scope.showItemList=[{"itemPerPage":"10 Users/Page","value":10},{"itemPerPage":"20 Users/Page","value":20},{"itemPerPage":"30 Users/Page","value":30}]
	
    $http.get('/user/getUsers')
	.success(function(data) {
		$scope.userlist = data;
	}).error(function(data) {
		console.log('Error: ' + data);
	});
});