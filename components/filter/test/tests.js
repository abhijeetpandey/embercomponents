/**
 * Created by IntelliJ IDEA.
 * User: abhijeet.pa
 * Date: 22/09/14
 * Time: 9:28 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Created by IntelliJ IDEA.
 * User: abhijeet.pa
 * Date: 16/07/14
 * Time: 12:42 PM
 * To change this template use File | Settings | File Templates.
 */


//tests
App = Ember.Application.create({

});

emq.globalize();
App.setupForTesting();
App.rootElement = '#ember-testing';
setResolver(Ember.DefaultResolver.create({ namespace:App }));

module('component:filter-block');
console.log(App.__container__.lookup('component:filter-block'));
test('Applied filter test', function () {
    // this.subject() is available because we used moduleForComponent
    var component = App.__container__.lookup('component:filter-block');
    component.reopen({
        appliedFilters:Ember.Map.create(),
        searchResults:[],
        filters:Ember.A([
            {name:'age', type:'number', alias:'Age', url:"/tada/tada/", placeholder:"Enter Your Age"},
            {name:'name', type:'string', alias:'Name', data:[
                {text:'Abhijeet'},
                {text:'Abhijeet Pandey'},
                {text:'Anup'},
                {text:'Suraj'}
            ]},
            {name:'rating', type:'range', alias:'Rating', placeholder:'low::high', isAutoCompleteOn:false}
        ]),
        baseUrl:"/data/get/"
    });
    // we wrap this with Ember.run because it is an async function
    Ember.run(function () {
        component.filtersObserver();
        component.set('filterName', 'Age');
        component.set('filterValue', '23');
        component.get('controller').send('applyFilter');
    });

    equal(component.get('appliedFilters').has('Age'), true);
    equal(component.get('appliedFilters').get('Age').value, 23);
    equal(component.get('availableFilters').length, 2);

    Ember.run(function () {
        component.set('filterName', 'Name');
        component.set('filterValue', 'Abhijeet');
        component.get('controller').send('applyFilter');
    });
    equal(component.get('appliedFilters').has('Name'), true);
    equal(component.get('appliedFilters').get('Name').value, 'Abhijeet');
    equal(component.get('availableFilters').length, 1);

    Ember.run(function () {
        component.set('filterName', 'Rating');
        component.set('filterValue', '100:');
        component.get('controller').send('applyFilter');
    });
    equal(component.get('appliedFilters').has('Rating'), false);
    equal(component.get('errorMsg'), 'Cannot Apply filter Rating. Please check value');
    equal(component.get('availableFilters').length, 1);

});