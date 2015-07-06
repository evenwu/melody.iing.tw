var DEBUG, xx;

DEBUG = false;

window.inInterval = false;

xx = function(x) {
  return DEBUG && console.log(x);
};

$(function() {
  return $('body').delegate('.header-nav-button', 'click', function() {
    if ($('.header-nav').hasClass('off')) {
      return $('.header-nav').addClass('on').removeClass('off');
    } else {
      return $('.header-nav').addClass('off').removeClass('on');
    }
  });
});
