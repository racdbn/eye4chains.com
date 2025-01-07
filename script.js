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

function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const copy = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    copy[key] = deepCopy(obj[key]);
  }
  return copy;
}

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

 
async function countDown(config){
	 
	
	var currentVal = document.getElementById("countDownButton").innerHTML;
	//var newVal = currentVal - 1;
	//document.getElementById("countDownButton").innerHTML = newVal;
	document.getElementById('selected-data').innerHTML = "Now it will be loading for some time. (For each address I request all tether transfer transactions from the EtherScan to find the relevant ones.  And EtherScan only gives us 10000 transaction at a time and has a 0.21 sec calldown. Maybe one day we will have our own nodes. But atm we can't since those bitches are giant in storage and bandwidth.)"
	
	reqts = []
	req1 = {};
	
	fromAddress = document.getElementById("fromAddress").value;
	casAddress = document.getElementById("toAddress").value;
	daysToCheck = document.getElementById("daysToCheck").value;
	maxPoints = document.getElementById("maxPoints").value; 
	
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
			LLL = 10
			
			// moved from python 
			
			savedTrans = []    
  
			fromAddress = fromAddress.trim();
			fromAddresses = fromAddress.toLowerCase().replace(",", " ").split(/\s+/); 

			casAddress = casAddress.trim();
			toAddresseses = casAddress.toLowerCase().replace(",", " ").split(/\s+/);
			
			
			arrDaysToCheck = daysToCheck.trim().toLowerCase().replace(",", " ").split(/\s+/);
			
			UnixTimestampNow = Math.floor(Date.now() / 1000); 			
			if(arrDaysToCheck.length == 1) 
			{
				daysToCheck = parseFloat(daysToCheck);
				
				startTimeStamp = (UnixTimestampNow - (daysToCheck * 60 * 60 * 24));
				endTimeStamp = 99999999999999;
			}
			else 
			{
				startTimeStamp = parseFloat(arrDaysToCheck[0]);
				endTimeStamp = parseFloat(arrDaysToCheck[1]);
				 
			}
			

			
 
			
			if(casAddress.length < LLL + 1)
			{
				toAddresseses = [];
				toAddresseses.push("ANY");
			}
			
			chains = ["polygon", "eth"]
			//chains = ["eth"]
			for(let ch = 0; ch < chains.length; ch++)
			{
				chain = chains[ch]
				for(let i = 0; i < fromAddresses.length; i++)
				{
					tmpfromAddress = fromAddresses[i];
					for (let j = 0; j < toAddresseses.length; j++)
					{
						tmptoAddress = toAddresseses[j];
						fromAddress = tmpfromAddress;
						toAddress = tmptoAddress
						if(fromAddress.startsWith("0x"))
							fromAddress = fromAddress.substring(2);
						if(toAddress.startsWith("0x"))
							toAddress = toAddress.substring(2);
						
						 
						endblock = 99999999999999;
						while(endblock > 0)
						{
							data222 = {fromAddress: fromAddress, toAddress: toAddress, source: "ETHERSCAN", chain: chain, endblock: endblock, endTimeStamp: endTimeStamp, startTimeStamp: startTimeStamp};
							
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
				 
							endblock = dddd["endblock"];
							
							document.getElementById('selected-data').innerHTML = document.getElementById('selected-data').innerHTML + "<br> processed" + JSON.stringify(data222);
				 
							for (let i = 0; i < dddd["trans"].length; i++) {
							  console.log("dddd[trans][i] = " +  JSON.stringify(dddd["trans"][i]));
							  savedTrans.push(dddd["trans"][i])
							}
						}

					}
				}
			}
		 
			
			 
			// end from python
			
			/*
			data222 = {}
			if(toAddress.length > LLL)
			{
				data222 = { fromAddress: fromAddress, toAddress: toAddress, daysToCheck: daysToCheck};
			}
			else
			{
				data222 = { fromAddress: fromAddress, toAddress: "", daysToCheck: daysToCheck};
			}
			*/
			

			
			savedTrans.sort((a,b) => a["timeStamp"] - b["timeStamp"]);
			resStr = ""
			topSStr = ""
			maxresStr = 1000
			sum = 0
			
			
			if(casAddress.length > LLL)
			{
				
				
				
				
				for (let i = 0; i < savedTrans.length; i++)
				{
					tr = savedTrans[i]
					dt = (new Date(tr["timeStamp"] * 1000)).toString()
					SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + ", time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ", from = " + tr["from"].toString().substring(0,7) + ", to = " + tr["to"].toString().substring(0,7) + ", hash = " + tr["hash"];
	 
					console.log(SSS);
					if(i < maxresStr)
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
				
				

			}
			else
			{
				
				
				sums = {}
				presums = {}
				
				for (let i = 0; i < savedTrans.length; i++)
				{
					tr = savedTrans[i]
					console.log("tr = " + JSON.stringify(tr))
					console.log("tr[to] = " + JSON.stringify(tr["to"]))
					if(tr["direction"] === "out")
					{
						if (!(tr["to"] in sums))
						{
							//sums[tr["to"]] = {"sum": 0.0}
							presums[tr["to"]] = {"sum": 0.0}
						}
					}
					if(tr["direction"] === "in")
					{
						if (!(tr["from"] in sums))
						{
							//sums[tr["from"]] = {"sum": 0.0}
							presums[tr["from"]] = {"sum": 0.0}
						}
					}
				}
				
				for (let i = 0; i < savedTrans.length; i++)
				{
					tr = savedTrans[i]
					if(tr["direction"] === "out")
					{
						presums[tr["to"]]["sum"] -= tr["ammountSent"];
					}
					if(tr["direction"] === "in")
					{ 
						presums[tr["from"]]["sum"] += tr["ammountSent"];
					}
				}

				presumsarr = []
				for (const key in presums) {
				   presumsarr.push({"key": key, "sum": presums[key]["sum"]})
				   
				}		

				presumsarr.sort((a,b) =>  b["sum"] * b["sum"] - a["sum"] * a["sum"]);
				grNum = Math.min(presumsarr.length, parseInt(casAddress))
				console.log("grNum = " + grNum.toString() + ",presumsarr.length " +  presumsarr.length.toString() + ", casAddress" + casAddress)		

				for(var j = 0; j < grNum; j++)
				{
					sums[presumsarr[j]["key"]] = {"sum": 0.0}
					topSStr = topSStr + presumsarr[j]["key"] + " " + presumsarr[j]["sum"] + "<br>"
				}					
				
				
				for (let i = 0; i < savedTrans.length; i++)
				{
					tr = savedTrans[i]
					dt = (new Date(tr["timeStamp"] * 1000)).toString()
					SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + ", time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ", from = " + tr["from"].toString().substring(0,7) + ", to = " + tr["to"].toString().substring(0,7) + ", hash = " + tr["hash"];
	 
					console.log(SSS);
					if(i < maxresStr)
						resStr = resStr + SSS + "<br>";
					console.log(tr["direction"])
					if(tr["direction"] === "out")
					{
						console.log("indd out")
						if(tr["to"] in sums)
							sums[tr["to"]]["sum"] -= tr["ammountSent"];
						sum -= tr["ammountSent"];
					}
					if(tr["direction"] === "in")
					{
						console.log("indd in")
						if(tr["from"] in sums)
							sums[tr["from"]]["sum"] += tr["ammountSent"];
						sum += tr["ammountSent"];
					}
					SSS = "sum = " + sum.toString()
					tr["sum"] = sum
					tr["sums"] = deepCopy(sums)
					console.log(SSS)
				}
				
				
				sumsarr = []
				for (const key in sums) {
				   sumsarr.push({"key": key, "sum": sums[key]["sum"]})
				}
				   
				sumsarr.sort((a,b) =>  b["sum"] * b["sum"] - a["sum"] * a["sum"]);
				//grNum = Math.min(sumsarr.length, parseInt(casAddress))
				//console.log("grNum = " + grNum.toString() + ",sumsarr.length " +  sumsarr.length.toString() + ", casAddress" + casAddress)
				
			}
			
				  var datetimes =  [];
				  var values = [];
				 
				  var data = new google.visualization.DataTable();
				  data.addColumn('datetime', 'Time');
				  data.addColumn('number', 'Value');				 
				  

				  
				  for (let i = 0; i < savedTrans.length; i++)
				  {
					  tr = savedTrans[i];
					  datetimes.push(new Date(tr["timeStamp"] * 1000))
					  values.push(tr["sum"])
				  
				  }
				  
				  
				  if(casAddress.length < LLL + 1)
				  {
					  for(var i = 0; i < sumsarr.length; i++)
						data.addColumn('number', sumsarr[i]["key"]);
				  }
					  
				  //console.log("savedTrans.length = " + savedTrans.length + ", maxPoints + 1 = " + (maxPoints + 1))	  
				  //console.log("sums.toString() = " + sums.toString() +"Object.keys(sums).length = " + Object.keys(sums).length + ",sumsarr = " + sumsarr.length + ",sumsarr.length = " + sumsarr.length + "presums.toString() = " + presums.toString() +"Object.keys(presums).length = " + Object.keys(presums).length  + ",presumsarr.length = " + presumsarr.length + ",grNum = " + grNum )
				  if(savedTrans.length < maxPoints + 1)
				  {
					  for (var i = 0; i < savedTrans.length; i++) 
					  {
						arr = [new Date(datetimes[i]), values[i]];
						tr = savedTrans[i]; 
						if(casAddress.length < LLL + 1)
						{ 
							for(var j = 0; j < sumsarr.length; j++)
							{
								//console.log("tr["sums"] = " + JSON.stringify(tr["sums"]))
								//console.log("tr["sums"] = " + JSON.stringify(tr["sums"]))
								arr.push(tr["sums"][sumsarr[j]["key"]]["sum"])
							}
						}
						data.addRow(arr);
					  }					  
				  }	  
				  else
				  {
					  startPoint = parseInt(savedTrans[0]["timeStamp"])
					  endPoint = parseInt(savedTrans[savedTrans.length - 1]["timeStamp"])
					  nextTime = startPoint
					  firstTrNum = []
					  for (var i = 0; i < savedTrans.length; i++) 
					  {
						tr = savedTrans[i];  
						if(tr["timeStamp"] > nextTime)
						{
							firstTrNum.push(i);
							data.addRow(arr); 
							nextTime = nextTime +  (parseFloat(endPoint) - parseFloat(startPoint)) / maxPoints
						}
						
						arr = [new Date(datetimes[i]), values[i]];
						if(casAddress.length < LLL + 1)
						{ 
							for(var j = 0; j < sumsarr.length; j++)
							{
								//console.log("tr["sums"] = " + JSON.stringify(tr["sums"]))
								//console.log("tr["sums"] = " + JSON.stringify(tr["sums"]))
								arr.push(tr["sums"][sumsarr[j]["key"]]["sum"])
							}
						}	
					  }
					  data.addRow(arr);					  
				  }				  
			

			  var options = {
				title: 'Cumulative winnings',
				curveType: 'function',
				legend: { position: 'bottom' },
				//pointSize: 5,  // Increase the size of data points
				//pointShape: 'circle', // Choose a shape for the points
				//pointColor: 'red', // Set the color of the points
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
				  if(savedTrans.length >= maxPoints + 1)
					  tr = savedTrans[firstTrNum[selection[0].row]]
				  dt = (new Date(tr["timeStamp"] * 1000)).toString()
				  SSS = tr["direction"] + " " + JSON.stringify(tr["ammountSent"]) + ", time = " +  JSON.stringify(tr["timeStamp"]) +  "(UNIX) = " + dt + ", from = " + tr["from"].toString().substring(0,7) + ", to = " + tr["to"].toString().substring(0,7) + ", hash = " + tr["hash"];
				  
				  document.getElementById('selected-data').innerHTML = "Total: " + selectedValue + "<br> Transaction info:" + SSS + "<br> All transaction data = " + JSON.stringify(tr);
				}
			  });

			  chart.draw(data, options);
			  
			  
			  
			  
			  
			
			document.getElementById('selected-data').innerHTML = "";			
			const paragraph = document.getElementById("myParagraph");
			//paragraph.innerHTML = "<p>All transactions!" + reqts[1]["fromAddress"] + "<br>" + resStr + "</p>";
			paragraph.innerHTML = "<p>"+ "Total:" + sum + "<br>" + "<br>" + topSStr + "<br>Fisrt " + maxresStr + " transactions" + "<br>" + resStr + "</p>";
			
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