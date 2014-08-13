(function () {
    Bootstrap.BsListGroupComponent = Bootstrap.ItemsView.extend({
        tagName:'ul',
        classNames:['list-group'],
        itemViewClass:Bootstrap.ItemView.extend({
            classNames:['list-group-item'],
            template:Ember.Handlebars.compile('{{#if view.badge}}\n    {{bs-badge contentBinding="view.badge"}}\n{{/if}}\n {{#if view.action}}\n<a style="color:red; z-index:1000; cursor:pointer; text-decoration: none; " {{action view.action view.title}}><span class="glyphicon glyphicon-remove"></span></a> &nbsp;\n{{/if}} \n {{#if view.sub}}\n <h4 class="list-group-item-heading">{{view.title}}</h4>\n    <p class="list-group-item-text">{{view.sub}}</p>\n{{else}}\n{{#if view.href}} <a {{bind-attr href=view.href}}>{{view.title}}</a>{{else}} {{view.title}}{{/if}}\n{{/if}}'),
            href:(function () {
                var content;
                content = this.get('content');
                if (!(Ember.typeOf(content) === 'instance' || Ember.canInvoke(content, 'get'))) {
                    return null;
                }
                return content.get('href');
            }).property('content'),
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