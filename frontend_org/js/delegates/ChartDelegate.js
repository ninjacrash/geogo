class ChartDelegate
{
	constructor()
	{
		
	}
	
	createRecidivismChart()
	{
		var trace1 = {
		  x: [1, 2, 3, 4],
		  y: [10, 15, 13, 17],
		  type: 'scatter',
			name: 'total homeless'
		};

		var trace2 = {
		  x: [1, 2, 3, 4],
		  y: [16, 5, 11, 9],
		  type: 'scatter',
			name: 'homeless in shelters'
		};

		var data = [trace1, trace2];

		Plotly.newPlot('numberOfPeopleInShelter', data);
	}
	
	
}