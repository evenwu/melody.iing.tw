var $popup400ErrorContent, $popup429ErrorContent, $popupAlarmContent, $popupErrorContent, $popupLoginContent, $popupLoginErrorContent, $popupSuccessContent, createWaveform, getItemById, getUrlVars, isMobile, nl2br, padLeft, setLoadingTime, showPopup, showPopupLoading, soundManager, soundTrack, stopLoadingTime, syncWaveform, vote, voteCheck, waveformStringToArray;

SC.initialize({
  client_id: 'd2f7da453051d648ae2f3e9ffbd4f69b'
});

soundManager = void 0;

soundTrack = [];

window.getVars = [];

window.autoLoop = false;

window.autoPlay = false;

window.shuffle = false;

window.isDesktop = true;

window.soundcloudId = void 0;

window.userVoted = [];

window.loadingTime = void 0;

$popupLoginContent = function(id) {
  return '<i class="icon-alarm"></i>\
  <h2>請先登入臉書帳號</h2>\
  <p>投票會需要你的臉書帳號</p>\
  <button class="btn btn_primary login-button">以 Facebook 登入投票</button><br>\
  <button type="button" class="close-popup">算了</button>';
};

$popupAlarmContent = function(id) {
  return '<i class="icon-alarm"></i>\
  <h2>咦，你今天已經投過囉！</h2>\
  <p>每天可以對任一首歌投票一次</p>\
  <a class="btn btn_primary" href="https://www.facebook.com/sharer/sharer.php?u=http://melody.iing.tw/song/' + id + '" target="_blank">分享拉票</a><br>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

$popupSuccessContent = function(id) {
  return '<i class="icon-success"></i>\
  <h2>恭喜你完成投票！</h2>\
  <p>是否將投票的好歌曲分享到臉書？</p>\
  <a class="btn btn_primary" href="https://www.facebook.com/sharer/sharer.php?u=http://melody.iing.tw/song/' + id + '" target="_blank">分享拉票</a><br>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

$popupErrorContent = function() {
  return '<i class="icon-error"></i>\
  <h2>糟糕！投票失敗...</h2>\
  <p>請嘗試重新整理頁面</p>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

$popup400ErrorContent = function() {
  return '<i class="icon-error"></i>\
  <h2>糟糕，出錯了...</h2>\
  <p>請嘗試重新整理頁面</p>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

$popup429ErrorContent = function() {
  return '<i class="icon-error"></i>\
  <h2>目前網路壅塞</h2>\
  <p>請晚一點再來播放</p>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

$popupLoginErrorContent = function() {
  return '<i class="icon-error"></i>\
  <h2>糟糕！登入失敗...</h2>\
  <p>請嘗試重新整理頁面</p>\
  <button class="btn btn_primary" type="button">再試一次</button><br>\
  <button type="button" class="close-popup">關閉視窗</button>';
};

isMobile = function() {
  return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/BlackBerry/);
};

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

padLeft = function(str, length) {
  if (str.toString().length >= length) {
    return str;
  } else {
    return padLeft('0' + str, length);
  }
};

nl2br = function(str, is_xhtml) {
  var breakTag;

  breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br ' + '/>' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
};

waveformStringToArray = function(str) {
  return str.split(',').map(Number);
};

voteCheck = function(facebook_token, soundcloud_id) {
  xx('vote check');
  return $.ajax({
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      facebook_token: facebook_token,
      soundcloud_id: soundcloud_id
    },
    url: '//api.iing.tw/vote_check.json',
    error: function(response) {
      xx(response);
      return showPopup($popup400ErrorContent());
    },
    success: function(response) {
      if (response.message === true) {
        return vote(facebook_token, soundcloud_id);
      } else {
        disableVoteButton(soundcloud_id);
        return showPopup($popupAlarmContent(soundcloud_id));
      }
    }
  });
};

vote = function(facebook_token, soundcloud_id) {
  xx(facebook_token);
  xx(soundcloud_id);
  return $.ajax({
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      facebook_token: facebook_token,
      soundcloud_id: soundcloud_id
    },
    url: '//api.iing.tw/votes.json',
    success: function(r) {
      xx(r);
      if (r.message === 'success') {
        showPopup($popupSuccessContent(soundcloud_id));
        disableVoteButton(soundcloud_id);
        if (window.pageName === 'list') {
          return $('.song-item-' + soundcloud_id + ' .vote-count').text(r.vote_count + ' 票');
        } else {
          return $('.vote-count').text(r.vote_count + ' 票');
        }
      } else {
        return showPopup($popupErrorContent());
      }
    }
  });
};

showPopup = function(html) {
  var loading, popup;

  stopLoadingTime();
  popup = $('.popup-container');
  loading = $('.popup-loading-container');
  if (popup.hasClass('on') === true) {
    popup.removeClass('on');
  }
  if (loading.hasClass('on') === true) {
    loading.removeClass('on');
  }
  $('.popup-dialog-inner').html(html);
  return popup.addClass('on');
};

showPopupLoading = function() {
  var loading, popup;

  popup = $('.popup-container');
  loading = $('.popup-loading-container');
  if (popup.hasClass('on') === true) {
    popup.removeClass('on');
  }
  return loading.addClass('on');
};

createWaveform = function(id, track_id, waveform, selector, autoplay) {
  if ($(selector + ' .waveform canvas').length <= 0) {
    return SC.get('/tracks/' + track_id, function(track) {
      var ctx, gradient, sound;

      xx('get track success');
      soundTrack[track_id] = track;
      sound = void 0;
      $(selector + ' .waveform-preview canvas').remove();
      waveform = new Waveform({
        container: $(selector + ' .waveform').get(0),
        innerColor: 'rgba(0,0,0,.1)',
        data: waveform
      });
      ctx = waveform.context;
      gradient = ctx.createLinearGradient(0, 0, 0, waveform.height);
      gradient.addColorStop(0.0, '#E4E779');
      gradient.addColorStop(1.0, '#57C0C7');
      waveform.innerColor = function(x) {
        if (sound && x < sound.position / sound.durationEstimate) {
          return gradient;
        } else if (sound && x < sound.bytesLoaded / sound.bytesTotal) {
          return 'rgba(0,0,0,.2)';
        } else {
          return 'rgba(0,0,0,.1)';
        }
      };
      return SC.stream('/tracks/' + track_id, {
        whileloading: waveform.redraw,
        whileplaying: waveform.redraw,
        volume: 100,
        useHTML5Audio: true,
        preferFlash: false
      }, function(s) {
        var playSong;

        xx('stream prepared');
        if (window.isDesktop === false) {
          xx('remove loading');
          $(selector + ' .play-button').removeClass('loading');
        }
        $(selector + ' .play-button').attr('data-sid', s.sID);
        sound = s;
        if (window.isDesktop) {
          if (window.autoPlay || window.shuffle || autoplay) {
            xx('auto play starting');
            playSong = function(element, sid) {
              return soundManager.play(sid, {
                onload: function(state) {
                  if (state === false) {
                    showPopup($popup429ErrorContent());
                    element.addClass('play-button');
                    return element.removeClass('pause-button');
                  }
                },
                onplay: function() {
                  xx('play');
                  element.addClass('pause-button');
                  element.removeClass('loading');
                  return element.removeClass('play-button');
                },
                onresume: function() {
                  xx('resume');
                  element.addClass('pause-button');
                  element.removeClass('loading');
                  return element.removeClass('play-button');
                },
                onfinish: function() {
                  xx('song finish');
                  if (window.autoLoop) {
                    return playSong(element, sid);
                  } else if (window.shuffle && window.pageName === 'song') {
                    return window.location = $('#nextSong').attr('href');
                  } else {
                    element.addClass('play-button');
                    return element.removeClass('pause-button');
                  }
                }
              });
            };
            if (window.pageName === 'list') {
              return playSong($('.play-button.loading'), s.sID);
            } else {
              return playSong($('.play-button'), s.sID);
            }
          }
        }
      });
    });
  }
};

syncWaveform = function(id, token, data) {
  return $.ajax({
    type: 'post',
    dataType: 'json',
    cache: false,
    data: {
      id: id,
      token: token,
      data: data.toString()
    },
    url: '//api.iing.tw/sync_waveform.json',
    success: function(response) {
      return xx(response);
    }
  });
};

getItemById = function(array, id) {
  var i;

  i = 0;
  while (i < array.length) {
    if (array[i].id === id) {
      return array[i];
    }
    i++;
  }
};

setLoadingTime = function() {
  var loadingStateCheckInterval;

  window.loadingTime = Date.now();
  return loadingStateCheckInterval = setInterval(function() {
    if (window.loadingTime === void 0) {
      return clearInterval(loadingStateCheckInterval);
    } else {
      if (Date.now() - window.loadingTime >= 5000) {
        if ($('.too-many-people-is-here').hasClass('on') === false) {
          return $('.too-many-people-is-here').addClass('on');
        }
      }
    }
  }, 500);
};

stopLoadingTime = function() {
  window.loadingTime = void 0;
  return $('.too-many-people-is-here').removeClass('on');
};

$(function() {
  if (isMobile()) {
    xx('is mobile');
    window.isDesktop = false;
  }
  window.getVars = getUrlVars();
  if (parseInt(window.getVars['loop']) === 1) {
    window.autoLoop = true;
  }
  if (parseInt(window.getVars['shuffle']) === 1) {
    window.shuffle = true;
  }
  $('body').delegate('.vote-button', 'click', function() {
    var soundcloud_id;

    xx('vote button clicked');
    setLoadingTime();
    soundcloud_id = $(this).data('id');
    showPopupLoading();
    return FB.getLoginStatus(function(response) {
      var facebook_token;

      xx(response);
      if (response.status === 'connected') {
        facebook_token = response.authResponse.accessToken;
        return voteCheck(facebook_token, soundcloud_id);
      } else {
        window.soundcloudId = soundcloud_id;
        return showPopup($popupLoginContent());
      }
    });
  });
  $('body').delegate('.login-button', 'click', function() {
    xx('login button clicked');
    showPopupLoading();
    return FB.login((function(response) {
      var facebook_token;

      if (response.status === 'connected') {
        facebook_token = response.authResponse.accessToken;
        xx(facebook_token);
        xx(window.soundcloudId);
        return voteCheck(facebook_token, window.soundcloudId);
      } else {
        return showPopup($popupLoginErrorContent());
      }
    }), {
      return_scopes: true
    });
  });
  $('body').delegate('.play-button', 'click', function() {
    var item, playSong, sid, songid, trackid, waveform, _this;

    xx('play');
    $('.play-button').removeClass('loading');
    $(this).addClass('loading');
    if (soundManager !== void 0) {
      soundManager.pauseAll();
      $('.pause-button').addClass('play-button');
      $('.play-button').removeClass('pause-button');
    }
    if ($(this).parents('.song-player').find('.waveform').find('canvas').length <= 0) {
      xx('no canvas');
      xx(songid = $(this).data('id'));
      xx(trackid = $(this).data('trackid'));
      if (window.pageName === 'list') {
        item = getItemById(window.list, songid);
        waveform = waveformStringToArray(item.waveform);
        return createWaveform(songid, trackid, waveform, '.song-item-' + songid, true);
      } else if (window.pageName === 'song') {
        waveform = waveformStringToArray(window.item.waveform);
        return createWaveform(songid, trackid, waveform, '.page', true);
      }
    } else {
      xx('canvas exist');
      _this = $(this);
      sid = _this.data('sid');
      playSong = function(element, sid) {
        return soundManager.play(sid, {
          onload: function(state) {
            if (state === false) {
              showPopup($popup429ErrorContent());
              element.addClass('play-button');
              return element.removeClass('pause-button');
            }
          },
          onplay: function() {
            element.addClass('pause-button');
            element.removeClass('loading');
            return element.removeClass('play-button');
          },
          onresume: function() {
            element.addClass('pause-button');
            element.removeClass('loading');
            return element.removeClass('play-button');
          },
          onfinish: function() {
            if (window.autoLoop) {
              return playSong(element, sid);
            } else {
              element.addClass('play-button');
              return element.removeClass('pause-button');
            }
          }
        });
      };
      return playSong(_this, sid);
    }
  });
  $('body').delegate('.pause-button', 'click', function() {
    soundManager.pauseAll();
    $(this).removeClass('pause-button');
    return $(this).addClass('play-button');
  });
  $('body').delegate('.fb-share', 'click', function() {
    var href;

    href = $(this).data('href');
    return window.open(href);
  });
  $('body').delegate('.waveform', 'click', function(e) {
    var button, currentTrack, duration, position, sid, target, trackid;

    button = $(this).parents('.song-player').find('button');
    sid = button.data('sid');
    trackid = button.data('trackid');
    currentTrack = soundTrack[trackid];
    duration = currentTrack.duration;
    position = (e.pageX - $(this).offset().left) / $(this).width();
    target = Math.floor(duration * position);
    return soundManager.setPosition(sid, target);
  });
  $('body').delegate('.close-popup', 'click', function() {
    return $('.popup-container').removeClass('on');
  });
  return $(document).mouseup(function(e) {
    var container;

    container = $('.popup-dialog-inner');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      return $('.popup-container').removeClass('on');
    }
  });
});
