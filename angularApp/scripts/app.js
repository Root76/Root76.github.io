(function(){

	var app = angular.module('DayWonApplication', ['ContactServices', 'TagServices', 'TaskServices']);

	var authToken = 'qoRyedh9o5xFLY8cpDzA';
	var authEmail = 'pastadiablo@gmail.com';

	app.config(['$httpProvider', function($httpProvider) {

		$httpProvider.defaults.headers.common['X-AUTHENTICATION-TOKEN'] = authToken;
		$httpProvider.defaults.headers.common['X-AUTHENTICATION-EMAIL'] = authEmail; 
		$httpProvider.defaults.headers.common['Content-Type'] = 'application/json'
	}]);

	app.controller('IndexController', ['$resource', 'contactService', 'tagService', 'taskService',
		function($resource, contactService, tagService, taskService) {

/*
			var ctrl = this;
			
			taskService.Tasks.get(function(data){
				console.log(data);
				ctrl.tasks = data.tasks;

				taskService.Task.get({task_id:ctrl.tasks[0]['id']}, function(data){
					console.log(data);
					ctrl.task = data;
					ctrl.task.status = true;
					ctrl.task.$save();
				});
			});

			var newTask = {
				'title' : 'Play new Summoners Rift on PBE'
			}*/
/*
			taskService.Tasks.create(newTask, function(data){
				console.log(data);
			});*/
			/*
			tagService.Tags.get(function(data){
				console.log(data);
				ctrl.tags = data.tags;

				tagService.Tag.get({tag_id:ctrl.tags[0]['id']}, function(data) {
					console.log(data.name);
					ctrl.tags = data.contacts;
					data.$save();
				});
			});

			var newTag = {
				'name':'Blue Steel'
			};

			tagService.Tags.create(newTag, function(data) {
				console.log('Tags: ' + data);
			});
			*/
			
			/*
			contactService.Contacts.query(function(data) {
				
				ctrl.contacts = data;

				contactService.Contact.get({contact_id:ctrl.contacts[0]['id']}, function(data) {
						
						ctrl.contact = data;
						ctrl.contact.address = 'The Shire';
						
						ctrl.contact.$save();
					
				});

			});
			var newContact = 	{
									'name':'Bilbo Baggins',
									'address':'3 Shire Lane'								
								};
			contactService.Contacts.create(newContact, function(data) {
				console.log("completed create!");
				console.log(data);
			});*/



		}]);

})();