(function () {
    Ember.TEMPLATES['defaultItemContainer'] = Ember.Handlebars.compile("{{text}}");
    Ember.TEMPLATES['components/auto-complete'] = Ember.Handlebars.compile("<div id='cc-auto' {{bind-attr class=cssclass}} >{{view textField placeholder=placeholder class=cssclass size=size maxlength=maxlength valueBinding='searchText'}}{{#if ulVisible}}{{view UlView contextBinding='searchResults' index=currentIndex}}{{/if}}</div>");
    Ember.TEMPLATES['ulViewContainer'] = Ember.Handlebars.compile("{{#each item in this}}{{view view.parentView.ItemView contextBinding='item' currentIndex=view.parentView.currentIndex}}{{/each}}");

    var AutoCompleteComponent = Ember.Component.extend({
        cache:Ember.Map.create(),
        listItemContainer:"defaultItemContainer",
        isAutoCompleteOn:true,
        localdata:[],
        isValid:false,
        ulVisible:true,
        primaryText:"text",
        minLength:3,
        url:'',
        searchText:'',
        currentIndex:-1,
        qParam:null, //by default set to null
        propertiesToSearch:null,
        getPropertiesToSearch:function () {
            return !Ember.isEmpty(this.get('propertiesToSearch')) ? this.get('propertiesToSearch').split(',') : Ember.A([this.get('primaryText')]);
        }.property('propertiesToSearch'),
        searchResults:[],
        value:'', //by default will have same value of searchText (text)
        valueType:'text', //additional type  required from autocomplete,
        populateResults:true,
        focusOut:function (event) {
            if (this.get('ulVisible')) {
                this.send('focusOut', event);
            }
        },
        keyDown:function (event) {
            if (event.keyCode == 9) {
                this.send('changeText');
            } else {
                this.send('traverse', event);
            }
        },
        click:function (event) {
            this.send('changeText', this.get('currentIndex'));
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
            }.property('context'),
            didInsertElement:function () {
                var outerWidth = $(this.get('parentView').$()).find("[type=text]").outerWidth();
                this.$().css('min-width', outerWidth);
            }
        }),
        IsNumeric:function (num) {
            return (num >= 0 || num < 0);
        },
        getFilteredData:function (data) {
            var filteredContent;
            var parentThis = this;
            filteredContent = $.grep(data, function (element, index) {
                element = Ember.Object.create(element);
                var valid = 0;
                $.each(parentThis.get('getPropertiesToSearch'), function (key, value) {
                    var p = value.trim();
                    valid = valid || (element.get(p).toString().toLowerCase().indexOf(parentThis.get('searchText').toLowerCase()) + 1);
                });
                return (valid > 0);
            });
            return filteredContent.toArray();
        },
        searchTextObserver:function () {
            if (!this.get('isAutoCompleteOn')) {
                return;
            }

            if (!this.get('populateResults')) {
                return;
            }
            var parent = this;
            var searchText = this.get('searchText');
            if (searchText.length < this.get('minLength')) {
                this.set('searchResults', []);
            } else {
                var items = [];
                var url = this.get('url');
                if (Ember.isEmpty(this.get('localdata'))) {
                    items = this.get('cache').get(url + searchText);
                    if (Ember.isEmpty(items)) {
                        $.ajax({
                            type:"GET",
                            url:(this.get('qParam')) == null ? (url + searchText) : (url + "?" + this.get('qParam') + "=" + searchText),
                            async:true
                        }).done(function (data) {
                                items = JSON.parse(data);
                                parent.get('cache').set(url + searchText, items);
                                parent.setSearchResults(parent.prepareSearchResults(items, parent));

                            });
                    } else {
                        parent.setSearchResults(parent.prepareSearchResults(items, parent));
                    }
                }
                else {
                    items = this.getFilteredData(this.get('localdata'));
                    parent.setSearchResults(parent.prepareSearchResults(items, parent));
                }
            }
            this.validateSearchText();
        }.observes('searchText'),
        prepareSearchResults:function (items, context) {
            var parent = context;
            var auto = Ember.A();
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
            return auto;
        },
        setSearchResults:function (results) {
            this.set('searchResults', results.splice(0,7));
        },
        actions:{
            changeText:function (internal_id) {
                if (!this.IsNumeric(internal_id)) {
                    internal_id = this.get('currentIndex');
                }
                if (internal_id == -1)return;
                if (this.get('searchResults').length == 0)return;
                var obj = this.get('searchResults').filterBy('internal_id', internal_id).get(0);
                this.set('populateResults', false);
                this.set('searchText', obj.get(this.get('primaryText')));
                this.set('value', obj.get(this.get('valueType')));
                this.set('searchResults', Ember.A());
                this.set('populateResults', true);
                this.validateSearchText();
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
                    this.set('currentIndex', 0);
                    this.set('searchResults', Ember.A());
                    this.validateSearchText();
                }
            },
            changeMouseState:function (state) {
                this.set('mouseOver', state);
            }
        },
        validateSearchText:function () {
            var parent = this;
            var searchText = this.get('searchText');

            var items = [];
            var url = this.get('url');

            if (Ember.isEmpty(this.get('localdata'))) {
                items = this.get('cache').get(url + searchText);
                if (Ember.isEmpty(items)) {
                    $.ajax({
                        type:"GET",
                        url:(this.get('qParam')) == null ? (url + searchText) : (url + "?" + this.get('qParam') + "=" + searchText),
                        async:true
                    }).done(function (data) {
                            items = JSON.parse(data);
                            parent.get('cache').set(url + searchText, items);
                            items = parent.prepareSearchResults(items, parent);
                        });
                } else {
                    items = parent.prepareSearchResults(items, parent);
                }
            }
            else {
                items = this.getFilteredData(this.get('localdata'));
                items = parent.prepareSearchResults(items, parent);
            }

            var valid = false;
            if (!Ember.isEmpty(items)) {
                $.each(items, function (key, value) {
                    if (value.get(parent.get('primaryText')) == searchText) {
                        valid = true;
                    }
                });
            }

            this.set('isValid', valid);
            if(!valid && searchText.length>0)
            {
                this.set('cssclass','input-error');
            }else{
                this.set('cssclass','');
            }
        }
    });

    Ember.Application.initializer({
        name:"auto-complete-component",
        initialize:function (container, application) {
            container.register('component:auto-complete', AutoCompleteComponent);
        }
    });
})();