export default class Desktop {
  constructor(root, applets) {
    this.root = root;
    this.applets = applets;
    this.windows = [];
    this.init();
  }

  init() {
    // Cache elements
    this.menubarEl = this.root.querySelector('#menubar');
    this.desktopEl = this.root.querySelector('#desktop');
    this.desktopEl.style.position = 'relative'; // for absolute icon placement

    // Initial render
    this.renderIcons();
    this.createMenu();
    this.attachMenuInteractions();
  }

  renderIcons() {
    this.desktopEl.innerHTML = '';
    this.applets.forEach((app, idx) => {
      if (app.showIcon !== false) {
        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.style.position = 'absolute';
        // basic stacked layout
        const x = 10;
        const y = 10 + idx * 80;
        icon.style.left = `${x}px`;
        icon.style.top = `${y}px`;
        icon.style.cursor = 'move';
        icon.innerHTML = `<div class="glyph">${app.icon}</div><span class="label">${app.title}</span>`;

        // Open on double-click
        icon.addEventListener('dblclick', () => this.openWindow(app));

        // Dragging behavior for icons
        let isDragging = false;
        let offsetX, offsetY;
        icon.addEventListener('mousedown', e => {
          e.stopPropagation();
          isDragging = true;
          const rect = icon.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          icon.style.zIndex = 1000; // bring to front
        });
        document.addEventListener('mousemove', e => {
          if (!isDragging) return;
          const desktopRect = this.desktopEl.getBoundingClientRect();
          let newX = e.clientX - desktopRect.left - offsetX;
          let newY = e.clientY - desktopRect.top - offsetY;
          // Optional: constrain within desktop
          newX = Math.max(0, Math.min(newX, desktopRect.width - icon.offsetWidth));
          newY = Math.max(0, Math.min(newY, desktopRect.height - icon.offsetHeight));
          icon.style.left = `${newX}px`;
          icon.style.top = `${newY}px`;
        });
        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            icon.style.zIndex = '';
          }
        });

        this.desktopEl.appendChild(icon);
      }
    });
  }

  createMenu() {
    // Static menu structure
    this.menubarEl.innerHTML =
      `<div class="menu" id="file-menu">
         <div class="menu-title">File</div>
         <div class="menu-content" data-type="file">
           <div class="menu-item" data-action="about">About</div>
         </div>
       </div>
       <div class="menu" id="windows-menu">
         <div class="menu-title">Windows</div>
         <div class="menu-content" data-type="windows"></div>
       </div>
       <div class="menu" id="help-menu">
         <div class="menu-title">Help</div>
         <div class="menu-content" data-type="help">
           <div class="menu-item" data-action="open-help">Help Contents</div>
         </div>
       </div>`;

    // Populate windows-menu initially
    this.updateWindowsMenu();
    // Attach file & help actions once
    this.attachMenuActions();
  }

  updateWindowsMenu() {
    const container = this.menubarEl.querySelector('#windows-menu .menu-content');
    container.innerHTML = this.windows.map((w, i) =>
      `<div class="menu-item" data-index="${i}">${w.app.title}</div>`
    ).join('') || '<div class="menu-item disabled">(no windows)</div>';
    // Attach click listeners for each window item
    container.querySelectorAll('.menu-item').forEach(item => {
      if (item.classList.contains('disabled')) return;
      item.addEventListener('click', e => {
        const idx = parseInt(item.dataset.index, 10);
        const winObj = this.windows[idx];
        winObj.el.classList.toggle('hidden');
        // Highlight selected
        container.querySelectorAll('.menu-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        this.closeAllMenus();
      });
    });
  }

  attachMenuActions() {
    // File -> About
    this.menubarEl.querySelector('#file-menu .menu-item[data-action="about"]')
      .addEventListener('click', () => {
        const aboutApp = {
          icon: 'ℹ️',
          title: 'About',
          render: container => {
            container.innerHTML = '<p>Retro WebOS Template<br>v1.0. Build your modular web desktop!</p>';
          }
        };
        this.openWindow(aboutApp);
        this.closeAllMenus();
      });

    // Help -> Help Contents
    this.menubarEl.querySelector('#help-menu .menu-item[data-action="open-help"]')
      .addEventListener('click', () => {
        const helpApplet = this.applets.find(a => a.title === 'Help');
        if (helpApplet) this.openWindow(helpApplet);
        this.closeAllMenus();
      });
  }

  attachMenuInteractions() {
    // Toggle dropdown
    this.menubarEl.querySelectorAll('.menu').forEach(menu => {
      const title = menu.querySelector('.menu-title');
      const content = menu.querySelector('.menu-content');
      title.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = content.classList.contains('open');
        this.closeAllMenus();
        if (!isOpen) content.classList.add('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', () => this.closeAllMenus());
  }

  closeAllMenus() {
    this.menubarEl.querySelectorAll('.menu-content.open').forEach(el =>
      el.classList.remove('open')
    );
  }

  openWindow(app) {
    const win = document.createElement('div');
    win.className = 'window';
    win.innerHTML = `
      <div class="titlebar"><span class="title">${app.title}</span><div class="controls"><div class="close-btn"></div></div></div>
      <div class="content"></div>
    `;
    this.root.appendChild(win);
    app.render(win.querySelector('.content'));

    // Dragging behavior for windows
    const titlebar = win.querySelector('.titlebar');
    let isDragging = false;
    let offsetX, offsetY;
    titlebar.addEventListener('mousedown', e => {
      isDragging = true;
      const rect = win.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      win.style.zIndex = this.windows.length + 1;
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    });
    document.addEventListener('mouseup', () => (isDragging = false));

    // Close button
    const closeBtn = win.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      win.remove();
      this.windows = this.windows.filter(w => w.el !== win);
      this.updateWindowsMenu();
    });

    // Track and update
    this.windows.push({ app, el: win });
    this.updateWindowsMenu();
  }
}
