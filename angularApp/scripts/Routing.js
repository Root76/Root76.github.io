(function() {

var RoutingModule = angular.module('Routing', ['ReportsModule', 'DashboardModule', 'Contacts', 'Events']);

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
			controller: "IndexController"
		})
		.state('settings', {
			url: "/settings",
			templateUrl: "templates/settings.html"
		})
		.state('orphans', {
			url: "/orphans",
			templateUrl: "templates/orphans/orphans.html"
		})
		.state('calendar', {
			url: "/calendar",
			templateUrl: "templates/calendar.html"
		})
		.state('contacts', {
			url: "/contacts",
			templateUrl: "templates/contacts/contacts.html"
		})
		.state('contacts.contact', {
			url: "/:contact_id",
			templateUrl: "templates/contacts/contact.html",
			controller: "ContactController"
		})
		.state('events', {
			url: "/events",
			templateUrl: "templates/events/events.html"
		})
		.state('events.event', {
			url: "/:event_id",
			templateUrl: "templates/events/event.html",
			controller: "EventController"
		})
		.state('tasks', {
			url: "/tasks",
			templateUrl: "templates/tasks/tasks.html"
		})
		.state("tags", {
			url: "/tags",
			templateUrl: "templates/tags/tags.html"
		})
	});
})();