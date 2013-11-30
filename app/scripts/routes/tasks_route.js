App.TasksRoute = Ember.Route.extend({
  model: function() {
    return this.get('store').find('task');
  }
});

App.TasksIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('tasks');
  }
});

App.TaskRoute = Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('task', params.Task_id);
  }
});
