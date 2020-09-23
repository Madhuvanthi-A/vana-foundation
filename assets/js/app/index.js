$(document).ready(function(){
	M = window.M || {};

	M.Navigator = new M.mainRouter;
	Backbone.history.start();

	M.AppView = new homeView({
				model: M.Navigator.model
			});

});