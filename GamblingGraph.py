from flask import Flask, request, jsonify
import requests
import json
import sys
import os 
 
sys.path.insert(0, os.path.abspath(".."))
from secretsGG import *
 
import time 
 

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
    
    
    while(True):
        if(len(savedTrans) > 10000):
            toManyTrans = True
            break
    
        timeToQuite = False
        if req["source"] == "POLYGONSCAN":
            url = "https://api.polygonscan.com/api"
            url = url + "?module=account"
            url = url + "&action=tokentx"
            url = url + "&address=" + "0x" + req['fromAddress']
            url = url + "&startblock=0"
            url = url + "&endblock=" + str(endblock)
            url = url + "&page=1"
            url = url + "&offset=10000"
            url = url + "&sort=desc"
            url = url + "&apikey=" + POLYGONSCAN_API_KEY
             
            
            tetherContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".lower()
            
        if req["source"] == "ETHERSCAN":  
            if req["chain"] == "polygon":
                tetherContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".lower()
                chainid = 137
            
 
            
                
            
            if req["chain"] == "eth":
                
                tetherContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7".lower()
                chainid = 1
            
            url = "https://api.etherscan.io/v2/api"
            url = url + "?chainid=" + str(chainid)
            url = url + "&module=account"
            url = url + "&action=tokentx"
            url = url + "&contractaddress=" + tetherContract
            url = url + "&address=" + "0x" + req['fromAddress']
            url = url + "&page=1"
            url = url + "&offset=10000"
            url = url + "&startblock=0"
            url = url + "&endblock=" + str(endblock)
            url = url + "&sort=desc"
            url = url + "&apikey=" + ETHERSCAN_API_KEY
                
 
        print("requesting " + req["source"] + " " + req["chain"] + " " + req['fromAddress'] + ", endblock = " + str(endblock))
        response = requests.get(url)
        print("response = " + str(response))
        print(f"fresponse = {response}") 
        rrr = response.json()
        print("rrr = " + str(rrr)) 
        

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
                if req["chain"] == "eth":
                    correctToken = True
                else:
                    if(tr.get("contractAddress")== tetherContract):
                        correctToken = True
                    else:
                        printSMT("tether ---")
 
                if(correctToken):
                    printSMT("tether +++")
                    ammountSent = int(tr['value'])  *  (0.1 ** int(tr['tokenDecimal']))
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
    
    print("Sending shit to the client")
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