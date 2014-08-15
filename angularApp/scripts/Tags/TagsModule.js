(function() {

	var TagsModule = angular.module('Tags', ['ngResource', 'TagServices']);

	TagsModule.filter('tagTypeaheadFilter', function() {
		return function(objects, type, tag) {

			for(var i = 0; i < objects.length; i++)
			{
				for(var j = 0; j < tag[type].length; j++)
					if(objects[i].id == tag[type][j].id)
					{
						objects.splice(i, 1);
						break;
					}
					else if(type == 'events')
					{
						if(objects[i].recurring && objects[i].title == tag.events[j].title)
						{
								objects.splice(i, 1);
								break;
						}
					}
			}
			return objects;
		}
	});

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



	        	var taggedItems = $('.taggedObjects img');
	            new Opentip(taggedItems[0], "Tagged Contacts", {
	                style: "lefttip"
	            });
	            new Opentip(taggedItems[1], "Tagged Events", {
	                style: "lefttip"
	            });
	            new Opentip(taggedItems[2], "Tagged Tasks", {
	                style: "lefttip"
	            });

				var trash1 = $("#detailPanel .trashicon"),
					trash2 = $("#detailmenubar .trashicon");

				new Opentip(trash1, "Delete", {
					style: "bottomtip"
				});

				new Opentip(trash2, "Delete", {
					style: "toptip"
				});

		        $(".trashicon").each(function() {
			        $(this).bind("click", function(){
			            var deleteTip = new Opentip($(this), "<p>Are you sure you want to delete this item?</p><br /><div class='deleteContainer'><div>Yes</div><div>No</div></div>", {
	                		style: "deleteconfirm"
	            		});
			        	deleteTip.show();

			            setTimeout(function(){
			                $(".deleteContainer > div:first-child").click(function(){
			                    deleteTip.hide();

			                    $scope.deleteTag($scope.tag);
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


				$scope.TagContacts = $scope.tag.contacts;

				$scope.contactsPromise.$promise.then(function(data) {
					
					console.log(data);
					for(var i = 0; i < $scope.TagContacts.length; i++)
					{
						for(var j =0; j < data.length; j++)
						{
							if(data[j].id == $scope.TagContacts[i].id)
							{
								$scope.TagContacts[i] = data[j];
								break;
							}
						}		
					}
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
					$model.tags++;
				if($model.type == "task")
					$scope.tag.tasks.push($model);

				$model.tags++;

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