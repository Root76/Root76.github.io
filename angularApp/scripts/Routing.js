(function() {


var RoutingModule = angular.module('Routing', ['ngRoute', 'ReportsModule', 'DashboardModule']);

RoutingModule.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/reports', {
			templateUrl: 'templates/reports/reports.html',
			controller: 'ReportsController',
		}).
		when('/', {
			templateUrl: 'templates/dashboard.html',
			controller: 'DashboardController',
		})
	}]);

})();