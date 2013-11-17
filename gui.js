function guiNumber(id) {
    this.value = 0;
    this.dom = $('#' + id);
    this.display = function() {
        this.dom.html(this.value);
        return;
    };
    this.init = function(value) {
        this.value = value;
        this.dom.html('');
        return;
    };
    this.set = function(value) {
        this.value = value;
        this.display();
        return;
    };
    this.increment = function(value) {
        this.value++;
        this.display();
        return;
    };
}

function guiString(id) {
    this.dom = $('#' + id);
    this.set = function(string) {
        this.dom.html('<div>' + string + '</div>');
        return;
    };
    this.append = function(string) {
        this.dom.append('<div>' + string + '</div');
        return;
    };
}

