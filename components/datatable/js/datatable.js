(function () {

    Ember.TEMPLATES['components/data-table'] = Ember.Handlebars.compile("<div  {{bind-attr class=cssClass}}>  </div>  <div class='table-component'>   <div class='topBox'>    <div class='searchBox'>     {{#if table.searchable}}     <span>Search :</span>{{input type='text' value=table.search}}<br/>     {{/if}}    </div>     <div class='perPage'>     <span>Rows :</span> {{view Ember.Select content=table.perPageSelector value=table.itemsPerPage}}    </div>     <div class='filter'>     {{#if table.availableFilters.length}}     <span>Filters :</span> {{view Ember.Select content=table.availableFilters value=table.filterName}}     {{input value=table.filterValue}} <a {{action 'addFilter'}} >Apply</a>     {{/if}}     {{#if table.appliedFilters.length}}     <span>Applied Filters</span>     {{#each filter in table.appliedFilters}}     <span>{{filter.name}}:{{filter.value}} <a {{action 'deleteFilter' filter.name filter.value}}> X </a> </span>     {{/each}}     {{/if}}    </div>    </div>   <div class='table'>    <table class='dataTable'>     <thead>     <tr>      {{#each header in table.headers}}      <th>       {{#if table.queryParamsEnabled}}       {{#link-to linkRouter (query-params page=1 sortBy=header.name order=header.order)       target='controller'}}{{header.name}}{{/link-to}}       {{else}}       <a href='' {{action 'getSortedContent' header.name}} >{{header.name}}</a></th>      {{/if}}      </th>      {{/each}}     </tr>     </thead>      <tbody>     {{#each table.paginatedContent }}     <tr>      <td>{{id}}</td>      <td>{{name}}</td>      <td>{{age}}</td>     </tr>     {{/each}}     </tbody>    </table>   </div>   <div class='paginator'>     {{#if table.queryParamsEnabled}}    <div class='previousPage'>{{#link-to linkRouter (query-params page=table.prevPage)     target='controller'}}Prev{{/link-to}}    </div>    {{else}}    <div class='previousPage'>{{#if table.prev}}<a href='' {{action getPreviousPage}}>prev</a>     {{else}}prev{{/if}}    </div>    {{/if}}     <div style='text-align: center;width: 50%;float: left;'>     <div class=' pageInfo    '>{{table.currentPage}} of {{table.availablePages}}     </div>    </div>    {{#if table.queryParamsEnabled}}    <div class='nextPage'>{{#link-to linkRouter (query-params page=table.nextPage)     target='controller'}}Next{{/link-to}}    </div>    {{else}}    <div class='nextPage'>{{#if table.next}}<a href=''{{action getNextPage}}>next</a>{{else}}next{{/if}}    </div>    {{/if}}   </div>  </div>");

    var ColumnNamesMixin = Ember.Mixin.create({
        properties:function () {
            var array = [];
            var content = this.toArray();
            if (content.length > 0) {
                var obj = Object.keys(content.get(0));
                $.each(obj, function (key, value) {
                    array.push(value);
                });
            }
            return array;
        }.property('content')
    });
    var PaginationMixin = Ember.Mixin.create({
        itemsPerPage:20,
        perPageSelector:[10, 20, 30, 40, 50],
        currentPage:1,
        page:1,
        pageObserver:function () {
            this.set('currentPage', this.get('page'));
        }.observes('page'),
        prev:function () {
            return this.get('currentPage') > 1;
        }.property('currentPage'),
        next:function () {
            return this.get('currentPage') != this.get('availablePages');
        }.property('currentPage', 'availablePages'),
        pages:function () {
            var availablePages = this.get('availablePages'),
                pages = [];
            for (var i = 0; i < availablePages; i++) {
                var page = i + 1;
                pages.push(page.toString());
            }
            return pages;
        }.property('availablePages'),
        nextPage:function () {
            var nextPage = parseInt(this.get('currentPage')) + 1;
            var availablePages = this.get('availablePages');
            if (nextPage <= availablePages) {
                return nextPage;
            } else {
                return this.get('currentPage');
            }
        }.property('currentPage', 'availablePages'),
        prevPage:function () {
            var prevPage = parseInt(this.get('currentPage')) - 1;
            if (prevPage > 0) {
                return prevPage;
            } else {
                return this.get('currentPage');
            }
        }.property('currentPage', 'availablePages'),
        availablePages:function () {
            return Math.ceil((this.get('fullData.length') / this.get('itemsPerPage')) || 1);
        }.property('fullData.length', 'itemsPerPage'),
        paginatedContent:function () {
            var currentPage = this.get('currentPage') || 1;
            var upperBound = (currentPage * this.get('itemsPerPage'));
            var lowerBound = (currentPage * this.get('itemsPerPage')) - this.get('itemsPerPage');
            var models = this.get('fullData');
            return models.slice(lowerBound, upperBound);
        }.property('content', 'currentPage', 'fullData.@each', 'itemsPerPage'),
        actions:{
            nextPage:function () {
                if (this.get('currentPage') >= this.get('availablePages')) {
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
        }
    });
    Ember.DataTableMixin = Ember.Mixin.create(ColumnNamesMixin, Ember.SortableMixin, PaginationMixin, {
        searchable:true,
        sortProperties:['id'],
        sortAscending:true,
        search:'',
        appliedFilters:[],
        actions:{
            propSort:function (property) {
                this.set('sortAscending', (this.sortProperties[0] === property ? !this.sortAscending : true));
                this.set('sortProperties', [property]);
                this.set('currentPage', 1);
            },
            applyFilter:function () {
                var filterName = this.get('filterName');
                var filterValue = this.get('filterValue');
                var appliedFilters = this.get('appliedFilters');
                var obj = {name:filterName, value:filterValue};
                appliedFilters.pushObject(obj);
                this.set('filterValue', '');
            },
            removeFilter:function (name, value) {
                var appliedFilters = this.get('appliedFilters');
                var newFilters = [];
                $.each(appliedFilters, function (key, value) {
                    if (value.name != name) {
                        newFilters.push({name:value.name, value:value.value});
                    }
                });
                this.set('appliedFilters', newFilters);
            }
        },
        headers:function () {
            var properties = this.get('properties');
            var obj = [];
            var sortBy = this.get('sortBy');
            var order = this.get('order');
            $.each(properties, function (key, value) {
                obj.push({name:value, order:(!Ember.isEmpty(sortBy) ? (sortBy == value ? (!Ember.isEmpty(order) ? (order == 'asc' ? 'desc' : 'asc') : 'asc') : 'asc') : 'asc')});
            });
            return obj;
        }.property('properties', 'sortBy', 'order'),
        availableFilters:function () {
            var filters = this.get('filters');
            var appliedFilters = this.get('appliedFilters');
            var columns = [];
            var availableFilters = [];
            $.each(appliedFilters, function (key, value) {
                columns.push(value.name);
            });

            $.each(filters, function (key, value) {
                if ($.inArray(value, columns) == -1) {
                    availableFilters.push(value);
                }
            });
            this.set('filterName', availableFilters[0]);
            return availableFilters;
        }.property('appliedFilters.length'),
        filters:function () {
            return this.get('properties');
        }.property('properties'),
        sortedContent:function () {
            return this.toArray();
        }.property('content', 'sortAscending', 'sortProperties'),
        searchedContent:function () {
            var searchedContent;
            var search = this.get('search').trim();
            var properties = this.get('properties');
            var sortedContent = this.get('sortedContent');
            searchedContent = $.grep(sortedContent, function (element, index) {
                var valid = 0;
                element = Ember.Object.create(element);
                $.each(properties, function (key, value) {
                    valid = valid || (element.get(value).toString().toLowerCase().indexOf(search.toLowerCase()) + 1);
                });

                return (valid > 0);
            });
            return searchedContent.toArray();
        }.property('content', 'search', 'sortedContent'),
        filteredContent:function () {
            var searchedContent = this.get('searchedContent');
            var filteredContent;
            var appliedFilters = this.get('appliedFilters');
            filteredContent = $.grep(searchedContent.toArray(), function (element, index) {
                var valid = 1;
                element = Ember.Object.create(element);
                $.each(appliedFilters, function (key, value) {
                    valid = valid && (element.get(value.name).toString() == value.value.toString());
                });
                return (valid > 0);
            });
            return filteredContent.toArray();
        }.property('content', 'filterName', 'searchedContent'),
        fullData:function () {
            return this.get('filteredContent');
        }.property('content', 'filteredContent'),
        searchObserver:function () {
            this.set('page', 1);
        }.observes('search'),
        sortByObserver:function () {
            var sortBy = this.get('sortBy');
            this.set('sortProperties', (!Ember.isEmpty(sortBy) ? [sortBy] : ['id']));
        }.observes('sortBy'),
        orderObserver:function () {
            var order = this.get('order');
            this.set('sortAscending', (!Ember.isEmpty(order) ? order == 'asc' : true));
        }.observes('order')
    });
    var DataTableComponent = Ember.Component.extend({
        init:function () {
            this._super();
            this.set('nextPage', 'nextPage');
            this.set('previousPage', 'previousPage');
            this.set('applyFilter', 'applyFilter');
            this.set('removeFilter', 'removeFilter');
            this.set('propSort', 'propSort');
        },
        linkRouter:function () {
            return this.get('table').get('currentRouteName');
        }.property('table'),
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
                this.send('loading');
                this.sendAction('nextPage');
                this.send('ready');
            },
            getPreviousPage:function () {
                this.send('loading');
                this.sendAction('previousPage');
                this.send('ready');
            },
            addFilter:function () {
                this.send('loading');
                this.sendAction('applyFilter');
                this.send('ready');
            },
            deleteFilter:function (name, value) {
                this.send('loading');
                this.sendAction('removeFilter', name, value);
                this.send('ready');
            }
        }
    });

    Ember.Application.initializer({
        name:"data-table-component",
        initialize:function (container, application) {
            container.register('component:data-table', DataTableComponent);
        }
    });
})();
