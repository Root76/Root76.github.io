(function(){

	var app = angular.module('DayWonApplication', ['restangular']);


	app.config(['$httpProvider', 'RestangularProvider', function($httpProvider, RestangularProvider) {

		RestangularProvider.setBaseUrl('http://daywon-api-staging.herokuapp.com');
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail;
	}]);

	app.controller('IndexController', ['Restangular', function(Restangular) {
		this.hello = "Hello World!";


		this.contacts = Restangular.all('contacts');

		var indexCtrl = this;

		this.contacts.getList({}).then(function(contacts) {
			indexCtrl.allContacts = contacts;
			console.log(contacts);
		});

		this.contact = Restangular.one('contacts', 92385);

		this.contact.get().then(function(contact){
			console.log(contact);
		});
/*
		this.allContacts.get({id:92385}, headerObj).then(function(contact) {
			indexCtrl.contact = contact;
			console.log(indexCtrl.contact);
		});*/
		
	}]);
})();