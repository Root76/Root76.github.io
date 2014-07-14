(function(){

	var TagServicesModule = angular.module('TagServices', ['ngResource']);

	var baseURL = "https://daywon-api-prod.herokuapp.com";

	TagServicesModule.factory('tagService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
				Tags : $resource(baseURL + "/tags", null, {
					create:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){
							return {'tag': data};		
						}].concat($http.defaults.transformRequest)

					}
				}),

				Tag : $resource(baseURL + "/tags/:tag_id", {tag_id:"@id"}, {
						save:
						{
							method: 'PUT',
							isArray: false,
							transformRequest: [function(data, headersGetter){
									
								var tag = JSON.parse(JSON.stringify(data));
														
								tag['contact_ids'] = _.map(tag['contacts'], function(contact) { return contact.id; });	
								tag['event_ids'] = _.map(tag['events'], function(event) { return event.id; });
								tag['task_ids'] = _.map(tag['tasks'], function(task) { return task.id; });

								delete tag["contacts"];
								delete tag["events"];
								delete tag["tasks"];

								delete tag['count'];

								return {'tag' : tag};

							}].concat($http.defaults.transformRequest)
						},
					})
			};
		}]);

})();