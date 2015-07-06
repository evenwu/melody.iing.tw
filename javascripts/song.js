var checkUserVoted, disableVoteButton;

window.pageName = 'song';

window.id = void 0;

window.item = void 0;

checkUserVoted = function(facebook_token) {
  return $.ajax({
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      facebook_token: facebook_token
    },
    url: '//api.iing.tw/check_user_voted.json',
    success: function(response) {
      var id, _i, _len, _ref, _results;

      _ref = response.data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        id = _ref[_i];
        if (id === window.id) {
          _results.push(disableVoteButton());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  });
};

disableVoteButton = function() {
  var button;

  button = $('.vote-button');
  if (button.hasClass('done') === false) {
    button.addClass('done');
    return button.text('感謝支持！');
  }
};

$(document).on('fbload', function() {
  return FB.getLoginStatus(function(response) {
    xx(response);
    if (response.status === 'connected') {
      return checkUserVoted(response.authResponse.accessToken);
    }
  });
});

$(function() {
  var explode, song_no, url;

  xx(window.getVars);
  if (parseInt(window.getVars['autoplay']) === 1) {
    window.autoPlay = true;
  }
  url = window.location.href;
  if (url.indexOf('?') > 0) {
    url = url.split('?')[0];
  }
  if (url.indexOf('#') > 0) {
    url = url.split('#')[0];
  }
  explode = url.split('/');
  song_no = explode[4];
  if (typeof song_no !== 'undefined' && parseInt(song_no) > 0) {
    window.id = parseInt(song_no);
    setLoadingTime();
    return $.getJSON('//api.iing.tw/soundclouds/' + window.id + '.json?token=8888', function(item) {
      var songWaveform, waveform;

      xx(item);
      window.item = item;
      $('.song-title').text(item.title);
      $('.song-number').text(padLeft(item.id, 3));
      $('.song-lyric p').html(nl2br(item.lyrics));
      $('.song-intro p').html(nl2br(item.desc));
      $('.song-waveform-value').val(item.waveform);
      $('.vote-button').attr('data-id', item.id);
      $('.play-button').attr('data-id', item.id).attr('data-trackid', item.track_id);
      $('#nextSong').attr('href', '/song/' + item.next_song_id + '/?shuffle=1');
      $('.vote-count').text(item.vote_count + ' 票');
      $('.fb-share').attr('data-href', 'https://www.facebook.com/sharer/sharer.php?u=http://melody.iing.tw/song/' + item.id);
      if (item.official_url) {
        $('.song-intro .song-artist').prepend('<a class="official-link" target="_blank" href="' + item.official_url + '">' + item.author_name + '</a>');
      } else {
        $('.song-artist').text(item.author_name);
      }
      songWaveform = waveformStringToArray(item.waveform);
      waveform = new Waveform({
        container: $('.waveform-preview').get(0),
        innerColor: 'rgba(0,0,0,.1)',
        data: songWaveform
      });
      if (window.shuffle && window.isDesktop) {
        $('.play-button').addClass('loading');
        createWaveform(item.id, item.track_id, songWaveform, '.song-player');
      }
      if (window.isDesktop === false) {
        createWaveform(item.id, item.track_id, songWaveform, '.song-player');
      }
      $('.page .spinner').remove();
      $('.song-detail').removeClass('off');
      $('.song-player-container').removeClass('off');
      $('.page-bottom-illustrator').removeClass('off');
      return stopLoadingTime();
    });
  }
});
