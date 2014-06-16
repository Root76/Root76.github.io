(function(){
	
	var ContactServicesModule = angular.module('ContactServices', ['ngResource']);

	var baseURL = "http://daywon-api-staging.herokuapp.com";

	ContactServicesModule.factory('contactService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
				Contacts: $resource(baseURL + '/contacts'),
				Contact:  $resource(baseURL + '/contacts/:contact_id', {contact_id:"@id"}, {
					save:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){
							
							$log.info(data);

							data = { 'contact': data };
							
							$log.info(data);
							$log.info(headersGetter);

						}].concat($http.defaults.transformRequest)
					}
				})
			}
		}]);
})();