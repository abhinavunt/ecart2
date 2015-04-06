
angular.module('AdminChartCtrl',[]).controller('AdminChartController', function($scope,$http) {
	
	$scope.chartObject = {};
	
	$scope.cssStyle="height:300px;";

   

    $scope.chartObject.data = {"cols": [
        {id: "t", label: "Topping", type: "string"},
        {id: "s", label: "Order", type: "number"}
      ], "rows": [
        {c: [
            {v: "Jan"},
            {v: 8}
        ]},
        {c: [
            {v: "Fab"},
            {v: 31}
        ]},
        {c: [
            {v: "Mar"},
            {v: 1},
        ]},
        {c: [
            {v: "Aprl"},
            {v: 2},
        ]},
        {c: [
             {v: "May"},
             {v: 2},
        ]},
         {c: [
              {v: "Jun"},
              {v: 2},
          ]},
          {c: [
               {v: "Jul"},
               {v: 2},
           ]},
           {c: [
                {v: "Aug"},
                {v: 2},
            ]},
            {c: [
                 {v: "Sep"},
                 {v: 2},
             ]},
             {c: [
                  {v: "Oct"},
                  {v: 2},
              ]},
              {c: [
                   {v: "Nov"},
                   {v: 2},
               ]},
               {c: [
                    {v: "Dec"},
                    {v: 2},
                ]}
    ]};
    
    // $routeParams.chartType == BarChart or PieChart or ColumnChart...
    $scope.chartObject.type = 'ColumnChart';
    $scope.chartObject.options = {
        'title': 'How Much Pizza I Ate Last Night'
    }
});
