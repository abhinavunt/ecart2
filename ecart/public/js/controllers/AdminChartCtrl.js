
angular.module('AdminChartCtrl',[]).controller('AdminChartController',['$scope','$http','$cookieStore','usSpinnerService', function($scope,$http,$cookieStore,usSpinnerService) {
	
	$scope.yearList = [];
	for(var i=1;i>=0;i--){
		var year = {"year":new Date().getFullYear()-i};
		$scope.yearList.push(year);
	}
	
	$scope.initYear = $scope.yearList[1].year;
	
	$scope.chartTypeList = [{'chartType':'Total Amount'},{'chartType':'Number of Order'}]
	$scope.chartTypeSelect = $scope.chartTypeList[0].chartType;
	
	$scope.selectedItemChanged = function(yearObj){
		$scope.initYear = yearObj.year;
		$scope.getChart($scope.initYear,$cookieStore.get('userType'));
	}
    
	
	$scope.getChart = function (yearVal,userType){
		usSpinnerService.spin('spinner-admin');
		if(userType=="customer"){
			var parameters = {year: yearVal, userType:userType, emailId:$cookieStore.get('user').emailId};
		}else if(userType=="admin"){
			var parameters = {year: yearVal, userType:userType};
		}
		
		$http({
            url: '/order/getChart',
            method: "GET",
            params: parameters
         }).success(function(data) {
        	 usSpinnerService.stop('spinner-admin');
			 $scope.data = data;
        	
			 if($scope.chartTypeSelect=='Total Amount') {
        		 drawAmountChart();
        	 }else{
        		 drawOrderNoChart();
        	 }
        	 
			
			
		}).error(function(data) {
			usSpinnerService.stop('spinner-admin');
			console.log('Error: ' + data);
		});
		
	  }
	
	var drawAmountChart = function(){
		
		var chartData = [{c: [{v: "Jan"},{v:0}]},{c: [{v: "Fab"},{v:0}]},{c: [{v: "Mar"},{v:0}]},{c: [{v: "Aprl"},{v:0}]},{c: [{v: "May"},{v:0}]},{c: [{v: "Jun"},{v:0}]},
		                 {c: [{v: "Jul"},{v:0}]},{c: [{v: "Aug"},{v:0}]},{c: [{v: "Sep"},{v:0}]},{c: [{v: "Oct"},{v:0}]},{c: [{v: "Nov"},{v:0}]},{c: [{v: "Dec"},{v:0}]}];
		
		for(var i=0;i<$scope.data.length;i++){
	    	switch ($scope.data[i]._id.month) {
		        
	    		case 1:
		            chartData[0].c[1].v = $scope.data[i].total;
		            break;
		        case 2:
		        	chartData[1].c[1].v = $scope.data[i].total;
		            break;
		        case 3:
		           chartData[2].c[1].v = $scope.data[i].total;
		           break;
		        case 4:
		        	chartData[3].c[1].v = $scope.data[i].total;
		            break;
		        case 5:
		           chartData[4].c[1].v = $scope.data[i].total;
		            break;
		        case 6:
		        	chartData[5].c[1].v = $scope.data[i].total;
		            break;
		        case 7:
		            chartData[6].c[1].v = $scope.data[i].total;
		            break;
		        case 8:
		            chartData[7].c[1].v = $scope.data[i].total;
		            break;
		        case 9:
		        	chartData[8].c[1].v = $scope.data[i].total;
		            break;
		        case 10:
		            chartData[9].c[1].v = $scope.data[i].total;
		            break;
		        case 11:
		        	chartData[10].c[1].v = $scope.data[i].total;
		            break;
		        case 12:
		        	chartData[11].c[1].v = $scope.data[i].total;
		            break;
		    	}
	    	
	    }
		
		$scope.chartObject = {};
		
		$scope.chartObject.options = {
				  animation: { duration: 500,easing: 'in'},
				  vAxis:{viewWindowMode: "explicit", viewWindow:{ min: 0 }}
		};
		
		$scope.cssStyle="height:300px;";
		$scope.chartObject.type = 'ColumnChart';
		$scope.chartObject.data = {"cols": [{id: "t", label: "Month", type: "string"},{id: "s", label: "Total Amount", type: "number"}], "rows": chartData };
		
	}
	
	var drawOrderNoChart = function(){

		
		var chartData = [{c: [{v: "Jan"},{v:0}]},{c: [{v: "Fab"},{v:0}]},{c: [{v: "Mar"},{v:0}]},{c: [{v: "Aprl"},{v:0}]},{c: [{v: "May"},{v:0}]},{c: [{v: "Jun"},{v:0}]},
		                 {c: [{v: "Jul"},{v:0}]},{c: [{v: "Aug"},{v:0}]},{c: [{v: "Sep"},{v:0}]},{c: [{v: "Oct"},{v:0}]},{c: [{v: "Nov"},{v:0}]},{c: [{v: "Dec"},{v:0}]}];
		
		for(var i=0;i<$scope.data.length;i++){
	    	switch ($scope.data[i]._id.month) {
		        
	    	case 1:
	            chartData[0].c[1].v = $scope.data[i].count;
	            break;
	        case 2:
	        	chartData[1].c[1].v = $scope.data[i].count;
	            break;
	        case 3:
	           chartData[2].c[1].v = $scope.data[i].count;
	           break;
	        case 4:
	        	chartData[3].c[1].v = $scope.data[i].count;
	            break;
	        case 5:
	           chartData[4].c[1].v = $scope.data[i].count;
	            break;
	        case 6:
	        	chartData[5].c[1].v = $scope.data[i].count;
	            break;
	        case 7:
	            chartData[6].c[1].v = $scope.data[i].count;
	            break;
	        case 8:
	            chartData[7].c[1].v = $scope.data[i].count;
	            break;
	        case 9:
	        	chartData[8].c[1].v = $scope.data[i].count;
	            break;
	        case 10:
	            chartData[9].c[1].v = $scope.data[i].count;
	            break;
	        case 11:
	        	chartData[10].c[1].v = $scope.data[i].count;
	            break;
	        case 12:
	        	chartData[11].c[1].v = $scope.data[i].count;
	            break;
	    	}
	    	
	    }
		
		$scope.chartObject = {};
		
		$scope.chartObject.options = {
				  animation: { duration: 500,easing: 'in'},
				  colors: ['#A61D4C'],
				  vAxis:{viewWindowMode: "explicit", viewWindow:{ min: 0 }}
		};
		
		$scope.cssStyle="height:300px;";
		$scope.chartObject.type = 'ColumnChart';
		$scope.chartObject.data = {"cols": [{id: "t", label: "Month", type: "string"},{id: "s", label: "No. of Order", type: "number"}], "rows": chartData };
		
	
		
	}
	
	$scope.selectedChartType = function(selectedChartObj){
		//alert(selectedChartObj.chartType);
		if(selectedChartObj.chartType=='Total Amount'){
			$scope.chartTypeSelect = selectedChartObj.chartType;
			drawAmountChart();
			
		}else if(selectedChartObj.chartType=='Number of Order'){
			$scope.chartTypeSelect = selectedChartObj.chartType;
			drawOrderNoChart();
		}
	}
    
	
	$scope.getChart($scope.initYear,$cookieStore.get('userType'));
    
    
}]);
