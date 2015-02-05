// public/js/controllers/MainCtrl.js
angular.module('CompleteOrderCtrl', []).controller('CompleteOrderController', function($scope,shoppingCartService) {
	
	$scope.orderId = shoppingCartService.getOrderId();
	$scope.tagline = 'To the moon and back!';	

});