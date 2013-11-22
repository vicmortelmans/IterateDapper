function import2(id, array, console) {
    for (var i = 0; i < array.length; i++) {
        array[i] = array[i].join(';')
    }
    var csv = array.join('\r\n');
    var request = gapi.client.request({
       'path': '/upload/fusiontables/v1/tables/' + id + '/import',
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
        console.append(resp); 
    });
}
