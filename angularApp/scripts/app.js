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
		'Contacts', 'Events',
		'ContactServices', 'TagServices', 'TaskServices', 'EventServices', 
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
					allObjects.events = data.events;
				});
			};
			
			$scope.loadTasks = function() {
				$scope.tasksPromise = taskService.Tasks.get();
				$scope.tasksPromise.$promise.then(function(data){
					$scope.tasks = data.tasks;
					allObjects.tasks = data.tasks;
				});
			};

			$scope.loadTags = function() {
				$scope.tagsPromise = tagService.Tags.get();
				$scope.tagsPromise.$promise.then(function(data){
					$scope.tags = data.tags;
					allObjects.tags = data.tags;
				});
			};

			$scope.combineAll = function() {

				var checkPromises = setInterval(function() {

					if (allObjects.contacts.length > 0 && allObjects.events.length > 0 && allObjects.tasks.length > 0 && allObjects.tags.length > 0) {

						console.log("Promises fulfilled");
						clearInterval(checkPromises);
						var combinedObjects = allObjects.contacts.concat(allObjects.events, allObjects.tasks, allObjects.tags);
						$scope.totalObjects = combinedObjects;

					} else {
						console.log("current object count: " + allObjects.contacts.length + " " + allObjects.events.length + " " + allObjects.tasks.length + " " + allObjects.tags.length);
					}

				}, 100);

			}

			$scope.loadContacts();
			$scope.loadEvents();
			$scope.loadTasks();
			$scope.loadTags();
			$scope.combineAll();

			$scope.IndexSort = "-updated_at";

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

				var totalEvents = data.events;

				console.log(totalEvents.length + "events");

				var getTasks = function(cb) {
		            $.ajax({
		                type: 'GET',
		                url: 'http://daywon-api-staging.herokuapp.com/tasks',
		                contentType: "application/json",
		                dataType: "json",
		                headers: {
		                    "X-AUTHENTICATION-TOKEN": authToken,
		                    "X-AUTHENTICATION-EMAIL": authEmail
		                },
		                success: cb,
		                error: function(e) {
		                    console.log("couldn't fetch tasks: " + e);
		                }
		            });
		        }

		        var callback = function(data) {

		        	var allTasks = data.tasks;
		        	var jsonTask = [];
		        	var j = 0;
		        	for (var i = totalEvents.length; j < allTasks.length; j++) {
		        		totalEvents[i] = allTasks[j];
		        		i++;
		        	}

		        	console.log("with tasks: " + totalEvents.length);

		        	var json = totalEvents;

			        for (var i = 0; i < json.length; i++) {

			        	if (totalEvents[i].hasOwnProperty("start_datetime")) {
			        		totalEvents[i]["start"] = totalEvents[i]["start_datetime"];
			        	} else
			        	if (totalEvents[i].hasOwnProperty("start_date")) {
			        		totalEvents[i]["start"] = totalEvents[i]["start_date"];
			        	} 

			        	if (totalEvents[i].hasOwnProperty("end_datetime")) {
			        		totalEvents[i]["end"] = totalEvents[i]["end_datetime"];
			        	} else
			        	if (totalEvents[i].hasOwnProperty("end_date")) {
			        		totalEvents[i]["end"] = totalEvents[i]["end_date"];
			        	}

			        	if (totalEvents[i].hasOwnProperty("due")) {
			        		console.log("there's a due");
			        		totalEvents[i]['start'] = totalEvents[i]["due"];
			        		totalEvents[i]['end'] = totalEvents[i]["due"];
			        		totalEvents[i]['className'] = 'calTask active';
			        	} else {
			        		totalEvents[i]['className'] = 'calEvent active';
			        	}
			        }

			        $('#calendarcont').fullCalendar({
			            header: {
			                left: 'prev,next today',
			                center: 'title',
			                right: 'month,agendaWeek,agendaDay'
			            },
			            editable: true,
			            events: totalEvents,
			            eventClick: function(calItem, jsEvent, view) {

					        var calElement = this;

					        if (calItem.hasOwnProperty('location')) {
								
								$.ajax({
							        type: 'GET',
							        url: 'http://daywon-api-staging.herokuapp.com/events/' + calItem.id,
							        contentType: "application/json",
							        dataType: "json",
							        headers: {
							            "X-AUTHENTICATION-TOKEN": authToken,
							            "X-AUTHENTICATION-EMAIL": authEmail
							        },
							        success: function (data) {

							        	console.log("success");
							        	console.log(data);
							        	var popupContent = '<div class="calPopupTags"><ul>';
							        	var objectTags = data.tags;

							        	for (var i = 0; i < objectTags.length; i++) {
							        		popupContent += '<a href="#/tags/' + objectTags[i].id + '"><li><img src="img/tags.png" /><span>' + objectTags[i].name + '</span></li></a>';
							        	}

							        	popupContent += '</ul></div><div class="calPopupCont"><p><b>Event Description: </b>' + data.description + '</p><p><b>Event Start: </b>' + moment(data.start_datetime).format('MMMM Do YYYY, h:mm:ss a') + '</p><p><b>Event End: </b>' + moment(data.end_datetime).format('MMMM Do YYYY, h:mm:ss a') + '</p></div>';

										var calPopupTemplate = '<a href="#/events/' + data.id + '"><h2>' + data.title + '</h2></a>' + popupContent;
								        
								        new Opentip(calElement, calPopupTemplate, {
						            		style: "calitem",
						            		showOn: "creation",
						            		hideTrigger: "closeButton",
						            		className: "calpop",
						            		background: "#e35d32",
						            		closeButtonRadius: 15,
						            		closeButtonCrossSize: 10,
						            		closeButtonCrossColor: "#ffffff"
						        		});	

								    },
							        error: function(e) {
							        	console.log("error: " + e);
							        }
							    });

							} else if (calItem.hasOwnProperty('due')) {

								$.ajax({
							        type: 'GET',
							        url: 'http://daywon-api-staging.herokuapp.com/tasks/' + calItem.id,
							        contentType: "application/json",
							        dataType: "json",
							        headers: {
							            "X-AUTHENTICATION-TOKEN": authToken,
							            "X-AUTHENTICATION-EMAIL": authEmail
							        },
							        success: function (data) {

							        	console.log("success");
							        	console.log(data);
							        	var popupContent = '<div class="calPopupTags"><ul>';
							        	var objectTags = data.tags;

							        	for (var i = 0; i < objectTags.length; i++) {
							        		popupContent += '<a href="#/tags/' + objectTags[i].id + '"><li><img src="img/tags.png" /><span>' + objectTags[i].name + '</span></li></a>';
							        	}

							        	popupContent += '</ul></div><div class="calPopupCont"><p><b>Task notes: </b>' + data.notes + '</p><p><b>Task Due: </b>' + moment(data.due).format('MMMM Do YYYY, h:mm:ss a') + '</p><p><b>Task Priority: </b>' + data.priority + '</p></div>';

										var calPopupTemplate = '<a href="#/tasks/' + data.id + '"><h2>' + data.title + '</h2></a>' + popupContent;
								        
								        new Opentip(calElement, calPopupTemplate, {
						            		style: "calitem",
						            		showOn: "creation",
						            		hideTrigger: "closeButton",
						            		className: "calpop",
						            		background: "#88c44c",
						            		closeButtonRadius: 15,
						            		closeButtonCrossSize: 10,
						            		closeButtonCrossColor: "#ffffff"
						        		});	

								    },
							        error: function(e) {
							        	console.log("error: " + e);
							        }
							    });

							} else {
								alert("something's wrong");
							}
					    }
			        });

		        }

		        getTasks(callback);
		        console.log(totalEvents);

			});

		}]);

})();