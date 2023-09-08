const { webm, mp4 } = require("./media.js");

// Detect native Wake Lock API support (Samsung Browser supports it but cannot use it + not fully supported in iOS)
const nativeWakeLock = () =>
  "wakeLock" in navigator &&
  !((/ipad|iphone|ipod/i).test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document))

let isNativeWakeLockSupported = true;

class NoSleep {
  constructor(enableWakeLockIfSupported = true) {
    this.enabled = false;

    if (enableWakeLockIfSupported && nativeWakeLock()) {
      this._wakeLock = null;
      const handleVisibilityChange = () => {
        if (this._wakeLock !== null && document.visibilityState === "visible") {
          this.enable();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("fullscreenchange", handleVisibilityChange);
    } else {
      isNativeWakeLockSupported = false;
      // Set up no sleep video element
      this.noSleepVideo = document.createElement("video");
      this.noSleepVideo.setAttribute("title", "No Sleep");
      this.noSleepVideo.setAttribute("playsinline", "");
      this._addSourceToVideo(this.noSleepVideo, "webm", webm);
      this._addSourceToVideo(this.noSleepVideo, "mp4", mp4);

      // For iOS >15 video needs to be on the document to work as a wake lock
      Object.assign(this.noSleepVideo.style, {
        position: "absolute",
        left: "-100%",
        top: "-100%",
      });
      document.querySelector("body").append(this.noSleepVideo);

      this.noSleepVideo.addEventListener("loadedmetadata", () => {
        if (this.noSleepVideo.duration <= 1) {
          // webm source
          this.noSleepVideo.setAttribute("loop", "");
        } else {
          // mp4 source
          this.noSleepVideo.addEventListener("timeupdate", () => {
            if (this.noSleepVideo.currentTime > 0.5) {
              this.noSleepVideo.currentTime = Math.random();
            }
          });
        }
      });
    }
  }

  enable = async () => {
    if (isNativeWakeLockSupported) {
      try {
        this._wakeLock = await navigator.wakeLock.request("screen");
        this.enabled = true;
        console.info("Wake Lock active.");
      } catch (err) {
        this.enabled = false;
        console.error(`NoSleep failed to activate WakeLock, error: ${err.message}`);
      }
    } else {
      try {
        await this.noSleepVideo.play();
        this.enabled = true;
      } catch (err) {
        this.enabled = false;
        console.error(`NoSleep failed to play Video, error: ${err.message}`);
      }
    }
  };

  disable = () => {
    if (isNativeWakeLockSupported) {
      if (this._wakeLock) {
        this._wakeLock.release();
        console.info("Wake Lock released.");
      }
      this._wakeLock = null;
    } else {
      this.noSleepVideo.pause();
    }
    this.enabled = false;
  };

  _addSourceToVideo(element, type, dataURI) {
    var source = document.createElement("source");
    source.src = dataURI;
    source.type = `video/${type}`;
    source.setAttribute('playsinline', 'true');
    element.appendChild(source);
  }

  get isEnabled() {
    return this.enabled;
  }
}

module.exports = NoSleep;
