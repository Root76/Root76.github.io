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

var authToken = query_string.authentication_token;
var authEmail = query_string.user_email;

//var authToken = '4N9-_NWfYvYxpesMVpne';
//var authEmail = 'hweaver@evenspring.com';

function hashHandler(){
    this.oldHash = window.location.hash;
    this.Check;
    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.hash){
            console.log(window.location.hash);
            $("#preload").remove();
            $("#recent10").addClass('active');
            that.oldHash = window.location.hash;
            rebindEvents();
        }
    };
    this.Check = setInterval(function(){ detect() }, 100);
}

var hashDetection = new hashHandler();

var previouslySelected, listCount;
var relatedContacts = true;
var relatedEvents = true;
var relatedTasks = true;
var relatedTags = true;

(function(){

	var app = angular.module('DayWonApplication', 
		['ui.router', 'ui.bootstrap', 'xeditable',
		'Contacts', 'Events', 'Tasks','Tags',
		'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 
		'Calendar', 'Orphans', 'Settings',
		'Routing', 'CreateModule', 'ReportsModule', 'DashboardModule']);

	app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		$httpProvider.interceptors.push(function($q) {
			return {
				'request': function(config) {
					if(config.url.indexOf("template") == -1) //don't change the url if referencing templates
						config.url =  "https://daywon-api-staging.herokuapp.com" + config.url;
					return config || $q.when(config);
				}
			}
		});

	}]);

	app.controller('IndexController', ['$scope', '$resource', '$modal', 'contactService', 'tagService', 'taskService', 'eventService', 
		function($scope, $resource, $modal, contactService, tagService, taskService, eventService) {

			var allObjects = {
				contacts: "",
				events: "",
				tasks: "",
				tags: ""
			};

			$scope.allReady = false;

			$scope.loadContacts = function() {

				$scope.globalUserSettings = $resource('/users/settings').get();

				var thisName, theseEmails, emailObject;
				$scope.contactsPromise = contactService.Contacts.query();
				$scope.contactsPromise.$promise.then(function(data) {

					$scope.contacts = data;

					allObjects.contacts = data;
					for (var i = 0; i < allObjects.contacts.length; i++) {
						allObjects.contacts[i]['type'] = "contact";
						allObjects.contacts[i]['title'] = allObjects.contacts[i]['name'];
						thisName = allObjects.contacts[i]['name'] || '';
						theseEmails = allObjects.contacts.emails || '';
						if (thisName.indexOf('@') > -1) {
							if (theseEmails.indexOf(thisName) < 0) {
								emailObject = {
									email: thisName
								};
								allObjects.contacts[i]['emails'][theseEmails.length] = emailObject;
							}
						}
					}

					$scope.FilteredContacts = allObjects.contacts;
					$scope.AllFilteredContacts = $scope.FilteredContacts;

					/*$scope.FilteredContacts.forEach(function(contact){
						contactService.Contact.get({contact_id: contact.id}, function(data) {
							contact.tagcount = data.tags.length;
						});
					});*/
				});

			};

			$scope.loadEvents = function() {
				$scope.eventsPromise = eventService.Events.get();
				$scope.eventsPromise.$promise.then(function(data){

					$scope.events = data.events;

					var today = moment().format('MMMM Do YYYY');
					var todayRaw = moment().format('YYYYMMDDHHMMSS');
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
						if (allObjects.events[i]['start_datetime'] == null) {
							allObjects.events[i]['start_datetime'] = allObjects.events[i]['start_date'];
						}
					}

					$scope.FilteredEvents = new Array();
					var eventTitles = new Array();
					var processedEvents = new Array();
					var thisTitle, thisDate, duplicateEvents, titleCount, duplicateCount;

					for (var i = 0; i < allObjects.events.length; i++) {

						duplicateEvents = new Array();
						thisTitle = allObjects.events[i]['title'];
						titleCount = 0;
						duplicateCount = 0;

						if (processedEvents.indexOf(thisTitle) < 0) {

							allObjects.events.forEach(function(event){
								if (event.title == thisTitle) {
									titleCount++;
									duplicateEvents.push(event);
									if (titleCount == 1) {
										processedEvents.push(thisTitle);
									}
								}
							});

							duplicateEvents.sort(function(a, b) {
								if (a.start_datetime < b.start_datetime) {
									return -1;
								}
								if (a.start_datetime > b.start_datetime) {
									return 1;
								}
								return 0;
							});
							
							if (titleCount == 1) {
								$scope.FilteredEvents.push($scope.events[i]);
							}
							else if (titleCount > 1) {
								duplicateEvents.forEach(function(event){
									if (todayRaw < moment(event.start_datetime).format('YYYYMMDDHHMMSS') && duplicateCount == 0) {
										$scope.FilteredEvents.push(event);
										duplicateCount++;
									}
								});
							}

						}

					}

					$scope.FilteredEvents.sort(function(a, b) {
						if (a.start_datetime < b.start_datetime) {
							return -1;
						}
						if (a.start_datetime > b.start_datetime) {
							return 1;
						}
						return 0;
					});

					/*$scope.FilteredEvents.forEach(function(event){
						eventService.Event.get({event_id: event.id}, function(data) {
							event.tagcount = data.tags.length;
							if (data.tags.length > 0) {
								console.log(data.title + " tagged " + data.tags.length + " times");
							}
						});
					});*/

					$scope.AllFilteredEvents = $scope.FilteredEvents;

					var j;

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
					console.log(data.tasks);

					allObjects.tasks = data.tasks;
					for (var i = 0; i < allObjects.tasks.length; i++) {
						allObjects.tasks[i]['type'] = "task";
					}

					$scope.FilteredTasks = allObjects.tasks;

				});
			};

			$scope.loadTags = function() {
				$scope.tagsPromise = tagService.Tags.get();
				$scope.tagsPromise.$promise.then(function(data){

					$scope.tags = data.tags;

					allObjects.tags = data.tags;
					for (var i = 0; i < allObjects.tags.length; i++) {
						allObjects.tags[i]['type'] = "tag";
						allObjects.tags[i]['title'] = allObjects.tags[i]['name'];
					}

				});
			};

			$scope.combineAll = function() {

				var i = 0;
				var contactSet = false;
				var eventSet = false;
				var taskSet = false;
				var tagSet = false;
				var combinedObjects = new Array();
				$scope.totalObjects = combinedObjects;

				var checkPromises = setInterval(function() {

					if (allObjects.contacts.length > 0 && contactSet == false) {
						$scope.totalObjects = $scope.totalObjects.concat(allObjects.contacts);
						contactSet = true;
					}
					if (allObjects.events.length > 0 && eventSet == false) {
						$scope.totalObjects = $scope.totalObjects.concat(allObjects.events);
						eventSet = true;
					}
					if (allObjects.tasks.length > 0 && taskSet == false) {
						$scope.totalObjects = $scope.totalObjects.concat(allObjects.tasks);
						taskSet = true;
					}
					if (allObjects.tags.length > 0 && tagSet == false) {
						$scope.totalObjects = $scope.totalObjects.concat(allObjects.tags);
						tagSet = true;
					}

					if ((allObjects.contacts.length > 0 && allObjects.events.length > 0) || (i > 5)) {

						console.log("final object count: " + allObjects.contacts.length + " " + allObjects.events.length + " " + allObjects.tasks.length + " " + allObjects.tags.length);

						clearInterval(checkPromises);
						$scope.allReady = true;
						$("#preload").remove();
						$("#recent10").addClass('active');
					}

					i++;

				}, 1000);

			}

			$scope.loadOrphans = function() {


				$scope.orphansPromise = $resource("/orphans").get();

				$scope.eventOrphans = [];
				$scope.taskOrphans = [];
				$scope.tagOrphans = [];

				$scope.orphansPromise.$promise.then(function(data) {

					$scope.eventOrphans = data.orphans[0].events;
					$scope.taskOrphans = data.orphans[0].tasks;
					$scope.tagOrphans = data.orphans[0].tags;

					$scope.FilteredOrphanEvents = new Array();
					var eventTitles = new Array();
					var processedEvents = new Array();
					var thisTitle, thisDate, duplicateEvents, titleCount, duplicateCount;
					var todayRaw = moment().format('YYYYMMDDHHMMSS')

					for (var i = 0; i < $scope.eventOrphans.length; i++) {

						duplicateEvents = new Array();
						thisTitle = $scope.eventOrphans[i]['title'];
						titleCount = 0;
						duplicateCount = 0;

						if (processedEvents.indexOf(thisTitle) < 0) {

							$scope.eventOrphans.forEach(function(event){
								if (event.title == thisTitle) {
									titleCount++;
									duplicateEvents.push(event);
									if (titleCount == 1) {
										processedEvents.push(thisTitle);
									}
								}
							});

							duplicateEvents.sort(function(a, b) {
								if (a.start_datetime < b.start_datetime) {
									return -1;
								}
								if (a.start_datetime > b.start_datetime) {
									return 1;
								}
								return 0;
							});
							
							if (titleCount == 1) {
								$scope.FilteredOrphanEvents.push($scope.eventOrphans[i]);
							}
							else if (titleCount > 1) {
								duplicateEvents.forEach(function(event){
									if (todayRaw < moment(event.start_datetime).format('YYYYMMDDHHMMSS') && duplicateCount == 0) {
										$scope.FilteredOrphanEvents.push(event);
										duplicateCount++;
									}
								});
							}

						}

					}

					$scope.FilteredOrphanEvents.sort(function(a, b) {
						if (a.start_datetime < b.start_datetime) {
							return -1;
						}
						if (a.start_datetime > b.start_datetime) {
							return 1;
						}
						return 0;
					});

					$scope.FilteredOrphanEvents.forEach(function(event){
						/*eventService.Event.get({event_id: event.id}, function(data) {
							event.tagcount = data.tags.length;
							if (data.tags.length > 0) {
								console.log(data.title + " tagged " + data.tags.length + " times");
							}
						});*/
					});

					$scope.AllFilteredOrphanEvents = $scope.FilteredOrphanEvents;
				});
			}

			$scope.loadContacts();
			$scope.loadEvents();
			$scope.loadTasks();
			$scope.loadTags();
			$scope.combineAll();
			$scope.loadOrphans();			

			$scope.TaskSort = [
				{title: 'Tasks with no dates', prop: 'due'}, 
				{title: 'Tasks with dates', prop: '-due'},
				{title: 'Priority', prop: 'priority'}, 
				{title: 'Alphabetical', prop: 'title'}
			];

			$scope.TaskOrder = $scope.TaskSort[0];
			$scope.IndexSort = "-updated_at";

			$scope.TagSort = [
				{title: 'Count', prop: 'count'},
				{title: 'Name', prop: 'name'}
			];
			$scope.TagOrder = $scope.TagSort[1];

			$scope.create = function(type)
			{

				var modalInstance = $modal.open({
					templateUrl: 'templates/create.html',
					controller: 'CreationController',
					resolve : {
						contactsPromise : function() { return $scope.contactsPromise; },
						eventsPromise : function() { return $scope.eventsPromise; },
						tasksPromise : function() { return $scope.tasksPromise; },
						tagsPromise : function() { return $scope.tagsPromise; },
						creationType : function() {return type;}
					}
				});

				modalInstance.result.then(function(newObject) {

					if(newObject)
					{
						if(newObject.type == "contact")
						{
							delete newObject.type;
							contactService.Contacts.create(newObject).$promise.then(function(){
								console.log("Reloading contacts");
								$scope.loadContacts();	
								$scope.loadOrphans();
								reactivateAccords();
							});
						}
						else if(newObject.type == "event")
						{
							delete newObject.type;
							eventService.Events.create(newObject).$promise.then(function(){
								console.log("Reloading events");
								$scope.loadEvents();
								$scope.loadOrphans();
								reactivateAccords();
							});
							
						}
						else if(newObject.type == "task")
						{
							delete newObject.type;
							taskService.Tasks.create(newObject).$promise.then(function(){
								console.log("Reloading tasks");
								$scope.loadTasks();	
								$scope.loadOrphans();
								reactivateAccords();
							});
						}
						else if(newObject.type == "tag")
						{
							delete newObject.type;
							tagService.Tags.create(newObject).$promise.then(function(){
								console.log("Reloading tags");
								$scope.loadTags();	
								$scope.loadOrphans();
								reactivateAccords();
							});
						}

						function reactivateAccords() {
							console.log("reactivating " + $('.listitem').length + " accordions");
							setTimeout(function(){
								$('.sortitem.selected').click();
							}, 500);
						}

					}
					
				});
				
			}

			$scope.getContactTitle = function(contact) {

				if(contact)
					if(contact.name)
						if($scope.globalUserSettings.sort_by_last_name)
						{
							//stuff
							var fullname = contact.name.split(' ');
							var firstname = fullname.slice(0, -1).join(' ');
							var lastname = fullname.slice(-1).join(' ');

							return lastname + ", " + firstname;
						}
						else
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

							if(allEvents[j].is_all_day) //rules are different all day events
							{
								if(moment(allEvents[j].end_date) > today)
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

							if(allEvents[j].is_all_day) //rules are different all day events
							{
								if(moment(allEvents[j].end_date) < today)
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

	app.filter("associatedContactObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "contact")
						filtered_list.push(objects[i]);


			return filtered_list
		};
	});

	app.filter("associatedEventObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "event")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

	app.filter("associatedTaskObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "task")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

	app.filter("associatedTagObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "tag")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

})();