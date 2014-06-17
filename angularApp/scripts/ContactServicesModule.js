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

									console.log("Outgoing Data!");
									console.log(JSON.stringify(contact));
							

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
																	
									if(!data["tags"] || data["tags"].length < 1)
										delete data["tags"];
									
									if(!data["events"] || data["events"].length < 1)
										delete data["events"];
									
									if(!data["tasks"] || data["tasks"].length < 1)
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