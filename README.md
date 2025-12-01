# NoSleep.js

Prevent display sleep and enable wake lock in all Android and iOS web browsers.

## Installation

This package is published to npm as **@marsgames/nosleep.js** and can be installed with:

`pnpm install @marsgames/nosleep.js`

## Build from source

Install all development dependencies with:

`pnpm install`

To build this library run:

`pnpm run build`

## Usage

The library is distributed as a modern ES Module (ESM).

```javascript
// Import as an ES Module
import NoSleep from '@marsgames/nosleep.js';

// Create a new NoSleep instance.
// By default, it attempts to use the native Wake Lock API first.
const noSleep = new NoSleep();

// Optional: To force the deprecated video-based fallback method, use:
// const noSleepFallback = new NoSleep(false);
```

To enable wake lock:

*NOTE: This function call must be wrapped in a user input event handler e.g. a mouse or touch handler**

```javascript
// Enable wake lock.
// (must be wrapped in a user input event handler e.g. a mouse or touch handler)
document.addEventListener('click', function enableNoSleep() {
  document.removeEventListener('click', enableNoSleep, false);

  // Asynchronous call required for the Wake Lock API
  noSleep.enable()
    .then(() => console.log('NoSleep is active!'))
    .catch((error) => console.error('NoSleep failed to activate:', error));
}, false);
```

To disable wake lock:

```javascript
// Disable wake lock at some point in the future.
// (does not need to be wrapped in any user input event handler)
noSleep.disable();
```

## Feedback

If you find any bugs or issues please report them on the [NoSleep.js Issue Tracker](https://github.com/Mars-Interactive/NoSleep.js/issues).

If you would like to contribute to this project please consider [forking this repo](https://github.com/Mars-Interactive/NoSleep.js/fork), making your changes and then creating a new [Pull Request](https://github.com/Mars-Interactive/NoSleep.js/pulls) back to the main code repository.

## License

Original author: MIT. Copyright (c) [Rich Tibbett](https://twitter.com/_richtr).

See the [LICENSE](https://github.com/Mars-Interactive/NoSleep.js/blob/master/LICENSE) file.
