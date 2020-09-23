$( document ).ready(function() {

$('[data-fancybox="images"]').fancybox({
   baseClass: "fancybox-custom-layout",
  infobar: false,
  toolbar: false,
  smallBtn: true,
  btnTpl: {
  	smallBtn:
  	'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small"  aria-label="Close">'+
  	    '<img src="assets/icon/4C_EVENTS Lightbox/4C_EVENTS Lightbox/Close icon_Group 268.png" class="">'+
        '</button>'
  },
  thumbs : {
    autoStart : true,
    axis      : 'x'
  },
  preventCaptionOverlap: false,
  idleTime: false,
  gutter: 0,
  margin    : 0,
  caption: function(instance) {
        return '<h3>home</h3><p>interiors, exteriors, and the humans that inhabit them.</p><p><a href="https://unsplash.com/collections/curated/162" target="_blank">unsplash.com</a></p>';
      },
  afterLoad : function(instance, current) {
          var pixelRatio = window.devicePixelRatio || 1;

          if ( pixelRatio > 1.5 ) {
              current.width  = current.width  / pixelRatio;
              current.height = current.height / pixelRatio;
          }
   },
  afterShow: function(instance, slide){
  	console.log(instance.$refs, slide);
  	// reduce offset 3 px due to some unknown reason
  	// calculate the caption height
  	var captionHeight = instance.$refs.stage.height() - 3 +20;
  	instance.$refs.caption.css('height', '514px');
  	instance.$refs.caption.css('opacity', 1);
  
  }
});

});