window.onload = function()
{
  
  // To customize IterateDapper for other types of information, three things must be done:
  // 1. create a new form to capture the user input
  // 2. create specific implementations for the FormMgr methods 'submit' and 'query'
  // 3. if needed, provide special range-objects (similar to daterange)
  
  window.daterangeformMgr = new FormMgr(document.iterateDates);
  
  window.daterangeformMgr.submit = function ()
  {
    // disable the button
    // fetch the progress object
    // create the dapper object
    this.xml = <data></data>;
    this.displayData();
    this.dapper = new DapperParametrized(this.form.dapperName.value,
                                         this.form.url.value);
    var that = this;
    this.dapper.callback = function(xml){that.addSomeData(xml)};
    // create a series object
    this.dates = new Daterange(this.form.firstDay.value, this.form.lastDay.value);
    this.query();
  }
  
  window.daterangeformMgr.query = function()
  {
    var date = new Date();
    if (date = this.dates.next())
    {
      var dateString = formatDate(date,this.form.dateFormat.value);
      this.dapper.queryParametrized(<params><date>{dateString}</date></params>);
    }
  }
  
}
