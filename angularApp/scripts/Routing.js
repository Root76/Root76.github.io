(function() {

var RoutingModule = angular.module('Routing', []);

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
		.state('calendar', {
			url: "/calendar",
			templateUrl: "templates/calendar.html"
		})
//ORPHANS ROUTES
		.state('orphans', {
			url: "/orphans",
			templateUrl: "templates/orphans/orphans.html",
			controller: 'OrphansController'
		})
	//ORPHAN EVENTS
		.state('orphanEvents', {
			abstract: true,
			url: "/orphans/events",
			templateUrl: "templates/orphans/events/orphanEvents.html",
			controller: 'OrphansController'
		})
		.state('orphanEvents.index', {
			url: "/",
			templateUrl: "templates/orphans/events/orphanEvent-index.html"
		})
		.state('orphanEvents.event', {
			url: "/:event_id",
			templateUrl: "templates/orphans/events/orphanEvent.html",
			controller: 'OrphanEventController'
		})
//CONTACTS ROUTES
		.state('contacts', {
			abstract: true,
			url: "/contacts",
			templateUrl: "templates/contacts/contacts.html"
		})
		.state('contacts.index', {
			url: "/",
			templateUrl: "templates/contacts/contact-index.html"
		})
		.state('contacts.contact', {
			url: "/:contact_id",
			templateUrl: "templates/contacts/contact.html",
			controller: "ContactController"
		})
//EVENTS ROUTES
		.state('events', {
			abstract: true,
			url: "/events",
			templateUrl: "templates/events/events.html"
		})
		.state('events.index', {
			url: "/",
			templateUrl: "templates/events/event-index.html"
		})
		.state('events.event', {
			url: "/:event_id",
			templateUrl: "templates/events/event.html",
			controller: "EventController"
		})
//TASKS ROUTES
		.state('tasks', {
			abstract: true,
			url: "/tasks",
			templateUrl: "templates/tasks/tasks.html"
		})
		.state('tasks.index', {
			url: "/",
			templateUrl: "templates/tasks/task-index.html"
		})
		.state('tasks.task', {
			url: "/:task_id",
			templateUrl: "templates/tasks/task.html",
			controller: "TaskController"
		})
//TAGS ROUTES
		.state("tags", {
			abstract: true,
			url: "/tags",
			templateUrl: "templates/tags/tags.html"
		})
		.state("tags.index", {
			url:"/",
			templateUrl: "templates/tags/tag-index.html"
		})
		.state("tags.tag", {
			url: "/:tag_id",
			templateUrl: "templates/tags/tag.html",
			controller: "TagController"
		})
	});
})();