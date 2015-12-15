// public/js/controllers/MainCtrl.js
angular.module('ConsolidatedItemsCtrl', []).controller('ConsolidatedItemsController',['$scope','$http', function($scope,$http) {
	
	$scope.monthObj={1:"Jan",2:"Fab", 3:"Mar", 4:"Aprl", 5:"May", 6:"Jun", 7:"Jul", 8:"Aug", 9:"Sep", "10":"Oct", 11:"Nov", 12:"Dec"};
	$scope.slotName ="";
	
	$scope.formatDate = function(){
		var d = new Date();
		return d.getDate() + "-"+$scope.monthObj[d.getMonth()+1]+"-"+d.getFullYear();
	}
	
	$scope.formatDate();
	
	$scope.columns = [
	               {title: "Item Name", dataKey: "itemName"},
	               {title: "Brand", dataKey: "brand"}, 
	               {title: "Amount", dataKey: "amount"}, 
	               {title: "Count", dataKey: "count"}
	           ];
	
	$scope.rows = [];
	
	$scope.slotCriteriaList = [{'slot':'-- Select Slot --','value':0},{'slot':'Today Slot-1 (between 10am to 1pm )','value':1},{'slot':'Today Slot-2 (between 5pm to 8pm)','value':2}];
	
	$scope.generateConsolidatedItemList = function(){
		
	  	 $http({
             url: '/order/consolidatedItemList',
             method: "GET",
             params:{slotVal:$scope.slotVal, dateVal:new Date()}
         }).success(function(data) {
      	    $scope.consolItemList = data.itemList;
      	 }).error(function(data) {
        	
         }); 
	}
	
	$scope.getPDFItemList = function(){
		$scope.rows = [];
		for(var i=0;i<$scope.consolItemList.length;i++){
			var obj = $scope.consolItemList[i]._id;
			obj["count"] = $scope.consolItemList[i].count;
			$scope.rows.push(obj);
		}
		
		var doc = new jsPDF('p', 'pt', 'a2');
        doc.autoTable($scope.columns, $scope.rows, {
        	theme: 'grid',
            styles: {fontSize: 20,cellPadding: 10,rowHeight: 40,font: "helvetica"},
            margin: {top: 100},
            beforePageContent: function(data) {
            	doc.setFontSize(30);
                doc.text("Tokri Shop", 40, 50);
                doc.text($scope.formatDate(), 400,50 );
                doc.text($scope.slotName, 700,50 );
               
            }
        });
        doc.save('table.pdf');
	}
	
	$scope.selectedSlotCriteria = function(slotObj){
		$scope.slotVal = slotObj.value;
		if($scope.slotVal==1) $scope.slotName="Slot-1 (between 10am to 1pm )";
		else if($scope.slotVal==2) $scope.slotName="Slot-2 (between 5pm to 8pm)";
		$scope.generateConsolidatedItemList();
	}
	
	$scope.generatePDF = function(){
		
		$scope.getPDFItemList();
	}
	
	
	
	
}]);