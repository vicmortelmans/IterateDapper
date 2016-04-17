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
        var dapperurl = "https://query.yahooapis.com/v1/public/yql";
        var query = 'select * from html where url="$url" and xpath="$xpath"';
        query = query.replace(/\$xpath/, xpath);
        query = query.replace(/\$url/, url);
        $.ajax({
            url: dapperurl,
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
              q: query,
              format: "json"
            }
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
