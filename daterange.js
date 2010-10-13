function Daterange(first,last)
{
 this.first = parseDate(first);
 this.last = parseDate(last);
 this.current = new Date(this.first);
 this.progress = 0;
 this.next = function()
 {
   var date = new Date(this.current);
   this.current.setDate(this.current.getDate() + 1);
   this.progress = (date.getTime() - this.first.getTime())/(this.last.getTime() - this.first.getTime());
   return (date > this.last) ? null : date;
 }
}
