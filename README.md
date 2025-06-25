# Retro WebOS Template

A modular, GitHub-Pages–deployable web “desktop” that evokes the look and feel of classic Atari/Mac/Unix GUIs. Build and deploy interactive applets, drag and drop windows, and enjoy a nostalgic, pixelated aesthetic—no build step required.

---

## 🚀 Features

* **Modular Applets**: Easily add new apps by dropping a JS file into `modules/applets/`.
* **Window Management**: Draggable windows with close controls and z‑index stacking.
* **Menu Bar**: Clickable **File**, **Windows**, and **Help** menus for About dialog, window toggles, and built‑in help.
* **Retro Styling**: VT323 monospace font, pixelated borders and shadows, simple color palette.
* **Zero Build Setup**: Pure HTML/CSS/ES modules—just push to GitHub Pages.

---

## 📂 Project Structure

```
/ (root)
├── index.html         # Entry point with menubar and desktop container
├── style.css          # Retro-themed styles and layout
├── main.js            # Bootstraps Desktop with registered applets
└── modules/
    ├── desktop.js     # Core Desktop class (icons, windows, menus)
    └── applets/
        ├── hello.js   # Sample "Hello" applet
        └── help.js    # Built-in Help contents (XML example)
```

---

## ⚙️ Installation & Deployment

1. **Clone or fork** this repo.
2. **Enable GitHub Pages** on the repository (deploy from `main` branch or `docs/`).
3. **Visit** your username `.github.io` site to see your Retro WebOS live!

*No bundlers or extra dependencies needed—just vanilla web tech.*

---

## 📖 Usage

### Adding Applets

1. Create a new file in `modules/applets/`:

   ```js
   export default {
     icon: '🎨',            // Emoji or character for your icon
     title: 'Paint',       // Display name
     render: container => {
       container.innerHTML = '<p>Your app content here</p>';
     }
   };
   ```
2. Import and register it in `main.js`:

   ```js
   import paintApplet from './modules/applets/paint.js';
   new Desktop(document.body, [helloApplet, helpApplet, paintApplet]);
   ```
3. **Double‑click** its icon on the desktop to launch.

### Menu & Windows

* **File ▶️ About**: Opens an About window with version/info.
* **Windows ▶️**: Lists all open windows—click to show/hide.
* **Help ▶️ Help Contents**: Opens the Help applet (XML example in a scrollable view).
* **Drag** the titlebar to move windows. Click **❌** to close.

---

## 🛠 Development

* **dragging logic** and **z‑index** handled in `modules/desktop.js`.
* **Menu system**: click to toggle `.open` state, auto‑closes on outside click.
* **Styles**: Tweak CSS variables or `.window` rules for theming.
* **Extensibility**: Consider adding window resizing, keyboard shortcuts, or a plugin loader.

---

## 🤝 Contributing

1. **Fork** the repo.
2. **Create a branch** (`feature/my-cool-applet`).
3. **Commit your changes** and **push**.
4. Open a **Pull Request** describing your feature or fix.

Please adhere to the existing code style and modular patterns.

---

## 📄 License

MIT © RetroWebOS contributors
