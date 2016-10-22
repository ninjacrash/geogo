(function($) {

  var app = $.sammy('#app', function() {
    this.use('Template');

    this.around(function(callback) {
      var context = this;
	  callback();
	  
	  /*
      this.load('data/articles.json')
          .then(function(items) {
            context.items = items;
          })
          .then(callback);
	  */
	  
    });
	
    this.get('#/', function(context) {
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/help.template', {}).appendTo(context.$element()).then(function(){
			$(".iman").click(function(){
				var model = AppModel.getInstance();
				model.userType = AppModel.MAN;
				context.redirect('#', "about");
			});
			$(".iwoman").click(function(){
				var model = AppModel.getInstance();
				model.userType = AppModel.WOMAN;
				context.redirect('#', "about");
			});
			$(".ifamily").click(function(){
				var model = AppModel.getInstance();
				model.userType = AppModel.FAMILY;
				context.redirect('#', "about");
			});
			$(".ianon").click(function(){
				var model = AppModel.getInstance();
				model.userType = AppModel.ANONYMOUS;
				context.redirect('#', "about");
				
			});
			
        });
    });
    
    this.get('#/about/', function(context) {
		alert("ets");
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/about.template', {})
               .appendTo(context.$element());
    });

    
	
    this.get('#/help2/', function(context) {
		alert("asdf");
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/help2.template', {}).appendTo(context.$element()).then(function(){
			alert("asdf");
		});
	});

    this.before('.*', function() {

        var hash = document.location.hash;
        $("nav").find("a").removeClass("current");
        $("nav").find("a[href='"+hash+"']").addClass("current");
		
		
   });

  });

  $(function() {
    app.run('#/');
  });

})(jQuery);