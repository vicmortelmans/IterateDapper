function StructuredData(object)
{
  // container for structured data
  // native format = xml
  // constructor accepts JSON object or E4X XML object
  // on construction time, the JSON object is generated and stored in the
  // json attribute
  this.xml = new XML();
  this.json = new Object();
  // if typeof object = json
  if ( typeof object === "object" )
  {
    // convert JSON to XML
    this.json = object;
    this.xml = <data>{json2xml(object)}</data>;
  }
  else if (typeof object === "xml" )
  {
    // convert XML to JSON
    // TODO
  }
  else
  {
    this.xml = object;
    this.json = object;
  }
  // Convert JSON to XML
  function json2xml(json)
  {
    if ( typeof json === "object" )
    {
      var list = new XMLList();
      for ( var key in json )
      {
        var value = json[key];
        if ( ! isArray(value) )
        {
          value = [ value ];
        }
        for each ( var item in value )
        {
          list += <{key}>{json2xml(item)}</{key}>;
        }
      }
      return list;
    }
    else
    {
      return json;
    }
  }
}
