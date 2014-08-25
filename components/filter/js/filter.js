(function () {

    Ember.TEMPLATES['components/filter-block'] = Ember.Handlebars.compile("" +
        "<div class='filter'>" +
        "    <div class='topBox'>" +
        "         {{#if availableFiltersName.length}}" +
        "         <div class='topBox-item'>" +
        "             <div class='selectBox'>" +
        "                 {{view Ember.Select content=availableFiltersName value=filterName class='select'}}" +
        "             </div>" +
        "         </div>" +
        "         <div class='topBox-item'>" +
        "             <div class='inputBox'>" +
        "                 <div class='inputBox-input-div'>" +
        "                     {{auto-complete localdata=data url=url qParam=qParam primaryText=primaryText listItemContainer=listItemContainer searchText=filterValue class='input' minLength=1}}" +
        "                 </div>" +
        "             </div>" +
        "         </div>" +
        "         <a {{action 'applyFilter'}}><div class='addButton-icon'></div></a>" +
        "         {{/if}}" +
        "         <div class='topBox-item'>" +
        "             <div class='inputBox'>" +
        "                 <div class='inputBox-input-div'>" +
        "                     {{auto-complete url=filterUrl class='input' minLength=1}}" +
        "                 </div>" +
        "             </div>" +
        "         </div>" +
        "     </div>" +
        "     {{#if appliedFiltersName.length}}" +
        "     <div class='tag-container'>" +
        "         {{#each filter in appliedFiltersName}}" +
        "         <div class='tag-box'>" +
        "             <div class='tag-text'>{{filter.name}}:{{filter.value}}" +
        "             </div>" +
        "             <a {{action 'removeFilter' filter.name filter.value}}>" +
        "             <div class='tag-remove-icon'></div>" +
        "             </a>" +
        "         </div>" +
        "         {{/each}}" +
        "     </div>" +
        "     {{/if}}" +
        " </div>");


    var FilterComponent = Ember.Component.extend({
        filters:Ember.A(),
        filterName:'',
        filterValue:'',
        searchFor:'search',
        errorMsg:'',
        getInnerProperty:function (property, defaultValue) {
            var filterName = this.get('filterName');
            var filters = this.get('filters');
            var ret = null;
            $.each(filters, function (key, value) {
                if (filterName == value.alias) {
                    if (value.hasOwnProperty(property)) {
                        var obj = Ember.Object.create(value);
                        ret = obj.get(property);
                        return;
                    }
                }
            });

            return ret ? ret : defaultValue;
        },
        primaryText:function () {
            return this.getInnerProperty('primaryText', 'text');
        }.property('filterName', 'filters'),
        listItemContainer:function () {
            return this.getInnerProperty('listItemContainer', 'defaultItemContainer');
        }.property('filterName', 'filters'),
        url:function () {
            return this.getInnerProperty('url', '');
        }.property('filterName', 'filters'),
        qParam:function () {
            return this.getInnerProperty('qParam', null);
        }.property('filterName', 'filters'),
        data:function () {
            return this.getInnerProperty('data', []);
        }.property('filterName', 'filters'),
        filterUrl:function () {
            return this.get('baseUrl') + this.get('flattenAppliedFilters');
        }.property('baseUrl', 'flattenAppliedFilters'),
        flattenAppliedFilters:function () {
            var appliedFilters = this.get('appliedFilters');
            var flattenedFilters = [];
            appliedFilters.forEach(function (key, value) {
                flattenedFilters.push("" + value.name + "=" + encodeURIComponent(value.value));
            });
            if (flattenedFilters.length > 0) {
                flattenedFilters.push("params=1");
            }
            flattenedFilters.push(this.get('searchFor') + '=');
            flattenedFilters = "?" + flattenedFilters.join("&");
            return flattenedFilters;
        }.property('appliedFilters.length', 'searchFor'),
        availableFiltersName:function () {
            var availableFilters = this.get('availableFilters');
            this.set('filterValue', '');
            var ar = availableFilters.keys.list.toArray();
            ar.sort();
            this.set('filterName', ar[0]);
            return ar;
        }.property('availableFilters.length'),
        appliedFiltersName:function () {
            var appliedFilters = this.get('appliedFilters');
            var ar = Ember.A();
            appliedFilters.forEach(function (key, val) {
                ar.push(Ember.Object.create({name:val.alias, value:val.value}));
            });
            return ar;
        }.property('appliedFilters.length'),
        availableFilters:Ember.Map.create(),
        appliedFilters:Ember.Map.create(),
        filtersObserver:function () {
            var filters = this.get('filters');
            var map = this.get('availableFilters');
            $.each(filters, function (key, value) {
                map.set(value.alias, value);
            });
        }.observes('filters.length').on('didInsertElement'),
        validateFilterData:function (filterValue, filterType) {
            switch (filterType) {
                case 'number':
                    return !isNaN(filterValue);
                case 'string':
                    return (typeof filterValue) === 'string';
                case 'range':
                    if ((typeof filterValue) === 'string') {
                        var range = filterValue.split("::");
                        if (range.length == 2) {
                            range[0] = parseInt(range[0]);
                            range[1] = parseInt(range[1]);
                            if (!isNaN(range[0]) && !isNaN(range[1])) {
                                return range[0] < range[1];
                            }
                        }
                    }
                    return false;
                default:
                    return false;
            }
        },
        actions:{
            applyFilter:function () {
                console.debug('applying filter');
                var filterName = this.get('filterName');
                var filterValue = this.get('filterValue');
                var appliedFilters = this.get('appliedFilters');
                var availableFilters = this.get('availableFilters');
                if (!Ember.isEmpty(filterValue)) {
                    if (!filterValue.length > 0) {
                        return;
                    } else {
                        if (!appliedFilters.has(filterName)) {
                            var filterData = availableFilters.get(filterName);
                            var isValid = this.validateFilterData(filterValue, filterData.type);
                            if (isValid) {
                                appliedFilters.set(filterName, Ember.Object.create(filterData, {value:filterValue}));
                                availableFilters.remove(filterName);
                            } else {
                                this.set('errorMsg','Cannot Apply filter '+filterName+'. Please check value');
                                console.log('Error ' + filterData.type + " " + filterValue);
                            }
                        }
                    }
                } else {
                    return;
                }
            },
            removeFilter:function (filterName) {
                var appliedFilters = this.get('appliedFilters');
                var availableFilters = this.get('availableFilters');
                var value = appliedFilters.get(filterName);
                delete value.value;
                availableFilters.set(filterName, value);
                appliedFilters.remove(filterName);

            }
        }
    });

    Ember.Application.initializer({
        name:"filter-block-component",
        initialize:function (container, application) {
            container.register('component:filter-block', FilterComponent);
        }
    });
})();
