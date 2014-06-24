(function(){

	var createModule = angular.module('CreateModule', ['ContactServices']);

	createModule.controller('CreationController', ['$scope', '$modalInstance', 'contacts', 'events', 'tasks', 'tags',
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
			}

			$scope.selectedObject = undefined;
			$scope.objects = [];
			$scope.associatedObjects = [];

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

			$scope.onSelect = function ($item, $model, $label) {
				$scope.associatedObjects.push($model);
				$scope.selectedObject = undefined;
			}

			$scope.removeObject = function(object) {
				var index = $scope.associatedObjects.indexOf(object);

				if(index > -1)
					$scope.associatedObjects.splice(index, 1);
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

			};

			$scope.recurrence = {
				frequency: "",
				ends_after: {
					occurences: 0,
					date: "",
				}
			};


	}]);
/*
	createModule.Controller('ContactCreationController', ['$scope', '$resource', 'contactService', 
		function($scope, $resource, contactService) {

		}]);*/
})();
