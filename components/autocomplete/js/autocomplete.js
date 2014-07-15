/**
 * Created by IntelliJ IDEA.
 * User: abhijeet.pa
 * Date: 15/07/14
 * Time: 11:11 AM
 * To change this template use File | Settings | File Templates.
 */

Ember.TEMPLATES['defaultItemContainer'] = Ember.Handlebars.compile("{{text}}");
Ember.TEMPLATES['components/auto-complete'] = Ember.Handlebars.compile("<div id='cc-auto' >{{view textField placeholder=placeholder class=cssclass size=size maxlength=maxlength valueBinding='searchText'}}{{view UlView contextBinding='searchResults' index=currentIndex}}</div>");
Ember.TEMPLATES['ulViewContainer'] = Ember.Handlebars.compile("{{#each item in this}}{{view view.parentView.ItemView contextBinding='item' currentIndex=view.parentView.currentIndex}}{{/each}}");

//todo:what can be added
//provide textfield classNames
//multiple filters
var AutoCompleteComponent = Ember.Component.extend({
    listItemContainer:"defaultItemContainer",
    localdata:[],
    primaryText:"text",
    minLength:1,
    url:'',
    searchText:'',
    currentIndex:-1,
    qParam:null, //by default set to null
    searchResults:[],
    value:'',  //by default will have same value of searchText (text)
    valueType:'text',//additional type  required from autocomplete
    focusOut:function (event) {
        this.send('focusOut', event);
    },
    keyUp:function (event) {
        this.send('traverse', event);
    },
    keyDown:function (event) {
        if (event.keyCode == 9) {
            this.send('changeText');
        }
    },
    click:function (event) {
        this.send('changeText',this.get('currentIndex'));
    },
    mouseEnter:function (event) {
        this.send('changeMouseState', true);
    },
    mouseLeave:function (event) {
        this.send('changeMouseState', false);
    },
    textField:Ember.TextField.extend({
        enter:'changeText'
    }),
    ItemView:Ember.View.extend(Ember.ViewTargetActionSupport, {
        classNameBindings:['staticClass', 'dynamicClass'],
        staticClass:'cc-menu-item',
        dynamicClass:function () {
            return this.get('context').get('internal_id') == this.get('currentIndex') ? 'is-active' : '';
        }.property('currentIndex'),
        tagName:'li',
        templateNameBinding:'getTemplate',
        getTemplate:function () {
            return this.get('targetObject').get('listItemContainer');
        }.property(),
        mouseEnter:function (event) {
            this.triggerAction({
                action:'setCurrentIndex',
                actionContext:this.get('context').get('internal_id')
            });
        }
    }),
    UlView:Ember.View.extend({
        tagName:'ul',
        classNameBindings:['staticClass', 'dynamicClass'],
        staticClass:'cc-autocomplete',
        templateName:'ulViewContainer',
        dynamicClass:function () {
            return this.get('context').length == 0 ? 'none' : '';
        }.property('context')
    }),
    IsNumeric:function (num) {
        return (num >= 0 || num < 0);
    },
    searchTextObserver:function () {
        var searchText = this.get('searchText');
        if (searchText.length < this.get('minLength')) {
            this.set('searchResults', []);
        } else {
            var items = [];
            var url = this.get('url');
            var response;
            if(Ember.isEmpty(this.get('localdata'))){
                response = $.ajax({
                    type:"GET",
                    url:(this.get('qParam')) == null ? (url + searchText) : (url + "?" + this.get('qParam') + "=" + searchText),
                    async:false
                }).responseText;
                items = JSON.parse(response);
            }
            else
            {
                items=this.get('localdata');
            }
            var auto = Ember.A();
            var parent = this;
            $.each(items, function (key, value) {
                if (typeof(value) == 'string') {
                    auto.pushObject(Ember.Object.create({internal_id:key, text:value}));

                }
                else if (typeof(value) == 'object') {
                    var obj = Ember.Object.create(value);
                    obj.set('internal_id', key);
                    obj.set('text', obj.get(parent.get('primaryText')));
                    auto.pushObject(obj);
                }

            });
            this.set('searchResults', auto);
        }
    }.observes('searchText'),

    actions:{
        changeText:function (internal_id) {

            if (!this.IsNumeric(internal_id)) {
                internal_id = this.get('currentIndex');
            }
            if (internal_id == -1)return;
            if (this.get('searchResults').length == 0)return;
            var obj = this.get('searchResults').filterBy('internal_id', internal_id).get(0);
            this.set('searchText', obj.get('text'));
            this.set('value',obj.get(this.get('valueType')));
            this.set('searchResults', Ember.A());
        },
        traverse:function (event) {
            var keyCode = event.keyCode;
            var currentIndex = this.get('currentIndex');
            switch (keyCode) {
                case 40:
                    currentIndex++;
                    currentIndex = Math.min(currentIndex, this.get('searchResults').length - 1);
                    break;
                case 38:
                    currentIndex--;
                    currentIndex = Math.max(currentIndex, 0);
                    break;
            }
            this.set('currentIndex', currentIndex);
        },

        setCurrentIndex:function (index) {
            this.set('currentIndex', index);
        },
        focusOut:function (event) {
            if (!this.get('mouseOver')) {
                var searchText = this.get('searchText');
                this.set('currentIndex',0);
                this.set('searchText', '');
                this.set('searchText', searchText);
                this.set('searchResults', Ember.A());
            }
        },
        changeMouseState:function (state) {
            this.set('mouseOver', state);
        }

    }
});

Ember.Application.initializer({
    name: "auto-complete-component",
    initialize: function(container, application) {
        container.register('component:auto-complete', AutoCompleteComponent);
    }
});
