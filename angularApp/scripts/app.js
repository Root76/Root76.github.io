function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}

var query_string = QueryStringToJSON();

//var authToken = query_string.authentication_token;
//var userEmail = query_string.user_email;

var authToken = '4N9-_NWfYvYxpesMVpne';
var authEmail = 'hweaver@evenspring.com';

(function(){

	var app = angular.module('DayWonApplication', ['ui.router', 'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 'Routing']);

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		//$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$resource', 'contactService', 'tagService', 'taskService', 'eventService',
		function($resource, contactService, tagService, taskService, eventService) {

			var ctrl = this;

			eventService.Events.get(function(data){
				ctrl.events = data.events;
			});
			
			taskService.Tasks.get(function(data){
				ctrl.tasks = data.tasks;
			});

			tagService.Tags.get(function(data){
				ctrl.tags = data.tags;
			});			
			
			contactService.Contacts.query(function(data) {
				ctrl.contacts = data;
			});

		}]);

	app.controller('ContactsController', ['$resource', 'contactService',
		function($resource, contactService) {

			var ctrl = this;

			contactService.Contacts.query(function(data) {
				ctrl.contacts = data;
			});

		}]);

	app.controller('EventsController', ['$resource', 'eventService',
		function($resource, eventService) {

			var ctrl = this;

			eventService.Events.get(function(data) {
				ctrl.events = data.events;
			});

		}]);

	app.controller('TasksController', ['$resource', 'taskService',
		function($resource, taskService) {

			var ctrl = this;

			taskService.Tasks.get(function(data) {
				ctrl.tasks = data.tasks;
			});

		}]);

	app.controller('TagsController', ['$resource', 'tagService',
		function($resource, tagService) {

			var ctrl = this;

			tagService.Tags.get(function(data) {
				ctrl.tags = data.tags;
			});

		}]);


})();