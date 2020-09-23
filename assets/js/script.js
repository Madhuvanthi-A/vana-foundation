$( document ).ready(function() {
    
    //Theme vars
    M = window.M || {};
    var $header = $("#page-head-nav");
    var $footer = $("#page-foot");


    var init = function(){
      //render header and footer
      var urlPath = window.location.pathname.split('');
      if(urlPath.length < 5){
        $header.load('./templates/header-navbar.html');
        $footer.load('./templates/footer.html');
      } else {
        $header.load('../templates/header-navbar.html');
        $footer.load('../templates/footer.html');
      }

      // Navbar hamburger animate
      setTimeout(function() {
        //console.log("called",  $('.navbar-toggler .menu-toggle'));
        $('.navbar-toggler').on('click', function() {
              $(this).find('.menu-toggle').toggleClass('is-active');
            });
      }, 300)
      
      
    }

    M.scrollTop = function () {
      window.scroll({
        top: 0, 
        behavior: 'smooth'
      });
    }

    M.lbCustomCloseIcon = function ($modal) {
      // Customize header and close button
      let modalHeader = $modal.find('.modal-header');
      modalHeader.addClass('modal-close-icon');
      modalHeader.find('span').remove();
      let closeIcon = `<img src="../assets/icon/6A_LIBRARY/Group 3302.png" class="" />`;
      modalHeader.find('button.close').append(closeIcon);

      return;
    }

    M.thumbnailRow = function(lb){
      var galleryItems = lb._$galleryItems;
      var modalFooter = lb._$modal.find('.modal-footer');
      
      var imgUrls = $.map(galleryItems, function(item) { 
        return $(item).data().remote 
      });
      var imgEl = $.map(imgUrls, function(url){
        return `<img src="${url}" class="lightbox-thumb"/>`
      });
      modalFooter.append(imgEl);

      console.log(galleryItems, imgUrls);
    }

    // Generic image gallery lightbox
   /* $("#visual-archive-row, #va-row-carousel, #albums-view").on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox({ 
            alwaysShowClose: true,
            onShown: function() {
            console.log(this);

            // Add custom markup
            M.lbCustomCloseIcon(this._$modal);

            // if image gallery
            M.thumbnailRow(this);

            //if video add info icon to footer

            },
            onContentLoaded: function() {
              var footer = this._$modal.find('.modal-footer');
              footer.show();
              //M.thumbnailRow(this);
            }
          });              
      });

    */
    
    // Ekko light box - needs more work
    $("#lib-featured-player").on('click', '[data-toggle="lightbox"]', function(event) {
                    event.preventDefault();
                    $(this).ekkoLightbox();
                });
    $("#videos").on('click', '[data-toggle="lightbox"]', function(event) {
                    event.preventDefault();
                    $(this).ekkoLightbox();
                });


    // Filters nav bar sort component
    $('#js-toggle-selected .dropdown-menu a').on('click', function(e) {
      e.preventDefault();
      var getClickedValue = $(this).text();
      var toggleValue = $('#filter-group-3').text();
      $('#filter-group-3').text(getClickedValue);
      $(this).text(toggleValue);
      if(M.AppView.filterView){
        M.AppView.filterView.model.set({sortBy: !M.AppView.filterView.model.get('sortBy')});
      }
    });

    //filter by date component
    $('#js-date-filter .dropdown-menu .dropdown-item').on('click', function(e) {
      e.preventDefault();
      $('#js-date-filter .dropdown-menu .active').removeClass('active');
      var getClickedValue = $(this).text();
      $(this).addClass('active');
      var toggleValue = $('#filter-group-2 .year-holder').text();
      $('#filter-group-2 .year-holder').text('('+getClickedValue+')');
      if(M.AppView.filterView){
        M.AppView.filterView.model.set({year: getClickedValue});
        M.Navigator.navigate(window.location.hash + '/' + getClickedValue, {trigger: true});
      }
    });

    //Library page filter - id conflict
    $('.js-toggle-sort .dropdown-menu a').on('click', function(e) {
      e.preventDefault();
      var getClickedValue = $(this).text().trim();
      var toggleValue = $($(this).parent().siblings()[1]).text().trim();
      $($(this).parent().siblings()[1]).text(getClickedValue);
      $(this).text(toggleValue);
    });

    formatDate = function(str){
      //date format for events
      var months = ["January", "February", "March", "April",
                    "May", "June", "July", "August", "September",
                    "October", "November", "December"];
      var ddSuperscript = ["0", "st", "nd", "rd", "th", "th",
                          "th", "th", "th", "th", "th", "th", "th",
                          "th", "th", "th", "th", "th", "th", "th",
                          "th", "th", "th", "th", "st", "nd", "rd",
                          "th", "th", "th", "th", "th", "th", "th", "st"]
      var dobj = new Date(str);
      var formatted;
      formatted = dobj.getDate() + '<sup>'+ ddSuperscript[dobj.getDate()] +
                  ' </sup>'+ months[dobj.getMonth()] + ', ' + dobj.getFullYear();
      return formatted;
    }

    //Limit no of words

    truncateWords = function(str, no_words) {
        return str.split(" ").splice(0,no_words).join(" ");
    }

    //yt player
    initYtPlayer = function() {
      $('#featured-player').hide();
       $('#lib-featured-player').click(function() {
           $('#featured-player').show();
           $('#featured-play-vid').hide();
           $('#fetaured-play-icon').hide();
           $('#featured-play-control').hide();
       });
    }
    
    initYtPlayer();
    /*$("#va-row-carousel").on('click', '[data-toggle="lightbox"]', function(event) {
                    event.preventDefault();
                    $(this).ekkoLightbox();
                });*/

    /*var videoModalManager = function() {
      

      $('#dynamic').on('click', function() {
       
          $(this).lightGallery({
              dynamic: true,
              zoom: false,
              share: false,
              counter: false,

              appendSubHtmlTo: ".lg-toolbar",
              loadYoutubeThumbnail: true,
              youtubeThumbSize: 'default',
              youtubePlayerParams: { modestbranding: 1, showinfo: 0, controls: 0 },
              dynamicEl: [{
                  "src": 'https://youtu.be/B_7Lr7OKUMg',
          
                  'subHtml': '<h4>Fading Light</h4><p>Classic view from Rigwood Jetty on Coniston Water an old archive shot similar to an old post but a little later on.</p>'
              }]
          })
       
      });


        
    }

    var modalManager = function() {
 
        $("#myModal").on("hidden.bs.modal",function(){
          $("#iframeYoutube").attr("src","#");
        })
     

      
    }

    M.changeVideo = function (vId){
      var iframe=document.getElementById("iframeYoutube");
      iframe.src="https://www.youtube.com/embed/"+vId;

      $("#myModal").modal("show");
    }
  
    M.changeImage = function(img){
      var src = 
    }
  */
    //Expose Api
    M.init = init;
    // Call Api's
    M.init();
 


 function alignModal(){
     var self = this;
     var modalDialog = $(this).find(".modal-dialog");
     //console.log(Math.max(0, ($(window).height() - modalDialog.height()) / 2), $(window).height())
     /* Applying the top margin on modal dialog to align it vertically center */

    // modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
     //scroll down by an offset
     setTimeout(function(){ 
      var modal = $(".modal");
      modal.scrollTop($(window).height() /2); 
    }, 0.05);
     
 }

 // Align modal when it is displayed

 $(".modal").on("shown.bs.modal", alignModal);

 

 // Align modal when user resize the window

 $(window).on("resize", function(){

     $(".modal:visible").each(alignModal);

 });   
});