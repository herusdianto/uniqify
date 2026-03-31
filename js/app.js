/**
 * Uniqify - Remove Duplicate Data Across Rows
 * Ensures clean, consistent, and unique datasets
 */

// Default example data
const DEFAULT_EXAMPLE = `apple\nbanana\napple\ncherry\nbanana\ndate`;

class Uniqify {
    constructor() {
        this.init();
        this.setDefaultExample();
    }

    init() {
        this.bindInputTypeToggle();
        this.bindFileEvents();
        this.bindCopyButtons();
        this.bindDownloadButtons();
        this.initThemeToggle();
        this.loadLastSession(); // Load last session from localStorage
        // Auto trigger remove duplicate on input change
        const inputText = document.getElementById('input-text');
        if (inputText) {
            inputText.addEventListener('input', () => {
                this.saveLastSession(); // Save input on change
                this.process();
            });
        }
        // Auto trigger remove duplicate on options change
        ['case-sensitive', 'trim-whitespace', 'remove-empty', 'sort-output'].forEach(optionId => {
            const opt = document.getElementById(optionId);
            if (opt) {
                opt.addEventListener('change', () => {
                    this.saveLastSession();
                    this.process();
                });
            }
        });
    }

    setDefaultExample() {
        const inputText = document.getElementById('input-text');
        if (inputText && !inputText.value.trim()) {
            inputText.value = DEFAULT_EXAMPLE;
            this.process();
        }
    }

    // ==================== LocalStorage Session ====================
    saveLastSession() {
        const inputText = document.getElementById('input-text');
        const outputText = document.getElementById('output-text');
        // Save options
        const caseSensitive = document.getElementById('case-sensitive').checked;
        const trimWhitespace = document.getElementById('trim-whitespace').checked;
        const removeEmpty = document.getElementById('remove-empty').checked;
        const sortOutput = document.getElementById('sort-output').checked;
        if (inputText && outputText) {
            localStorage.setItem('uniqify_last_input', inputText.value);
            localStorage.setItem('uniqify_option_caseSensitive', caseSensitive);
            localStorage.setItem('uniqify_option_trimWhitespace', trimWhitespace);
            localStorage.setItem('uniqify_option_removeEmpty', removeEmpty);
            localStorage.setItem('uniqify_option_sortOutput', sortOutput);
        }
    }

    loadLastSession() {
        const lastInput = localStorage.getItem('uniqify_last_input');
        const inputText = document.getElementById('input-text');
        if (inputText && lastInput) {
            inputText.value = lastInput;
        }
        // Restore options
        const caseSensitive = localStorage.getItem('uniqify_option_caseSensitive');
        const trimWhitespace = localStorage.getItem('uniqify_option_trimWhitespace');
        const removeEmpty = localStorage.getItem('uniqify_option_removeEmpty');
        const sortOutput = localStorage.getItem('uniqify_option_sortOutput');
        if (caseSensitive !== null) document.getElementById('case-sensitive').checked = (caseSensitive === 'true');
        if (trimWhitespace !== null) document.getElementById('trim-whitespace').checked = (trimWhitespace === 'true');
        if (removeEmpty !== null) document.getElementById('remove-empty').checked = (removeEmpty === 'true');
        if (sortOutput !== null) document.getElementById('sort-output').checked = (sortOutput === 'true');
        this.process()
    }

    // ==================== Theme Toggle ====================
    initThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        const themeIcon = document.getElementById('theme-icon');

        // Check for saved theme preference or default to dark mode
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        this.updateThemeIcon(themeIcon, savedTheme);

        themeSwitch.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(themeIcon, newTheme);
        });
    }

    updateThemeIcon(iconElement, theme) {
        iconElement.innerHTML = theme === 'dark'
            ? `<svg class="sun-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.06 1.06a1 1 0 101.41-1.41l-1.06-1.06zm1.06-10.96a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06zM7.05 18.36a1 1 0 10-1.41-1.41l-1.06 1.06a1 1 0 101.41 1.41l1.06-1.06z"></path></svg>`
            : `<svg class="moon-icon" viewBox="0 0 24 24" width="28" height="28"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"></path></svg>`;
    }

    // ==================== Input Type Toggle ====================
    bindInputTypeToggle() {
        const inputTypeRadios = document.querySelectorAll('input[name="input-type"]');
        inputTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                document.getElementById('text-input').classList.toggle('hidden', radio.value !== 'text');
                document.getElementById('file-input').classList.toggle('hidden', radio.value !== 'file');
            });
        });
    }

    // ==================== File Events ====================
    bindFileEvents() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('input-file');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                this.handleFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    handleFile(file) {
        const preview = document.getElementById('file-preview');
        preview.classList.remove('hidden');

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lineCount = content.split('\n').length;

            preview.innerHTML = `
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${this.formatFileSize(file.size)} • ${lineCount} lines</span>
                    <button class="remove-file">✕ Remove</button>
                </div>
            `;
            preview.querySelector('.remove-file').addEventListener('click', () => this.removeFile());

            // Also populate the textarea with file content
            document.getElementById('input-text').value = content;
            // Auto trigger process after file upload
            this.process();
        };
        reader.readAsText(file);
    }

    removeFile() {
        document.getElementById('input-file').value = '';
        document.getElementById('file-preview').classList.add('hidden');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    process() {
        const inputText = document.getElementById('input-text').value;

        if (!inputText.trim()) {
            this.showStatus('Please enter data to deduplicate', 'error');
            return;
        }

        // Get options
        const caseSensitive = document.getElementById('case-sensitive').checked;
        const trimWhitespace = document.getElementById('trim-whitespace').checked;
        const removeEmpty = document.getElementById('remove-empty').checked;
        const sortOutput = document.getElementById('sort-output').checked;

        // Split into lines
        let lines = inputText.split('\n');
        const originalCount = lines.length;

        // Process based on options
        if (trimWhitespace) {
            lines = lines.map(line => line.trim());
        }

        if (removeEmpty) {
            lines = lines.filter(line => line.length > 0);
        }

        // Remove duplicates
        let uniqueLines;
        if (caseSensitive) {
            uniqueLines = [...new Set(lines)];
        } else {
            const seen = new Map();
            uniqueLines = [];
            for (const line of lines) {
                const key = line.toLowerCase();
                if (!seen.has(key)) {
                    seen.set(key, true);
                    uniqueLines.push(line);
                }
            }
        }

        // Sort if requested
        if (sortOutput) {
            uniqueLines.sort((a, b) => {
                if (caseSensitive) {
                    return a.localeCompare(b);
                } else {
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                }
            });
        }

        // Calculate stats
        const uniqueCount = uniqueLines.length;
        const removedCount = originalCount - uniqueCount;
        const reductionPercent = originalCount > 0
            ? ((removedCount / originalCount) * 100).toFixed(1)
            : 0;

        // Update stats display
        document.getElementById('stats').classList.remove('hidden');
        document.getElementById('original-count').textContent = originalCount;
        document.getElementById('unique-count').textContent = uniqueCount;
        document.getElementById('removed-count').textContent = removedCount;
        document.getElementById('reduction-percent').textContent = reductionPercent + '%';

        // Show output
        document.getElementById('output-text').value = uniqueLines.join('\n');
        this.saveLastSession(); // Save after processing
        this.showStatus(`Successfully removed ${removedCount} duplicate(s)!`, 'success');
    }

    // ==================== Copy Buttons ====================
    bindCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetElement = document.getElementById(targetId);

                if (targetElement && targetElement.value) {
                    navigator.clipboard.writeText(targetElement.value).then(() => {
                        const originalText = btn.textContent;
                        btn.textContent = '✓ Copied!';
                        btn.classList.add('copied');
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.classList.remove('copied');
                        }, 2000);
                    }).catch(() => {
                        this.showStatus('Failed to copy to clipboard', 'error');
                    });
                } else {
                    this.showStatus('Nothing to copy', 'error');
                }
            });
        });
    }

    // ==================== Download Buttons ====================
    bindDownloadButtons() {
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const contentId = btn.dataset.content;
                const filename = btn.dataset.filename || 'unique_data.txt';
                const contentElement = document.getElementById(contentId);

                if (contentElement && contentElement.value) {
                    const blob = new Blob([contentElement.value], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    this.showStatus('File downloaded successfully!', 'success');
                } else {
                    this.showStatus('Nothing to download', 'error');
                }
            });
        });
    }

    // ==================== Status Messages ====================
    showStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
        status.classList.remove('hidden');

        setTimeout(() => {
            status.classList.add('hidden');
        }, 3000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new Uniqify();
    var yearElem = document.getElementById('currentYear');
    if (yearElem) {
        yearElem.textContent = new Date().getFullYear();
    }
});

