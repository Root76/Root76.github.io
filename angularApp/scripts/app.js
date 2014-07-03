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

function hashHandler(){
    this.oldHash = window.location.hash;
    this.Check;
    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.hash){
            console.log(window.location.hash);
            that.oldHash = window.location.hash;
            rebindEvents();
        }
    };
    this.Check = setInterval(function(){ detect() }, 100);
}

var hashDetection = new hashHandler();

(function(){
	var app = angular.module('DayWonApplication', 
		['ui.router', 'ui.bootstrap', 
		'Contacts', 'Events', 'Tasks','Tags',
		'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 
		'Calendar',
		'Routing', 'CreateModule']);

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		//$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
		function($scope, $resource, $modal, contactService, tagService, taskService, eventService) {

			var allObjects = {
				contacts: "",
				events: "",
				tasks: "",
				tags: ""
			};

			$scope.loadContacts = function() {
				$scope.contactsPromise = contactService.Contacts.query();
				$scope.contactsPromise.$promise.then(function(data) {
					
					$scope.contacts = data;
					allObjects.contacts = data;
					for (var i = 0; i < allObjects.contacts.length; i++) {
						allObjects.contacts[i]['type'] = "contact";
					}

				});
			};

			$scope.loadEvents = function() {
				$scope.eventsPromise = eventService.Events.get();
				$scope.eventsPromise.$promise.then(function(data){

					$scope.events = data.events;

					var thisDate, j;
					var today = moment().format('MMMM Do YYYY');
					var tomorrow = moment().add('days', 1).format('MMMM Do YYYY');
					var day3 = moment().add('days', 2).format('MMMM Do YYYY');
					var day4 = moment().add('days', 3).format('MMMM Do YYYY');
					var day5 = moment().add('days', 4).format('MMMM Do YYYY');
					var day6 = moment().add('days', 5).format('MMMM Do YYYY');
					var day7 = moment().add('days', 6).format('MMMM Do YYYY');

					var events1 = new Array();
					var events2 = new Array();
					var events3 = new Array();
					var events4 = new Array();
					var events5 = new Array();
					var events6 = new Array();
					var events7 = new Array();

					allObjects.events = data.events;
					
					for (var i = 0; i < allObjects.events.length; i++) {
						allObjects.events[i]['type'] = "event";
					}

					function buildArray(eventArray, targetDate) {

						j = 0;

						for (var i = 0; i < allObjects.events.length; i++) {

							thisDate = allObjects.events[i]['start_datetime'];
							if (moment(thisDate).format('MMMM Do YYYY') == targetDate) {
								eventArray[j] = allObjects.events[i];
								j++;
							}

						}

					}

					buildArray(events1, today);
					buildArray(events2, tomorrow);
					buildArray(events3, day3);
					buildArray(events4, day4);
					buildArray(events5, day5);
					buildArray(events6, day6);
					buildArray(events7, day7);

					$scope.events1 = events1;
					$scope.events2 = events2;
					$scope.events3 = events3;
					$scope.events4 = events4;
					$scope.events5 = events5;
					$scope.events6 = events6;
					$scope.events7 = events7;

				});
			};
			
			$scope.loadTasks = function() {
				$scope.tasksPromise = taskService.Tasks.get();
				$scope.tasksPromise.$promise.then(function(data){

					$scope.tasks = data.tasks;
					$scope.FilteredTasks = $scope.tasks;
					console.log(data.tasks);

					allObjects.tasks = data.tasks;
					for (var i = 0; i < allObjects.tasks.length; i++) {
						allObjects.tasks[i]['type'] = "task";
					}

				});
			};

			$scope.loadTags = function() {
				$scope.tagsPromise = tagService.Tags.get();
				$scope.tagsPromise.$promise.then(function(data){

					$scope.tags = data.tags;

					allObjects.tags = data.tags;
					for (var i = 0; i < allObjects.tags.length; i++) {
						allObjects.tags[i]['type'] = "tag";
					}

				});
			};

			$scope.combineAll = function() {

				var checkPromises = setInterval(function() {

					if (allObjects.contacts.length > 0 && allObjects.events.length > 0 && allObjects.tasks.length > 0 && allObjects.tags.length > 0) {

						//console.log("Promises fulfilled");
						clearInterval(checkPromises);
						var combinedObjects = allObjects.contacts.concat(allObjects.events, allObjects.tasks, allObjects.tags);

						$scope.totalObjects = combinedObjects;

						//console.log(combinedObjects);
						//combinedObjects = combinedObjects.splice(10, 11);
						//console.log(combinedObjects);

					} else {
						//console.log("current object count: " + allObjects.contacts.length + " " + allObjects.events.length + " " + allObjects.tasks.length + " " + allObjects.tags.length);
					}

				}, 100);

			}

			$scope.loadContacts();
			$scope.loadEvents();
			$scope.loadTasks();
			$scope.loadTags();
			$scope.combineAll();

			$scope.IndexSort = "-updated_at";

			$scope.TaskShow = ['Open Tasks', 'Closed Tasks'];

			$scope.TaskFilter = null;

			$scope.updateTaskList = function() {
				console.log("chosen filter");
				console.log($scope.TaskFilter);
				$scope.FilteredTasks = new Array();
				if ($scope.TaskFilter === "Open Tasks") {
					for (var i = 0; i < $scope.tasks.length; i++) {
						if ($scope.tasks[i]['status'] == false) {
							$scope.FilteredTasks.push($scope.tasks[i]);
							console.log("status was false, pushing to array");
							console.log($scope.FilteredTasks);
						} else {
							console.log("status is true");
						}
					}
				}
				if ($scope.TaskFilter === "Closed Tasks") {
					for (var i = 0; i < $scope.tasks.length; i++) {
						if ($scope.tasks[i]['status'] == true) {
							$scope.FilteredTasks.push($scope.tasks[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredTasks);
						} else {
							console.log("status is false");
						}
					}					
				}
			}

			$scope.TaskSort = [
				{title: 'Tasks with no dates', prop: 'due'}, 
				{title: 'Tasks with dates', prop: '-due'},
				{title: 'Priority', prop: 'priority'}, 
				{title: 'Alphabetical', prop: 'title'}
			];

			$scope.TaskOrder = $scope.TaskSort[0];

			$scope.TagSort = [
				{title: 'Count', prop: 'count'},
				{title: 'Name', prop: 'name'}
			];
			$scope.TagOrder = $scope.TagSort[1];

			$scope.create = function()
			{
				var modalInstance = $modal.open({
					templateUrl: 'templates/create.html',
					controller: 'CreationController',
					resolve : {
						contactsPromise : function() { return $scope.contactsPromise; },
						eventsPromise : function() { return $scope.eventsPromise; },
						tasksPromise : function() { return $scope.tasksPromise; },
						tagsPromise : function() { return $scope.tagsPromise; }
					}
				});

				modalInstance.result.then(function(newObject) {

					if(newObject.type == "contact")
					{
						delete newObject.type;
						contactService.Contacts.create(newObject).$promise.then(function(){
							console.log("Reloading contacts");
							$scope.loadContacts();	
						});
					}
					else if(newObject.type == "event")
					{
						delete newObject.type;
						eventService.Events.create(newObject).$promise.then(function(){
							console.log("Reloading events");
							$scope.loadEvents();	
						});
						
					}
					else if(newObject.type == "task")
					{
						delete newObject.type;
						taskService.Tasks.create(newObject).$promise.then(function(){
							console.log("Reloading tasks");
							$scope.loadTasks();	
						});
					}
					else if(newObject.type == "tag")
					{
						delete newObject.type;
						tagService.Tags.create(newObject).$promise.then(function(){
							console.log("Reloading tags");
							$scope.loadTags();	
						});
					}
					
				});
			}

			$scope.getContactTitle = function(contact) {
				console.log(contact);

				if(contact.name)
					return contact.name;
				else
					if(contact.emails && contact.emails[0] && contact.emails[0].email)
						return contact.emails[0].email;

				
				return "No name or email";		
			}

		}]);


	
	
	var filtered_list = [];

	app.filter('openEvents', function(){
		return function(eventShells, allEvents) {
			filtered_list = [];

			if(eventShells && allEvents)
			{
				for(var i = 0; i < eventShells.length; i++)
					for(var j = 0; j < allEvents.length; j++)
						if(allEvents[j].id == eventShells[i].id) //Our event id matches with the list of full data events
						{
							var today = moment();

							if(allEvents[j].recurrence) //rules are different for recurrence events
							{
								if(moment(allEvents[j].end_datetime) > today)
									filtered_list.push(eventShells[i]);
							}
							else
							{
								if(moment(allEvents[j].end_datetime) > today)
									filtered_list.push(eventShells[i]);
							}
						}
			}

			return filtered_list;
		}
	});

	app.filter('closedEvents', function(){
		return function(eventShells, allEvents) {
			filtered_list = [];

			if(eventShells && allEvents)
			{
				for(var i = 0; i < eventShells.length; i++)
					for(var j = 0; j < allEvents.length; j++)
						if(allEvents[j].id == eventShells[i].id) //Our event id matches with the list of full data events
						{
							var today = moment();

							if(allEvents[j].recurrence) //rules are different for recurrence events
							{
								if(moment(allEvents[j].end_datetime) < today)
									filtered_list.push(eventShells[i]);
							}
							else
							{
								if(moment(allEvents[j].end_datetime) < today)
									filtered_list.push(eventShells[i]);
							}
						}
			}

			return filtered_list;
		}
	});

	app.filter('openTasks', function() {
		return function(tasks) {
			filtered_list = [];
			if(tasks)
				for(var i = 0; i < tasks.length; i++)
				{
					if(!tasks[i].status)
					{
						filtered_list.push(tasks[i]);
					}
				}

			return filtered_list;
		}
	});

	app.filter('closedTasks', function() {
		return function(tasks) {
			filtered_list = [];
			if(tasks)
				for(var i = 0; i < tasks.length; i++)
				{
					if(tasks[i].status)
					{
						filtered_list.push(tasks[i]);
					}
				}

			return filtered_list;
		}
	});

})();