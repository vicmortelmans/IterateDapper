function spreadsheets(key, name, array) {
    var url = "https://script.google.com/macros/s/AKfycbztnEsss1VKtJsM3q8kwbHTRtJ-JPbetHzhWzZjhcpK58KAQTkU/exec";
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
