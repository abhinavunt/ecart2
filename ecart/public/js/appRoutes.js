
angular.module('appRoutes', ['ui.router']).config(function($stateProvider, $urlRouterProvider,$locationProvider) {
		
		
		$stateProvider

		.state('home', {
			url:'/',
			templateUrl: 'views/home.html',
			
		})

		
		.state('nerds', {
			url:'/nerd',
			templateUrl: 'views/nerd.html',
			controller: 'HeadController'
		})
		
		
		.state('loginOrSignUp', {
			url:'/loginOrSignUp',
			templateUrl: 'views/signup.html'
			
		})
		
		
		.state('reviewOrder', {
			url:'/reviewOrder',
			templateUrl: 'views/reviewOrder.html'
			
		})
		
		
		.state('paymentGateway', {
			url:'/paymentGateway',
			templateUrl: 'views/paymentGateway.html'
			
		})
		
		.state('completeOrder', {
			url:'/completeOrder',
			templateUrl: 'views/completeOrder.html',
			controller:'CompleteOrderController'
			
		})
		
		.state('adminPortal', {
			url:'/adminPortal',
			templateUrl: 'views/admin.html'
			//controller: 'UserController'
			
		})
		
				.state('adminPortal.order', {
						url:'/order',
						templateUrl: 'views/adminTemplates/order.html'
		
			
					})
				
				.state('adminPortal.item', {
						url:'/item',
						templateUrl: 'views/adminTemplates/item.html'
		
			
					})
				.state('adminPortal.menu', {
						url:'/menu',
						templateUrl: 'views/adminTemplates/menu.html'
		
			
					})
				.state('adminPortal.user', {
						url:'/user',
						templateUrl: 'views/adminTemplates/user.html'
		
			
					})
				.state('adminPortal.feedback', {
						url:'/feedback',
						templateUrl: 'views/adminTemplates/feedback.html'
		
			
					})
				.state('adminPortal.customize', {
						url:'/customize',
						templateUrl: 'views/adminTemplates/customize.html'
		
			
					})
				.state('adminPortal.chart', {
						url:'/chart',
						templateUrl: 'views/adminTemplates/chart.html',
						controller: 'AdminChartController'
		
			
					})
					
		.state('userPortal', {
			url:'/userPortal',
			templateUrl: 'views/user.html'
			//controller: 'UserController'
			
		})
		
		.state('adminAuthFailed', {
			url:'/adminAuthFailed',
			templateUrl: 'views/adminAuthFailed.html'
			//controller: 'UserController'
			
		})
		
		
					
		
		.state('signup', {
			url:'/addUser',
			templateUrl: 'views/signup.html',
			controller: 'GeekController'	
		})
		
		.state('searchItems', {
		url:'/:category/:sideMenu',
		templateUrl: 'views/showItems.html',
		controller: 'GetItemController'
	});

	$locationProvider.html5Mode(true);

});

	
