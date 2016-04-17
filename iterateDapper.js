var parochieLijst;
var parochie;
var parochieData;
var misData;

$(document).ready(function() {
    
    window.scheduledCalls = new guiNumber('scheduledCalls');
    window.openCalls = new guiNumber('openCalls');

    $('#authorizeButton').on('click', function(){
        var authorizeConfig = {
            'client_id': '222690187047-oqno38strfmakqt4rgbv04tid9db81q5.apps.googleusercontent.com',
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
                    if (json.query && json.query.count) {
                        if (json.query.count > 0) {
                            var url = "http://archief.kerknet.be/" + json.query.results.a.href;
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

    $('#readParochieLijstButton').on('click',function() {
      parochieLijst = [];
      var text = $('#parochieLijst').val();
      $.each(text.split('\n'), function(index, line) {
        parochieLijst.push(line);
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
            dapper("(//a[contains(@href,'parochie_fiche')])", url, 
                function(json) {
                    if (json.query && json.query.count && json.query.count > 0) {
                        parochieLijstOngoing.increment();
                        var items = json.query.results.a;
                        $.each(items, function(index, item) {
                            var url = "http://archief.kerknet.be/" + item.href;
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
    
    $('#readParochieButton').on('click',function() {
      parochie = [];
      var text = $('#parochie').val();
      $.each(text.split('\n'), function(index, line) {
        parochie.push(line);
      });
    });

    
    $('#dataButton').on('click', function() {
        // verzamel de parochiegegevens
        
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
        var key = '1J_evudlmZ2bDKkaguYzK7o_4cHlSkaUq586T8hYYjis'; // the macro in this spreadsheet is referred to in spreadsheet.js
        
        parochieCount2.set(parochie.length);
        $.each(parochie, function(index, url) {
            if (url) {
                dapper("//div[@id='middle']", url,
                    function(json) {
                        if (json.query && json.query.count && json.query.count > 0) {
                            parochieOngoing.increment()
                            var middle = json.query.results.div;
                            var nameAndCity = middle.div.table[0].thead.tr[0].th.content.toProperCase();
                            // data for table 'Kerken'
                            // collect the data in an array following the right order of fields!
                            var fields = [];
                            fields.push(''); // Name
                            fields.push(''); // Diocese Name
                            fields.push(''); // Mailing Street Address
                            fields.push(''); // Mailing City
                            fields.push(''); // Mailing Postal Code
                            fields.push(''); // Mailing Country/Territory
                            fields.push(''); // Phone Number
                            fields.push(''); // Compiled Address
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
                            if (middle.div.table[0].tbody.tr) {
                                var itemValues = middle.div.table[0].tbody.tr;
                                itemValues = (typeof itemValues != 'undefined' && itemValues instanceof Array) ? itemValues : [itemValues];
                                for (var i = 0; i < itemValues.length; i++) {
                                    var day = itemValues[i].th.content;
                                    var agenda = itemValues[i].td.content;
                                    var time = agenda.match(/[0-9]{2}\.[0-9]{2}u/g);
                                    var activity = agenda.split(/\s?[0-9]{2}\.[0-9]{2}u\s?/g);
                                    activity.shift();
                                    for (var m = 0; m < time.length; m++) {
                                        var mass = [];
                                        mass.push(day); // Day Of Week
                                        mass.push(time[m]); // Time Start
                                        mass.push("Dutch"); // Language
                                        mass.push(activity[m]); // Service Type
                                        mass.push(''); // Diocese Name
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
                        else {
                            dataError.append("dapper returned empty : " + url);
                        }
                    },
                    function(url) {
                        dataError.append(url);
                    }
                );
            } // if (url)
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

    $('#toCSVButton').on('click', function() {
        // genereer CSV om manueel te kopieren

    });        

});

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
