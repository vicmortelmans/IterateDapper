function Dapper(dappername)
{
 this.dappername = dappername;
 this.callback = function() {};
 this.query = function(url)
 {
   var dapperurl = "http://open.dapper.net/transform.php?dappName=$dappername&applyToUrl=$url";
   dapperurl = dapperurl.replace(/\$dappername/, encodeURI(dappername));
   dapperurl = dapperurl.replace(/\$url/, encodeURI(url));
   // TODO turn the URL in something that returns JSON, like this:
   // http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22http%3A%2F%2Fopen.dapper.net%2FRunDapp%3FdappName%3Daelforg%26v%3D1%26applyToUrl%3Dhttp%3A%2F%2Fwww.aelf.org%2Foffice-messe%3Fdate_my%3D2010-01-01%22&format=json&diagnostics=true&callback=cbfunc
   // BUT I've got no clue how the callback-part of the URL should be known here!
   // > inspected the code, the getJSON call autonomously appends "&output=json&callback=..." to the URL
   // YQL is suggesting to use "&format=json", but it seems to be OK with "&output=json" as well... 
   // must be some kind of standard?
   // A standard Dapper is not adhering to, as they say: 
   // "&transformer=JSON&extraArg_callbackFunctionWrapper=callback"
   loader.outputParam = "transformer";
   loader.outputValue = "JSON";
   loader.callbackParam = "extraArg_callbackFunctionWrapper";
   loader.getJSON(this,
                  this.queryCallback, 
                  dapperurl);
 }
 this.queryCallback = function(json)
 {
   var data = new StructuredData(json);
   var xml = <item>{data.xml.fields.*}</item>;
   delete xml..originalElement;
   delete xml..fieldName;
   this.callback(xml);
 }
}

function DapperParametrized(dappername,urlTemplate)
{
 var that = new Dapper(dappername);
 that.urlTemplate = urlTemplate;
 that.queryParametrized = function(params)
 {
   var url = that.urlTemplate;
   for each (var p in params.*)
   {
     url = url.replace('$' + p.name().toString(),p.toString());
   }
   that.query(url);
 }
 return that;
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
