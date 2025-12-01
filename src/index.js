const { webm, mp4 } = require('./media.js');

const nativeWakeLockSupported = () => {
  // Check for 'wakeLock' support AND exclude specific iOS/iPadOS user agents
  const isIOS = (/ipad|iphone|ipod/i).test(navigator.userAgent) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  return 'wakeLock' in navigator && !isIOS;
};

class NoSleep {
  /**
   * @type {WakeLockSentinel | null}
   */
  _wakeLock = null;

  /**
   * @type {boolean}
   */
  _isNativeSupported = nativeWakeLockSupported();

  /**
   * @type {HTMLVideoElement | null}
   */
  _noSleepVideo = null;

  constructor(enableWakeLockIfSupported = true) {
    this.enabled = false;

    if (enableWakeLockIfSupported && this._isNativeSupported) {
      document.addEventListener('visibilitychange', this._handleVisibilityChange);
      document.addEventListener('fullscreenchange', this._handleVisibilityChange);

      console.debug('Native Wake Lock API selected.');
    } else {
      this._isNativeSupported = false;
      this._setupVideoFallback();
    }
  }

  // --- Private Wake Lock Handler (Arrow function for correct 'this' binding) ---
  _handleVisibilityChange = () => {
    if (this._wakeLock !== null && document.visibilityState === 'visible') {
      this.enable();
    }
  };

  // --- Private Video Fallback Setup ---
  _setupVideoFallback() {
    this._noSleepVideo = document.createElement('video');
    this._noSleepVideo.setAttribute('title', 'No Sleep');
    this._noSleepVideo.setAttribute('playsinline', '');
    this._noSleepVideo.muted = true;

    this._addSourceToVideo(this._noSleepVideo, 'webm', webm);
    this._addSourceToVideo(this._noSleepVideo, 'mp4', mp4);

    Object.assign(this._noSleepVideo.style, {
      position: 'absolute',
      left: '-100%',
      top: '-100%',
    });

    document.body?.append(this._noSleepVideo);

    this._noSleepVideo.addEventListener('loadedmetadata', () => {
      if (this._noSleepVideo.duration > 1) {
        this._noSleepVideo.addEventListener('timeupdate', this._handleMp4TimeUpdate);
      } else {
        this._noSleepVideo.setAttribute('loop', '');
      }
    });
  }

  _handleMp4TimeUpdate = () => {
    if (this._noSleepVideo && this._noSleepVideo.currentTime > 0.5) {
      this._noSleepVideo.currentTime = Math.random() * 0.1;
    }
  };

  _addSourceToVideo(element, type, dataURI) {
    const source = document.createElement('source');
    source.src = dataURI;
    source.type = `video/${type}`;
    element.appendChild(source);
  }

  // --- Public Methods (Class Field Declaration syntax) ---

  enable = async () => {
    if (this._isNativeSupported) {
      if (this._wakeLock) return;

      try {
        this._wakeLock = await navigator.wakeLock.request('screen');
        this._wakeLock.addEventListener('release', () => {
          this._wakeLock = null;
          this.enabled = false;
          console.warn('Wake Lock released by browser.');
        });
        this.enabled = true;
        console.info('Wake Lock active.');
      } catch (err) {
        this.enabled = false;
        console.warn(`NoSleep failed to activate WakeLock: ${err.message}`);
      }
    } else if (this._noSleepVideo) {
      try {
        await this._noSleepVideo.play();
        this.enabled = true;
      } catch (err) {
        this.enabled = false;
        console.warn(`NoSleep failed to play Video: ${err.message}`);
      }
    }
  };

  disable = () => {
    if (this._isNativeSupported) {
      if (this._wakeLock) {
        this._wakeLock.release().then(() => {
          this._wakeLock = null;
        });
        console.info('Wake Lock released.');
      }
    } else if (this._noSleepVideo) {
      this._noSleepVideo.pause();
    }
    this.enabled = false;
  };

  get isEnabled() {
    return this.enabled;
  }
}

module.exports = NoSleep;
