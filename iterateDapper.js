var parochieLijst;
var parochie;
var parochieData;
var misData;

$(document).ready(function() {
    
    window.scheduledCalls = new guiNumber('scheduledCalls');
    window.openCalls = new guiNumber('openCalls');

    $('#authorizeButton').on('click', function(){
        var authorizeConfig = {
            'client_id': '115096030889.apps.googleusercontent.com',
            'scope': ['https://www.googleapis.com/auth/fusiontables','https://spreadsheets.google.com/feeds']
        };
        gapi.auth.authorize(authorizeConfig, function() {
            $('#authorizeConsole').html('login complete');
        });
    });

    $('#parochieLijstButton').on('click', function() {
        var bisdom = [
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=1",
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=2",
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=3",
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=4",
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=6",
            "http://archief.kerknet.be/zoek_parochie.php?allbisdom=7"
        ];

/*        var bisdom = ["http://kerknet.be/zoek_parochie.php?allbisdom=1&zoekinbisdom=&term=&rowcounter=7&order=dekenaat&ordertype=ASC"];
 */       
        // verzamel voor elk bisdom alle opeenvolgende pagina's met lijsten van parochies
        
        parochieLijst = [];
        var parochieLijstBisdomOngoing = new guiNumber('parochieLijstBisdomOngoing');
        var parochieLijstBisdomCount = new guiNumber('parochieLijstBisdomCount');
        var parochieLijstCount = new guiNumber('parochieLijstCount');
        var parochieLijstError = new guiText('parochieLijstError');
        var parochieLijstLog = new guiText('parochieLijst');
        
        var volgendeparochieLijst = function(url) {
            dapper("(//a[.='Volgende'])[1]", url, 
                function(json) {
                    if (json.hasOwnProperty('fields')) {
                        var items = json.fields.item;
                        if (items.length) {
                            var item = items[0];
                            var url = item.href;
                            parochieLijst.push(url);
                            parochieLijstCount.increment();
                            parochieLijstLog.prepend(url);
                            volgendeparochieLijst(url);
                        }
                        else {
                            parochieLijstBisdomOngoing.increment();
                        }
                    }
                },
                function(url) {
                    parochieLijstError.append(url);
                }
            );
        };
        
        parochieLijstBisdomCount.set(bisdom.length);
        $.each(bisdom, function(index,url) {
            parochieLijst.push(url);
            parochieLijstCount.increment();
            parochieLijstLog.prepend(url);
            volgendeparochieLijst(url);
        });
    });

    $('#parochieButton').on('click', function() {
        // verzamel de pagina's van de parochies
        
        parochie = [];
        var parochieLijstCount = new guiNumber('parochieLijstCount2');
        var parochieLijstOngoing = new guiNumber('parochieLijstOngoing');
        var parochieCount = new guiNumber('parochieCount');
        var parochieError = new guiText('parochieError');
        var parochieLog = new guiText('parochie');
        
        parochieLijstCount.set(parochieLijst.length);
        $.each(parochieLijst, function(index, url) {
            dapper('kerknetparochieslist', url, 
                function(json) {
                    if (json.hasOwnProperty('fields') && json.fields.item.length) {
                        parochieLijstOngoing.increment();
                        var items = json.fields.item;
                        $.each(items, function(index, item) {
                            var url = item.href;
                            parochie.push(url);
                            parochieCount.increment();
                            parochieLog.prepend(url);
                        });
                    }
                    else {
                        parochieError.append("dapper empty : " + url);
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
        var kerkenImportCount = new guiNumber('kerkenImportCount');
        var misImportCount = new guiNumber('misImportCount');
        var dataError = new guiText('dataError');
        var dataLog = new guiText('data');
        var importError = new guiText('importError');
        var key = '0Au659FdpCliwdEJXZXJibi1JNERQcXZIMUVBZV9JSEE';
        
        parochieCount2.set(parochie.length);
        $.each(parochie, function(index, url) {
            dapper('KerknetParochiesdataVersion3', url,
                function(json) {
                    if (json.hasOwnProperty('groups') && json.groups.item.length) {
                        parochieOngoing.increment()
                        var items = json.groups.item;
                        if (items.length) {
                            // data for table 'Kerken'
                            var item = items[0];
                            var columns = ["bisdom", "stad", "parochie", "adres1", "adres2", "telefoon"];
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
                            var diocese = data.bisdom.replace(/Bisdom /,'').replace(/Vicariaat.*/,'Mechelen-Brussel');
                            var nameAndCity = [data.parochie.toProperCase(),data.stad.toProperCase()].join(', ');
                            fields.push(data.parochie.toProperCase()); // Name
                            fields.push(diocese); // Diocese Name
                            fields.push(data.adres1); // Mailing Street Address
                            fields.push(data.stad.toProperCase()); // Mailing City
                            fields.push(data.adres2.split(' ')[0]); // Mailing Postal Code
                            fields.push("Belgium"); // Mailing Country/Territory
                            fields.push(data.telefoon); // Phone Number
                            fields.push([data.adres1, data.adres2].join(' ')); // Compiled Address
                            fields.push(""); // Latitude
                            fields.push(""); // Longitude
                            fields.push(url);  // used as record ID
                            fields.push(nameAndCity); // Name and City
                            parochieData.push(fields);
                            dataCount.increment();
                            dataLog.prepend(url);
                            spreadsheets(key, 'kerken', fields)
                                .done(function(){
                                    kerkenImportCount.increment();
                                })
                                .fail(function(){
                                    importError.prepend('kerken: ' + url);
                                });
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
                                        mass.push(diocese); // Diocese Name
                                        mass.push(url);  // used as record ID
                                        mass.push(nameAndCity);  // Name and City
                                        misData.push(mass);
                                        misCount.increment();
                                        spreadsheets(key, 'missen', mass)
                                            .done(function(){
                                                misImportCount.increment();
                                            })
                                            .fail(function(){
                                                importError.prepend('missen: ' + url);
                                            });
                                    }
                                }
                            }
                        }
                    }
                    else {
                        dataError.append("dapper returned empty : " + url);
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
        
        var importError = new guiText('importError');
        var kerkenId = '1ahxaJ35-UlI37Ye-haLFLolAhKeeI-Gs4PkpmfY';
        var missenId = '1-fEwLICfAOxOVGHaXPCVRyF4ezf0IockWOwULwI';
        
        fusion(kerkenId, parochieData, importError);
        fusion(missenId, misData, importError);
        
    });

});

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
