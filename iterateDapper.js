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
            "http://kerknet.be/zoek_parochie.php?allbisdom=2",
            "http://kerknet.be/zoek_parochie.php?allbisdom=3",
            "http://kerknet.be/zoek_parochie.php?allbisdom=4",
            "http://kerknet.be/zoek_parochie.php?allbisdom=6",
            "http://kerknet.be/zoek_parochie.php?allbisdom=7"
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
            dapper('KerknetParochiesdataVersion2', url,
                function(json) {
                    if (json.hasOwnProperty('groups')) {
                        parochieOngoing.increment()
                        var items = json.groups.item;
                        if (items.length) {
                            // data for table 'Kerken'
                            var item = items[0];
                            var columns = ["bisdom", "parochie", "adres1", "adres2", "telefoon"];
                            var data = [];
                            for (var c = 0; c < columns.length; c++) {
                                var label = columns[c];
                                if (item.hasOwnProperty(label)) {
                                    var itemValues = item[label];
                                    var values = [];
                                    for (var i = 0; i < itemValues.length; i++) {
                                        values.push(itemValues[i].value);
                                    }
                                    data[label] = values.join(", ");
                                }
                                else {
                                    data[label] = "";
                                }
                            }
                            // collect the data in an array following the right order of fields!
                            var fields = [];
                            fields.push(data.parochie.toProperCase()); // Name
                            fields.push(data.bisdom); // Diocese Name
                            fields.push(data.adres1); // Street Address
                            fields.push(data.adres2.split(' ')[0]); // Postal Code
                            fields.push(data.adres2.replace(/^[0-9]+ /,'')); // City
                            fields.push("Belgium"); // Country/Territory
                            fields.push(""); // Photo
                            fields.push(data.telefoon); // Phone Number
                            fields.push([data.adres1, data.adres2].join(' ')); // Compiled Address
                            fields.push(""); // Latitude
                            fields.push(""); // Longitude
                            fields.push(url);  // used as record ID
                            parochieData.push(fields);
                            dataCount.increment();
                            // data for table 'Missen'
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
                                        mass.push(day); // Day Of Week
                                        mass.push(time[m]); // Time Start
                                        mass.push("Dutch"); // Language
                                        mass.push(activity[m]); // Service Type
                                        mass.push(url);  // used as record ID
                                        misData.push(mass);
                                        misCount.increment();
                                    }
                                }
                            }
                        }
                    }
                },
                function(url) {
                    dataError.append(url);
                }
            );
        });
    });

    $('#importButton').on('click', function() {
        // laad de gegevens op naar de Fusion tables
        
        var importError = new guiString('importError');
        var kerkenId = '1ahxaJ35-UlI37Ye-haLFLolAhKeeI-Gs4PkpmfY';
        var missenId = '1-fEwLICfAOxOVGHaXPCVRyF4ezf0IockWOwULwI';
        
        import2(kerkenId, parochieData, importError);
        import2(missenId, misData, importError);
        
    });

});

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}