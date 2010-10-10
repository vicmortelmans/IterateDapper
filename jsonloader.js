/* Simple JSON loader example
   example call would be
   loader.getJSON(reference to object,
                  function to be called when returned, 
                  the URL to the JSON api);
   Source:
   http://radio.javaranch.com/pascarello/2006/07/07/1152292250518.html
*/

var loader = new Object;
loader.callQueue = new Array();

// VIC´s modification to make the URL sections configurable
loader.outputParam = "output";
loader.outputValue = "json";
loader.callbackParam = "callback";

loader.getJSON = function(objReference,objCallBackFnc,jsonUrl)
{

  var _index = loader.callQueue.length;
  loader.callQueue[_index] = new jsHandler(objReference,
                                           objCallBackFnc,
                                           _index);

  var elem = document.createElement("script");
  elem.id = "script" + _index;
  // VIC's modification to make the URL sections configurable
  elem.src = jsonUrl + "&" + loader.outputParam + "=" + loader.outputValue +
             "&" + loader.callbackParam + "=loader.callQueue[" + _index +"].transferOO";
  document.body.appendChild(elem);

}  

function jsHandler()
{
  this.objReference = arguments[0];
  this.callBackFnc = arguments[1];
  this.scriptId = arguments[2];
}

jsHandler.prototype.transferOO = function()
{
  this.objReference.json = arguments[0];
  this.callBackFnc.call(this.objReference,arguments[0]);
  document.body.removeChild(document.getElementById("script" + this.scriptId));
  this.objReference = null;
  this.callBackFnc = null;
}


