require(['jquery', 'utils', 'image-cropper/ImageCropper'], function(jQuery, utils, ImageCropper) {
    jQuery(document).ready(function() {
        ImageCropper(jQuery('#images'), jQuery('#output'));
    });
});
