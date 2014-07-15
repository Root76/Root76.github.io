(function(){
	
	var ContactServicesModule = angular.module('ContactServices', ['ngResource']);

	ContactServicesModule.factory('contactService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
						Contacts: $resource('/contacts', null, {
							create:
							{
								method: 'POST',
								isArray: false,
								transformRequest: [function(data, headersGetter){
									
									if(!data["extended_properties"])
										data["extended_properties"] = [];

									return {'contact': data};		
								}].concat($http.defaults.transformRequest)

							}
						}),
						Contact:  $resource('/contacts/:contact_id', {contact_id:"@id"}, {

							save:
							{
								method: 'PUT',
								isArray: false,
								transformRequest: [function(data, headersGetter){
									
									var contact = JSON.parse(JSON.stringify(data));

									contact['tag_ids'] = _.map(contact['tags'], function(tag) { return tag.id; });	
									contact['event_ids'] = _.map(contact['events'], function(event) { return event.id; });
									contact['task_ids'] = _.map(contact['tasks'], function(task) { return task.id; });

									delete contact["tags"];
									delete contact["events"];
									delete contact["tasks"];
								
									return {'contact': contact};

								}].concat($http.defaults.transformRequest)
							},

						}),
					}
			}]);
})();