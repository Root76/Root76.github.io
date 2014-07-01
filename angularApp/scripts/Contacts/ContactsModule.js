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
				$scope.contact = data;
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
		}])

})();