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

app = Flask(__name__)

def printSMT(s):
    ss = "PSMT " + s
    #print(ss)

   
@app.route("/getTr", methods = ["POST", "OPTIONS"])
def getTr():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept"
        }
        
    addrJson = request.get_json()
    
  
    fromAddresses = addrJson["fromAddress"].lower().replace(",", " ").split()

    
    toAddresseses = addrJson["toAddress"].lower().replace(",", " ").split()
    daysToCheck = float(addrJson["daysToCheck"])
    
    UnixTimestampNow = int(time.time())
    
    reqts = []
    
    for tmpfromAddress in fromAddresses:
        for tmptoAddress in toAddresseses:
            fromAddress = tmpfromAddress
            toAddress = tmptoAddress
            if fromAddress.startswith(("0x", "0X")):
                fromAddress = fromAddress[2:]
            if toAddress.startswith(("0x", "0X")):
                toAddress = toAddress[2:]
            req = {}
            req["fromAddress"] = fromAddress
            req["toAddress"] =  toAddress
            #req["direction"] = "out"
            req["source"] = "ETHERSCAN"
            req["chain"] = "polygon"
            reqts.append(req)
            
            #req = {}
            #req["fromAddress"] = toAddress
            #req["toAddress"] = fromAddress
            #req["direction"] = "in"
            #req["source"] = "ETHERSCAN"
            #req["chain"] = "polygon"
            #reqts.append(req)   

            req = {}
            req["fromAddress"] = fromAddress
            req["toAddress"] =  toAddress
            #req["direction"] = "out"
            req["chain"] = "eth"
            req["source"] = "ETHERSCAN"
            reqts.append(req)
            
            #req = {}
            #req["fromAddress"] = toAddress
            #req["toAddress"] = fromAddress
            #req["direction"] = "in"
            #req["chain"] = "eth"
            #req["source"] = "ETHERSCAN"
            #reqts.append(req)
    
    savedTrans = []
    
    for req in reqts:
        endblock = 99999999999999
        while(True):
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
                    
            
            #print(url)
            #print("req['fromAddress'] = " + req['fromAddress'])
            #print("req['toAddress'] = " + req['toAddress'])
            #print()
            #break
            
            print("requesting " + req["source"] + " " + req["chain"] + " " + req['fromAddress'])
            response = requests.get(url)
            rrr = response.json()
            ourTargetAddress = req["toAddress"].lower()
            

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
                    if tr["to"].lower() == ("0x" + req["toAddress"].lower()):
                        tr["direction"] = "out"
                        CorrectAddress = True
                        
                if(tr["to"].lower() == "0x" + req["fromAddress"].lower()):
                    if tr["from"].lower() == ("0x" + req["toAddress"].lower()):
                        tr["direction"] = "in"
                        CorrectAddress = True                        
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
                    if UnixTimestampNow - int(tr["timeStamp"]) < daysToCheck * 60 * 60 * 24:
                        savedTrans.append(tr) 
                    else:
                        timeToQuite = True
                    
            time.sleep(POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS)
            
            if (timeToQuite or (tmpEndblock == endblock)): # TODO +-1
                for tr in tmpSavedTrans: 
                    if int(tr["blockNumber"]) == tmpEndblock:
                        if UnixTimestampNow - int(tr["timeStamp"]) < daysToCheck * 60 * 60 * 24:
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
    
    return jsonify(savedTrans), 200, {
        "Access-Control-Allow-Origin": "*"
    }

@app.route("/")
def home():
    return "fkn Home !!!"


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=GAMBLING_GRAPH_BACKEND_PORT)