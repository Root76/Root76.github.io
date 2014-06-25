(function(){
	
	var ContactsModule = angular.module('Contacts', ['ngResource', 'ContactServices']);

	ContactsModule.controller('ContactsController', ['$resource', '$scope', 'contactService',
		function($resource, $scope, contactService) {
			contactService.Contacts.query(function(data) {
				$scope.contacts = data;
			});
		}]);
	ContactsModule.controller('ContactController', ['$resource', '$scope', '$stateParams', 'contactService',
		function($resource, $scope, $stateParams, contactService){
			contactService.Contact.get({contact_id: $stateParams['contact_id']}, function(data) {
				$scope.contact = data;
			});
		}])
})();