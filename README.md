
# Kitty Speller - Configuration Guide

## Folder Structure
To add your own 100 words and audio files, follow this structure in your public/static folder:

```
/
  index.html
  audio/
    word_001.mp3
    word_002.mp3
    ... (total 100 files)
```

## How to update words
1. Open `constants.ts`.
2. Find the `WORD_LIST` array.
3. Add your word objects: `{ word: "EXAMPLE", audio: "audio/word_filename.mp3" }`.
4. Ensure the `word` property is in uppercase for best matching or let the code handle normalization.

## How to run
- Since this is a React app, it's best run with a tool like Vite.
- If running as a standalone folder, ensure you serve it with a local static server (e.g., `npx serve .`) to avoid CORS issues with audio files.

## Assumptions Made
1. **Audio format**: The game expects standard web-supported formats like .mp3 or .wav.
2. **Special Characters**: Words with spaces or hyphens (like "HOT DOG") are supported; the spaces/hyphens are automatically filled in the answer slots and are not part of the clickable letter pool.
3. **Audio Autoplay**: Most mobile browsers block autoplay. The game includes a "Start" button that acts as the required user gesture to unlock audio context.
4. **Extra Letters**: The algorithm always picks 5 letters that are NOT in the current word. If the alphabet is exhausted (not likely with English words), it would need more complex logic.
