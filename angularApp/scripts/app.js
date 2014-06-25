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

var authToken = 'qoRyedh9o5xFLY8cpDzA';
var authEmail = 'pastadiablo@gmail.com';

(function(){

	var app = angular.module('DayWonApplication', 
		['ui.router', 'ui.bootstrap', 
		'Contacts', 
		'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 
		'Routing', 'CreateModule']);

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		//$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
		function($scope, $resource, $modal, contactService, tagService, taskService, eventService) {

			var eventsPromise = eventService.Events.get();
			eventsPromise.$promise.then(function(data){
				$scope.events = data.events;
			});
			
			var tasksPromise = taskService.Tasks.get();
			eventsPromise.$promise.then(function(data){
				$scope.tasks = data.tasks;
			});

			var tagsPromise = tagService.Tags.get();
			tagsPromise.$promise.then(function(data){
				$scope.tags = data.tags;
			});

			var contactsPromise = contactService.Contacts.query();
			contactsPromise.$promise.then(function(data) {
				$scope.contacts = data;
			});


			$scope.create = function()
			{
				var modalInstance = $modal.open({
					templateUrl: 'templates/create.html',
					controller: 'CreationController',
					resolve : {
						contacts : function() { return contactsPromise; },
						events : function() { return eventsPromise; },
						tasks : function() { return tasksPromise; },
						tags : function() { return tagsPromise; }
					}
				});

				modalInstance.result.then(function(newContact) {
					console.log(newContact);
					contactService.Contacts.create(newContact);
				});
			}

		}]);

	app.controller('EventsController', ['$resource', '$scope', 'eventService',
		function($resource, $scope, eventService) {
			eventService.Events.get(function(data){
				$scope.events = data.events;
			});
		}]);

	app.controller('TasksController', ['$resource', '$scope', 'taskService',
		function($resource, $scope, taskService) {
			taskService.Tasks.get(function(data){
				$scope.tasks = data.tasks;
			});
		}]);

	app.controller('TagsController', ['$resource', '$scope', 'tagService',
		function($resource, $scope, tagService) {
			tagService.Tags.get(function(data){
				$scope.tags = data.tags;
			});	
		}]);

	app.controller('CalendarController', ['$resource', 'taskService', 'eventService',
		function($resource, taskService, eventService) {

			var ctrl = this;

			eventService.Events.get(function(data){

				ctrl.events = data.events;
				var totalEvents = ctrl.events;

				for (var i = 0; i < totalEvents.length; i++) {

					if (totalEvents[i].hasOwnProperty('start_datetime')) {
						totalEvents[i]['start'] = totalEvents[i]['start_datetime'];
					} else if (totalEvents[i].hasOwnProperty('start_date')) {
						totalEvents[i]['start'] = totalEvents[i]['start_date'];
					}

					if (totalEvents[i].hasOwnProperty('end_datetime')) {
						totalEvents[i]['end'] = totalEvents[i]['end_datetime'];
					} else if (totalEvents[i].hasOwnProperty('end_date')) {
						totalEvents[i]['end'] = totalEvents[i]['end_date'];
					}

					console.log(totalEvents[i]);

				}

		        $('#calendarcont').fullCalendar({
		            header: {
		                left: 'prev,next today',
		                center: 'title',
		                right: 'month,agendaWeek,agendaDay'
		            },
		            editable: true,
		            events: totalEvents
		        });

			});
			
			taskService.Tasks.get(function(data){
				ctrl.tasks = data.tasks;
			});

		}]);	


})();