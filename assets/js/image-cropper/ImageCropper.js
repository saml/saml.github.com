if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['../jquery'], function(jQuery) {
    var constructor = function(input, output) {
        var me = {};

        var Rectangle = function(x, y, width, height) {
            return {x: x, y: y, width: width, height: height};
        };

        var findFittingRectangle = function(imgWidth, imgHeight, width, height) {
            if (imgWidth < width && imgHeight < height) {
                return Rectangle(0, 0, imgWidth, imgHeight);
            }

            var imgAspectRatio = imgWidth / imgHeight;
            var aspectRatio = width / height;
            var resultWidth = 0;
            var resultHeight = 0;
            if (imgAspectRatio < aspectRatio) {
                resultHeight = height;
                resultWidth = resultHeight * imgWidth / imgHeight;
            } else {
                resultWidth = width;
                resultHeight = resultWidth * imgHeight / imgWidth;
            }
            return Rectangle(0, 0, resultWidth, resultHeight);
        };

        var createThumbnailDataUrl = function(img, width, height) {
            var canvas = document.createElement('canvas');
            var rect = findFittingRectangle(img.width, img.height, width, height);
            canvas.width = rect.width;
            canvas.height = rect.height;
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, rect.width, rect.height);
            ctx.drawImage(img, 0, 0, rect.width, rect.height);
            var imgUrl = canvas.toDataURL();
            canvas = null;
            ctx = null;
            return imgUrl;
        };

        var createOnFileReadSuccess = function(file) {
            return (function(ev) {
                var img = new Image();
                img.addEventListener('load', function() {
                    var dataUrl = createThumbnailDataUrl(img, 100, 100);
                    var thumbnail = new Image();
                    thumbnail.src = dataUrl;
                    output.append(thumbnail);
                } , false);
                img.src = ev.target.result;
            });
        };

        var onFileSelect = function(ev) {
            output.empty();

            var files = ev.target.files;
            var n = files.length;
            for (var i = 0; i < n; i++) {
                var file = files[i];
                if (file.type.match('image/.*')) {
                    var reader = new FileReader();
                    reader.onload = createOnFileReadSuccess(file);
                    reader.readAsDataURL(file);
                }
            }
        };

        input.on('change', onFileSelect);
        return me;
    };

    return constructor;
});
