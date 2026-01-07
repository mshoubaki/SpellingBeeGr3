
# Kitty Speller - Configuration Guide

## Folder Structure
All audio files must be placed in a folder named `audio` in the root directory.

```
/
  index.html
  index.js
  audio/
    applaud.mp3
    myth.mp3
    ...
```

## How to update words
1. Open `constants.js`.
2. Find the `WORD_LIST` array.
3. Add just the word: `{ word: "EXAMPLE" }`.
4. The app will automatically look for `audio/example.mp3`.

## How to run
- **Local Development**: Use a static server like VS Code's "Live Server" or run `npx serve .` to avoid CORS errors.
- **GitHub Pages**: Upload all files, including the `audio/` folder. The app uses Babel to handle JSX directly in the browser.

## Assumptions Made
1. **Audio format**: The game expects `.mp3` files. Filenames should be lowercase and match the word (e.g., "TSUNAMI" -> `tsunami.mp3`).
2. **Audio Autoplay**: The "Start" button handles the user interaction required by browsers to allow audio playback.
