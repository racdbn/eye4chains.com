from flask import Flask, request, jsonify
import requests
import json
from secrets import *
import os 

POLYGONSCAN_API_KEY = os.environ.get('POLYGONSCAN_API_KEY', POLYGONSCAN_API_KEY)
POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS = os.environ.get('POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS', POLYGONSCAN_SLEEP_BETWEEN_REQUESTS_SECS)
GAMBLING_GRAPH_BACKEND_PORT = os.environ.get('GAMBLING_GRAPH_BACKEND_PORT', GAMBLING_GRAPH_BACKEND_PORT)  

app = Flask(__name__)
   
@app.route("/getTr", methods = ["POST", "OPTIONS"])
def getTr():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept"
        }
        
    addrJson = request.get_json()
    
    fromAddress = addrJson["fromAddress"]
    toAddress = addrJson["toAddress"]
    
    reqts = []
    req1 = {}
    req1["fromAddress"] = fromAddress
    req1["toAddress"] =  toAddress
    req1["direction"] = "out"
    reqts.append(req1)
    req2 = {}
    req2["fromAddress"] = toAddress
    req2["toAddress"] = fromAddress
    req2["direction"] = "in"
    reqts.append(req2)
    
    savedTrans = []
    
    for req in reqts:
        url = "https://api.polygonscan.com/api"
        url = url + "?module=account"
        url = url + "&action=tokentx"
        url = url + "&address=" + "0x" + req['fromAddress']
        url = url + "&startblock=0"
        url = url + "&endblock=99999999"
        url = url + "&page=1"
        url = url + "&offset=10000"
        url = url + "&sort=desc"
        url = url + "&apikey=" + POLYGONSCAN_API_KEY
        filename = "data.json"
        
        response = requests.get(url)
        rrr = response.json()

        ourTargetAddress = req["toAddress"].lower()
        tetherContract = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f".lower()
        sendFunctionCode = "0xa9059cbb000000000000000000000000".lower()

        AllTrans = rrr.get("result")
        print("AllTrans = " + str(AllTrans))

        for tr in AllTrans:
            print(" ")
            print(str(tr))
            if(tr['from'].lower() == "0x" + req["fromAddress"].lower()):
                print("fromAddress +++")
                if(tr.get("contractAddress")== tetherContract):
                    print("tether +++")
                    input = tr.get("input")
                    FunctionCode = input[0:34].lower() 
                    #if FunctionCode == sendFunctionCode:
                    if True:
                        print("sendfunc +++")
                        #targetAddress = input[34:74].lower()
                        targetAddress = tr['to'].lower()
                        if targetAddress == ("0x" + ourTargetAddress):
                            print("targetAddress +++")
                            #sentAmmoutString = input[74:148].lower()
                            #ammountSent = int(sentAmmoutString, 16) / 1000000.0
                            ammountSent = int(tr['value'])  *  (0.1 ** int(tr['tokenDecimal']))
                            #print("sentAmmoutString = " + str(sentAmmoutString))
                            print("ammountSent = " + str(ammountSent))
                            
                            savedTrans.append(tr)
                            savedTrans[len(savedTrans) - 1]['ammountSent'] = ammountSent  
                            print("savedTrans[len(savedTrans) - 1]['ammountSent'] = " + str(savedTrans[len(savedTrans) - 1]['ammountSent']))
                            savedTrans[len(savedTrans) - 1]['direction'] = req["direction"]
                        else:
                            print("targetAddress ---")
                            print("targetAddress = " + targetAddress)
                            print("ourTargetAddress = " + ourTargetAddress)
                    else:
                        print("sendfunc ---")
                        print("FunctionCode = " + str(FunctionCode))
                else:
                    print("tether ---")
            else:
                print("fromAddress ---")

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