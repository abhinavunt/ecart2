// public/js/controllers/MainCtrl.js
angular.module('AdminOrderCtrl', []).controller('AdminOrderController', function($scope,$http,ngDialog) {
	
	
	$http.get('/order/orderList')
	.success(function(data) {
		
		$.each(data, function(){
			
			$scope.orderlist = data;
			console.log(data);
		  });
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.myFunction = function(order){
		$scope.showOrderList = order;
		
		var dialog = ngDialog.open({
            template: 'views/adminTemplates/showOrderListPopup.html',
            scope: $scope,
            className: 'ngdialog-theme-default'
          });
	}
});