if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(function() {
    if (typeof String.prototype.fo !== 'function') {
        // "hello %(name)s!".fo({name: 'Sam'})
        // ==> "hello Sam!"
        String.prototype.fo = function(o) {
            return this.replace(/%\(([^)]+)\)s/g,
                   function(matched, group_1) {
                       return o[group_1];
                   });
        };
    }

    if (typeof String.prototype.f !== 'function') {
        // "whhello %s!".fo('Sam')
        // ==> "hello Sam!"
        String.prototype.f = function() {
            var args = arguments;
            var index = 0;
            return this.replace(/%s/g, function() {
                return args[index++];
            });
        };
    }
});
