window.onload = function()
{
  
  // To customize IterateDapper for other types of information, three things must be done:
  // 1. create a new form to capture the user input
  // 2. create specific implementations for the FormMgr methods 'submit' and 'query'
  // 3. if needed, provide special range-objects (similar to daterange)
  
  parochiesMgr = new FormMgr(document.parochies);
  
  
  
  parochiesMgr.submit = function()
  {
    // disable the button
    // fetch the progress object
    // create the dapper object
    //this.displayData();
    this.dapper = new Dapper("KerknetParochiesdata");
    var that = this;
    this.dapper.callback = function(json){
      var row = [];
      var items = Utilities.jsonParse(json).groups.item;
      if (items.length) {
        var item = items[0];
        var columns = ["parochie", "heiligemis", "adres1", "adres2", "telefoon"];
        for (var c = 0; c < columns.length; c++) {
          var label = columns[c];
          if (item.hasOwnProperty(label)) {
            var itemValues = item[label];
            var values = [];
            for (i = 0; i < itemValues.length; i++) {
              values.push(itemValues[i].value);
            }
            row.push(values.join(";"));
          } else {
            row.push("");
          }
        }
      }
      that.addSomeData(row)
    };
    // create a series object
    this.urls = new Arrayrange([
        "http://kerknet.be/parochie/parochie_fiche.php?parochieID=24",
        "http://kerknet.be/parochie/parochie_fiche.php?parochieID=21"
    ]);
    this.query();
  }
  
  parochiesMgr.query = function()
  {
    if (url = this.urls.next())
    {
      this.dapper.query(url);
    }
  }
}
