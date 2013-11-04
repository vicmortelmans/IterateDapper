function Progress(id)
{
 this.id = id;
 this.progress;
 this.update = function(progress)
 {
   this.progress = progress;
   var div = $("#" + this.id);
   if (div)
   {
     div.innerHTML("<p>" + Math.ceil(progress*100) + " %</p>");
  }
 }
 // render a placeholder empty <div/> with id-tag
 $(document.body).append("<div id='" + this.id + "'></div>");
}
