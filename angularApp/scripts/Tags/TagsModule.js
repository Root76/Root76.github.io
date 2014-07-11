(function() {

	var TagsModule = angular.module('Tags', ['ngResource', 'TagServices']);

	TagsModule.controller('TagsController', ['$resource', '$scope', '$state','tagService',
		function($resource, $scope, $state, tagService){
			
			$scope.deleteTag = function(tag){
				
				var index;

				for(var i = 0; i < $scope.tags.length; i++)
					if($scope.tags[i].id == tag.id)
						index = i;

				if(index > -1)
					$scope.tags.splice(index, 1);

				tagService.Tag.delete({tag_id:tag.id});

				$state.go('tags.index');

			}

			$scope.getTagTitle = function(tag) {
				return tag.name + ' (' + tag.count + ')';
			}

		}]);

	TagsModule.controller('TagController', ['$resource', '$scope', '$stateParams', 'tagService',
		function($resource, $scope, $stateParams, tagService) {
			
			$scope.showOpenEvents = true;
			$scope.showClosedEvents = true;
			$scope.showOpenTasks = true;
			$scope.showClosedTasks = true;

			$scope.tagPromise = tagService.Tag.get({tag_id: $stateParams['tag_id']}, function(data) {
				console.log(data);
				$scope.tag = data;
			});

			$scope.TagSort = [
				{title: 'Count', prop: 'count'},
				{title: 'Name', prop: 'name'}
			];
			$scope.TagOrder = $scope.TagSort[1];

			$scope.onSelect = function ($item, $model, $label) {

				if($model.type == "contact")
					$scope.tag.contacts.push($model);
				if($model.type == "event")
					$scope.tag.events.push($model);
				if($model.type == "task")
					$scope.tag.tasks.push($model);

				$scope.tag.$save();
			}

			$scope.removeContact = function(contact) {
			
				index = $scope.tag.contacts.indexOf(contact);
				$scope.tag.contacts.splice(index, 1);					

				$scope.tag.$save();
			}

			$scope.removeEvent = function(event) {

				index = $scope.tag.events.indexOf(event);
				$scope.tag.events.splice(index, 1);					

				$scope.tag.$save();	
			}

			$scope.removeTask = function(task) {

				index = $scope.tag.tasks.indexOf(task);
				$scope.tag.tasks.splice(index, 1);					

				$scope.tag.$save();	
			}

			$scope.saveTag = function() {
				console.log($scope.tag);
				$scope.tag.$save();
			}
		}]);
})();