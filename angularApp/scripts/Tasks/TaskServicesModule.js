(function(){

	var TaskServicesModule = angular.module('TaskServices', ['ngResource']);

	var baseURL = "https://daywon-api-staging.herokuapp.com";

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
									
							var task = JSON.parse(JSON.stringify(data));

							task['contact_ids'] = _.map(task['contacts'], function(contact) { return contact.id; });	
							task['event_ids'] = _.map(task['events'], function(event) { return event.id; });
							task['tag_ids'] = _.map(task['tags'], function(tag) { return tag.id; });

							delete task["contacts"];
							delete task["events"];
							delete task["tags"];

							return {"task":task};
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