import '@pnotify/core/dist/BrightTheme.css';

const { error, notice } = require('@pnotify/core');
const { defaults } = require('@pnotify/core');
defaults.closer = true;
defaults.sticker = false;
defaults.delay = 2000;
defaults.shadow = true;
defaults.delay = 2000;

function pluginError(text) {
  return error({text});
}

function pluginNotice(text) {
  return notice({text});
}
export { pluginError, pluginNotice };
