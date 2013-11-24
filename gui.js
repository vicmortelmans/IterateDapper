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
    this.decrement = function(value) {
        this.value--;
        this.display();
        return;
    };
}

function guiText(id) {
    this.dom = $('#' + id);
    this.set = function(string) {
        this.dom.val(string);
        return;
    };
    this.append = function(string) {
        this.dom.val(this.dom.val() + '\n' + string);
        return;
    };
    this.prepend = function(string) {
        this.dom.val(string + '\n' + this.dom.val());
        return;
    };
    this.set('');
}

