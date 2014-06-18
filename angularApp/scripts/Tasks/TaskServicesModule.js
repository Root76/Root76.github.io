(function(){

	var TaskServicesModule = angular.module('TaskServices', ['ngResource']);

	var baseURL = "http://daywon-api-staging.herokuapp.com";

	TaskServicesModule.factory('taskService', ['$resource', '$http', '$log', 
		function ($resource, $http, $log) {
			return {
				Tasks : $resource(baseURL + "/tasks", null, {
					
					create:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){
							return {'task': data};
						}].concat($http.defaults.transformRequest)

					}
				}),

				Task : $resource(baseURL + "/tasks/:task_id", {task_id:"@id"}, {
					
					save:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){

							data['contact_ids'] = _.map(data['contacts'], function(contact) { return contact.id; });	
							data['event_ids'] = _.map(data['events'], function(event) { return event.id; });
							data['tag_ids'] = _.map(data['tags'], function(tag) { return tag.id; });

							delete data["contacts"];
							delete data["events"];
							delete data["tags"];

							return {"task":data};
						}].concat($http.defaults.transformRequest)
					},

					quicksave:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){

							delete data["contacts"];
							delete data["events"];
							delete data["tags"];

							return {"task":data};
						}].concat($http.defaults.transformRequest)

					}					
				})
			}
		}
	]);
})();