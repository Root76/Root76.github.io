 (function(){

	var EventServicesModule = angular.module('EventServices', ['ngResource']);

	EventServicesModule.factory('eventService', ['$resource', '$http', '$log', 
		function($resource, $http, $log) {
			return {
				Events : $resource($scope.baseURL + "/events", null, {
					create:
					{
						method: 'POST',
						isArray: false,
						transformRequest: [function(data, headersGetter){ 
							return {'event': data}; 
						}].concat($http.defaults.transformRequest)

					}
				}),

				Event : $resource($scope.baseURL + "/events/:event_id", {event_id:"@id"}, {
					save:
					{
						method: 'PUT',
						isArray: false,
						transformRequest: [function(data, headersGetter){
									
							var event = JSON.parse(JSON.stringify(data));

							event['task_ids'] = _.map(event['tasks'], function(task) { return task.id; });	
							event['contact_ids'] = _.map(event['contacts'], function(contact) { return contact.id; });
							event['tag_ids'] = _.map(event['tags'], function(tag) { return tag.id; });

							delete event["tasks"];
							delete event["contacts"];
							delete event["tags"];

							return {"event":event};
						}].concat($http.defaults.transformRequest)
					},
				})
			};
		}
	]);
})();