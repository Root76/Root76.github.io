(function(){
	
	var ContactServicesModule = angular.module('ContactServices', ['ngResource']);

	var baseURL = "http://daywon-api-staging.herokuapp.com";

	ContactServicesModule.factory('contactService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
						Contacts: $resource(baseURL + '/contacts', null, {
							create:
							{
								method: 'POST',
								isArray: false,
								transformRequest: [function(data, headersGetter){

									if(!data["extended_properties"])
										data["extended_properties"] = [];

									var contact = {'contact': data};		
									return contact;

								}].concat($http.defaults.transformRequest)

							}
						}),
						Contact:  $resource(baseURL + '/contacts/:contact_id', {contact_id:"@id"}, {

							save:
							{
								method: 'PUT',
								isArray: false,
								transformRequest: [function(data, headersGetter){
																	
									data['tag_ids'] = _.map(data['tags'], function(tag) { return tag.id; });	
									data['event_ids'] = _.map(data['events'], function(event) { return event.id; });
									data['task_ids'] = _.map(data['tasks'], function(task) { return task.id; });

									delete data["tags"];
									delete data["events"];
									delete data["tasks"];
	
									var contact = {'contact': data};									
									return contact;

								}].concat($http.defaults.transformRequest)
							},

							quicksave:
							{
								method: 'PUT',
								isArray: false,
								transformRequest: [function(data, headersGetter){

									delete data["tags"];
									delete data["events"];
									delete data["tasks"];

									var contact = {'contact': data};									
									return contact;

								}].concat($http.defaults.transformRequest)
							},

							delete:
							{
								method: 'DELETE',
								isArray: false,
							}
						}),
					}
			}]);
})();