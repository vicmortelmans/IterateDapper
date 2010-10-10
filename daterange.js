function Daterange(first,last)
{
 this.first = parseDate(first);
 this.last = parseDate(last);
 this.current = new Date(this.first);
 this.next = function()
 {
   var date = new Date(this.current);
   this.current.setDate(this.current.getDate() + 1);
   return (date > this.last) ? null : date;
 }
}
