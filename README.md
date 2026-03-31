# Uniqify

A client-side web tool for removing duplicate data across rows, ensuring clean, consistent, and unique datasets for further processing or analysis.

**100% Client-side - No data sent to server!**

## Features

- ✅ Remove duplicate lines/rows from text data
- ✅ Case-sensitive or case-insensitive deduplication
- ✅ Trim whitespace option
- ✅ Remove empty lines option
- ✅ Sort output alphabetically
- ✅ Upload text files (.txt, .csv, .log, .json, .xml, .md, .html)
- ✅ Drag & drop file support
- ✅ Copy to clipboard
- ✅ Download results as .txt
- ✅ Live statistics (original count, unique count, removed count, reduction %)
- ✅ Dark/Light mode toggle
- ✅ Responsive design

## Options

| Option | Description |
|--------|-------------|
| Case Sensitive | Treat "Apple" and "apple" as different entries |
| Trim Whitespace | Remove leading/trailing spaces from each line |
| Remove Empty Lines | Filter out blank lines from the data |
| Sort Output | Sort the unique results alphabetically |

## Usage

### Option 1: Open directly in browser

Simply open `public/index.html` in your web browser.

### Option 2: Use a local server

```bash
# Using Python
cd public
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

Then open `http://localhost:8000` in your browser.

### Option 3: Deploy to Firebase Hosting

```bash
firebase deploy
```

## Example

**Input:**
```
apple
banana
apple
cherry
banana
date
apple
```

**Output (with default options):**
```
apple
banana
cherry
date
```

**Statistics:**
- Original: 7
- Unique: 4
- Removed: 3
- Reduction: 42.9%

## Project Structure

```
uniqify/
├── public/
│   ├── index.html      # Main HTML file
│   ├── 404.html        # 404 page
│   ├── css/
│   │   └── style.css   # Styles
│   └── js/
│       └── app.js      # Main JavaScript logic
├── firebase.json       # Firebase config
└── README.md           # Documentation
```

## Technology

- Pure HTML, CSS, and JavaScript
- No external dependencies
- Works offline
- Privacy-focused (all processing in browser)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## Demo

[https://herusdianto.github.io/uniqify/](https://herusdianto.github.io/uniqify/)