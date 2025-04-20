from flask import Flask, request, jsonify
import requests
import json
import sys
import os 
 
sys.path.insert(0, os.path.abspath(".."))
os.environ['TEMP'] = 'C:\\TEMP'  
from secretsGG import *
 
import time 
from datetime import datetime
 

POLYGONSCAN_API_KEY = os.environ.get('POLYGONSCAN_API_KEY', POLYGONSCAN_API_KEY)
POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS = os.environ.get('POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS', POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS)

ETHERSCAN_API_KEY = os.environ.get('ETHERSCAN_API_KEY', ETHERSCAN_API_KEY)
ETHERSCAN_SLEEP_BETWEEN_REQUESTS_SECS = os.environ.get('ETHERSCAN_SLEEP_BETWEEN_REQUESTS_SECS', ETHERSCAN_SLEEP_BETWEEN_REQUESTS_SECS)

GAMBLING_GRAPH_BACKEND_PORT = os.environ.get('GAMBLING_GRAPH_BACKEND_PORT', GAMBLING_GRAPH_BACKEND_PORT)  

SOURCE_FOR_CORS = os.environ.get('SOURCE_FOR_CORS', SOURCE_FOR_CORS)

app = Flask(__name__)

def printSMT(s):
    ss = "PSMT " + s
    #print(ss)
    
def printWLOG(logf,s):
    print(s)  
    print(s, file=logf)
        
    
def aboveStart(tr, req):
    if(req["startblock"] < 0):
        if int(tr["timeStamp"]) >= req["startTimeStamp"]:
            return True
        else: 
            return False
    else:
        if int(tr["blockNumber"]) >= req["startblock"]:
            return True
        else:
            return False
        

   
@app.route("/api/getTr", methods = ["POST", "OPTIONS"])
def getTr():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200, {
            "Access-Control-Allow-Origin": SOURCE_FOR_CORS,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept"
        }
        
         
        
    req = request.get_json()
     
    endblock = req["endblock"]
    #UnixTimestampNow = req["UnixTimestampNow"]
    #daysToCheck = req["daysToCheck"]
    
    toManyTrans = False
    
    savedTrans = []
    
    now = datetime.now()
    
    tnow = now.strftime("%Y-%m-%d_%H-%M-%S")
    log_file = open("..\\RacdbnLogs\\" + tnow + '.log', 'a')
    
    while(True):
        if(len(savedTrans) > 10000):
            toManyTrans = True
            break
    
        timeToQuite = False
        
        
        #if req["source"] == "POLYGONSCAN":
        #    url = "https://api.polygonscan.com/api"
        #    url = url + "?module=account"
        #    url = url + "&action=tokentx"
        #    url = url + "&address=" + "0x" + req['fromAddress']
        #    url = url + "&startblock=0"
        #    url = url + "&endblock=" + str(endblock)
        #    url = url + "&page=1"
        #    url = url + "&offset=10000"
        #    url = url + "&sort=desc"
        #    url = url + "&apikey=" + POLYGONSCAN_API_KEY
        #     
        #    
        #    tokenContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".lower()
            
        #if req["source"] == "TRONSCAN":   
        #    if(req["token"] == "usdt"):
        #        tokenContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
        #    if(req["token"] == "usdc"):
        #        tokenContract = "".lower()    
        #        
        #    url = "https://apilist.tronscanapi.com/api/token_trc20/transfers?"
        #    url = url + "&start=0"
        #    url = url + "&endblock=" + str(endblock)
        #    url = url + "&limit=10000"
        #    url = url + "&contract_address=" + tokenContract
        #    url = url + "&relatedAddress=" + "0x" + req['fromAddress']
        #    url = url + "&page=1"
        #    url = url + "&apikey=" + TRONSCAN_API_KEY
        
            
        if req["source"] == "ETHERSCAN":  
            if(req["token"] == "token by contract address"):
                tokenContract = req["tokenAddress"].lower()
                
            if req["chain"] == "polygon":
                if(req["token"] == "usdt"):
                    tokenContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".lower()
                if(req["token"] == "usdc"):
                    tokenContract = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359".lower()
                chainid = 137
            
            if req["chain"] == "bsc":
                if(req["token"] == "usdt"):
                    tokenContract = "0x55d398326f99059fF775485246999027B3197955".lower()                
                if(req["token"] == "usdc"):
                    tokenContract = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d".lower()
                chainid = 56
                
            if req["chain"] == "base":
                if(req["token"] == "usdt"):
                    tokenContract = "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2".lower()                
                if(req["token"] == "usdc"):
                    tokenContract = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".lower()
                chainid = 8453
            
            if req["chain"] == "arbOne":
                if(req["token"] == "usdt"):
                    tokenContract = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9".lower()                
                if(req["token"] == "usdc"):
                    tokenContract = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831".lower()
                chainid = 42161
            
            if req["chain"] == "eth":  
                if(req["token"] == "usdt"):
                    tokenContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7".lower()
                if(req["token"] == "usdc"):
                    tokenContract = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48".lower()    
                chainid = 1
            
            
            
            url = "https://api.etherscan.io/v2/api"
            url = url + "?chainid=" + str(chainid)
            url = url + "&module=account"
            
            
            if(req["token"] == "main token of the chain"):
                url = url + "&action=txlist"
            else: 
              if(req["token"] == "main token of the chain (internal)"):
                url = url + "&action=txlistinternal"
              else:     
                  url = url + "&action=tokentx"
                  url = url + "&contractaddress=" + tokenContract
                  
               
            url = url + "&address=" + "0x" + req['fromAddress']
            url = url + "&page=1"
            url = url + "&offset=10000"
            url = url + "&startblock=0"
            url = url + "&endblock=" + str(endblock)
            url = url + "&sort=desc"
            url = url + "&apikey=" + ETHERSCAN_API_KEY
                
        printWLOG(log_file,"req[chain] = " + str(req["chain"]))
 
        printWLOG(log_file,"requesting " + req["source"] + " " + req["chain"] + " " + req['fromAddress'] + ", endblock = " + str(endblock))
        
        printWLOG(log_file,"requesting(full) " + json.dumps(req))
        
        retriesNum = 3
        for i in range(retriesNum):
            response = requests.get(url)
            printWLOG(log_file,"response = " + str(response))
            printWLOG(log_file,f"fresponse = {response}") 
            rrr = response.json()
            printWLOG(log_file,"rrr = " + str(rrr)) 
            if(response.json()['message']).startswith('Unexpected error'):
                if(i < retriesNum - 1):
                    time.sleep(5 * ETHERSCAN_SLEEP_BETWEEN_REQUESTS_SECS)
                else:
                  res = jsonify({"trans": savedTrans, "endblock": endblock, "error": "End point unexpected error"})   
            else:
                break 

        AllTrans = rrr.get("result")
        printSMT("AllTrans = " + str(AllTrans))

    
        tmpEndblock = endblock
        tmpSavedTrans = []
    
        for tr in AllTrans:
            printSMT(" ")
            printSMT(str(tr))
            tmpEndblock = int(tr["blockNumber"])
            
            CorrectAddress = False
            
            if(tr["from"].lower() == "0x" + req["fromAddress"].lower()):
                if (tr["to"].lower() == ("0x" + req["toAddress"].lower())) or req["toAddress"].lower() == "any":
                    tr["direction"] = "out"
                    CorrectAddress = True
                    
            if(tr["to"].lower() == "0x" + req["fromAddress"].lower()):
                if (tr["from"].lower() == ("0x" + req["toAddress"].lower())) or req["toAddress"].lower() == "any":
                    tr["direction"] = "in"
                    CorrectAddress = True     
            printSMT("req[ toAddress ].lower() = " + req["toAddress"].lower())
            if  CorrectAddress:       
                correctToken = False
                
                if(req["token"] == "main token of the chain") or (req["token"] == "main token of the chain (internal)"):
                    correctToken = True
                else:
                    if req["chain"] == "eth":
                        correctToken = True
                    else:
                        if(tr.get("contractAddress")== tokenContract):
                            correctToken = True
                        else:
                            printSMT("tether ---")
 
                if(correctToken):
                    printSMT("tether +++")
                    
                    if(req["token"] == "main token of the chain") or (req["token"] == "main token of the chain (internal)"):
                        decimals = 18
                    else:
                        decimals = int(tr['tokenDecimal'])
                    ammountSent = int(tr['value'])  *  (0.1 ** decimals)
                    printSMT("ammountSent = " + str(ammountSent))
                    
                    tmpSavedTrans.append(tr)
                    tmpSavedTrans[len(tmpSavedTrans) - 1]['ammountSent'] = ammountSent  
                    printSMT("tmpSavedTrans[len(tmpSavedTrans) - 1]['ammountSent'] = " + str(tmpSavedTrans[len(tmpSavedTrans) - 1]['ammountSent']))
 
            else:
                printSMT("fromAddress ---")
               
        for tr in tmpSavedTrans: 
            if int(tr["blockNumber"]) > tmpEndblock:
                #if UnixTimestampNow - int(tr["timeStamp"]) < daysToCheck * 60 * 60 * 24:
                if int(tr["timeStamp"]) >= req["startTimeStamp"]:
                    if int(tr["timeStamp"]) <= req["endTimeStamp"]:
                        savedTrans.append(tr) 
                else:
                    timeToQuite = True
                
        time.sleep(ETHERSCAN_SLEEP_BETWEEN_REQUESTS_SECS)
        
        if (timeToQuite or (tmpEndblock == endblock)): # TODO +-1
            for tr in tmpSavedTrans: 
                if int(tr["blockNumber"]) == tmpEndblock:
                    if int(tr["timeStamp"]) >= req["startTimeStamp"]:
                        if int(tr["timeStamp"]) <= req["endTimeStamp"]:
                            savedTrans.append(tr) 
            break
        else:
            endblock = tmpEndblock
    

    #sum = 0
    #savedTrans = sorted(savedTrans, key=lambda x: int(x["timeStamp"]))
    #for tr in savedTrans:
    #    print(tr['direction'] + " " + str(tr["ammountSent"]) + "( time = " + str(tr["timeStamp"]) + ")")
    #    if tr['direction'] == "out":
    #        sum -= tr["ammountSent"]
    #    if tr['direction'] == "in":
    #        sum += tr["ammountSent"]
    #print("sum = " + str(sum))
    
    printWLOG(log_file,"Sending shit to the client")
    log_file.close()
    if not toManyTrans:
        endblock = -1
    
    res = jsonify({"trans": savedTrans, "endblock": endblock})
    
    return res, 200, {
        "Access-Control-Allow-Origin": SOURCE_FOR_CORS
    }

@app.route("/")
def home():
    return "fkn Home !!!"


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=GAMBLING_GRAPH_BACKEND_PORT)