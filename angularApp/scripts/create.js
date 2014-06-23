(function(){

	var createModule = angular.module('CreateModule', ['ContactServices']);

	createModule.controller('CreationController', ['$scope', '$modalInstance', 'contacts', 'events', 'tasks', 'tags',
		function($scope, $modalInstance, contacts, events, tasks, tags) {

			$scope.modalInstance = $modalInstance;

			$scope.contacts = contacts;
			$scope.events = events;
			$scope.tasks = tasks;
			$scope.tags = tags;

			$scope.dropdownText="Select an object";
			$scope.selection = 0;
			
			$scope.status = {
				isopen: false
			};
/*
			$scope.toggleDropdown = function()
			{
				console.log("toggling dropdown");
				$scope.status.isopen = false;				
			};*/

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

			$scope.dt = new Date();
		}]);

	createModule.controller('ContactCreationController', ['$scope', 'contactService', 
		function($scope, contactService) {

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

				if($scope.newContact.phones.length < 1 && $scope.newContact.phones[0] == '')
					delete $scope.newContact.phones;

				if($scope.newContact.emails.length < 1 && $scope.newContact.emails[0] == '')
					delete $scope.newContact.emails;
				
				$scope.modalInstance.close($scope.newContact);
			}

		}]);
/*
	createModule.Controller('ContactCreationController', ['$scope', '$resource', 'contactService', 
		function($scope, $resource, contactService) {

		}]);*/
})();
