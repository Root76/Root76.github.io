(function() {

var RoutingModule = angular.module('Routing', ['ReportsModule', 'DashboardModule']);

RoutingModule.config(function($stateProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise("/dashboard");

	$stateProvider
		.state('reports', {
			url: "/reports",
			templateUrl: "templates/reports/reports.html",
			controller: "ReportsController"
		})
		.state('dashboard', {
			url: "/dashboard",
			templateUrl: "templates/dashboard/dashboard.html",
			controller: "DashboardController"
		})
		.state('settings', {
			url: "/settings",
			templateUrl: "templates/settings.html"
		})
		.state('orphans', {
			url: "/orphans",
			templateUrl: "templates/orphans/orphans.html"
		})

	});
})();