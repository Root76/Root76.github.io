 (function(){

	var EventServicesModule = angular.module('EventServices', ['ngResource']);

	var baseURL = "http://daywon-api-staging.herokuapp.com";

	EventServicesModule.factory('eventService', ['$resource', '$http', '$log', 
		function($resource, $http, $log) {
			return {
				Events : $resource(baseURL + "/events", null, {
					create:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){ 
							return {'event': data}; 
						}].concat($http.defaults.transformRequest)

					}
				}),

				Event : $resource(baseURL + "/events/:event_id", {event_id:"@id"}, {
					save:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){

							data['task_ids'] = _.map(data['tasks'], function(task) { return task.id; });	
							data['contact_ids'] = _.map(data['contacts'], function(contact) { return contact.id; });
							data['tag_ids'] = _.map(data['tags'], function(tag) { return tag.id; });

							delete data["tasks"];
							delete data["contacts"];
							delete data["tags"];

							return {"event":data};
						}].concat($http.defaults.transformRequest)
					},

					quicksave:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){

							delete data["tasks"];
							delete data["contacts"];
							delete data["tags"];

							return {"event":data};
						}].concat($http.defaults.transformRequest)
					}
				})
			};
		}
	]);
})();