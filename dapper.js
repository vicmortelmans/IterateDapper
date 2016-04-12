// where it says 'dapper', please read 'yql', I'm to lazy to search and replace
// first calls go here:
function dapper(xpath, url, callback, failure, retry) {
    window.scheduledCalls.increment();
    dapperActual(xpath, url, callback, failure, retry);
}

// retry calls because server busy or returning error go here:
function dapperActual(xpath, url, callback, failure, retry) {
    retry = (typeof retry === "undefined") ? 0 : retry;
    // better wait a minute
    if (retry || window.openCalls.value > 10) {
        setTimeout(function() {dapperActual(xpath, url, callback, failure, retry)}, Math.random() * 1000 * window.openCalls.value);
    }
    // all clear, go ahead!
    else {
        window.scheduledCalls.decrement();
        window.openCalls.increment();
        var dapperurl = "https://query.yahooapis.com/v1/yql?q=select%20*%20from%20html%20where%20url%3D%22$url%22%20and%20xpath%3D%22$xpath%22&format=json&callback=";
        dapperurl = dapperurl.replace(/\$xpath/, encodeURIComponent(xpath));
        dapperurl = dapperurl.replace(/\$url/, encodeURIComponent(url));
        $.ajax({
            url: dapperurl,
            dataType: 'jsonp',
            jsonp: 'extraArg_callbackFunctionWrapper'
        })
            .done(function(json) {
                window.openCalls.decrement();
                if (json.query && json.query.count) {
                    if (json.query.count == 0) failure("no data found on" + url);
                    callback(json);
                }
                else if (retry <= 3) {
                    setTimeout(function() {dapperActual(xpath, url, callback, retry + 1);}, 2000);
                }
                else {
                    failure("YQL failed on" + url);
                }
            })
            .fail(function() {
                window.openCalls.decrement();
                failure("ajax failed on : " + url)
            });
        }
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
