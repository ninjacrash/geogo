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
			
			console.log(person.phone);
			//person.phone = "3146513545";
			adiv = "<div class='personEntry person"  + i + "'>"
			adiv += "	<div class='userRow userPersonId'><div class='userPersonLabel'>User:</div><div class='userPersonValue'> " + person.user_id + "</div></div>";
			adiv += "	<div class='userRow userEmail'><div class='userPersonLabel'>Email: </div><div class='userPersonValue'>" + person.email + "</div></div>";
			adiv += "	<div class='userRow userPhone'><div class='userPersonLabel'>Phone: </div><div class='userPersonValue'>" + person.phone + "</div></div>";
			adiv += "	<div class='userRow userGender'><div class='userPersonLabel'>Gender: </div><div class='userPersonValue'>" + person.gender + "</div></div>";
			adiv += "	<div class='userRow userVeteran'><div class='userPersonLabel'>Veteran: </div><div class='userPersonValue'>" + person.veteran + "</div></div>";
			adiv += "	<div class='userRow userEducation'><div class='userPersonLabel'>Education: </div><div class='userPersonValue'>" + person.education + "</div></div>";
			adiv += "	<div class='userRow userDependents'><div class='userPersonLabel'>Dependents: </div><div class='userPersonValue'>" + person.dependents + "</div></div>";
			adiv += "	<div class='userRow userEthnicity'><div class='userPersonLabel'>Ethnicity: </div><div class='userPersonValue'>" + person.ethnicity + "</div></div>";
			adiv += "	<div class='userRow userHomeless'><div class='userPersonLabel'>Homeless: </div><div class='userPersonValue'>" + person.homeless + "</div></div>";
			adiv += "	<div class='userRow userEmployed'><div class='userPersonLabel'>Employed: </div><div class='userPersonValue'>" + person.employed + "</div></div>";
			//adiv += "	<a class='contactUser'>Contact user</div>";
			adiv += "</div>";
			
			var theDiv = $(adiv);
			$("#step3 .peopleList").append(theDiv);
			
			$(theDiv).data("info", person);
			//console.log($(theDiv).data("info"));
			
			//http://api.globalhack.ninja/closest_shelter?lat=38.6226&lon=-90.1928&gender=f&num=20
			
			$(theDiv).click(function(){
				var model = AppModel.getInstance();
				
				var info = $(this).data("info");
				console.log(model.orgData);
				
				$("#animatedModal").css("display", "block");
				$("#demo01").trigger("click");
				$("#theModalContent .theUser").html(info.user_id);
				$("#theModalContent .theNumber").html(info.phone);
				
				var smsMessage = "Hi this is " + model.orgData.org_name + "\n";
				smsMessage += "Contact us at this address or by phone \n";
				smsMessage += "Address: " + model.orgData.street_address + ", " + model.orgData.city + " " + model.orgData.state + "\n";
				smsMessage += "Phone: " + model.orgData.phone + "\n";
				smsMessage += "to schedule a consultation";
				
				console.log(smsMessage);
				
				model.smsPhone = info.phone;
				model.smsMessage = smsMessage;
				//model.smsOrgName = model.orgData.org_name;
				//model.smsAddress = model.orgData.smsAddress;
				
				//http://sms.globalhack.ninja/send?message=Hi%20Shay&phone=3146513545
				
			});
			
		}
		
		$("#theModalContent .premadeButton").click(function(){
			var model = AppModel.getInstance();
			$.get("http://sms.globalhack.ninja/send?message=" + model.smsMessage + "&phone=" + model.smsPhone, function(data){
				//console.log(data);
				alert("Message sent");
				//close-animatedModal
				$("#animatedModal .close-animatedModal").trigger("click");
			});
		});
		
		
		$("#theModalContent .smsSendButton").click(function(){
			var model = AppModel.getInstance();
			model.smsMessage = $("#theModalContent .theMessage").val();
			$.get("http://sms.globalhack.ninja/send?message=" + model.smsMessage + "&phone=" + model.smsPhone, function(data){
				//console.log(data);
				alert("Message sent");
				//close-animatedModal
				$("#animatedModal .close-animatedModal").trigger("click");
			});
		});
		
		$("#demo01").animatedModal();
		
	}
	
	this.handlePersonClick = function(person)
	{
		alert('teaaa');
	}
	
	
    this.get('#/map/', function(context) {
		console.log("MAP");
		if(loggedIn == false)
		{
			alert("You must log in first");
			location.hash = "#/";
		}
		
		$("#step1").hide();
		$("#step2").hide();
		$("#step3").hide();
		$("#map").show();
		$("#charts").hide();
		
		//http://api.globalhack.ninja/closest_shelter?address=884+Judson+Manor&num=10
		
		var model = AppModel.getInstance();
		//console.log(model.orgData);
		//return;
		
		
		$.get("http://api.globalhack.ninja/closest_shelter?address=" + model.orgData.street_address + "&num=10", function(data){
				
			//console.log(data);
			//http://pg.globalhack.ninja/shelter?shelter_id=eq.1
			
			
			var locations = [];
			var items = [];
			var doneCount = 0;
			
			for(var i = 0; i < data.length; i++)
			{
				var theData = data[i];
				
				items["item" + theData.Shelter_Id] = theData;
				$.get("http://pg.globalhack.ninja/shelter?shelter_id=eq." + theData.Shelter_Id, function(xdata){
					//console.log("Got data----------------------");
					
					
					var sid = xdata[0].shelter_id;
					for(var x in xdata[0])
					{
						items["item" + sid][x] = xdata[0][x];
					}
					
					doneCount++;
					if(doneCount >= data.length)
					{
						for(var xx in items)
						{
							locations[locations.length] = [items[xx].Shelter_Name + "<br/>" + items[xx].street_address + ", " + items[xx].city  + " " + items[xx].state + "<br/>" + items[xx].phone, items[xx].Latitude, items[xx].Longitude];
						}
						root.createMap(locations);
					}
					
				});
				
				
			}
			
		});
		
	});
	
	
    this.createMap = function(locations)
	{
	    var map = new google.maps.Map(document.getElementById('shelterMap'), {
	      zoom: 12,
	      center: new google.maps.LatLng(38.6226,-90.1928),
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    });
		
	    var infowindow = new google.maps.InfoWindow();
		
	    var marker, i;

	    for (i = 0; i < locations.length; i++) {  
	      marker = new google.maps.Marker({
	        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	        map: map
	      });
		  
	      google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        return function() {
	          infowindow.setContent(locations[i][0]);
	          infowindow.open(map, marker);
	          }
	      })(marker, i));
	    }
	}
	
	this.get('#/charts/', function(context) {
		console.log("CHARTS");
		$("#step1").hide();
		$("#step2").hide();
		$("#step3").hide();
		$("#map").hide();
		$("#charts").show();
				   
	});
	
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
					//console.log(data[i]);
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
					$("#step2").hide();
					$("#step3").show();
					root.populatePeople(data);
				});
			});
			
			$(".shelterPeople").click(function(){
				var model = AppModel.getInstance();
				$.get("http://pg.globalhack.ninja/user?shelter_id=eq." + model.orgData.org_id, function(data){
					console.log(data);
					$("#step2").hide();
					$("#step3").show();
					root.populatePeople(data);
				});
			});
			
			
			$(".noAssocPeople").click(function(){
				$.get("http://pg.globalhack.ninja/user?shelter_id=is.null", function(data){
					console.log(data);
					$("#step2").hide();
					$("#step3").show();
					root.populatePeople(data);
				});
			});
			
			$(".newPeople").click(function(){
				
				
				var dt = moment().startOf('month');
				var theDate = dt.format("YYYY-MM-DD");
				$.get("http://pg.globalhack.ninja/user?create_dt=gte." + theDate, function(data){
					console.log(data);
					$("#step2").hide();
					$("#step3").show();
					root.populatePeople(data);
				});
				
			});
			
			$(".riskPeople").click(function(){
				
			});
			
			$(".homelessPeople").click(function(){
				$.get("http://pg.globalhack.ninja/user?homeless=is.true", function(data){
					console.log(data);
					$("#step2").hide();
					$("#step3").show();
					root.populatePeople(data);
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
						//console.log(data);
						$("#step2").hide();
						$("#step3").show();
						root.populatePeople(data);
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