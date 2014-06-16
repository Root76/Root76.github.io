(function(){

	var app = angular.module('DayWonApplication', ['ContactServices']);

	var authToken = 'qoRyedh9o5xFLY8cpDzA';
	var authEmail = 'pastadiablo@gmail.com';

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$resource', 'contactService', 
		function($resource, contactService) {


			var ctrl = this;
			contactService.Contacts.query(function(data) {
				
				ctrl.contacts = data;
				
				contactService.Contact.get({contact_id:ctrl.contacts[0]['id']}, function(data) {
						
						console.log(data);

						ctrl.contact = data;
						ctrl.contact.address = 'Bosham Lane';
						
						ctrl.contact.$save();
					
				});

			});


		}]);

})();