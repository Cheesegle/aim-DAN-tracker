# 🎯 DAN Progress Tracker

An interactive web application to track your osu! DAN (Dedicated Aim Navigator) progress through 20 levels of beatmaps. Keep track of completed maps, add personal notes, and monitor your overall progress.

## Features

✅ **Track Progress** - Check off beatmaps as you complete them
📊 **Progress Statistics** - Visual progress bar showing overall completion percentage
💾 **Persistent Storage** - Your progress is automatically saved to your browser's local storage
📝 **Notes System** - Add personal notes to any beatmap
📤 **Export Data** - Backup your progress as a JSON file
📥 **Import Data** - Restore your progress from a backup file
🔄 **Reset Option** - Reset all progress to start fresh
🎨 **Responsive Design** - Works on desktop, tablet, and mobile devices
🔗 **Direct Links** - Click any beatmap name to open it on osu!

## How to Use

1. **View Beatmaps** - Browse through all 20 DAN levels, each containing 11 beatmaps
2. **Complete a Beatmap** - Click the checkbox next to any beatmap to mark it as completed
3. **Add Notes** - Click the "📝 Notes" button to expand the notes section and add your thoughts
4. **Track Progress** - Monitor your overall progress at the top of the page
5. **Backup Your Data** - Click "💾 Export Data" to download a JSON backup
6. **Restore Data** - Click "📂 Import Data" to restore from a previous backup

## Deployment

### GitHub Pages Deployment

This project is ready for GitHub Pages deployment. Follow these steps:

#### Option 1: Push Existing Files to GitHub

1. **Initialize Git Repository** (if not already done):
   ```bash
   cd aim-dan-tracker
   git init
   ```

2. **Add Files**:
   ```bash
   git add .
   ```

3. **Commit Changes**:
   ```bash
   git commit -m "Initial commit: DAN Progress Tracker"
   ```

4. **Create GitHub Repository**:
   - Go to [github.com](https://github.com) and create a new repository
   - Name it something like `dan-tracker` or `aim-dan-progress`
   - Make it public (for free GitHub Pages hosting)

5. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

6. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages** (in the left sidebar)
   - Under **Build and deployment**, select **Source** → **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**

7. **Access Your Site**:
   - Wait a few minutes for deployment
   - Your site will be available at: `https://YOUR_USERNAME.github.io/your-repo-name/`

#### Option 2: Using GitHub CLI (gh)

If you have the GitHub CLI installed:

```bash
cd aim-dan-tracker
gh repo create dan-tracker --public --source=. --remote=origin
git push -u origin main
```

Then follow steps 6-7 from Option 1 to enable GitHub Pages.

## Data Storage

Your progress is stored locally in your browser using `localStorage`. This means:

✅ Data persists across page refreshes and browser restarts
✅ No server required - works offline
✅ Private - your data never leaves your device
❌ Data is device-specific and browser-specific
❌ Clearing browser data will lose your progress

**Important:** Always use the "Export Data" feature to create backups of your progress!

## File Structure

```
aim-dan-tracker/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── app.js             # Application logic and data
└── README.md          # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks required
- **localStorage API** - Client-side data persistence

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Customization

### Adding New Beatmaps

Edit the `initialData` object in `app.js` to add or modify beatmaps:

```javascript
{
    id: "unique-id",
    url: "https://osu.ppy.sh/b/xxxxxx",
    name: "Map Name [Difficulty]",
    mod: "N/A",  // or "DT", "HR", "DTHR", etc.
    sr: "5.00",  // Star rating
    bpm: "180",
    ar: "9",      // Approach Rate
    cs: "4",      // Circle Size
    od: "8",      // Overall Difficulty
    length: "2:30"
}
```

### Changing Colors

Modify CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4f46e5;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... etc */
}
```

## Troubleshooting

### Progress Not Saving
- Check if you're in private/incognito mode (localStorage may be disabled)
- Ensure browser storage is not full
- Try clearing cache and reloading (but note this will lose unsaved data)

### Can't Import Backup
- Ensure the file is a valid JSON file
- Check that the file wasn't corrupted
- Try exporting a fresh backup and importing it to test

### Mobile Issues
- The tracker is fully responsive, but works best in landscape orientation on mobile
- Use Chrome Mobile or Safari for best performance

## License

This project is open source and available for personal use.

## Credits

- Beatmap data sourced from the official DAN levels spreadsheet
- Built with vanilla web technologies for simplicity and performance
- Designed for the osu! community

---

**Good luck with your DAN journey! 🎯🎵**
