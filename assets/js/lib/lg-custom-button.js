(function($, window, document, undefined) {

    'use strict';
    
    /**
        * Creates the autoplay plugin.
        * @param {object} element - lightGallery element
     */

     var defaults = {

     };

 	var customButton = function (element) {
 		 // get lightGallery core plugin data
        this.core = $(element).data('lightGallery');

        this.$el = $(element);

        // extend module defalut settings with lightGallery core settings
        this.core.s = $.extend({}, defaults, this.core.s);

        this.init();
        return this;

 	}

 	customButton.prototype.init = function () {
 		if (this.core.s.customButton) {
 		            // here the actions
 		            //console.log("called init", this.core.$outer, this.core);
 		            //this.core.$outer.find('.lg-toolbar.lg-group').removeClass('lg-close').addClass('icon-new-close');

 		            $lg = this.$el;
 		            //$lg.lightGallery(oOptions);
 		            $lg.on('onAfterOpen.lg',function(event){
 		               $('.lg-toolbar').append('<a class=\"lg-icon\" href=\"javascript:toggleCaption()\">CC</a>');
 		            });

 		            function toggleCaption() {
 		               var curVal = $('.lg-sub-html').css('visibility');
 		               $('.lg-sub-html').css('visibility', curVal == 'hidden' ? 'visible' : 'hidden');
 		            }
 		        }
 	}

    $.fn.lightGallery.modules.customButton = customButton;

})(jQuery, window, document);