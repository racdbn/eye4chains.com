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


function sleepVen(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function prpr(ss) 
{
	//document.getElementById('selected-data').innerHTML += ss;
	document.getElementById('selected-data').innerHTML = ss;
}

async function getTransfersBlockscout(data)
{
	//document.getElementById('selected-data').innerHTML = document.getElementById('selected-data').innerHTML + "<br> processed" + ERRORMSG + JSON.stringify(data222);
	//document.getElementById('selected-data').innerHTML = document.getElementById('selected-data').innerHTML + " tron retriever is under construction";
	
	//return {"test": "testTTT", "trans": []};
	
	let CONTRACT_ADDRESS;
	let API_ENDPOINT;
	 
	//((chain == "eth") || (chain == "base") || (chain == "arbOne")|| (chain == "optimism")
	const chain = data["chain"]

	if(chain == "eth")
		API_ENDPOINT = "https://eth.blockscout.com/api";	
	if(chain == "base")
		API_ENDPOINT = "https://base.blockscout.com/api";	
	if(chain == "arbOne")
		API_ENDPOINT = "https://arbitrum.blockscout.com/api";	
	if(chain == "optimism")
		API_ENDPOINT = "https://optimism.blockscout.com/api";
	
	if(chain == "eth")
	{
		if(data["token"] == "usdt")
			CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
		if(data["token"] == "usdc")
			CONTRACT_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
	}	
	if(chain == "base")
	{
		if(data["token"] == "usdt")
			CONTRACT_ADDRESS = "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2";
		if(data["token"] == "usdc")
			CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
	}	
	if(chain == "arbOne")
	{
		if(data["token"] == "usdt")
			CONTRACT_ADDRESS = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
		if(data["token"] == "usdc")
			CONTRACT_ADDRESS = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";
	}	
	if(chain == "optimism")
	{
		if(data["token"] == "usdt")
			CONTRACT_ADDRESS = "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";
		if(data["token"] == "usdc")
			CONTRACT_ADDRESS = "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85";
	}
	
	
	address = data["fromAddress"];
	
	const params = new URLSearchParams({
		module: "account",
		action: "tokentx",
		contractaddress: CONTRACT_ADDRESS,
		address: "0x" + address,
		page: 1,
		offset: 1000,
		//startblock: data['startblock'],
		//endblock: data['endblock'],
		sort: "desc",
		only_confirmed: "true",
	});

	
	//document.getElementById('selected-data').innerHTML += "fromAddress = " + data["fromAddress"] + ",toAddress = " + data["toAddress"] + ","
	//document.getElementById('selected-data').innerHTML += "DPASDJPOWSA"
	
	
	


    let allTrans = [];
    let status1 = "";
    let fingerprint;
	let responses = [];
	let urls = [];
	let datas = [];
	
	document.getElementById('selected-data').innerHTML += "Getting " + + " transfers";
	document.getElementById('selected-data').innerHTML += "params = " + params.toString();
 
	let page = 1 
    while (status1 !== "doneFetching") 
	{
        let retriesLeft = 3;
        status1 = "startingRequests";
        let dddd;
		
        while (retriesLeft > 0) 
		{
            try {
				params.set("page", page);
                const url = `${API_ENDPOINT}?${params}`;
                //const url = API_ENDPOINT + "?" + params.toString();
				document.getElementById('selected-data').innerHTML += "page = [" + page + "]";
				document.getElementById('selected-data').innerHTML += "url = [" + url + "]";
                
                const response = await fetch(url);
				
				//const data3333 = await response.json();
				//datas.push(data3333);
				

				
				
				responses.push(response);

				
				//document.getElementById('selected-data').innerHTML += "response = [" + response + "]";
				urls.push(url);
				 
				//document.getElementById('selected-data').innerHTML += "response = " + JSON.stringify(response.json());
				console.log("response");
				console.log(response);
				

				
				
                //if (!response.ok) 
				//{
                //    status1 = "response not .ok";
                //    document.getElementById('selected-data').innerHTML += 
                //        `Error: HTTP ${response.status}\n`;
                //    retriesLeft--;
                //    await sleepVen(210);
                //    continue;
                //}
				


                const predata = await response.json();
				

				
                dddd = predata.result || [];
				datas.push(dddd);
				//return {
				//	trans: allTrans,
				//	kickedByAPIReason: status1,
				//	responses: responses,
				//	datas: datas,
				//	urls: urls
				//};
				//document.getElementById('selected-data').innerHTML += "dddd = " + JSON.stringify(dddd);
				
				
				
				//return {
				//	trans: allTrans,
				//	kickedByAPIReason: status1,
				//	responses: responses,
				//	datas: datas,
				//	urls: urls
				//};				
				
				//document.getElementById('selected-data').innerHTML += "PPPPPPPPPP"
			
				if(dddd.length == 0)
				{
					status1 = "doneFetching";
					break;
				}
				else 
				{
					Last = dddd.length - 1;
					if(parseInt(dddd[Last]["timeStamp"]) < parseInt(dddd["startTimeStamp"]))
					{
						status1 = "doneFetching";
						break;
					}
				}
				
				//document.getElementById('selected-data').innerHTML += "EEEEEEEEE"
				
                status1 = "fetchedCorr";
                break;
 
            } catch (error) {
                document.getElementById('selected-data').innerHTML += 
                    `Error: ${error.message}\n`;
                retriesLeft--;
                await sleepVen(500);
            }
        }
		
		page += 1
		
		//document.getElementById('selected-data').innerHTML += "SSSSSSSSSSSSSS status1 = " + status1;

        if (status1 !== "fetchedCorr") {
            allTrans.sort((a, b) => a.timeStamp - b.timeStamp);
			
			document.getElementById('selected-data').innerHTML += "\n ON RETURN allTrans.length.toString() = [" + allTrans.length.toString() + "]"
			
            return {
                trans: allTrans,
                kickedByAPIReason: status1,
				responses: responses,
				urls: urls
            };
        }
		//document.getElementById('selected-data').innerHTML += "QQQQQQQQQQQQQQQQQQ data = " + JSON.stringify(dddd);
		
		for(let i = 0; i < dddd.length; i++)
		{
			tr = dddd[i];
			if(parseInt(tr["timeStamp"]) < parseInt(data["endTimeStamp"]))
				if(parseInt(tr["timeStamp"]) > parseInt(data["startTimeStamp"]))
					allTrans.push(tr);
		}
		//document.getElementById('selected-data').innerHTML += "TTT4TTTTallTrans = " + JSON.stringify(allTrans);
		//document.getElementById('selected-data').innerHTML += "\n" + allTrans.length.toString()
		//document.getElementById('selected-data').innerHTML += "\n allTrans.length.toString() = [" + allTrans.length.toString() + "]"
    }
	 	
}

async function getTronTransfers(data) {
	//document.getElementById('selected-data').innerHTML = document.getElementById('selected-data').innerHTML + "<br> processed" + ERRORMSG + JSON.stringify(data222);
	//document.getElementById('selected-data').innerHTML = document.getElementById('selected-data').innerHTML + " tron retriever is under construction";
	
	//return {"test": "testTTT", "trans": []};
	
	let CONTRACT_ADDRESS;
	let API_ENDPOINT;
	 
 
	API_ENDPOINT = "https://api.trongrid.io/v1/accounts/{address}/transactions/trc20";
	
	if(data["token"] == "usdt")
		CONTRACT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
	if(data["token"] == "usdc")
		CONTRACT_ADDRESS = "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8";
	
	const params = new URLSearchParams({
		contract_address: CONTRACT_ADDRESS,
		limit: 200,
		only_confirmed: "true",
		min_timestamp: parseInt(data["startTimeStamp"]) * 1000,
		max_timestamp: parseInt(data["endTimeStamp"]) * 1000
	});
	
	//document.getElementById('selected-data').innerHTML += "fromAddress = " + data["fromAddress"] + ",toAddress = " + data["toAddress"] + ","
	//document.getElementById('selected-data').innerHTML += "DPASDJPOWSA"
	address = data["fromAddress"];
	
	


    let allTrans = [];
    let status1 = "";
    let fingerprint;
	
	document.getElementById('selected-data').innerHTML += "Getting tron transfers";
	
 

    while (status1 !== "doneFetching") {
        let retriesLeft = 3;
        status1 = "startingRequests";
        let dddd;
        while (retriesLeft > 0) {
            try {
                const url = `${API_ENDPOINT.replace("{address}", address)}?${params}`;
                
                // Use CORS proxy to bypass restrictions
                // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
				// proxyUrl + 
                const response = await fetch(url, {
                    headers: {
                        // Add API key here if you have one
                        // "TRON-PRO-API-KEY": "YOUR_KEY"
                    }
                });
				
				//document.getElementById('selected-data').innerHTML += "211111111111111111111111111111122211";
				document.getElementById('selected-data').innerHTML += "params = " + params.toString();
				//document.getElementById('selected-data').innerHTML += "response = " + JSON.stringify(response);
				//console.log("response");
				//console.log(response);

                if (!response.ok) {
                    status1 = "codeNot200";
                    document.getElementById('selected-data').innerHTML += 
                        `Error: HTTP ${response.status}\n`;
                    retriesLeft--;
                    await sleepVen(210);
                    continue;
                }

                const predata = await response.json();
                dddd = predata.data || [];
                fingerprint = predata.meta?.fingerprint;

                if (!fingerprint) {
                    document.getElementById('selected-data').innerHTML += 
                        `No fingerprint, retries left: ${retriesLeft}\n`;
                    status1 = "noFingerprint";
                    retriesLeft--;
                    await sleepVen(500);
                } else {
                    params.set("fingerprint", fingerprint);
                    status1 = "fetchedCorr";
                    break;
                }
            } catch (error) {
                document.getElementById('selected-data').innerHTML += 
                    `Error: ${error.message}\n`;
                retriesLeft--;
                await sleepVen(500);
            }
        }

        if (status1 !== "fetchedCorr") {
            if (status1 === "noFingerprint") {
                allTrans = [...allTrans, ...dddd];
            }
            allTrans.sort((a, b) => a.block_timestamp - b.block_timestamp);
			
			document.getElementById('selected-data').innerHTML += "\n ON RETURN allTrans.length.toString() = [" + allTrans.length.toString() + "]"
			
            return {
                trans: allTrans,
                kickedByAPIReason: status1
            };
        }

        allTrans = [...allTrans, ...dddd];
		//document.getElementById('selected-data').innerHTML += "\n" + allTrans.length.toString()
		document.getElementById('selected-data').innerHTML += "\n allTrans.length.toString() = [" + allTrans.length.toString() + "]"
    }
	 
}

 
async function countDown(config){
	
 
	
	var currentVal = document.getElementById("countDownButton").innerHTML;
	//var newVal = currentVal - 1;
	//document.getElementById("countDownButton").innerHTML = newVal;
	sss = "loading..."
	//sss = "Now it will be loading for some time. (For each address I request all tether transfer transactions from the EtherScan to find the relevant ones.  And EtherScan only gives us 10000 transaction at a time and has a 0.21 sec calldown. Maybe one day we will have our own nodes. But atm we can't since those bitches are giant in storage and bandwidth.) <br> In the case if nothing happens for a couple of minutes this means that the site is probably broken. Feel free to DM me."
	//document.getElementById('selected-data').innerHTML = sss;
	prpr(sss);
	
	
	reqts = []
	req1 = {};
	
	fromAddress = document.getElementById("fromAddress").value;
	casAddress = document.getElementById("toAddress").value;
	daysToCheck = document.getElementById("daysToCheck").value;
	maxPoints = document.getElementById("maxPoints").value; 
	network = document.getElementById("network").value;
	
	tokens2track = document.getElementById("tokens2track").value;
	 
	
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
    
    const hostname = window.location.hostname;
    console.log(hostname);  
    document.getElementById("myParagraph").innerHTML +=  "hostname = [" + hostname + "]";
    let prefix = ""
    if(hostname.includes("www."))
        prefix = "www."
    document.getElementById("myParagraph").innerHTML +=  "prefix = [" + prefix + "]";
    
	
	if(newStuff)
	{

		url = config.sourceSite +  config.backendPort + "/getTr";
        url = str.replace("://", "://" + prefix);
        document.getElementById("myParagraph").innerHTML +=  "url = [" + url + "]";
		try 
		{
			LLL = 10
			
			// moved from python 
			
			savedTrans = []    
			
			
			fromAddress = fromAddress.trim();
			if(!(network == "tron"))
				 fromAddress = fromAddress.toLowerCase()
			fromAddresses = fromAddress.replace(",", " ").split(/\s+/); 

			casAddress = casAddress.trim();
			if(!(network == "tron"))
				casAddress = casAddress.toLowerCase();
			toAddresseses = casAddress.replace(",", " ").split(/\s+/);
			
			
			arrDaysToCheck = daysToCheck.trim().toLowerCase().replace(",", " ").split(/\s+/);
			
			UnixTimestampNow = Math.floor(Date.now() / 1000); 			
			if(arrDaysToCheck.length == 1) 
			{
				daysToCheck = parseFloat(daysToCheck);
				
				startTimeStamp = (UnixTimestampNow - (daysToCheck * 60 * 60 * 24));
				endTimeStamp = UnixTimestampNow;
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
			
			if(network == "eth+L2s+bsc")
				chains = ["polygon", "eth", "bsc", "base", "arbOne", "optimism"]
			else
			{
				chains = []
				chains.push(network)
			}
			

			
			//chains = ["eth"]
			for(let ch = 0; ch < chains.length; ch++)
			{
				chain = chains[ch]
				
				if(tokens2track == "stables")
					tokens = ["usdt", "usdc"]
				else
				{
					tokens = []
					tokens.push(tokens2track)
				}
				
				for(let tt = 0; tt < tokens.length; tt++)
				{
					token = tokens[tt]
					for(let i = 0; i < fromAddresses.length; i++)
					{
						tmpfromAddress = fromAddresses[i];
						for (let j = 0; j < toAddresseses.length; j++)
						{
							tmptoAddress = toAddresseses[j];
							fromAddress = tmpfromAddress;
							toAddress = tmptoAddress
							if(!(network == "tron"))
							{
								if(fromAddress.startsWith("0x"))
									fromAddress = fromAddress.substring(2);
								if(toAddress.startsWith("0x"))
									toAddress = toAddress.substring(2);
							}
							
							 
							endblock = 99999999999999;
							let dddd = {"status": "not fetched"};

									
								if((chain !== "tron") && (chain !== "eth") && (chain !== "base")&& (chain !== "arbOne") && (chain !== "optimism")) 
								{	
									while(endblock > 0)
									{
										data222 = {fromAddress: fromAddress, toAddress: toAddress, chain: chain, endblock: endblock, endTimeStamp: endTimeStamp, startTimeStamp: startTimeStamp, "token": token};
										data222["source"] = "ETHERSCAN"
										
										
										const response = await fetch(url, 
										{
										  method: 'POST', // Change to POST
										  headers: {
											'Content-Type': 'application/json'
										  },
										  body: JSON.stringify(data222)
										}) 
										 
										dddd = await response.json();
										console.log(JSON.stringify(dddd));
							 
										endblock = dddd["endblock"];
										
										ERRORMSG = ""
										if("error" in dddd)
											ERRORMSG  = " with ERROR=[" + dddd["error"] + "] ";
										
										document.getElementById('selected-data').innerHTML += "<br> processed" + ERRORMSG + JSON.stringify(data222);
										
										if ("error" in dddd)
											break;
										
										for (let i = 0; i < dddd["trans"].length; i++) {
										  console.log("dddd[trans][i] = " +  JSON.stringify(dddd["trans"][i]));
										  savedTrans.push(dddd["trans"][i])
										}
									}
								}
								else // chain == "tron" or "eth" or L2s expt poly
								{
									
									data222 = {fromAddress: fromAddress, toAddress: toAddress, chain: chain, endblock: endblock, endTimeStamp: endTimeStamp, startTimeStamp: startTimeStamp, "token": token};
									//if(chain == "tron")
									//	data222["source"] = "TronGrid"
									//if(chain == "eth")
									//	data222["source"] = "blockscout"
									if(chain == "tron")
									{
										try {
											dddd = await getTronTransfers(data222);
										}catch (error) {
										document.getElementById('selected-data').innerHTML += `Critical error: ${error.message}`;
										}
									}
									if((chain == "eth") || (chain == "base") || (chain == "arbOne")|| (chain == "optimism"))
									{
										try {
											dddd = await getTransfersBlockscout(data222);
										}catch (error) {
										document.getElementById('selected-data').innerHTML += `Critical error: ${error.message}`;
										}
									}
									document.getElementById('selected-data').innerHTML += "RRRRRRRRRRRRRRR " + JSON.stringify(data222);
									
									document.getElementById('selected-data').innerHTML += "<br> dddd = " + JSON.stringify(dddd);
 
									for(let i = 0; i < dddd["trans"].length; i++)
									{
										tr = dddd["trans"][i];
							 
										if(chain == "tron")
										{
											if(tr["from"] == data222["fromAddress"])
												if((tr["to"] == data222["toAddress"]) || (data222["toAddress"].toLowerCase() == "any"))
													tr["direction"] = "out";
								 
								 
											if(tr["to"] == data222["fromAddress"])
												if((tr["from"] == data222["toAddress"]) || (data222["toAddress"].toLowerCase() == "any"))
													tr["direction"] = "in";
										}
										else
										{
											if(tr["from"].toLowerCase() == "0x" + data222["fromAddress"].toLowerCase())
												if((tr["to"].toLowerCase() == "0x" + data222["toAddress"].toLowerCase()) || (data222["toAddress"].toLowerCase() == "any"))
													tr["direction"] = "out";
								 
								 
											if(tr["to"].toLowerCase() == "0x" + data222["fromAddress"].toLowerCase())
												if((tr["from"].toLowerCase() == "0x" + data222["toAddress"].toLowerCase()) || (data222["toAddress"].toLowerCase() == "any"))
													tr["direction"] = "in";	
										}
											
										
										
										if(chain == "tron")
										{
											ammountSent = parseInt(tr["value"])  *  (0.1 ** parseInt(tr["token_info"]["decimals"]));
										}
										else
										{
											ammountSent = parseInt(tr["value"])  *  (0.1 ** parseInt(tr["tokenDecimal"]));
										}
										
										tr["ammountSent"] = ammountSent;
									}
							 

									//const API_ENDPOINT = "https://api.trongrid.io/v1/accounts/{address}/transactions/trc20";
									//const CONTRACT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
									for (let i = 0; i < dddd["trans"].length; i++) {
										
									  console.log("dddd[trans][i] = " +  JSON.stringify(dddd["trans"][i]));
									  //document.getElementById('selected-data').innerHTML += "dddd['trans'].length = [" + dddd["trans"].length + "]";
									  document.getElementById('selected-data').innerHTML += "dddd" + dddd.toString();
									  if(chain == "tron")
									  {
										if(dddd["trans"][i]["type"] == "Transfer")
											savedTrans.push(dddd["trans"][i])
									  }
									  else
										savedTrans.push(dddd["trans"][i])
									}
									
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
			

			
			
			resStr = ""
			topSStr = ""
			maxresStr = 1000
			sum = 0
			
			for (let i = 0; i < savedTrans.length; i++)
			{
				tr = savedTrans[i]
				if("block_timestamp" in tr)
					tr["timeStamp"] = (parseInt(tr["block_timestamp"]) / 1000).toString();
				if("transaction_id" in tr)
					tr["hash"] = tr["transaction_id"]
				

			}
			
			savedTrans.sort((a,b) => parseInt(a["timeStamp"]) - parseInt(b["timeStamp"]));
			
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
				  
				  document.getElementById('selected-data').innerHTML = "Total: " + selectedValue + "<br> Transaction info:" + SSS + "<br> All transaction data = " + JSON.stringify(tr) + document.getElementById('selected-data').innerHTML;
				}
			  });

			  chart.draw(data, options);
			  
			  
			  
			  
			  
			
			//document.getElementById('selected-data').innerHTML = "";			
			prpr("");
			
			const paragraph = document.getElementById("myParagraph");
			//paragraph.innerHTML = "<p>All transactions!" + reqts[1]["fromAddress"] + "<br>" + resStr + "</p>";
			paragraph.innerHTML = "<p>"+ "TOTAL:" + sum + "<br>" + "<br>" + topSStr + "<br>First " + maxresStr + " transactions" + "<br>" + resStr + "</p>";
			
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