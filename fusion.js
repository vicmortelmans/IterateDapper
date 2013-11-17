function import2(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].join(';')
    }
    var csv = array.join('\r\n');
    var tableId = '1ahxaJ35-UlI37Ye-haLFLolAhKeeI-Gs4PkpmfY';
    var request = gapi.client.request({
       'path': '/upload/fusiontables/v1/tables/' + tableId + '/import',
       'method': 'POST',
       'headers': {
           'Content-Type': 'application/octet-stream'
       },
       'params': {
           'delimiter': ';'
       },
       'body': csv
   });            
    request.execute(function(resp) { 
        console.log(resp); 
        });
}

