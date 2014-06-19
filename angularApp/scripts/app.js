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
			})
			
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

})();