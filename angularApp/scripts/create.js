(function(){

	var createModule = angular.module('CreateModule', []);

	createModule.filter("associatedContactObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "contact")
						filtered_list.push(objects[i]);


			return filtered_list
		};
	});

	createModule.filter("associatedEventObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "event")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

	createModule.filter("associatedTaskObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "task")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

	createModule.filter("associatedTagObjects", function() {
		return function(objects) {
			var filtered_list = [];

			if(objects)
				for(var i = 0; i < objects.length; i++)
					if(objects[i].type != "tag")
						filtered_list.push(objects[i]);
					
			return filtered_list
		};
	});

	createModule.controller('CreationController', ['$scope', '$modalInstance', 'contactsPromise', 'eventsPromise', 'tasksPromise', 'tagsPromise',
		function($scope, $modalInstance, contactsPromise, eventsPromise, tasksPromise, tagsPromise) {

			$scope.modalInstance = $modalInstance;

			$scope.contactsPromise = contactsPromise;
			$scope.eventsPromise = eventsPromise;
			$scope.tasksPromise = tasksPromise;
			$scope.tagsPromise = tagsPromise;

			$scope.dropdownText="Select an object";
			$scope.selection = 0;
			
			$scope.status = {
				isopen: false
			};

			$scope.selectedObject = undefined;
			$scope.objects = [];
			$scope.associatedObjects = [];

			$scope.contactsPromise.$promise.then(function(data){
				var contacts = data;

				for(var i = 0; i < contacts.length; i++)
				{
					var contact = contacts[i];

					contact.type = "contact";
					contact.title = contact.name;

					$scope.objects.push(contact);
				}
			});

			$scope.eventsPromise.$promise.then(function(data){

				var events = data.events;

				for(var i = 0; i < events.length; i++)
				{
					var event = events[i];

					event.type = "event";

					var skip = false;

					if(event.recurring)
					{
						for(var j = 0; j < $scope.objects.length; j++)
						{
							if($scope.objects[j].title == event.title)
								skip = true;
						}
					}

					if(!skip)
						$scope.objects.push(event);
				}	
			});
			
			
			$scope.tasksPromise.$promise.then(function(data){

				var tasks = data.tasks;

				for(var i = 0; i < tasks.length; i++)
				{
					var task = tasks[i];

					task.type = "task";

					$scope.objects.push(task);
				}
			});
			
			$scope.tagsPromise.$promise.then(function(data){
				
				var tags = data.tags;

				for(var i = 0; i < tags.length; i++)
				{
					var tag = tags[i];

					tag.type = "tag";
					tag.title = tag.name;

					$scope.objects.push(tag);
				}
			});

			$scope.onSelect = function ($item, $model, $label) {

				$scope.associatedObjects.push($model);
			}

			$scope.removeObject = function(object) {
				var index = $scope.associatedObjects.indexOf(object);

				if(index > -1)
					$scope.associatedObjects.splice(index, 1);
			}

			$scope.selectCreation = function(selection) 
			{
				$scope.selection = selection;

				switch(selection)
				{
					case 1: 
						$scope.dropdownText="Contact";
						break;
					case 2:
						$scope.dropdownText="Event";
						break;
					case 3:
						$scope.dropdownText="Task";
						break;
					case 4:
						$scope.dropdownText="Tag";
						break;
				} 

				$scope.status.isopen = false;	
				$scope.associatedObjects = [];			
			};

			$scope.contactSelected = function() { return $scope.selection == 1; };
			$scope.eventSelected = function() { return $scope.selection == 2; };
			$scope.taskSelected = function() { return $scope.selection == 3; };
			$scope.tagSelected = function() { return $scope.selection == 4; };

		}]);

	createModule.controller('ContactCreationController', ['$scope', 
		function($scope) {

			$scope.newContact = {
				name: '',
				emails: [
					{email:''}
				],
				organization: '',
				phones: [
					{number:''}
				],
				address:'',
				event_ids:'',
				task_ids:'',
				tag_ids:'',
				type: "contact"
			}
			

			$scope.emailTitle = function() {
				if($scope.newContact.emails.length > 1)
					return "Contact emails";
				else
					return "Contact email";
			}

			$scope.addEmail = function() {
				$scope.newContact.emails.push({email:''});
			}

			$scope.removeEmail = function(email) {
				var index = $scope.newContact.emails.indexOf(email);
				
				if(index > -1 && $scope.newContact.emails.length > 1)
					$scope.newContact.emails.splice(index, 1);
			}

			$scope.phoneTitle = function() {
				if($scope.newContact.phones.length > 1)
					return "Contact phone numbers";
				else
					return "Contact phone number";
			}

			$scope.addPhone = function() {
				$scope.newContact.phones.push({number:''});
			}

			$scope.removePhone = function(number) {
				var index = $scope.newContact.phones.indexOf(number);

				if(index > -1 && $scope.newContact.phones.length > 1)
					$scope.newContact.phones.splice(index, 1);
			}

			$scope.createContact = function() {

				//TODO: Perform validation!

				var event_ids = [];
				var task_ids = [];
				var tag_ids = [];

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "event")
						event_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "task")
						task_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "tag")
						tag_ids.push($scope.associatedObjects[i].id);
				}
				
				$scope.newContact.event_ids = event_ids;
				$scope.newContact.task_ids = task_ids;
				$scope.newContact.tag_ids = tag_ids;

				if($scope.newContact.phones.length < 1 && $scope.newContact.phones[0] == '')
					delete $scope.newContact.phones;

				if($scope.newContact.emails.length < 1 && $scope.newContact.emails[0] == '')
					delete $scope.newContact.emails;

				$scope.modalInstance.close($scope.newContact);
			}

		}]);

	createModule.controller("EventCreationController", ['$scope', 
		function($scope) {
			$scope.newEvent = {
				title : "",
				description: "",
				location: "",
				is_all_day: false,
				recurring: false,
				start_datetime: "",
				end_datetime: "",
				type: "event"

			};

			$scope.repeatEvery = 0;

			$scope.recurrence = {
				frequency: "",
				ends_after: {
					occurences: 0,
					date: "",
				}
			};

			$scope.startTime = new Date();
			$scope.endTime = new Date();

			$scope.frequencies = [
				{display: "Daily", value: "day"},
				{display: "Weekly", value: "week"},
				{display: "Monthly", value: "month"},
				{display: "Yearly", value: "year"},
				{display: "All Weekdays", value: "weekday"}
			];
			$scope.endsAfter = "";
			$scope.endsAfterOccurences = 0;
			$scope.endsAfterDate = undefined;

			$scope.AllDay = function() {

			};

			$scope.today = function() {
			  $scope.dt = new Date();
			};
			$scope.today();
			
			$scope.format = 'shortDate';

			$scope.open = function($event, which) {
		      $event.preventDefault();
		      $event.stopPropagation();

		      if(which == 'start')
		      	$scope.startDateOpened = !($scope.startDateOpened);

		      if(which == 'end')
		      	$scope.endDateOpened = !($scope.endDateOpened);
		    };

		    $scope.openEndAfter = function($event) {

		      	$event.preventDefault();
		      	$event.stopPropagation();

		     	$scope.endsAfterDateOpened = !($scope.endsAfterDateOpened);
		    };

		    $scope.createEvent = function() {

				//TODO: Perform validation!
				var valid = true;

				var contact_ids = [];
				var task_ids = [];
				var tag_ids = [];

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						contact_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "task")
						task_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "tag")
						tag_ids.push($scope.associatedObjects[i].id);
				}
				
				$scope.newEvent.contact_ids = contact_ids;
				$scope.newEvent.task_ids = task_ids;
				$scope.newEvent.tag_ids = tag_ids;

				if($scope.newEvent.is_all_day)
				{
					$scope.newEvent.start_date.setHours(0);
					$scope.newEvent.start_date.setMinutes(0);
					$scope.newEvent.start_date.setSeconds(0);
					$scope.newEvent.start_date.setMilliseconds(0);
				
					$scope.newEvent.end_date.setHours(0);
					$scope.newEvent.end_date.setMinutes(0);
					$scope.newEvent.end_date.setSeconds(0);
					$scope.newEvent.end_date.setMilliseconds(0);

					delete $scope.newEvent.start_datetime;
					delete $scope.newEvent.end_datetime;
				}
				else
				{
					$scope.newEvent.start_date.setHours($scope.startTime.getHours());
					$scope.newEvent.start_date.setMinutes($scope.startTime.getMinutes());
					$scope.newEvent.start_date.setSeconds($scope.startTime.getSeconds());
					$scope.newEvent.start_date.setMilliseconds($scope.startTime.getMilliseconds());
				
					$scope.newEvent.end_date.setHours($scope.endTime.getHours());
					$scope.newEvent.end_date.setMinutes($scope.endTime.getMinutes());
					$scope.newEvent.end_date.setSeconds($scope.endTime.getSeconds());
					$scope.newEvent.end_date.setMilliseconds($scope.endTime.getMilliseconds());

					$scope.newEvent.start_datetime = $scope.newEvent.start_date;
					$scope.newEvent.end_datetime = $scope.newEvent.end_date;

					delete $scope.newEvent.start_date;
					delete $scope.newEvent.end_date;
				}

				if($scope.newEvent.recurring)
				{

					$scope.newEvent.recurrence = $scope.recurrence;

					if($scope.endsAfter == "never")
						$scope.newEvent.recurrence.ends_after = {};
					else if($scope.endsAfter == "after")
						$scope.newEvent.recurrence.ends_after.occurences = $scope.endsAfterOccurences;
					else if($scope.endsAfter == "on")
						$scope.newEvent.recurrence.ends_after.date = $scope.endsAfterDate;
					else {
						valid = false;
						delete $scope.newEvent.recurrence;
					}

				}

				if(valid)
				{
					$scope.modalInstance.close($scope.newEvent);
				}
		    };


	}]);

	createModule.controller("TaskCreationController", ['$scope',
		function($scope) {

			$scope.newTask = {
				title: "",
				notes: "",
				status: false,
				priority: 1,
				due: new Date(),
				type: "task"
			};

			$scope.format = 'shortDate';

			$scope.open = function($event) {
		      $event.preventDefault();
		      $event.stopPropagation();
		      
		      $scope.dueOpened = !($scope.dueOpened );
		    };

			$scope.createTask = function() {
				
				//TODO: Perform validation!
				var valid = true;

				var contact_ids = [];
				var tag_ids = [];
				var event_ids = [];

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						contact_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "tag")
						tag_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "event")
						event_ids.push($scope.associatedObjects[i].id);
				}
				
				$scope.newTask.contact_ids = contact_ids;
				$scope.newTask.tag_ids = tag_ids;
				$scope.newTask.event_ids = event_ids;
				
				$scope.newTask.due.setHours(0);
				$scope.newTask.due.setMinutes(0);
				$scope.newTask.due.setSeconds(0);
				$scope.newTask.due.setMilliseconds(0);
				
				if(valid)
				{
					$scope.modalInstance.close($scope.newTask);
				}
			};
	}]);

	createModule.controller("TagCreationController", ['$scope',
		function($scope) {

			$scope.newTag = {
				name: "",
				type: "tag"
			};
			$scope.createTag = function() {

				//TODO: Perform validation!
				var valid = true;

				var contact_ids = [];
				var task_ids = [];
				var event_ids = [];

				for(var i = 0; i < $scope.associatedObjects.length; i++)
				{
					if($scope.associatedObjects[i].type == "contact")
						contact_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "task")
						task_ids.push($scope.associatedObjects[i].id);
					if($scope.associatedObjects[i].type == "event")
						event_ids.push($scope.associatedObjects[i].id);
				}
				
				$scope.newTag.contact_ids = contact_ids;
				$scope.newTag.task_ids = task_ids;
				$scope.newTag.event_ids = event_ids;

				if(valid)
				{
					$scope.modalInstance.close($scope.newTag);
				}
			};
	}]);
/*
	createModule.Controller('ContactCreationController', ['$scope', '$resource', 'contactService', 
		function($scope, $resource, contactService) {

		}]);*/
})();
