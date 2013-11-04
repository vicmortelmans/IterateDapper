function Arrayrange(array)
{
 this.current = -1;
 this.progress = 0;
 this.array = array;
 this.next = function()
 {
   this.current++;
   this.progress = this.current / this.array.length;
   return (this.current >= this.array.length) ? null : this.array[this.current];
 }
}
