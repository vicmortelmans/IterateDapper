function FormMgr(form)
{
  // the formMgr manages a form and can be extended with methods to
  // - submit the series of queries (event handler for submit button)
  // - launch single query
  // - display the result from a query (as callback) and laund the next query
  this.form = form; // don't assign another form after construction, or following bindings are lost!
  this.form.formMgr = this;
  this.submit = function(){};
  this.form.submit.onclick = function()
  {
    this.form.formMgr.submit();
  } 
  this.query = function(){};
  this.data = [];
  this.addSomeData = function(data)
  { 
    this.data.append(data);
    //this.displayData();
    this.query();
  }
  this.displayData = function()
  {
    this.form.xml.value = this.xml.toString();
  }
}

