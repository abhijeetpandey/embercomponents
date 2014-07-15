App = Ember.Application.create();

App.Router.map(function () {
    // put your routes here
});

App.IndexRoute = Ember.Route.extend({

});
App.ApplicationController=Ember.Controller.extend({
    data:function(){
        return Ember.A([{text:'kartik'},{text:'singal'},{text:'abhijeet'},{text:'kartik'},{text:'singal'},{text:'abhijeet'},{text:'kartik'},{text:'singal'},{text:'abhijeet'},{text:'kartik'},{text:'singal'},{text:'abhijeet'}]);
    }.property()
});