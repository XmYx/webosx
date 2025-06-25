export default {
  icon: '❓',
  title: 'Help',
  showIcon: false,
  render: container => {
    const xmlExample = `<?xml version="1.0"?>\n<desktop>\n  <icon title=\"Hello\" />\n  <icon title=\"About\" />\n  <menu name=\"File\">About</menu>\n  <menu name=\"Help\">Help Contents</menu>\n</desktop>`;
    container.innerHTML = `<pre><code>${xmlExample}</code></pre>`;
  }
};
