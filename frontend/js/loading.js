// Animation fade effect for loading page
document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    // Adding fade class on document ready
    $('#preloading').addClass('fade_out');
    // Animation listener for compleated animation
    $('#preloading').on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (event) {
      if (event.originalEvent.animationName !== 'fadeoutelement') {
        return;
      }
      // New state for page display
      $('#preloading').hide();
      $('#loaded').css('visibility', 'visible');
      $('BODY').css('overflow', 'visible');
    });
  }
};
