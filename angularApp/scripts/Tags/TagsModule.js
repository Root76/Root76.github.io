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

				tagService.Tag.delete({tag_id:tag.id}).$promise.then(function(){ $scope.loadOrphans(); });
	
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

				new Opentip(".trashicon", "Delete", {
	                style: "bottomtip"
	            });

	            var deleteTip = new Opentip(".trashicon", "<p>Are you sure you want to delete this item?</p><br /><div class='deleteContainer'><div>Yes</div><div>No</div></div>", {
	                style: "deleteconfirm"
	            });

		        $(".trashicon").unbind("click").bind("click", function(){
		        	deleteTip.show();
		            setTimeout(function(){
		                $(".deleteContainer > div:first-child").click(function(){
		                    deleteTip.hide();
		                    $("#deleteButton").click();
		                    var deleteTip2 = new Opentip("#taskpane1 > img", '<span>Item deleted.</span>', {
		                        style: "deleteconfirm2"
		                    });
		          			deleteTip2.show();
		                    setTimeout(function(){
		                        deleteTip2.hide();
		                    }, 1500);
		                });
		                $(".deleteContainer > div:last-child").click(function(){
		                    deleteTip.hide();
		                });
		            }, 100);
		        });

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

				for(var i = 0; i < $scope.tags.length; i++)
				{
					if($scope.tags[i].id == $scope.tag.id)
					{
						$scope.tags[i].name = $scope.tag.name
						break;
					}
				}

				console.log($scope.tag);
				$scope.tag.$save();
			}
		}]);
})();