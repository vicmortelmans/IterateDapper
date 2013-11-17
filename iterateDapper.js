var parochielijst;
var parochie;

$(document).ready(function() {

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
            "http://kerknet.be/zoek_parochie.php?allbisdom=1"
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
        
        parochielijstBidsomCount.set(bidsom.length);
        $.each(bisdom, function(index,url) {
            volgendeParochielijst(url);
        });
    });

    $('#parochieButton').on('click', function() {
        // verzamel de pagina's van de parochies
        
        parochie = [];
        var parochieCount = new guiNumber('parochieCount');
        
        $.each(parochielijst, function(index, url) {
            dapper('kerknetparochieslist', url, 
                function(json) {
                    if (json.hasOwnProperty('fields')) {
                        var items = json.fields.item;
                        $.each(items, function(index, item) {
                            var url = item.href;
                            parochie.push(url);
                            parochieCount.increment();
                        });
                    }
                },
                function(url) {
                    $('#parochieError').append('<p>' + url + '</p>');
                }
            );
        });
    })
    
    // verzamel de data van elke parochie
    
    /*
    
    window.parochiesMgr.submit = function() {
        // disable the button
        // fetch the progress object
        // create the dapper object
        //this.displayData();
        this.dapper = new Dapper("KerknetParochiesdata");
        var that = this;
        this.dapper.callback = function(json) {
            var row = [];
            var items = json.groups.item;
            if (items.length) {
                var item = items[0];
                var columns = ["parochie", "heiligemis", "adres1", "adres2", "telefoon"];
                for (var c = 0; c < columns.length; c++) {
                    var label = columns[c];
                    if (item.hasOwnProperty(label)) {
                        var itemValues = item[label];
                        var values = [];
                        for (var i = 0; i < itemValues.length; i++) {
                            values.push(itemValues[i].value);
                        }
                        row.push(values.join(";"));
                    }
                    else {
                        row.push("");
                    }
                }
            }
            that.addSomeData(row)
        };
        // create a series object
        this.urls = new Arrayrange(["http://kerknet.be/parochie/parochie_fiche.php?parochieID=24", "http://kerknet.be/parochie/parochie_fiche.php?parochieID=21"]);
        this.query();
    }

    window.parochiesMgr.query = function() {
        var url = this.urls.next();
        if (url) {
            this.dapper.query(url);
        }
    }
    
    */
});
