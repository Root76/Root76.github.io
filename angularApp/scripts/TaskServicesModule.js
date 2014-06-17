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

							var task = {'task': data};		
							return task;

						}].concat($http.defaults.transformRequest)

					}
				}),

				Task : $resource(baseURL + "/tasks/:task_id", {task_id:"@id"}, {
					
					save:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){

						}].concat($http.defaults.transformRequest)
					},
					
					delete:
					{

					}
				})
			}
		}
	]);
})();