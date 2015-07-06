var DEBUG, xx;

DEBUG = false;

window.inInterval = false;

xx = function(x) {
  return DEBUG && console.log(x);
};

$(function() {
  $.getJSON('//api.iing.tw/check_ininterval.json?token=8888', function(r) {
    if (r.in_interval === false) {
      window.inInterval = false;
      return $('body').addClass('event-close');
    }
  });
  return $('body').delegate('.header-nav-button', 'click', function() {
    if ($('.header-nav').hasClass('off')) {
      return $('.header-nav').addClass('on').removeClass('off');
    } else {
      return $('.header-nav').addClass('off').removeClass('on');
    }
  });
});
