var $songItem, countdown, currentTime, songFilter;

window.pageName = 'list';

window.list = [];

window.pageNumber = 1;

window.perPage = 200;

window.append = false;

window.hash = 'asc';

window.waveform = void 0;

window.appendFinish = false;

countdown = Date.now();

currentTime = Date.now();

songFilter = function(filter) {
  $('.song-list').find(".song-string:not(:Contains(" + filter + "))").parents('li').hide();
  return $('.song-list').find(".song-string:contains(" + filter + ")").parents('li').show();
};

$songItem = function(item, display) {
  var top20;

  if (item.winners !== void 0 && item.winners === true) {
    top20 = ' top20';
  } else if (item.top20 !== void 0 && item.top20 === true) {
    top20 = ' top20';
  } else {
    top20 = '';
  }
  return '<li class="song-item song-item-' + item.id + display + top20 + '" data-id="' + item.id + '" data-vote="' + item.vote_count + '">\
    <div class="song-string">' + padLeft(item.id, 3) + ',' + item.id + ',' + item.title.toLowerCase() + ',' + item.desc.toLowerCase() + ',' + item.author_name.toLowerCase() + '\
    </div>\
    <div class="song-content">\
      <a href="/song/' + item.id + '">\
        <div class="song-number">' + padLeft(item.id, 3) + '</div>\
        <div class="song-info">\
          <div class="song-title">' + item.title + '</div>\
          <div class="song-artist">' + item.author_name + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br class="mobile-wrap"><!--播放次數: <span class="play-times"></span>--></div>\
        </div>\
      </a>\
    </div>\
    <div class="song-player">\
      <button class="play-button" data-id="' + item.id + '" data-trackid="' + item.track_id + '" data-sid=""></button>\
      <div class="song-wave">\
        <div class="waveform-preview"></div>\
        <div class="waveform"></div>\
        <input type="hidden" class="song-waveform-value" value="' + item.waveform + '">\
      </div>\
    </div>\
    <div class="song-tool-buttons">\
      <div class="vote-button-container">\
        <button class="vote-button" type="button" data-id="' + item.id + '"><i class="icon-vote"></i>投他一票</button>\
        <div class="vote-count">' + item.vote_count + ' 票</div>\
      </div>\
      <button class="fb-share" type="button" data-href="https://www.facebook.com/sharer/sharer.php?u=http://melody.iing.tw/song/' + item.id + '">分享</button>\
    </div>\
  </li>';
};

$(function() {
  var appendStateCheckInterval, hash;

  if (window.location.hash !== '') {
    hash = window.location.hash.toLowerCase();
    xx(hash);
    if (hash === '#asc') {
      window.hash = 'asc';
    } else if (hash === '#desc') {
      window.hash = 'desc';
    } else if (hash === '#ranking') {
      window.hash = 'ranking';
    } else {
      window.hash = 'asc';
    }
  } else {
    window.hash = 'asc';
  }
  setLoadingTime();
  $.getJSON('/json/soundclouds.json', function(r) {
    var display, i, item, _i, _len, _ref, _results;

    xx('api done');
    r = r.slice().sort(function(a, b) {
      return a.id - b.id;
    });
    window.list = r;
    window.loading = true;
    $('.song-list').addClass('loading');
    i = 0;
    _ref = window.list;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (i > window.perPage - 1) {
        display = ' hide';
      } else {
        display = '';
      }
      $('.song-list').append($songItem(item, display));
      if (isDesktop === false) {
        $('.song-item-' + item.id + ' .play-button').addClass('loading');
      }
      i++;
      if (i === window.list.length) {
        xx(window.hash);
        if (window.hash === 'asc') {
          $('#listSorting').val(1);
          tinysort('ul.song-list>li', {
            data: 'id',
            order: 'asc'
          });
        } else if (window.hash === 'desc') {
          $('#listSorting').val(2);
          tinysort('ul.song-list>li', {
            data: 'id',
            order: 'desc'
          });
        } else if (window.hash === 'ranking') {
          $('#listSorting').val(3);
          tinysort('ul.song-list>li', {
            data: 'vote',
            order: 'desc'
          });
        }
        $('.search-bar').removeClass('off');
        $('.song-list').removeClass('loading');
        $('.page .spinner').remove();
        window.appendFinish = true;
        _results.push(stopLoadingTime());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  });
  appendStateCheckInterval = setInterval(function() {
    var item, songWaveform, waveform, _i, _len, _ref, _results;

    xx('append waiting');
    if (window.appendFinish) {
      clearInterval(appendStateCheckInterval);
      if (window.isDesktop) {
        return $.getJSON('/json/waveform.json', function(r) {
          var item, songWaveform, waveform, waveformItem, _i, _len, _ref, _results;

          window.waveform = r;
          _ref = window.list;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            waveformItem = getItemById(window.waveform, item.id);
            songWaveform = waveformStringToArray(waveformItem.waveform);
            _results.push(waveform = new Waveform({
              container: $('.song-item-' + item.id + ' .waveform-preview').get(0),
              innerColor: 'rgba(0,0,0,.1)',
              data: songWaveform
            }));
          }
          return _results;
        });
      } else {
        _ref = window.list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          songWaveform = [1, 1, 1, 1, 1];
          waveform = new Waveform({
            container: $('.song-item-' + item.id + ' .waveform-preview').get(0),
            innerColor: 'rgba(0,0,0,.1)',
            data: songWaveform
          });
          _results.push(createWaveform(item.id, item.track_id, songWaveform, '.song-item-' + item.id));
        }
        return _results;
      }
    }
  }, 100);
  $('body').delegate('.search-string', 'keydown', function() {
    return countdown = Date.now();
  });
  $('body').delegate('.search-string', 'keyup', function() {
    var filter;

    filter = ($(this).val()).toLowerCase();
    return setTimeout((function() {
      currentTime = Date.now();
      if (currentTime - countdown >= 490) {
        $('.no-result-container').removeClass('on');
        if (filter) {
          $('body').addClass('searching');
          songFilter(filter);
        } else {
          $('body').removeClass('searching');
          $('.song-list li').show();
        }
        return setInterval((function() {
          if ($('.song-list li').filter(':visible').size() === 0) {
            return $('.no-result-container').addClass('on');
          }
        }), 500);
      }
    }), 500);
  });
  return $('body').delegate('#listSorting', 'change', function() {
    var value;

    value = parseInt($(this).val());
    if (value === 1) {
      window.location.hash = '#asc';
      return tinysort('ul.song-list>li', {
        data: 'id',
        order: 'asc'
      });
    } else if (value === 2) {
      window.location.hash = '#desc';
      return tinysort('ul.song-list>li', {
        data: 'id',
        order: 'desc'
      });
    } else if (value === 3) {
      window.location.hash = '#ranking';
      return tinysort('ul.song-list>li', {
        data: 'vote',
        order: 'desc'
      });
    }
  });
});
