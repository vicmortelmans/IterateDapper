function spreadsheets(key, name, array) {
    var url = "https://script.google.com/macros/s/AKfycbyfrwx0NoWlMlCgRSB1778uBcCod0BrYtVJE21Qopod8p17ySdp/exec";
    return $.ajax({
        url: url,
        dataType: 'jsonp',
        data: {
            'key': key,
            'name': name,
            'values': JSON.stringify({"values": array})
        }
    });
}
