M = window.M || {};

M.mainRouter = Backbone.Router.extend({
	  routes: {
	  	//"items/:type(/:univ/:page)": "showCollection",
	  	"filter/:type(/:date)(/:sortBy)": "showGrouped",
	  	'items/:type?*querystring': 'routeQuery',
	  	"": "defaultAction"
	  },
	  initialize: function(){
	  	console.log("Router Initialized");
	  	/*this.model = new M.models.navModel(
	  						{
	  							type: "",
	  							page: 1,
	  							slug: ""
	  						});*/
	  },
	  routeQuery: function(type, querystring){
	  	console.log(type, parseQueryString(querystring), "route query");
	  	var queryParams = parseQueryString(querystring);

	  	/*this.model.set({
	  		slug: type, 
	  		type: queryParams.univ || 'jnu', 
	  		date: queryParams.date || null, 
	  		page: queryParams.page || 1,
	  		action: 'filter'
	  	});
	*/
	  },
	  defaultAction: function(action){
	  	console.log("Home page", action);
	  	//M.AppView.cleanup();
	  	//this.model.set({slug: "home"});
	  	
	  },
	  showCollection: function(action, type, page){
	  	console.log("COllections page", action, type, page);
	  	//M.AppView.cleanup();
	  	//this.model.set({slug: action, type: type, page: Number(page), action: 'items'});
	  },
	  showGrouped: function(action, date, sortBy){
	  	console.log(action, date, sortBy);
	  	var params = action.split('&');

	  	M.AppView.routeChanged(params, date, sortBy);
	  	//this.model.set({slug: action, type: univ, date: date, action: 'filter'});

	  }
	});


//function to parse query params
function parseQueryString(queryString)
{
    if (!_.isString(queryString))
        return
    queryString = queryString.substring( queryString.indexOf('?') + 1 )
    var params = {}
    var queryParts = decodeURI(queryString).split(/&/g)
    _.each(queryParts, function(val)
        {
            var parts = val.split('=')
            if (parts.length >= 1)
            {
                var val = undefined
                if (parts.length == 2)
                    val = parts[1]
                params[parts[0]] = val
            }
        })
    return params
}

