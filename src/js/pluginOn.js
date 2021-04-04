import '@pnotify/core/dist/BrightTheme.css';

const { error, notice } = require('@pnotify/core');
const { defaults } = require('@pnotify/core');

defaults.sticker = false;
defaults.icon = false;
defaults.delay = 1000;
defaults.shadow = true;

function pluginError(text) {
  return error({ text });
}

function pluginNotice(text) {
  return notice({ text });
}
export { pluginError, pluginNotice };