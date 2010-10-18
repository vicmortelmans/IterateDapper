function Progress(id)
{
 this.id = id;
 this.progress;
 this.update = function(progress)
 {
   this.progress = progress;
   var div = document.getElementById(this.id);
   if (div)
   {
     var html = <p>{Math.ceil(progress*100)} %</p>;
     div.innerHTML = html.toXMLString();
  }
 }
 // render a placeholder empty <div/> with id-tag
 var html = <div id={this.id}></div>;
 document.write(html.toXMLString());
}
