var BASE_URL = "http://pg.globalhack.ninja";
var API_BASE = "http://api.globalhack.ninja";
var loggedIn = false;

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
	
	
	
	this.populatePeople = function(data)
	{
		var adiv;
		for(var i = 0; i < data.length; i++)
		{
			var person = data[i];
			adiv = "<div class='personEntry'>"
			adiv += "	<div class='personId'>" + person.user_id + "</div>";
			adiv += "	<div class='email'>" + person.email + "</div>";
			adiv += "	<div class='personId'>" + person.phone + "</div>";
			adiv += "	<div class='personId'>" + person.user_id + "</div>";
			adiv += "	<div class='personId'>" + person.user_id + "</div>";
			adiv += "</div>";
		}
	}
	
    this.get('#/', function(context) {
		$("#step2").hide();
		$("#step3").hide();
		
        var str=location.href.toLowerCase();
        context.app.swap('');
        context.render('templates/help.template', {}).appendTo(context.$element()).then(function(){
			
			if(loggedIn == true)
			{
				$("#step1").hide();
				$("#step2").show();
			}
			
			
			$(".loginButton").click(function(){
				//alert("Login");
				
				var email = $(".loginEmail").val();
				$.get("http://pg.globalhack.ninja/org?email=eq." + email, function(data){
					
					
					if(data.length > 0)
					{
						var model = AppModel.getInstance();
						model.orgData = data[0];
						
						$("#step1").hide();
						$("#step2").show();
						loggedIn = true;
					}
					else 
					{
						alert("Invalid username or password");
					}
					
					
				})
				//console.log($(".loginEmail").val());
				//swildman@stpatrickcenter.org
				//http://pg.globalhack.ninja/org?email=eq.swildman@stpatrickcenter.org
				
			});
			
			
			
			$.get("http://pg.globalhack.ninja/org?select=org_name", function(data){
				
				var adiv = "<select class='orgSelect'>";
				for(var i = 0; i < data.length; i++)
				{
					console.log(data[i]);
					var orgName = data[i].org_name;
					adiv += "<option value='" + orgName + "'>" + orgName + "</option>";
				}
				adiv += "</select>";
				
				$("#filterBox").append(adiv);
			});
				
				
			$(".allPeople").click(function(){
				//http://pg.globalhack.ninja/user
				$.get("http://pg.globalhack.ninja/user", function(data){
					console.log(data);
				});
			});
			
			$(".shelterPeople").click(function(){
				var model = AppModel.getInstance();
				$.get("http://pg.globalhack.ninja/user?shelter_id=eq." + model.orgData.org_id, function(data){
					console.log(data);
				});
			});
			
			
			$(".noAssocPeople").click(function(){
				$.get("http://pg.globalhack.ninja/user?shelter_id=is.null", function(data){
					console.log(data);
				});
			});
			
			$(".newPeople").click(function(){
				
				
				var dt = moment().startOf('month');
				var theDate = dt.format("YYYY-MM-DD");
				$.get("http://pg.globalhack.ninja/user?create_dt=gte." + theDate, function(data){
					console.log(data);
				});
				
			});
			
			$(".riskPeople").click(function(){
				
				
				
			});
			
			$(".homelessPeople").click(function(){
				$.get("http://pg.globalhack.ninja/user?homeless=is.true", function(data){
					console.log(data);
				});
			});
			
			$(".sendPeople").click(function(){
				
				str = "http://pg.globalhack.ninja/user?";
				var model = AppModel.getInstance();
				
				var vet = $(".veteranSelect").val();
				if(vet == "true")
				{
					str += "veteran=eq.true&";
				}
				else if(vet == "false")
				{
					str += "veteran=eq.false&";
				}
				
				var hom = $(".homelessSelect").val();
				if(hom == "true")
				{
					str += "homeless=eq.true&";
				}
				else if(hom == "false")
				{
					str += "homeless=eq.false&";
				}
				
				var emp = $(".employedSelect").val();
				if(emp == "true")
				{
					str += "employed=eq.true&";
				}
				else if(emp == "false")
				{
					str += "employed=eq.false&";
				}
				
				var fam = $(".familySelect").val();
				if(fam == "true")
				{
					str += "dependents=gt.0&";
				}
				else if(emp == "false")
				{
					str += "dependents=eq.0&";
				}
				
				var gen = $(".genderSelect").val();
				if(gen == "true")
				{
					str += "gender=eq.f&";
				}
				else if(gen == "false")
				{
					str += "gender=eq.m&";
				}
				
				
				var org = $(".orgSelect").val();
				
				str += "";
				$.get("http://pg.globalhack.ninja/org?select=org_id&org_name=eq." + org, function(data){
					
					str += "shelter_id=eq." + data[0].org_id;
					$.get(str, function(data){
						console.log(data);
					});
					
				});
				
				//http://pg.globalhack.ninja/org?select=org_id&org_name=eq.
				//http://sms.globalhack.ninja/send?message=Hi%20Shay&phone=3146513545
				
				
				
				
				
				
			});
			
			/*
 			   $.post(API_BASE + "/user", postData,
                function(data) {
                    alert("Data Loaded: " + data);
            	});
			*/
			
			
			
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
				
				
				//initMap();
				
				
				function initMap3() {
					
						
  		          
				  
				  		var pos;
  		         		 if (navigator.geolocation) 
						 {
							 
							//NAV BLOCK 
  		         		   navigator.geolocation.getCurrentPosition(function(position) {
  		         		     pos = {
  		         		       lat: position.coords.latitude,
  		         		       lng: position.coords.longitude
  		         		     };
				 			  
	   		 			  	console.log("Position");
	   		 			  	console.log(pos);
                 			
	 				        var directionsDisplay = new google.maps.DirectionsRenderer;
	 				        var directionsService = new google.maps.DirectionsService;
	 				        var map = new google.maps.Map(document.getElementById('map'), {
	 				          zoom: 14,
	 				          center: {lat: pos.lat, lng: pos.long}
	 				        });
							var infoWindow = new google.maps.InfoWindow({map: map});
							
							
							
 		         		     infoWindow.setPosition(pos);
 		         		     infoWindow.setContent('Location found.');
 		         		     map.setCenter(pos);
	 				        directionsDisplay.setMap(map);
							
							
					        //https://maps.googleapis.com/maps/api/geocode/json?&address=st%20louis%2C%20mo
							
					        document.getElementById('mode').addEventListener('change', function() {
					          calculateAndDisplayRoute(directionsService, directionsDisplay, {lat: 40.7366038, lng: -74.0263816}, {lat: 37.768, lng: -122.511});
					        });
							
							calculateAndDisplayRoute(directionsService, directionsDisplay, {lat: 37.77, lng: -122.447}, {lat: 37.768, lng: -122.511});
							
							
  		         		   }, function() {
  		         		     handleLocationError(true, infoWindow, map.getCenter());
  		         		   });
						   
				 		 }
						 else
						 {
							 alert("Location services are not available for your device");
						 }
		 			 
				        
				      }

				      function calculateAndDisplayRoute(directionsService, directionsDisplay, origin, destination) {
				        var selectedMode = document.getElementById('mode').value;
				        directionsService.route({
				          origin: origin,  // Haight.
				          destination: destination,  // Ocean Beach.
				          // Note that Javascript allows us to access the constant
				          // using square brackets and a string value as its
				          // "property."
				          travelMode: google.maps.TravelMode[selectedMode]
				        }, function(response, status) {
				          if (status == 'OK') 
						  {
				            directionsDisplay.setDirections(response);
				          } 
						  else 
						  {
				            window.alert('Directions request failed due to ' + status);
				          }
				        });
						
						
				    }
					  
					  
				
				
				
				initMap3();
				
				
				
				
				
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