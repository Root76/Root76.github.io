(function(){

	var app = angular.module('DayWonApplication', ['ContactServices']);

	var authToken = 'qoRyedh9o5xFLY8cpDzA';
	var authEmail = 'pastadiablo@gmail.com';

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail;
	}]);

	app.controller('IndexController', ['$resource', 'contactService', 
		function($resource, contactService) {


			var ctrl = this;
			contactService.Contacts.query(function(data) {
				
				ctrl.contacts = data;
				console.log(ctrl.contacts[0]['id']);


				contactService.Contact.get({contact_id:ctrl.contacts[0]['id']}, function(data) {
					ctrl.contact = data;
					ctrl.contact.address = '3902 McTyres Cove CT';
					ctrl.contact.$save();
					console.log(ctrl.contact);
				});

			});


		}]);

})();