var BASE_URL = "http://pg.globalhack.ninja";

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
	
	
	var root = this;
	this.handleItemClick = function(item)
	{
		$(item).data("selected", !$(item).data("selected"));
		if($(item).data("selected") == true)
		{
			$(item).addClass("selectedHelpButton");
		}
		else
		{
			$(item).removeClass("selectedHelpButton");
		}
	}
	
	this.getHelpNeeded = function()
	{
		var helpItems = [];
		$(".step2Button").each(function(index){
			if($(this).data("selected") == true)
			{
				//console.log($(this).attr("value"));
				helpItems[helpItems.length] = $(this).attr("value");
			}
			
		});
		return helpItems;
	}
	
	
    this.get('#/', function(context) {
		$("#step2").hide();
		$("#step3").hide();
		
        var str=location.href.toLowerCase();
        context.app.swap('');
		
        context.render('templates/help.template', {}).appendTo(context.$element()).then(function(){
			
			$(".iman").click(function(){
				var del1 = HelpDelegate.getInstance();
				del1.handleStep1Click(AppModel.MAN);
			});
			
			$(".iwoman").click(function(){
				var del1 = HelpDelegate.getInstance();
				del1.handleStep1Click(AppModel.WOMAN);
			});
			
			$(".ifamily").click(function(){
				var del1 = HelpDelegate.getInstance();
				del1.handleStep1Click(AppModel.FAMILY);
			});
			
			$(".ianon").click(function(){
				var del1 = HelpDelegate.getInstance();
				del1.handleStep1Click(AppModel.ANONYMOUS);
			});
			
			
			//STEP 2
			$(".housing").click(function(){
				root.handleItemClick(this);
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".food").click(function(){
				root.handleItemClick(this);
				var del1 = HelpDelegate.getInstance();
				
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".hygine").click(function(){
				root.handleItemClick(this);
				
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".casemgmt").click(function(){
				root.handleItemClick(this);
				
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".employment").click(function(){
				root.handleItemClick(this);
				
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".money").click(function(){
				root.handleItemClick(this);
				
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			$(".other").click(function(){
				root.handleItemClick(this);
				
				var del1 = HelpDelegate.getInstance();
				//del1.handleStep2Click(AppModel.ANONYMOUS);
			});
			
			
			$(".nextButton").click(function(){
				var model = AppModel.getInstance();
				model.servicesNeeded = root.getHelpNeeded();
				$("#step2").hide();
				$("#step3").show();
				
				//console.log(model.servicesNeeded);
				//console.log(model.userType);
			});
			
			$(".helpSendButton").click(function(){
				
    			
				var model = AppModel.getInstance();
				var postData = {};
				postData.Id_Type = model.userType;
				postData.Needs = model.servicesNeeded;
				
				
				model.username 	= $(".helpUsername").val();
				model.email 		= $(".helpEmail").val();
				model.phone 		= $(".helpPhone").val();
				model.reason 		= $(".helpReason").val();
				model.gender 		= $(".helpGender").val();
				model.veteran		= $(".helpVeteran").val() == "on" ? true : false;
				model.education 	= $(".helpEducation").val();
				model.dependents 	= $(".helpDependents").val();
				model.enthnicity	= $(".helpEthnicity").val();
				model.homesless 	= $(".helpHomeless").val() == "on" ? true : false;
				model.employed 		= $(".helpEmployed").val() == "on" ? true : false;
				model.dobMonth 		= $(".helpDobMonth").val();
				model.dobDay	 	= $(".helpDobDay").val();
				model.dobYear 		= $(".helpDobYear").val();
				
				
    			postData.Email 	= model.email;
    			postData.Phone  = model.phone;
    			postData.Reason = model.reason;
    			postData.Gender = model.gender;
    			postData.Veteran = model.veteran;
    			postData.Education = model.education;
    			postData.Dependents = model.dependents;
    			postData.Ethnicity = model.enthnicity;
    			postData.Homeless = model.homesless;
    			postData.Employed = model.employed;
    			postData.Date_Of_Birth = model.dobMonth + "-" + model.dobDay + "-" + model.dobYear;
					
					/*		
 			   $.post("mail.php", this.params,
                function(data) {
                    alert("Data Loaded: " + data);
            	});
			*/
			
			
        });
    });
});
	
	
    this.get('#/about/', function(context) {
		console.log("ets");
		
        //var str=location.href.toLowerCase();
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
	
	
    this.get('#/shelters/', function(context) {
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/shelters.template', {}).appendTo(context.$element()).then(function(){
			
			$.get(BASE_URL + "/shelter", function(data){
				console.log("Done");
				console.log(data);
				
				for(var i = 0; i < data.length; i++)
				{
					console.log(data[i]);
					
					var div = "<div class='shelterItem'>"
					div += "	<div class='shelterItemTitle'>" + data[i].shelter_name + "</div>"
					div += "	<div class='shelterItemAddress'>" + data[i].street_address + ", " + data[i].city + ", " + data[i].state + " " + data[i].zip_code + "</div>";
					div += "	<div class='shelterItemPhone'>" + data[i].phone + "</div>";
					div += "</div><br>";
					
					$("#shelterListInner").append(div);
				}
				
				
				initMap();
		        function initMap() {
		          var map = new google.maps.Map(document.getElementById('map'), {
		            center: {lat: -34.397, lng: 150.644},
		            zoom: 6
		          });
		          var infoWindow = new google.maps.InfoWindow({map: map});

		          // Try HTML5 geolocation.
		          if (navigator.geolocation) {
		            navigator.geolocation.getCurrentPosition(function(position) {
		              var pos = {
		                lat: position.coords.latitude,
		                lng: position.coords.longitude
		              };

		              infoWindow.setPosition(pos);
		              infoWindow.setContent('Location found.');
		              map.setCenter(pos);
		            }, function() {
		              handleLocationError(true, infoWindow, map.getCenter());
		            });
		          } else {
		            // Browser doesn't support Geolocation
		            handleLocationError(false, infoWindow, map.getCenter());
		          }
		        }

		        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		          infoWindow.setPosition(pos);
		          infoWindow.setContent(browserHasGeolocation ?
		                                'Error: The Geolocation service failed.' :
		                                'Error: Your browser doesn\'t support geolocation.');
		        }
				
				
				
				
			});
			
		});
	});

	/*
    this.before('.*', function() {

        var hash = document.location.hash;
        $("nav").find("a").removeClass("current");
        $("nav").find("a[href='"+hash+"']").addClass("current");
		
		
   });
	*/

  });

  $(function() {
    app.run('#/');
  });

})(jQuery);