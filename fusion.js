function fusion(id, array, console) {
    var csv = [];
    for (var i = 0; i < array.length; i++) {
        var record = [];
        for (var j = 0; j < array[i].length; j++) {
            if (array[i][j]) {
              record[j] = '"' + array[i][j].replace('"','""') + '"';
            } else {
              record[j] = '';
            }
        }
        csv[i] = record.join(';');
    }
    csv = csv.join('\r\n');
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
