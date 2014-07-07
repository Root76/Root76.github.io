(function(){
	
	var ContactsModule = angular.module('Contacts', ['ngResource', 'ContactServices']);

	ContactsModule.controller('ContactsController', ['$resource', '$scope', 'contactService',
		function($resource, $scope, contactService) {

			$scope.ordering = ['name', 'emails[0].email', 'id'];

		}]);
	
	ContactsModule.controller('ContactController', ['$resource', '$scope', '$stateParams', 'contactService',
		function($resource, $scope, $stateParams, contactService){
			
			$scope.contactPromise = contactService.Contact.get({contact_id: $stateParams['contact_id']}, function(data) {
<<<<<<< HEAD
		//		console.log(data);
				$scope.contacts = data;
=======
				console.log(data);
				$scope.contact = data;

				if($scope.contact.phones.length == 0)
					$scope.contact.phones.push({number:''});
				if($scope.contact.emails.length == 0)
					$scope.contact.emails.push({email:''});

				$scope.birthdayIndex = undefined;
				$scope.notesIndex = undefined;

				if($scope.contact.extended_properties)
					for(var i = 0; i < $scope.contact.extended_properties.length; i++)
					{
						if($scope.contact.extended_properties[i].key === "birthday")
							$scope.birthdayIndex = i;
						else
						if($scope.contact.extended_properties[i].key === "notes")
							$scope.notesIndex = i;
					}
				else
					$scope.contact.extended_properties = [];

				if($scope.birthdayIndex == undefined)
				{
					$scope.birthdayIndex = 0;
					$scope.contact.extended_properties.push({key:'birthday', value:''});

					if($scope.notesIndex == undefined)
					{
						$scope.notesIndex = 1;
						$scope.contact.extended_properties.push({key:'notes', value:''});
					}
				}
				else if($scope.notesIndex == undefined)
				{
					$scope.notesIndex = 0;
					$scope.contact.extended_properties.push({key:'notes', value:''});
				}

>>>>>>> 65a9de107d99ac27cbcc6ab4c9b14e2694d75d14
			});

			$scope.detailsView = false;

			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;
			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;

<<<<<<< HEAD
			$scope.selectedSection = 0;

			$scope.selectSection = function(section) {
				console.log("select section " + section);
				$scope.selectedSection = section;
			};

			$scope.isSectionSelected = function(section) {
				if($scope.selectedSection == section)
					return true;
				else
					return false;
			};

=======
>>>>>>> 65a9de107d99ac27cbcc6ab4c9b14e2694d75d14
			$scope.contactBirthday = function() {

				$scope.contactPromise.then(function(contact) {
					for(var i = 0; i < contact.extended_properties.length; i++)
					{
						if(contact.extended_properties[i].key == "birthday")
							return contact.extended_properties[i].value;
					}
				});				
			}

<<<<<<< HEAD
			$scope.ContactShow = ['All', 'Tagged', 'New This Week', 'New This Month', 'Recent'];

			$scope.ContactFilter = $scope.ContactShow[0];

			$scope.updateContactList = function() {

				console.log("chosen filter");
				console.log($scope.ContactFilter);
				$scope.FilteredContacts = new Array();
				var today = moment().format('MMMM Do YYYY');

				if ($scope.ContactFilter === "All") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['status'] == false) {
							$scope.FilteredContacts.push($scope.contacts[i]);
							console.log("status was false, pushing to array");
							console.log($scope.FilteredContacts);
						}
					}
				}
				else if ($scope.ContactFilter === "Tagged") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['status'] == true) {
							$scope.FilteredContacts.push($scope.contacts[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredContacts);
						}
					}					
				}
				else if ($scope.ContactFilter === "New This Week") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['status'] == true) {
							$scope.FilteredContacts.push($scope.contacts[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredContacts);
						}
					}					
				}
				else if ($scope.ContactFilter === "New This Month") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['status'] == true) {
							$scope.FilteredContacts.push($scope.contacts[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredContacts);
						}
					}					
				}
				else if ($scope.ContactFilter === "Recent") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['status'] == true) {
							$scope.FilteredContacts.push($scope.contacts[i]);
							console.log("status was true, pushing to array");
							console.log($scope.FilteredContacts);
						}
					}					
				}

			}

=======
			$scope.addPhone = function() {
				$scope.contact.phones.push({number:''});

				$scope.contact.$save();
			}

			$scope.removePhone = function(number) {
				var index = $scope.contact.phones.indexOf(number);

				if(index > -1 && $scope.contact.phones.length > 1)
					$scope.contact.phones.splice(index, 1);

				$scope.contact.$save();
			}

			$scope.addEmail = function() {
				$scope.contact.emails.push({email:''});

				$scope.contact.$save();
			}

			$scope.removeEmail = function(email) {
				var index = $scope.contact.emails.indexOf(email);
				
				if(index > -1 && $scope.contact.emails.length > 1)
					$scope.contact.emails.splice(index, 1);

				$scope.contact.$save();
			}

			$scope.addProperty = function() {
				$scope.contact.extended_properties.push({key:'', value:''});

				$scope.contact.$save();
			}

			$scope.removeProperty = function(property) {
				var index = $scope.contact.extended_properties.indexOf(property);
				
				if(index > -1 && $scope.contact.extended_properties.length > 1)
					$scope.contact.extended_properties.splice(index, 1);

				$scope.contact.$save();
			}


			$scope.saveContact = function() {
				console.log($scope.contact);
				$scope.contact.$save();
			}
>>>>>>> 65a9de107d99ac27cbcc6ab4c9b14e2694d75d14
		}])

})();