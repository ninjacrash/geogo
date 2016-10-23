class MapDelegate
{
	constructor()
	{
		
	}
	
    createMap(locations)
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
	
	makeMap(data)
	{
		var root = this;
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
					var adiv = "";
					for(var xx in items)
					{
						locations[locations.length] = [items[xx].Shelter_Name + "<br/>" + items[xx].street_address + ", " + items[xx].city  + " " + items[xx].state + "<br/>" + items[xx].phone, items[xx].Latitude, items[xx].Longitude];
						adiv = "<br/><div class='shelterLocation'>";
						adiv += "	<div class='shelterLabel'>" + items[xx].Shelter_Name + "</div>";
						adiv += "	<div class='shelterLabel'>" + items[xx].street_address + ", " + items[xx].city + ", " + items[xx].state + "</div>";
						adiv += "	<div class='shelterLabel'>" + items[xx].phone + "</div><br/>";
						$("#shelterList").append($(adiv));
					}
					root.createMap(locations);
				}
				
			});
			
			
		}
	}
	
}