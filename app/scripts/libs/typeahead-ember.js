/*! ember-typeahead 13-12-2013 */
!function(){"use strict";Ember.TypeAheadComponent=Ember.TextField.extend({didInsertElement:function(){this._super();var a=this;if(!this.get("data"))throw"No data property set";jQuery.isFunction(this.get("data").then)?this.get("data").then(function(b){a.initializeTypeahead(b)}):this.initializeTypeahead(this.get("data"))},initializeTypeahead:function(a){var b=this;this.typeahead=this.$().typeahead({name:"typeahead",limit:this.get("limit")||5,local:a.map(function(a){return{value:a.get(b.get("name")),name:a.get(b.get("name")),tokens:[a.get(b.get("name"))],emberObject:a}})}),this.typeahead.on("typeahead:selected",function(a,c){b.set("selection",c.emberObject)}),this.typeahead.on("typeahead:autocompleted",function(a,c){b.set("selection",c.emberObject)}),this.get("selection")&&this.typeahead.val(this.get("selection.name"))},selectionObserver:function(){return this.typeahead.val(this.get("selection").get(this.get("name")))}.observes("selection")}),Ember.Handlebars.helper("type-ahead",Ember.TypeAheadComponent)}(this);