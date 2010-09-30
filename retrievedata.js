function retrieveData(form)
{
 // disable the button
 // fetch the progress object
 // create the dapper object
 var dapper = new DapperParametrized(form.dapperName,form.url);
 // create a series object
 var dates = new Daterange(form.firstDay, form.lastDay);
 var xml = <></>;
 while (date = dates.next())
 {
    var dateString = formatDate(date,form.dateFormat);
    xml += dapper.queryParametrized(dateString);
 }
 form.xml = xml.toString();
}
