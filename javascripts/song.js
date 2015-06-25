var getUrlVars;

window.pageName = 'song';

getUrlVars = function() {
  var hash, hashes, i, vars;

  vars = [];
  hash = void 0;
  hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  i = 0;
  while (i < hashes.length) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
    i++;
  }
  return vars;
};

$(function() {
  var explode, id, song_no, url;

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
    id = parseInt(song_no);
    return $.getJSON('http://api.iing.tw/soundclouds/' + id + '.json?token=8888', function(item) {
      var songWaveform, waveform;

      $('.song-title').text(item.title);
      $('.song-artist').text(item.author_name);
      $('.song-number').text(padLeft(item.id, 3));
      $('.vote-count span').text(item.vote_count);
      $('.song-lyric p').html(nl2br(item.lyrics));
      $('.song-intro p').html(nl2br(item.desc));
      $('.song-waveform-value').val(item.waveform);
      $('.vote-button').attr('data-id', item.id);
      $('.play-button').attr('data-trackid', item.track_id);
      $('.next-song a').attr('href', '/song/' + item.next_song_id);
      $('.fb-share').attr('data-href', 'https://www.facebook.com/sharer/sharer.php?u=http://melody.iing.tw/song/' + item.id);
      if (item.official_url) {
        $('.song-intro .song-artist').prepend('<a class="official-link" targe="_blank" href="' + item.official_url + '">Official Link</a>');
      }
      if (item.waveform === null) {
        SC.get('/tracks/' + item.track_id, function(track) {
          xx(track);
          xx(track.waveform_url);
          return $.getJSON('http://waveformjs.org/w?callback=?', {
            url: track.waveform_url
          }, function(d) {
            var songWaveform, waveform;

            xx(d);
            syncWaveform(item.id, item.token, d);
            songWaveform = d;
            return waveform = new Waveform({
              container: $('.waveform-preview').get(0),
              innerColor: '#F0F0F0',
              data: songWaveform
            });
          });
        });
      } else {
        songWaveform = waveformStringToArray(item.waveform);
        waveform = new Waveform({
          container: $('.waveform-preview').get(0),
          innerColor: '#F0F0F0',
          data: songWaveform
        });
      }
      return createWaveform(item.id, item.track_id, songWaveform, '.song-player');
    });
  }
});
