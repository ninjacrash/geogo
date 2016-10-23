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
				
			var md = new MapDelegate();
			md.makeMap(data);
			
		});
		
	});
	
	
    
	
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
		
    });
});
	
	

  });

  $(function() {
    app.run('#/');
  });

})(jQuery);