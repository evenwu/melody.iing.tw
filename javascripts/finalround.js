var $songItem;

window.pageName = 'list';

window.list = [];

window.pageNumber = 1;

window.perPage = 200;

window.append = false;

window.waveform = void 0;

window.appendFinish = false;

$songItem = function(i, item) {
  var num;

  num = item.id;
  return '<li class="song-item song-item-' + item.id + '" data-id="' + item.id + '" data-vote="' + item.vote_count + '">\
    <div class="song-content">\
      <a href="/song/' + item.id + '">\
        <div class="song-number">' + num + '</div>\
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
      window.hash = 'ranking';
    }
  } else {
    window.hash = 'ranking';
  }
  setLoadingTime();
  $.getJSON('/json/soundclouds.json', function(r) {
    var i, item, j, _i, _len, _ref, _results;

    xx('api done');
    r = r.slice().sort(function(a, b) {
      return b.vote_count - a.vote_count;
    });
    window.list = r;
    window.loading = true;
    $('.song-list').addClass('loading');
    i = 0;
    j = 0;
    _ref = window.list;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (item.winners) {
        $('.song-list').append($songItem(j, item));
        j++;
      }
      i++;
      if (i === window.list.length) {
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
  return appendStateCheckInterval = setInterval(function() {
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
            if (item.winners) {
              waveformItem = getItemById(window.waveform, item.id);
              songWaveform = waveformStringToArray(waveformItem.waveform);
              _results.push(waveform = new Waveform({
                container: $('.song-item-' + item.id + ' .waveform-preview').get(0),
                innerColor: 'rgba(0,0,0,.1)',
                data: songWaveform
              }));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      } else {
        _ref = window.list;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (item.winners) {
            songWaveform = [1, 1, 1, 1, 1];
            waveform = new Waveform({
              container: $('.song-item-' + item.id + ' .waveform-preview').get(0),
              innerColor: 'rgba(0,0,0,.1)',
              data: songWaveform
            });
            $('.song-item-' + item.id + ' .play-button').addClass('loading');
            _results.push(createWaveform(item.id, item.track_id, songWaveform, '.song-item-' + item.id));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    }
  }, 100);
});
