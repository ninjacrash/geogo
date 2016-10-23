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
		
		
		var trace1 = {
		  x: [1, 2, 3, 4, 5],
		  y: [1, 3, 2, 3, 1],
		  mode: 'lines+markers',
		  name: 'John Doe 1',
		  line: {shape: 'linear'},
		  type: 'scatter'
		};

		var trace2 = {
		  x: [1, 2, 3, 4, 5],
		  y: [6, 8, 7, 8, 6],
		  mode: 'lines+markers',
		  name: 'John Doe 2',
		  text: [''],
		  line: {shape: 'spline'},
		  type: 'scatter'
		};

		var trace3 = {
		  x: [1, 2, 3, 4, 5],
		  y: [11, 13, 12, 13, 11],
		  mode: 'lines+markers',
		  name: 'John Doe 3',
		  line: {shape: 'vhv'},
		  type: 'scatter'
		};

		var trace4 = {
		  x: [1, 2, 3, 4, 5],
		  y: [16, 18, 17, 18, 16],
		  mode: 'lines+markers',
		  name: 'John Doe 4',
		  line: {shape: 'hvh'},
		  type: 'scatter'
		};
		
		var trace5 = {
		  x: [1, 2, 3, 4, 5],
		  y: [21, 23, 22, 23, 21],
		  mode: 'lines+markers',
		  name: 'John Doe 5',
		  line: {shape: 'vh'},
		  type: 'scatter'
		};
		
		var trace6 = {
		  x: [1, 2, 3, 4, 5],
		  y: [26, 28, 27, 28, 26],
		  mode: 'lines+markers',
		  name: 'John Doe 6',
		  line: {shape: 'hv'},
		  type: 'scatter'
		};

		var data = [trace1, trace2, trace3, trace4, trace5, trace6];

		var layout = {
		  legend: {
		    y: 0.5,
		    traceorder: 'reversed',
		    font: {size: 16},
		    yref: 'paper'
		  }};

		Plotly.newPlot('individualProgress', data, layout);
		
		
		
	}
	
	
}