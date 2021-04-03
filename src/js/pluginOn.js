import '@pnotify/core/dist/BrightTheme.css';

const { error } = require('@pnotify/core');
const { defaults } = require('@pnotify/core');
defaults.closer = false;
defaults.sticker = false;
defaults.delay = 2000;
defaults.shadow = true;

function pluginError(text) {
  return error({text});
}

export { pluginError };
