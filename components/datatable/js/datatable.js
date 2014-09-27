(function () {
    Ember.TEMPLATES['dataTableRow'] = Ember.Handlebars.compile("<td>{{id}}</td><td>{{name}}</td><td>{{age}}</td>");
    Ember.TEMPLATES['components/data-table'] = Ember.Handlebars.compile("<div {{bind-attr class=cssClass}}>  </div> <div class='table-component'>     <div class='topBox'>         <!--search box-->         {{#if table.searchable}}         <div class='topBox-item'>             <div class='inputBox search'>                 <div class='inputBox-input-div'>                     {{input type='text' value=table.search class='searchBox-input'}}                 </div>                 <div class='searchBox-icon'></div>             </div>         </div>         {{/if}}          {{#if table.pagination}}         <div class='topBox-item'>             <div class='selectBox'>                 {{view Ember.Select content=table.perPageSelector value=table.itemsPerPage class='select'}}             </div>         </div>         {{/if}}          {{#if table.filterable}}         {{#if table.availableFilters.length}}         <div class='topBox-item'>             <div class='selectBox'>                 {{view Ember.Select content=table.availableFilters value=table.filterName class='select'}}             </div>         </div>          <div class='topBox-item'>             <div class='inputBox'>                 <div class='inputBox-input-div'>                     {{auto-complete localdata=table.autodata searchText=table.filterValue class='input'}}                 </div>          </div>         </div>          <a {{action 'addFilter'}}>        <div class='addButton-icon'></div>         </a>         {{/if}}         {{/if}}     </div>       {{#if table.appliedFilters.length}}     <div class='tag-container'>         {{#each filter in table.appliedFilters}}         <div class='tag-box'>             <div class='tag-text'>{{filter.name}}:{{filter.value}}</div>      <a {{action 'deleteFilter' filter.name filter.value}}><div class='tag-remove-icon'></div></a>         </div>         {{/each}}     </div>     {{/if}}      <div class='table'>         <table class='dataTable'>             <thead>             <tr>                 {{#each header in table.headers}}                 <th >                     {{#if table.queryParamsEnabled}} {{#link-to linkRouter (query-params page=1 sortBy=header.name  order=header.order)  target='controller'}}<div {{bind-attr class=header.class}}>{{header.header}}</div>{{/link-to}}                     {{else}} <a {{action 'getSortedContent' header.name}} ><div {{bind-attr class=header.class}}>{{header.header}}</div></a>                     {{/if}}                 </th>                 {{/each}}             </tr>             </thead>             <tbody>             {{#each row in table.paginatedContent }}             {{view Ember.DataTableRowView contextBinding='row' rowTemplate=table.rowTemplate table=table}}             {{/each}}             </tbody>         </table>     </div>      {{#if table.pagination}}     <div class='paginator'> {{#if table.queryParamsEnabled}}         <div class='previousPage'>{{#link-to linkRouter (query-params page=table.prevPage)             target='controller'}}Prev{{/link-to}}         </div>         {{else}}         <div class='previousPage'>{{#if table.prev}}<a href='' {{action getPreviousPage}}>prev</a>             {{else}}prev{{/if}}         </div>         {{/if}}         <div style='text-align: center;width: 50%;float: left;'>             <div class=' pageInfo    '>{{table.currentPage}} of {{table.availablePages}}</div>         </div>         {{#if table.queryParamsEnabled}}         <div class='nextPage'>{{#link-to linkRouter (query-params page=table.nextPage)             target='controller'}}Next{{/link-to}}         </div>         {{else}}         <div class='nextPage'>{{#if table.next}}<a href=''{{action getNextPage}}>next</a>{{else}}next{{/if}}</div>         {{/if}}     </div>     {{/if}} </div>");

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };

    Ember.DataTableRowView = Ember.View.extend({
        tagName:'tr',
        templateNameBinding:'getTemplateName',
        getTemplateName:function () {
            var rowTemplate = this.get('rowTemplate');
            if (!Ember.isEmpty(rowTemplate) && rowTemplate.length > 0) {
                return rowTemplate;
            } else {
                return 'dataTableRow';
            }
        }.property('rowTemplate')
    });

    Ember.ColumnNamesMixin = Ember.Mixin.create({
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

    Ember.PaginationMixin = Ember.Mixin.create({
        itemsPerPage:10,
        perPageSelector:[10, 20, 30, 40, 50],
        currentPage:function () {
            return this.get('page');
        }.property('page'),
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
            var totalPages = Math.ceil((this.get('fullData.length') / this.get('itemsPerPage')) || 1);
            if (this.get('currentPage') > totalPages) {
                this.set('page', totalPages);
                this.set('currentPage', totalPages);
            }
            return totalPages;
        }.property('fullData.length', 'itemsPerPage'),
        paginatedContent:function () {
            var currentPage = this.get('currentPage') || 1;
            var upperBound = (currentPage * this.get('itemsPerPage'));
            var lowerBound = (currentPage * this.get('itemsPerPage')) - this.get('itemsPerPage');
            var models = this.get('fullData');
            return models.slice(lowerBound, upperBound);
        }.property('content.length', 'currentPage', 'fullData.@each', 'itemsPerPage'),
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

    Ember.DataTableMixin = Ember.Mixin.create(Ember.ColumnNamesMixin, Ember.SortableMixin, Ember.PaginationMixin, {
        headerAlias:null,
        searchable:true,
        filterable:true,
        sortProperties:['id'],
        sortAscending:true,
        pagination:true,
        hidden:[],
        search:'',
        appliedFilters:[],
        propertyAliasMap:Ember.Map.create(),
        aliasPropertyMap:Ember.Map.create(),
        autodata:function () {
            var currentFilter = this.getPropertyFromAlias(this.get('filterName'));
            if (Ember.isEmpty(currentFilter))
                return;
            var autodata = Ember.A();
            var data = Ember.A();
            this.get('model').forEach(function (item) {
                data.push(Ember.Object.create(item).get(currentFilter));
            });
            data = data.uniq();
            data.forEach(function (item) {
                autodata.push({text:item});
            });
            return autodata;
        }.property('filterName'),
        actions:{
            propSort:function (property) {
                var order = this.get('order');
                this.set('order', (this.sortProperties[0] === property ? ((!Ember.isEmpty(order) ? ( order == 'asc' ? 'desc' : 'asc') : 'desc')) : 'asc'));
                this.set('sortBy', property);
                this.set('currentPage', 1);
            },
            applyFilter:function () {
                var filterName = this.get('filterName');
                var filterValue = this.get('filterValue');

                if (!Ember.isEmpty(filterValue)) {
                    if (!filterValue.length > 0) {
                        return;
                    } else {
                        this.set('page', 1);
                        var appliedFilters = this.get('appliedFilters');
                        var obj = {name:filterName, value:filterValue};
                        appliedFilters.pushObject(obj);
                        this.set('filterValue', '');
                        if (this.get('queryParamsEnabled')) {
                            this.send('sendTransition');
                            return;
                        }
                    }
                } else {
                    return;
                }
            },
            deleteFilter:function (param) {
                this.send('removeFilter', param.name, param.value);
            },
            removeFilter:function (name, value) {
                this.set('page', 1);
                var appliedFilters = this.get('appliedFilters');
                var newFilters = [];
                $.each(appliedFilters, function (key, value) {
                    if (value.name != name) {
                        newFilters.push({name:value.name, value:value.value});
                    }
                });
                this.set('appliedFilters', newFilters);
                if (this.get('queryParamsEnabled')) {
                    this.send('sendTransition');
                    return;
                }
            },
            sendTransition:function () {
                var filterBy = [];
                var appliedFilters = this.get('appliedFilters');
                $.each(appliedFilters, function (key, value) {
                    filterBy.push(value.name + "=" + value.value);
                });
                filterBy = filterBy.join(";");
                if (this.get('queryParamsEnabled')) {
                    if (filterBy.length) {
                        this.transitionToRoute({queryParams:{filterBy:filterBy}});
                        return;
                    } else {
                        this.transitionToRoute({queryParams:{filterBy:''}});
                        return;
                    }
                }
            }
        },
        getPropertyAlias:function (value) {
            var map = this.get('aliasPropertyMap');
            if (map.has(value)) {
                return map.get(value);
            }
            this.generateMap(map, false);
            return map.get(value);
        },
        getPropertyFromAlias:function (alias) {
            var map = this.get('propertyAliasMap');
            if (map.has(alias)) {
                return map.get(alias);
            }
            this.generateMap(map, true);
            return map.get(alias);
        },
        generateMap:function (map, flip) {
            var headerAlias = this.get('headerAlias');
            var properties = this.get('properties');
            var filters = this.get('filters');
            $.each(properties, function (key, value) {
                var v1 = flip ? value.replace(/_/g, ' ').capitalize() : value;
                var v2 = flip ? value : value.replace(/_/g, ' ').capitalize();
                if (headerAlias.hasOwnProperty(value)) {
                    flip?map.set(headerAlias.get(value),value):map.set(value,headerAlias.get(value));
                } else {
                    map.set(v1, v2);
                }
            });

            $.each(filters, function (key, value) {
                var v1 = flip ? value.replace(/_/g, ' ').capitalize() : value;
                var v2 = flip ? value : value.replace(/_/g, ' ').capitalize();
                var present = false;
                map.forEach(function(key,value){
                    if(value == v2)
                    {
                        present = true;
                    }
                });

                if (!present) {
                    map.set(v1, v2);
                }
            });
        },
        headers:function () {
            var properties = this.get('properties');
            var obj = [];
            var sortBy = this.get('sortBy');
            var order = this.get('order');
            var parent = this;
            var hiddenProperties = this.get('hidden');
            $.each(properties, function (key, value) {
                if ($.inArray(value, hiddenProperties)) {
                    obj.push({
                        header:parent.getPropertyAlias(value),
                        name:value,
                        order:(!Ember.isEmpty(sortBy) ? (sortBy == value ? (!Ember.isEmpty(order) ? (order == 'asc' ? 'desc' : 'asc') : 'asc') : 'asc') : 'asc'),
                        class:(!Ember.isEmpty(sortBy) ? (sortBy == value ? (!Ember.isEmpty(order) ? (order == 'asc' ? 'sortIcon active-asc' : 'sortIcon active-desc') : 'sortIcon both') : 'sortIcon both') : 'sortIcon both')});
                }
            });
            return obj;
        }.property('properties', 'sortBy', 'order'),
        availableFilters:function () {
            var filters = this.get('filters');
            var appliedFilters = this.get('appliedFilters');
            var columns = [];
            var availableFilters = [];
            var parent = this;
            $.each(appliedFilters, function (key, value) {
                columns.push(parent.getPropertyFromAlias(value.name));
            });
            $.each(filters, function (key, value) {
                if ($.inArray(value, columns) == -1) {
                    availableFilters.push(parent.getPropertyAlias(value));
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
        }.property('content.length', 'sortAscending', 'sortProperties'),
        searchedContent:function () {
            var searchedContent;
            var search = this.get('search').trim();
            var properties = this.get('properties');
            var sortedContent = this.get('sortedContent');
            searchedContent = $.grep(sortedContent, function (element, index) {
                var valid = 0;
                if (typeof element.get != "function") {
                    element = Ember.Object.create(element);
                }
                $.each(properties, function (key, value) {
                    valid = valid || (element.get(value).toString().toLowerCase().indexOf(search.toLowerCase()) + 1);
                });
                return (valid > 0);
            });
            return searchedContent.toArray();
        }.property('content.length', 'search', 'sortedContent'),
        filteredContent:function () {
            var searchedContent = this.get('searchedContent');
            var filteredContent;
            var appliedFilters = this.get('appliedFilters');
            var properties = this.get('properties');
            var parent = this;
            filteredContent = $.grep(searchedContent.toArray(), function (element, index) {
                var valid = 1;
                if (typeof element.get != "function") {
                    element = Ember.Object.create(element);
                }

                $.each(appliedFilters, function (key, value) {
                    var propertyFromAlias = parent.getPropertyFromAlias(value.name);
                    if (properties.indexOf(propertyFromAlias) > 0) {
                        valid = valid && (element.get(propertyFromAlias).toString() == value.value.toString());
                    }
                });
                return (valid > 0);
            });
            return filteredContent.toArray();
        }.property('content.length', 'appliedFilters.length', 'searchedContent'),
        fullData:function () {
            return this.get('filteredContent');
        }.property('content.length', 'filteredContent'),
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
        }.observes('order'),
        filterByObserver:function () {
            var appliedFilters = [];
            var filterBy = this.get('filterBy');
            if (filterBy.length > 0) {
                filterBy = filterBy.split(";");
                $.each(filterBy, function (key, value) {
                    var filter = value.split("=");
                    if (filter.length == 2) {
                        appliedFilters.pushObject({name:filter[0], value:filter[1]});
                    }
                });
            }
            this.set('appliedFilters', appliedFilters);
        }.observes('filterBy'),
        appliedFiltersObserver:function () {
            this.set('page', 1);
        }.observes('fullData.length')

    });

    var DataTableComponent = Ember.Component.extend(Ember.TargetActionSupport, {
        linkRouter:function () {
            //ref http://stackoverflow.com/questions/15019212/ember-app-router-router-currentstate-undefined/
            var router = App.__container__.lookup("router:main"); //lookup the router
            var currentHandlerInfos = router.router.currentHandlerInfos; //there are multiple handlers active at one time
            var activeHandler = currentHandlerInfos[currentHandlerInfos.length - 1]; // the last item in the array is the current handler with properties like name, context, handler (Ember.Route)
            var activeRoute = activeHandler.handler; //your route object
            return activeRoute.get('routeName');
        }.property(),
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
                var parent = this;
                this.triggerAction({
                    action:'propSort',
                    target:parent.get('table'),
                    actionContext:prop
                });
                this.send('ready');

            },
            getNextPage:function () {
                this.send('loading');
                var parent = this;
                this.triggerAction({
                    action:'nextPage',
                    target:parent.get('table')
                });
                this.send('ready');
            },
            getPreviousPage:function () {
                this.send('loading');
                var parent = this;
                this.triggerAction({
                    action:'previousPage',
                    target:parent.get('table')
                });
                this.send('ready');
            },
            addFilter:function () {
                this.send('loading');
                var parent = this;
                this.triggerAction({
                    action:'applyFilter',
                    target:parent.get('table')
                });
                this.send('ready');
            },
            deleteFilter:function (name, value) {
                this.send('loading');
                var parent = this;
                this.triggerAction({
                    action:'deleteFilter',
                    target:parent.get('table'),
                    actionContext:{name:name, value:value}
                });
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
