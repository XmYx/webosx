import Desktop from './modules/desktop.js';
import helloApplet from './modules/applets/hello.js';
import helpApplet from './modules/applets/help.js';

window.addEventListener('DOMContentLoaded', () => {
  const desktop = new Desktop(document.body, [helloApplet, helpApplet]);
});