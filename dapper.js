function dapper(dappername, url, callback, failure, retry) {
    window.openCalls.increment();
    setTimeout(function() {dapperActual(dappername, url, callback, failure, retry)}, Math.random() * 100 * window.openCalls.value);
}

function dapperActual(dappername, url, callback, failure, retry) {
    retry = (typeof retry === "undefined") ? 0 : retry;
    var dapperurl = "http://open.dapper.net/transform.php?dappName=$dappername&applyToUrl=$url&transformer=JSON";
    dapperurl = dapperurl.replace(/\$dappername/, encodeURIComponent(dappername));
    dapperurl = dapperurl.replace(/\$url/, encodeURIComponent(url));
    $.ajax({
        url: dapperurl,
        dataType: 'jsonp',
        jsonp: 'extraArg_callbackFunctionWrapper'
    })
        .done(function(json) {
            window.openCalls.decrement();
            if (json.error && json.error === "The Dapp ran, but did not find any matching results in the given URL.") {
                callback({
                    "dapper":{
                        "status":"OK"
                    },
                    "fields":{
                        "item":[]
                    }
                });
            }
            else if (json.dapper && json.dapper.status === "OK") {
                callback(json);
            }
            else if (retry <= 3) {
                setTimeout(function() {dapper(dappername, url, callback, retry + 1);}, 2000);
            }
            else {
                failure(url);
            }
        });
}

// Utility functions

// http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256C720080D723
function isArray(obj) 
{
   if (obj.constructor.toString().indexOf("Array") == -1)
      return false;
   else
      return true;
}
