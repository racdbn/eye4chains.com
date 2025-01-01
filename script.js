google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);




function revealMessage(){
	document.getElementById("hiddenMessage").style.display = "block";
 

}

/*
async function fetchHTML(url) {
  try {
    const response = await fetch(url);
    const htmlString = await response.text();
    return htmlString;
  } catch (error) {
    console.error("Error fetching HTML:", error);
    return null;
  }
}
*/

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

 
async function countDown(config){
	 
	
	var currentVal = document.getElementById("countDownButton").innerHTML;
	//var newVal = currentVal - 1;
	//document.getElementById("countDownButton").innerHTML = newVal;
	document.getElementById('selected-data').textContent = "Now it will be loading for some time. (For each address I request all tether transfer transactions from the EtherScan to find the relevant ones.  And EtherScan only gives us 10000 transaction at a time and has a 0.21 sec calldown. Maybe one day we will have our own nodes. But atm we can't since those bitches are giant in storage and bandwidth.)"
	
	reqts = []
	req1 = {};
	
	fromAddress = document.getElementById("fromAddress").value;
	toAddress = document.getElementById("toAddress").value;
	daysToCheck = document.getElementById("daysToCheck").value;
	
	//if(fromAddress.startsWith("0x") || fromAddress.startsWith("0X"))
	//	fromAddress = fromAddress.substring(2)
	//if(toAddress.startsWith("0x") || toAddress.startsWith("0X"))
	//	toAddress = toAddress.substring(2)
	
	//req1["fromAddress"] = "cB7dA2CdA654B29Fba272DA622AC96cbF1eA59b5";
	
	//req1["fromAddress"] = fromAddress
	//req1["toAddress"] =  toAddress
	//req1["direction"] = "out";
	//reqts.push(req1);
	//req2 = {};
	//req2["fromAddress"] = toAddress;
	//req2["toAddress"] = fromAddress;
	//req2["direction"] = "in";
	//reqts.push(req2);
	
	totRes = ""
	console.log("Pre loop");
	
	newStuff = true
	
	if(newStuff)
	{
		url = config.sourceSite +  config.backendPort + "/getTr";
		try 
		{
			const data222 = { fromAddress: fromAddress, toAddress: toAddress, daysToCheck: daysToCheck};
			
			const response = await fetch(url, 
			{
			  method: 'POST', // Change to POST
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(data222)
			}) 
			 
			const dddd = await response.json();
			console.log(JSON.stringify(dddd));
 
			savedTrans = []
 
			for (let i = 0; i < dddd.length; i++) {
			  console.log("dddd[i] = " +  JSON.stringify(dddd[i]));
			  savedTrans.push(dddd[i])
			}
			
			sum = 0
			savedTrans.sort((a,b) => a["timeStamp"] - b["timeStamp"]);
			resStr = ""
			
			for (let i = 0; i < savedTrans.length; i++)
			{
				tr = savedTrans[i]
				dt = (new Date(tr["timeStamp"] * 1000)).toString()
				SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + ", time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ", from = " + tr["from"].toString().substring(0,7) + ", to = " + tr["to"].toString().substring(0,7) + ", hash = " + tr["hash"];
 
				console.log(SSS);
				resStr = resStr + SSS + "<br>";
				console.log(tr["direction"])
				if(tr["direction"] === "out")
				{
					console.log("indeed out")
					sum -= tr["ammountSent"];
				}
				if(tr["direction"] === "in")
				{
					console.log("indeed in")
					sum += tr["ammountSent"];
				}
				SSS = "sum = " + sum.toString()
				tr["sum"] = sum
				console.log(SSS)
			}
			SSS = "sum = " + sum.toString()
			console.log(SSS)
			resStr = SSS +  "<br>" + resStr;
			
			
			  var datetimes =  [];
			  var values = [];
			  
			  for (let i = 0; i < savedTrans.length; i++)
			  {
				tr = savedTrans[i];
				datetimes.push(new Date(tr["timeStamp"] * 1000))
				values.push(tr["sum"])
			  }

			  var data = new google.visualization.DataTable();
			  data.addColumn('datetime', 'Time');
			  data.addColumn('number', 'Value');

			  for (var i = 0; i < datetimes.length; i++) {
				data.addRow([new Date(datetimes[i]), values[i]]);
			  }

			  var options = {
				title: 'Cumulative winnings',
				curveType: 'function',
				legend: { position: 'bottom' },
				pointSize: 5,  // Increase the size of data points
				pointShape: 'circle', // Choose a shape for the points
				pointColor: 'red', // Set the color of the points
				height: 400
			  };

			  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

			  google.visualization.events.addListener(chart, 'select', function() {
				var selection = chart.getSelection();
				if (selection.length > 0) {
				  var selectedRow = selection[0].row;
				  var selectedDate = data.getValue(selectedRow, 0);
				  var selectedValue = data.getValue(selectedRow, 1);

				  // Display the selected data in the "selected-data" div
				  
				  tr = savedTrans[selection[0].row] 
				  dt = (new Date(tr["timeStamp"] * 1000)).toString()
				  SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + ", time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ", from = " + tr["from"].toString().substring(0,7) + ", to = " + tr["to"].toString().substring(0,7) + ", hash = " + tr["hash"];
				  
				  document.getElementById('selected-data').innerHTML = "Total: " + selectedValue + "<br> Transaction info:" + SSS + "<br> All transaction data = " + JSON.stringify(tr);
				}
			  });

			  chart.draw(data, options);
			  
			  
			  
			  
			  
			
			document.getElementById('selected-data').textContent = "";			
			const paragraph = document.getElementById("myParagraph");
			//paragraph.innerHTML = "<p>All transactions!" + reqts[1]["fromAddress"] + "<br>" + resStr + "</p>";
			paragraph.innerHTML = "<p>All transactions!" + "<br>" + resStr + "</p>";
			
		} 
		catch (error) {
			console.error(`Error fetching data from ${url}:`, error);
		}
		/*	
		const url = 'http://54.94.205.151:80';
		const data = { name: 'John Doe', age: 30 };

		fetch(url, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(data => {
		  console.log('Success:', data);
		})
		.catch((error) => {
		  console.error('Error:', error);
		});
		*/
	}	
	else
	{
		
		replies = []
		/*
		const urls = []
		for(let i = 0; i < reqts.length; i++)
		{
			req = reqts[i];
			url = "https://api.polygonscan.com/api";
			url = url + "?module=account";
			url = url + "&action=tokentx";
			url = url + "&address=" + "0x" + req["fromAddress"];
			url = url + "&startblock=0";
			url = url + "&endblock=99999999";
			url = url + "&page=1";
			url = url + "&offset=10000";
			url = url + "&sort=desc";
			url = url + "&apikey=???";
			urls.push(url)
		}
					
		for (const url of urls) {
			try {
			const response = await fetch(url);
			const data = await response.json();
			replies.push(data);
			} catch (error) {
			console.error(`Error fetching data from ${url}:`, error);
			}
		}
	 
		console.log(replies);
			
		savedTrans = []	
		for(let i = 0; i < reqts.length; i++) 
		{
			req = reqts[i];
	 
			ourTargetAddress = req["toAddress"].toLowerCase();
			tetherContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".toLowerCase();
			sendFunctionCode = "0xa9059cbb000000000000000000000000".toLowerCase();

			AllTrans = replies[i]["result"];
			console.log("AllTrans = " + JSON.stringify(AllTrans));

			for(let j = 0; j < AllTrans.length; j++) 
			{
				tr = AllTrans[j];
				console.log(JSON.stringify(tr));
				console.log(tr["from"].toLowerCase());
				
				if(tr["from"].toLowerCase() == "0x" + req["fromAddress"].toLowerCase())
				{
					console.log("fromAddress +++")
					if(tr["contractAddress"]== tetherContract)
					{
						console.log("tether +++")
						input = tr["input"]
						  
						targetAddress = tr["to"].toLowerCase()
						if (targetAddress == ("0x" + ourTargetAddress))
						{
							console.log("targetAddress +++")
							ammountSent = parseInt(tr["value"])  *  Math.pow(0.1, parseInt(tr["tokenDecimal"]));  
							console.log("ammountSent = " + JSON.stringify(ammountSent))
							savedTrans.push(tr)
							savedTrans[ savedTrans.length - 1]["ammountSent"] = ammountSent  
							console.log("savedTrans[savedTrans.length - 1][ammountSent] = " +  JSON.stringify(savedTrans[savedTrans.length - 1]["ammountSent"]))
							savedTrans[savedTrans.length - 1]["direction"] = req["direction"]
						}
						else
						{
							console.log("targetAddress ---")
							console.log("targetAddress = " + targetAddress)
							console.log("ourTargetAddress = " + ourTargetAddress)
						}
					}		
					else
						console.log("tether ---")
				}
				else
					console.log("fromAddress ---")	
			}	 
		}	

		sum = 0
		savedTrans.sort((a,b) => a["timeStamp"] - b["timeStamp"]);
		resStr = ""
		
		for (let i = 0; i < savedTrans.length; i++)
		{
			tr = savedTrans[i]
			dt = (new Date(tr["timeStamp"] * 1000)).toString()
			SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + "( time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ")" + ", from = " + tr["from"] + ", to = " + tr["to"] + ",hash = " + tr["hash"];
			console.log(SSS);
			resStr = resStr + SSS + "<br>";
			console.log(tr["direction"])
			if(tr["direction"] === "out")
			{
				console.log("indeed out")
				sum -= tr["ammountSent"];
			}
			if(tr["direction"] === "in")
			{
				console.log("indeed in")
				sum += tr["ammountSent"];
			}
			
			SSS = "sum = " + sum.toString()
			tr["sum"] = sum
			console.log(SSS)
		}
		SSS = "sum = " + sum.toString()
		console.log(SSS)
		resStr = resStr + SSS + "<br>";
		
		
		  var datetimes =  [];
		  var values = [];
		  
		  for (let i = 0; i < savedTrans.length; i++)
		  {
			tr = savedTrans[i];
			datetimes.push(new Date(tr["timeStamp"] * 1000))
			values.push(tr["sum"])
		  }

		  var data = new google.visualization.DataTable();
		  data.addColumn('datetime', 'Time');
		  data.addColumn('number', 'Value');

		  for (var i = 0; i < datetimes.length; i++) {
			data.addRow([new Date(datetimes[i]), values[i]]);
		  }

		  var options = {
			title: 'Cumulative winnings',
			curveType: 'function',
			legend: { position: 'bottom' },
			pointSize: 5,   
			pointShape: 'circle',  
			pointColor: 'red', 
			height: 400
		  };

		  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

		  google.visualization.events.addListener(chart, 'select', function() {
			var selection = chart.getSelection();
			if (selection.length > 0) {
			  var selectedRow = selection[0].row;
			  var selectedDate = data.getValue(selectedRow, 0);
			  var selectedValue = data.getValue(selectedRow, 1);

			   
			  document.getElementById('selected-data').textContent = "Selected Date: " + selectedDate.toLocaleDateString() + 
																  "\nSelected Value: " + selectedValue;
			}
		  });

		  chart.draw(data, options);
		
		document.getElementById('selected-data').textContent = "";
		const paragraph = document.getElementById("myParagraph");
		paragraph.innerHTML = "<p>All transactions!" + reqts[1]["fromAddress"] + "<br>" + resStr + "</p>";
		*/
	}
}