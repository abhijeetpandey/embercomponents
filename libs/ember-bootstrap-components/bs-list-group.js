(function () {
    Bootstrap.BsListGroupComponent = Bootstrap.ItemsView.extend({
        tagName:'ul',
        classNames:['list-group'],
        itemViewClass:Bootstrap.ItemView.extend(Bootstrap.ItemSelection, {
            classNames:['list-group-item'],
            template:Ember.Handlebars.compile('{{#if view.badge}}\n    {{bs-badge contentBinding="view.badge"}}\n{{/if}}\n {{#if view.action}}\n<a style="color:red; z-index:1000; cursor:pointer; text-decoration: none; " {{action delete view.title}}>X</a> &nbsp;\n{{/if}} \n {{#if view.sub}}\n <h4 class="list-group-item-heading">{{view.title}}</h4>\n    <p class="list-group-item-text">{{view.sub}}</p>\n{{else}}\n    {{view.title}}\n{{/if}}'),
            action:(function () {
                var content;
                content = this.get('content');
                if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
                    return null;
                }
                return content.get('action');
            }).property('content'),
            badge:(function () {
                var content;
                content = this.get('content');
                if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
                    return null;
                }
                return content.get('badge');
            }).property('content'),
            sub:(function () {
                var content;
                content = this.get('content');
                if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
                    return null;
                }
                return content.get('sub');
            }).property('content')
        })
    });

    Ember.Handlebars.helper('bs-list-group', Bootstrap.BsListGroupComponent);

}).call(this);