(function() {
    Bootstrap.BsPill = Bootstrap.ItemView.extend(Bootstrap.NavItem, Bootstrap.ItemSelection, {
        template: Ember.Handlebars.compile('{{#if view.content.linkTo}}\n    {{#if view.parentView.dynamicLink}}\n        {{#link-to view.content.linkTo model}}{{view.title}}{{/link-to}}\n    {{else}}\n        {{#link-to view.content.linkTo}}{{view.title}}{{/link-to}}\n    {{/if}}\n{{else}}\n    {{view view.pillAsLinkView}}\n{{/if}}'),
        pillAsLinkView: Ember.View.extend({
            tagName: 'a',
            template: Ember.Handlebars.compile('{{view.parentView.title}}'),
            attributeBindings: ['href'],
            href: "#"
        })
    });

}).call(this);

(function() {
    Bootstrap.BsPills = Bootstrap.ItemsView.extend(Bootstrap.Nav, {
        navType: 'pills',
        classNameBindings: ['stacked:nav-stacked', 'justified:nav-justified'],
        attributeBindings: ['style'],
        itemViewClass: Bootstrap.BsPill
    });

    Ember.Handlebars.helper('bs-pills', Bootstrap.BsPills);

}).call(this);

(function() {
    Bootstrap.BsTabPane = Bootstrap.ItemPaneView.extend();

}).call(this);

(function() {
    Bootstrap.BsTabsPanes = Bootstrap.ItemsPanesView.extend({
        classNames: ['tab-content'],
        itemViewClass: Bootstrap.BsTabPane
    });

    Ember.Handlebars.helper('bs-tabs-panes', Bootstrap.BsTabsPanes);

}).call(this);

(function() {
    Bootstrap.BsTabs = Bootstrap.ItemsView.extend(Bootstrap.Nav, {
        navType: 'tabs',
        classNameBindings: ['justified:nav-justified'],
        attributeBindings: ['style'],
        itemViewClass: Bootstrap.BsPill
    });

    Ember.Handlebars.helper('bs-tabs', Bootstrap.BsTabs);

}).call(this);