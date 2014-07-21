(function(){
	
	var ContactsModule = angular.module('Contacts', ['ngResource', 'ContactServices']);

	ContactsModule.filter('contactSearchFilter', function() {
		return function(contacts, searchText) {

			var filtered_list = [];
			var defaultTitleString = "no name or email";

			if(contacts && searchText)
			{			
				for(var i = 0; i < contacts.length; i++) 
				{
					
					if(contacts[i].name && contacts[i].name != "")
					{
						if(contacts[i].name.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
							filtered_list.push(contacts[i]);
					}
					else if(contacts[i].email && contacts[i].email != "")
					{
						if(contacts[i].email.toLowerCase().indexOf(searchText.toLowerCase()) > -1)
							filtered_list.push(contacts[i]);
					}
					else if(defaultTitleString.indexOf(searchText.toLowerCase()) > -1)
						filtered_list.push(contacts[i]);
				}
			}
			else
				filtered_list = contacts;

			return filtered_list;
		}
	});

	ContactsModule.controller('ContactsController', ['$resource', '$scope', '$state', 'contactService',
		function($resource, $scope, $state, contactService) {

			$scope.ContactShow = ['All', 'Tagged', 'New This Week', 'New This Month', 'Recent'];

			$scope.ContactFilter = $scope.ContactShow[0];

			var today = moment().format('YYYYMMDDHHMMSS');
			var lastWeek = moment().subtract('days', 7).calendar();
			lastWeek = moment(lastWeek).format('YYYYMMDDHHMMSS');
			var lastMonth = moment().subtract('months', 1).calendar();
			lastMonth = moment(lastMonth).format('YYYYMMDDHHMMSS');
			var thisCreateDate;

			$scope.updateContactList = function() {

				$scope.FilteredContacts = new Array();
				var today = moment().format('MMMM Do YYYY');

				if ($scope.ContactFilter === "All") {
					for(var i = 0; i < $scope.contacts.length; i++)
						$scope.FilteredContacts.push($scope.contacts[i]);
				}
				else if ($scope.ContactFilter === "Tagged") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						if ($scope.contacts[i]['tagcount'] > 0) {
							$scope.FilteredContacts.push($scope.contacts[i]);
						}
					}					
				}
				else if ($scope.ContactFilter === "New This Week") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						thisCreateDate = moment($scope.contacts[i]['created_at']).format('YYYYMMDDHHMMSS');
						if (thisCreateDate > lastWeek) {
							$scope.FilteredContacts.push($scope.contacts[i]);
						}
					}					
				}
				else if ($scope.ContactFilter === "New This Month") {
					for (var i = 0; i < $scope.contacts.length; i++) {
						thisCreateDate = moment($scope.contacts[i]['created_at']).format('YYYYMMDDHHMMSS');
						console.log("created at: " + thisCreateDate);
						if (thisCreateDate > lastMonth) {
							$scope.FilteredContacts.push($scope.contacts[i]);
						}
					}	
				}
				else if ($scope.ContactFilter === "Recent") {
					$scope.ContactList = $scope.contacts;
					$scope.ContactList.sort(function(a, b) {
						if (a.updated_at < b.updated_at) {
							return 1;
						}
						if (a.updated_at > b.updated_at) {
							return -1;
						}
						return 0;
					});
					for (var i = 0; i < 10; i++) {
						$scope.FilteredContacts.push($scope.ContactList[i]);
					}				
				}

			}

			$scope.ContactSort = [
				{title: 'Name', prop: 'name'}, 
				{title: 'Company', prop: 'organization'}
			];

			$scope.ContactOrdering = function(contact) {
				
				if($scope.ContactOrder.prop == 'name')
					if(contact.name)
						if($scope.globalUserSettings.sort_by_last_name)
						{
							var fullname = contact.name.split(' ');
							var firstname = fullname.slice(0, -1).join(' ');
							var lastname = fullname.slice(-1).join(' ');

							return lastname + ", " + firstname;
						}
						else
							return contact.name;
					else if(contact.emails && contact.emails[0] && contact.emails[0].email)
						return contact.emails[0].email;
					else 
						return '';

				else if($scope.ContactOrder.prop == 'organization')
					return contact.organization;
			};

			$scope.ContactOrder = $scope.ContactSort[0];

			$scope.ordering = ['name', 'emails[0].email', 'id'];
			
			$scope.deleteContact = function(contact){

				var index;

				for(var i = 0; i < $scope.FilteredContacts.length; i++)
					if($scope.FilteredContacts[i].id == contact.id)
						index = i;

				if(index > -1)
					$scope.FilteredContacts.splice(index, 1);

				contactService.Contact.delete({contact_id:contact.id});
				$scope.loadOrphans();
				$state.go('contacts.index');

			}
		}]);
	
	ContactsModule.controller('ContactController', ['$resource', '$scope', '$stateParams', 'contactService',
		function($resource, $scope, $stateParams, contactService){
			
			$scope.contactPromise = contactService.Contact.get({contact_id: $stateParams['contact_id']}, function(data) {

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

				setTimeout(function(){

					if (data.emails.length > 0) {
						var emailString = 'https://mail.google.com/mail/u/?authuser=' + authEmail + '#search/from:' + data.emails[0].email + '+OR+to:' + data.emails[0].email;
						$('.contactDetails .emailLink').attr("href", emailString);
					} else {
						$('.contactDetails .emailLink').attr("href", "");
					}

					new Opentip(".trashicon", "Delete", {
		                style: "bottomtip"
		            });

		            var deleteTip = new Opentip(".trashicon", "<p>Are you sure you want to delete this item?</p><br /><div class='deleteContainer'><div>Yes</div><div>No</div></div>", {
		                style: "deleteconfirm"
		            });

			        $(".trashicon").unbind("click").bind("click", function(){
			        	deleteTip.show();
			            setTimeout(function(){
			                $(".deleteContainer > div:first-child").click(function(){
			                    $("#destroy").click();
			                    deleteTip.hide();
			                    var deleteTip2 = new Opentip(".trashicon", '<span>Item deleted.</span>', {
			                        style: "deleteconfirm2"
			                    });
			                    $("#deleteButton").click();
			                    deleteTip2.show();
			                    setTimeout(function(){
			                        deleteTip2.hide();
			                    }, 1500);
			                });
			                $(".deleteContainer > div:last-child").click(function(){
			                    deleteTip.hide();
			                });
			            }, 100);
			        });

		            new Opentip("#detailmenubar > a > img", "Create", {
		                style: "bottomtip"
		            }); 

				}, 100);
			});

			$scope.detailsView = false;

			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;
			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;


			$scope.contactBirthday = function() {

				$scope.contactPromise.then(function(contact) {
					for(var i = 0; i < contact.extended_properties.length; i++)
					{
						if(contact.extended_properties[i].key == "birthday")
							return contact.extended_properties[i].value;
					}
				});				
			}

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

			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "event")
					$scope.contact.events.push($model);
				if($model.type == "task")
					$scope.contact.tasks.push($model);
				if($model.type == "tag")
					$scope.contact.tags.push($model);

				$scope.contact.$save();
			}

			$scope.removeEvent = function(event) {
			
				index = $scope.contact.events.indexOf(event);
				$scope.contact.events.splice(index, 1);					

				$scope.contact.$save();
			}

			$scope.removeTask = function(task) {

				index = $scope.contact.tasks.indexOf(task);
				$scope.contact.tasks.splice(index, 1);					

				$scope.contact.$save();	
			}

			$scope.removeTag = function(tag) {	

				index = $scope.contact.tags.indexOf(tag);
				$scope.contact.tags.splice(index, 1);					

				$scope.contact.$save();
			}

			$scope.saveContact = function() {

				for(var i = 0; i < $scope.contacts.length; i++)
				{
					if($scope.contacts[i].id == $scope.contact.id)
					{
						$scope.contacts[i].name = $scope.contact.name
						break;
					}
				}

				console.log($scope.contact);
				$scope.contact.$save();
			}
		}])

})();