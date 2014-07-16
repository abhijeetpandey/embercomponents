var ColumnNamesMixin = Ember.Mixin.create({
    properties:function () {
        var array = [];
        var content = this.get('content').toArray();
        if (content.length > 0) {
            var obj = Object.keys(content.get(0));
            $.each(obj, function (key, value) {
                array.push(value);
            });
        }
        return array;
    }.property('content')
});

var FilterContentMixin = Ember.Mixin.create(ColumnNamesMixin, Ember.SortableMixin, {
    content:[],
    search:'',
    sortProperties:['id'],
    sortAscending:true,
    filteredContent:function () {
        var filteredContent;
        var parentThis = this;
        filteredContent = $.grep(parentThis.toArray(), function (element, index) {
            var valid = 0;
            element = Ember.Object.create(element);
            $.each(parentThis.get('properties'), function (key, value) {
                var p = value;
                valid = valid || (element.get(p).toString().indexOf(parentThis.get('search')) + 1);
            });
            return (valid > 0);
        });
        return filteredContent.toArray();
    }.property('content', 'search', 'sortProperties', 'sortAscending')
});

//creates an array sortable on columns and searchable as well
var DataTableMixin = Ember.Mixin.create(FilterContentMixin, {
    perPage:10,
    perPageSelector:[10, 20, 30, 40, 50],
    search:'',
    searchable:true,
    sortProperties:['id'],
    sortAscending:true,
    currentPage:1,
    prev:function () {
        return this.get('currentPage') > 1;
    }.property('currentPage'),
    next:function () {
        return this.get('currentPage') != this.get('totalPages');
    }.property('currentPage', 'totalPages'),
    totalPages:0,
    actions:{
        toggleRender:function () {
            this.set('render', !this.set('render'));
        },
        propSort:function (property) {
            this.set('sortAscending', (this.sortProperties[0] === property ? !this.sortAscending : true));
            this.set('sortProperties', [property]);
            this.set('currentPage', 1);
        },
        nextPage:function () {
            if (this.get('currentPage') >= this.get('totalPages')) {
                return null;
            }
            this.set('currentPage', this.get('currentPage') + 1);
        },
        previousPage:function () {
            if (this.get('currentPage') <= 1) {
                return null;
            }
            this.set('currentPage', this.get('currentPage') - 1);
        }
    },
    fullData:function () {
        var returnData = this.get("search") !== "" ? this.get('filteredContent') : this.get('sortedContent');
        this.set('totalPages', Math.ceil(returnData.length / this.get('perPage')));
        this.set('currentPage', (this.get('totalPages') === 0 ? 0 : (this.get('currentPage') > this.get('totalPages') ?
            this.get('totalPages') : this.get('currentPage'))));
        return returnData;
    }.property('currentPage', 'perPage', 'sortedContent', 'filteredContent', 'search', 'render'),
    data:function () {
        return this.get('fullData').slice(this.get('startIndex'), this.get('endIndex'));
    }.property('fullData'),
    searchObserver:function () {
        this.set('currentPage', 1);
    }.observes('search'),
    sortedContent:function () {
        return this.toArray();
    }.property('content', 'sortAscending', 'sortProperties'),
    startIndex:function () {
        return (this.get('currentPage') - 1) * this.get('perPage');
    }.property('currentPage', 'perPage'),
    endIndex:function () {
        return this.get('startIndex') + this.get('perPage');
    }.property('startIndex')
});

//component to create a table using sortable & searchable array
var DataTableComponent = Ember.Component.extend(Ember.TargetActionSupport, {
    cssClass:'',
    actions:{
        loading:function () {
            this.set('cssClass', 'overlay');
            console.debug('loading state');
            return true;
        },
        ready:function () {
            this.set('cssClass', '');
            console.debug('ready state');
            return true;
        },
        getSortedContent:function (prop) {
            this.send('loading');
            this.sendAction('propSort', prop);
            this.send('ready');

        },
        getNextPage:function () {
            this.sendAction('nextPage');
            this.send('ready');
        },
        getPreviousPage:function () {
            this.send('loading');
            this.sendAction('previousPage');
            this.send('ready');
        }
    }
});

//strictly for DS.Model models
Ember.Handlebars.registerHelper('eachMyProperty', function (context, options) {
    var ret = "";
    var newContext = Ember.get(this, context);
    var arr = [];

    Ember.get(this.get('constructor'), 'attributes').forEach(function (key, value) {
        if (value.type !== 'boolean')
            arr.push({prop:key});
    });

    $.each(arr, function (key, value) {
        var cssClass = newContext.get('cssClass');
        cssClass = cssClass(value.prop, newContext);
        if (value.prop == 'Link') {
            ret += options.fn({value:newContext.get(value.prop), link:true, params:newContext, cssClass:cssClass});
        } else if (value.prop == 'Vote') {
            ret += options.fn({value:newContext.get(value.prop), button:true, params:newContext, cssClass:cssClass});
        }
        else {
            ret += options.fn({value:newContext.get(value.prop), link:false, cssClass:cssClass});
        }
    });
    return ret;
});
