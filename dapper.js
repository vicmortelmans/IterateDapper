function Dapper(dappername)
{
 this.dappername = dappername;
 this.query = function(url)
 {
   var http = new XMLHttpRequest();
   var url = "http://open.dapper.net/RunDapp?dappName=$dappername&v=1&applyToUrl=$url";
   url = url.replace(/\$dappername/, encodeURI(dappername));
   url = url.replace(/\$url/, encodeURI(url));
   http.open("get",url,false); // synchronous call
   http.send(null);
   var data = http.responseText;
   data = data.replace(/<\?(.*?)\?>/,"")
   var xml = new XML(data);
   delete xml.dapper;  <!-- delete dapper status feedback -->
   delete xml..@*;  <!-- delete references to original tags -->
   return xml;
 }
}

function DapperParametrized(dappername,urlTemplate)
{
 var that = new Dapper(dappername);
 that.urlTemplate = urlTemplate;
 that.queryParametrized = function (params)
 {
   url = that.urlTemplate;
   for each ( param in params )
   {
     url = url.replace(param.name(),param.toString());
   }
   return that.query(url);
 }
 return that;
}
