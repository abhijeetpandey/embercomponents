<script type='text/x-handlebars' data-template-name='components/data-table'>
    {{yield}}
    <div
    {{bind-attr class=cssClass}}>
    </div>
    <div class='table-component'>
        <div class='topBox'>
            <div class='searchBox'>
                {{#if table.searchable}}
                <span>Search :</span>{{input type='text' value=table.search}}<br/>
                {{/if}}
            </div>
            <div class='perPage'>
                <span>Rows :</span> {{view Ember.Select content=table.perPageSelector value=table.perPage}}
            </div>
            {{#each this.filters}}
            <div class='filter'>
                <span>{{name}} :</span> {{view Ember.Select content=filter value=filterValues}}
            </div>
            {{/each}}

        </div>
        <div>
            <table class='dataTable'>
                <thead>
                <tr>
                    {{#each table.properties}}
                    <th>
                        <a href='' {{action 'getSortedContent' prop}}> {{prop}}</a></th>
                    </th>
                    {{/each}}
                </tr>
                </thead>

                <tbody>
                {{#each table.data }}
                <tr>
                    {{#eachMyProperty this}}
                    {{#if link}}
                    <td
                    {{bind-attr class=cssClass}}'>
                    <a {{action 'open' 'comparedSolution' params}}>{{value}}</a></td>
                    {{else}}
                    {{#if button}}
                    <td
                    {{bind-attr class=cssClass}}>
                    {{#if params.ButtonState}}
                    <button disabled>{{value}}</button>
                    {{else}}
                    <button
                    {{action 'open' 'modalVoting' params}}>{{value}}  </button>
                    {{/if}}
                    </td>
                    {{else}}
                    <td
                    {{bind-attr class=cssClass}}>{{value}}</td>
                    {{/if}}
                    {{/if}}
                    {{/eachMyProperty}}
                </tr>
                {{/each}}
                </tbody>
            </table>
        </div>
        <div class='paginator'>
            <div class='previousPage'>{{#if table.prev}}<a href='' {{action getPreviousPage}}>prev</a>
                {{else}}prev{{/if}}
            </div>
            <div style='text-align: center;width: 50%;float: left;'>
                <div class=' pageInfo
            '>{{table.currentPage}} of {{table.totalPages}}
                </div>
            </div>
            <div class='nextPage'>{{#if table.next}}<a href='' {{action getNextPage}}>next</a>{{else}}next{{/if}}
            </div>
        </div>
    </div>

</script>