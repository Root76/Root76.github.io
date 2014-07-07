(function(){
	
	var ContactsModule = angular.module('Contacts', ['ngResource', 'ContactServices']);

	ContactsModule.controller('ContactsController', ['$resource', '$scope', 'contactService',
		function($resource, $scope, contactService) {

			$scope.ordering = ['name', 'emails[0].email', 'id'];

		}]);
	
	ContactsModule.controller('ContactController', ['$resource', '$scope', '$stateParams', 'contactService',
		function($resource, $scope, $stateParams, contactService){
			
			$scope.contactPromise = contactService.Contact.get({contact_id: $stateParams['contact_id']}, function(data) {
		//		console.log(data);
				$scope.contacts = data;
			});

			$scope.detailsView = false;

			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;
			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;

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

			$scope.contactBirthday = function() {

				$scope.contactPromise.then(function(contact) {
					for(var i = 0; i < contact.extended_properties.length; i++)
					{
						if(contact.extended_properties[i].key == "birthday")
							return contact.extended_properties[i].value;
					}
				});				
			}

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

		}])

})();