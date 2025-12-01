declare class NoSleep {
  /**
   * Creates a NoSleep instance.
   * @param enableWakeLockIfSupported - Whether to attempt using the native Wake Lock API. Defaults to true.
   */
  constructor(enableWakeLockIfSupported?: boolean);

  /**
   * Indicates whether NoSleep is currently active (either via Wake Lock or video playback).
   */
  readonly isEnabled: boolean;

  /**
   * Activates the NoSleep functionality.
   * If native Wake Lock is supported, it requests a screen wake lock.
   * Otherwise, it starts playing the hidden video.
   */
  enable(): Promise<void>;

  /**
   * Deactivates the NoSleep functionality.
   * If a native wake lock is active, it is released.
   * Otherwise, the hidden video is paused.
   */
  disable(): void;

  // NOTE: Internal methods like _addSourceToVideo are omitted as they are not part of the public API.
}

// Export the class for use via default import
export default NoSleep;

// Also declare the class on the global Window object if intended for global script usage
declare global {
  interface Window {
    NoSleep: typeof NoSleep;
  }
}
