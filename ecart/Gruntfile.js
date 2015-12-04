/*module.exports = function(grunt){
	
	grunt.initConfig({
		
		uncss: {
			  dist: {
			    
			    files: {
			      'public/prod/temp.css': ['public/views/indexNew.html',
			                                 'public/views/expandItem.html',
			                                 'public/views/forgotPassword.html',
			                                 'public/views/home.html',
			                                 'public/views/howItWorks.html',
			                                 'public/views/loginOrSignup.html',
			                                 'public/views/loginOrSignupCheckout.html',
			                                 'public/views/paymentGateway.html',
			                                 'public/views/reviewOrder.html',
			                                 'public/views/serviceArea.html',
			                                 'public/views/shoppingCart.html',
			                                 'public/views/showItems.html',
			                                 'public/views/signup.html',
			                                 'public/views/user.html',
			                                 'public/views/userFeedback.html',
			                                 'public/views/admin.html',
			                                 'public/views/adminAuthFailed.html',
			                                 'public/views/completeOrder.html',
			                                 'public/views/userTemplates/expenseChart.html',
			                                 'public/views/userTemplates/orderHistory.html',
			                                 'public/views/userTemplates/personalInfo.html',
			                                 'public/views/userTemplates/showOrder.html',
			                                 'public/views/adminTemplates/item.html',
			                                 'public/views/adminTemplates/menu.html',
			                                 'public/views/adminTemplates/order.html',
			                                 'public/views/adminTemplates/registeredUsers.html',
			                                 'public/views/adminTemplates/showOrderListPopup.html',
			                                 'public/views/adminTemplates/usertable.html',
			                                 'public/views/adminTemplates/addItemPopUp.html',
			                                 'public/views/adminTemplates/chart.html',
			                                 'public/views/adminTemplates/customize.html',
			                                 'public/views/adminTemplates/editItemPopUp.html',
			                                 'public/views/adminTemplates/editMenuPopUp.html',
			                                 'public/views/adminTemplates/feedback.html']
			    }
			  }
			},
			
			concat: {
			    js1: {
			      src: [
					"public/libs/jquery/dist/jquery-2.1.1.js",
					"public/libs/angular/angular.min.js",
					"public/libs/jquery/dist/jquery.tabletojson.js",
					"public/libs/angular-route/angular-route.js", 
					"public/libs/bootstrap/dist/public/js/bootstrap-modal.js",
					"public/libs/angular-ui-route/angular-ui-router.js",
					"public/libs/bootstrap/dist/public/js/bootstrap.js",
					"public/libs/angular-dialog/js/ng-dialog.js",
					"public/libs/aditional_jqueries/jasny-bootstrap.js",
					"public/libs/aditional_jqueries/holder.js",
					"public/libs/aditional_jqueries/angular-file-model.js",
					"public/libs/angular-file-upload/angular-file-upload.js",
					"public/libs/angular-cookie/angular-cookies.js",
					"public/libs/angular-google-charts/ng-google-chart.js",
					"public/libs/angular_infiniteScroll/ng-infinite-scroll.js",
					"public/libs/angular-animate/angular-animate.js",
					"public/libs/angular-spinner/spin.min.js",
					"public/libs/angular-spinner/angular-spinner.js",
					"public/js/app.js",
			        "public/js/controllers/HomeCtrl.js",
					"public/js/controllers/UserCtrl.js", 
					"public/js/controllers/RegisteredUsersCtrl.js",
					"public/js/controllers/CompleteOrderCtrl.js",
					"public/js/controllers/HeadCtrl.js",
					"public/js/controllers/MenuCtrl.js",
					"public/js/controllers/AddCtrl.js",
					"public/js/controllers/ItemCtrl.js",
					"public/js/controllers/ShowItemCtrl.js",
					"public/js/controllers/ExpandItemCtrl.js",
					"public/js/controllers/GetItemCtrl.js",
					"public/js/controllers/AdminChartCtrl.js",
					"public/js/controllers/AdminOrderCtrl.js",
					"public/js/controllers/AdminFeedbackCtrl.js",
					"public/js/controllers/PaymentGatewayCtrl.js",
					"public/js/controllers/ReviewOrderCtrl.js.js",
					"public/js/appRoutes.js"
				],
			      dest: 'public/prod/scripts.js',
			    },
			    
			    css:{
			    	src:['public/prod/temp.css','public/prod/conditional.css'],
			    	dest:'public/prod/layout.css'
			    }
			  },
			  
			  clean:['public/prod/temp.css','public/prod/scripts.js'],
			  
			  uglify: {
				    my_target: {
				      files: {
				        'public/prod/scripts.min.js': ['public/prod/scripts.js']
		             }
				    }
			  },
			  
			  cssmin: {
				  target: {
				    files: {
				      'public/prod/layout.min.css': ['public/prod/layout.css']
				    }
				  }
				}
		
	});
	
	
	grunt.loadNpmTasks('grunt-uncss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-stripcomments');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('final', ['uncss', 'concat','uglify','cssmin','clean']);

};*/