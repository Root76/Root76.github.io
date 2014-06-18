(function(){

	var TagServicesModule = angular.module('TagServices', ['ngResource']);

	var baseURL = "http://daywon-api-staging.herokuapp.com";

	TagServicesModule.factory('tagService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
				Tags : $resource(baseURL + "/tags", null, {
					create:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){

							var tag = {'tag': data};		
							return tag;

						}].concat($http.defaults.transformRequest)

					}
				}),

				Tag : $resource(baseURL + "/tags/:tag_id", {tag_id:"@id"}, {
						save:
						{
							method: 'PUT',
							isArray: false,
							transformRequest: [function(data, headersGetter){
														
								data['contact_ids'] = _.map(data['contacts'], function(contact) { return contact.id; });	
								data['event_ids'] = _.map(data['events'], function(event) { return event.id; });
								data['task_ids'] = _.map(data['tasks'], function(task) { return task.id; });

								delete data["contacts"];
								delete data["events"];
								delete data["tasks"];
								delete data['count'];

								var tag = {'tag': data};									
								return tag;

							}].concat($http.defaults.transformRequest)
						},

						quicksave:
						{
							method: 'PUT',
							isArray: false,
							transformRequest: [function(data, headersGetter){

								delete data["contacts"];
								delete data["events"];
								delete data["tasks"];
								delete data['count'];

								var tag = {'tag': data};									
								return tag;

							}].concat($http.defaults.transformRequest)
						},
					})
			};
		}]);

})();