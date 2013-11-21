var parochielijst;
var parochie;
var parochieData;
var misData;

$(document).ready(function() {
    
    window.openCalls = new guiNumber('openCalls');

    $('#authorizeButton').on('click', function(){
        var authorizeConfig = {
            'client_id': '115096030889.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/fusiontables'
        };
        gapi.auth.authorize(authorizeConfig, function() {
            $('#authorizeConsole').html('login complete');
        });
    });

    $('#parochielijstButton').on('click', function() {
        var bisdom = [
            "http://kerknet.be/zoek_parochie.php?allbisdom=1",
            "http://kerknet.be/zoek_parochie.php?allbisdom=2"
        ];
        
        // verzamel voor elk bisdom alle opeenvolgende pagina's met lijsten van parochies
        
        parochielijst = [];
        var parochielijstBisdomOngoing = new guiNumber('parochielijstBisdomOngoing');
        var parochielijstBisdomCount = new guiNumber('parochielijstBisdomCount');
        var parochielijstCount = new guiNumber('parochielijstCount');
        var parochielijstError = new guiString('parochielijstError');
        
        var volgendeParochielijst = function(url) {
            dapper('KerknetParochiesdeephtmlnext', url, 
                function(json) {
                    if (json.hasOwnProperty('fields')) {
                        var items = json.fields.item;
                        if (items.length) {
                            var item = items[0];
                            var url = item.href;
                            window.parochielijst.push(url);
                            parochielijstCount.increment();
                            volgendeParochielijst(url);
                        }
                        else {
                            parochielijstBisdomOngoing.increment();
                        }
                    }
                },
                function(url) {
                    parochielijstError.append(url);
                }
            );
        };
        
        parochielijstBisdomCount.set(bisdom.length);
        $.each(bisdom, function(index,url) {
            volgendeParochielijst(url);
        });
    });

    $('#parochieButton').on('click', function() {
        // verzamel de pagina's van de parochies
        
        parochie = [];
        var parochielijstCount = new guiNumber('parochielijstCount2');
        var parochielijstOngoing = new guiNumber('parochielijstOngoing');
        var parochieCount = new guiNumber('parochieCount');
        var parochieError = new guiString('parochieError');
        
        parochielijstCount.set(parochielijst.length);
        $.each(parochielijst, function(index, url) {
            dapper('kerknetparochieslist', url, 
                function(json) {
                    if (json.hasOwnProperty('fields')) {
                        parochielijstOngoing.increment();
                        var items = json.fields.item;
                        $.each(items, function(index, item) {
                            var url = item.href;
                            parochie.push(url);
                            parochieCount.increment();
                        });
                    }
                },
                function(url) {
                    parochieError.append(url);
                }
            );
        });
    });
    
    
    $('#dataButton').on('click', function() {
        // verzamel de data van elke parochie
        
        parochieData = [];
        misData = [];
        var parochieCount2 = new guiNumber('parochieCount2');
        var parochieOngoing = new guiNumber('parochieOngoing');
        var dataCount = new guiNumber('dataCount');
        var misCount = new guiNumber('misCount');
        var dataError = new guiString('dataError');
        
        parochieCount2.set(parochie.length);
        $.each(parochie, function(index, url) {
            dapper('KerknetParochiesdata', url,
                function(json) {
                    var data = [];
                    if (json.hasOwnProperty('groups')) {
                        parochieOngoing.increment()
                        var items = json.groups.item;
                        if (items.length) {
                            data.push(url);  // used as record ID
                            var item = items[0];
                            var columns = ["parochie", "adres1", "adres2", "telefoon"];
                            for (var c = 0; c < columns.length; c++) {
                                var label = columns[c];
                                if (item.hasOwnProperty(label)) {
                                    var itemValues = item[label];
                                    var values = [];
                                    for (var i = 0; i < itemValues.length; i++) {
                                        values.push(itemValues[i].value);
                                    }
                                    data.push(values.join(", "));
                                }
                                else {
                                    data.push("");
                                }
                            }
                            if (item.hasOwnProperty("heiligemis")) {
                                var itemValues = item["heiligemis"];
                                for (var i = 0; i < itemValues.length; i++) {
                                    var day = itemValues[i].value;
                                    var agenda = itemValues[++i].value;
                                    var time = agenda.match(/[0-9]{2}\.[0-9]{2}u/g);
                                    var activity = agenda.split(/\s?[0-9]{2}\.[0-9]{2}u\s?/g);
                                    activity.shift();
                                    for (var m = 0; m < time.length; m++) {
                                        var mass = [];
                                        mass.push(url);  // used as record ID
                                        mass.push(day);
                                        mass.push(time[m]);
                                        mass.push(activity[m]);
                                        misData.push(mass);
                                        misCount.increment();
                                    }
                                }
                            }
                        }
                        parochieData.push(data);
                        dataCount.increment();
                    }
                },
                function(url) {
                    dataError.append(url);
                }
            );
        });
    });
});

