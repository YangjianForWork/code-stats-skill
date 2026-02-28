/**
 * Code Analyzer - Core analysis logic
 */

const fs = require('fs');
const path = require('path');

// Language detection by extension
const LANG_MAP = {
    '.js': 'JavaScript',
    '.ts': 'TypeScript',
    '.py': 'Python',
    '.rb': 'Ruby',
    '.go': 'Go',
    '.rs': 'Rust',
    '.java': 'Java',
    '.c': 'C',
    '.cpp': 'C++',
    '.h': 'C/C++ Header',
    '.cs': 'C#',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.r': 'R',
    '.m': 'Objective-C',
    '.mm': 'Objective-C++',
    '.sh': 'Shell',
    '.bash': 'Bash',
    '.zsh': 'Zsh',
    '.ps1': 'PowerShell',
    '.pl': 'Perl',
    '.lua': 'Lua',
    '.vim': 'Vim Script',
    '.md': 'Markdown',
    '.json': 'JSON',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.xml': 'XML',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.less': 'Less',
    '.sql': 'SQL',
    '.dockerfile': 'Dockerfile',
    '.tf': 'Terraform',
    '.vue': 'Vue',
    '.jsx': 'JSX',
    '.tsx': 'TSX',
    '.svelte': 'Svelte'
};

// Directories to ignore
const IGNORE_DIRS = new Set([
    'node_modules', '.git', '__pycache__', '.pytest_cache',
    'dist', 'build', 'target', 'out', '.next', '.nuxt',
    'coverage', '.coverage', 'venv', '.venv', 'env',
    '.env', 'vendor', 'Pods', '.idea', '.vscode',
    '.openclaw', 'openviking-reference', 'embedding_env', '.env'
]);

// Binary file extensions
const BINARY_EXTS = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg',
    '.ico', '.pdf', '.zip', '.tar', '.gz', '.rar',
    '.7z', '.exe', '.dll', '.so', '.dylib', '.bin',
    '.woff', '.woff2', '.ttf', '.otf', '.eot'
]);

class CodeAnalyzer {
    constructor() {
        this.stats = {
            files: [],
            languages: {},
            complexity: {
                totalLines: 0,
                codeLines: 0,
                commentLines: 0,
                blankLines: 0,
                maxFileLines: 0,
                maxFileName: ''
            },
            byDirectory: {},
            todos: [],
            functions: []
        };
    }

    async analyzeDirectory(dirPath, basePath = dirPath) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            const relativePath = path.relative(basePath, fullPath);
            
            if (entry.isDirectory()) {
                if (!IGNORE_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
                    await this.analyzeDirectory(fullPath, basePath);
                }
            } else if (entry.isFile()) {
                await this.analyzeFile(fullPath, relativePath);
            }
        }
        
        return this.stats;
    }

    async analyzeFile(filePath, relativePath) {
        const ext = path.extname(filePath).toLowerCase();
        const lang = LANG_MAP[ext] || 'Other';
        
        // Skip binary files
        if (BINARY_EXTS.has(ext)) {
            return;
        }
        
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n');
            const lineCount = lines.length;
            
            // Count lines
            const counts = this.countLineTypes(lines, lang);
            
            // Detect functions
            const functions = this.detectFunctions(content, lang);
            
            // Find TODOs
            const todos = this.findTODOs(lines, relativePath);
            
            // Get directory
            const dir = path.dirname(relativePath);
            
            // Update stats
            this.stats.files.push({
                path: relativePath,
                language: lang,
                lines: lineCount,
                codeLines: counts.code,
                commentLines: counts.comment,
                blankLines: counts.blank,
                functions: functions.length
            });
            
            // Update language stats
            this.stats.languages[lang] = (this.stats.languages[lang] || 0) + lineCount;
            
            // Update complexity
            this.stats.complexity.totalLines += lineCount;
            this.stats.complexity.codeLines += counts.code;
            this.stats.complexity.commentLines += counts.comment;
            this.stats.complexity.blankLines += counts.blank;
            
            if (lineCount > this.stats.complexity.maxFileLines) {
                this.stats.complexity.maxFileLines = lineCount;
                this.stats.complexity.maxFileName = relativePath;
            }
            
            // Update directory stats
            this.stats.byDirectory[dir] = (this.stats.byDirectory[dir] || 0) + lineCount;
            
            // Add TODOs
            this.stats.todos.push(...todos);
            
            // Add functions
            this.stats.functions.push(...functions.map(f => ({
                ...f,
                file: relativePath
            })));
            
        } catch (err) {
            // Skip files we can't read
        }
    }

    countLineTypes(lines, lang) {
        const counts = { code: 0, comment: 0, blank: 0 };
        let inBlockComment = false;
        
        const blockStart = ['/*', '"""', "'''", '<!--'];
        const blockEnd = ['*/', '"""', "'''", '-->'];
        const lineComment = ['//', '#', '--', '%'];
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === '') {
                counts.blank++;
                continue;
            }
            
            // Check for block comment end
            if (inBlockComment) {
                counts.comment++;
                if (blockEnd.some(end => trimmed.includes(end))) {
                    inBlockComment = false;
                }
                continue;
            }
            
            // Check for block comment start
            if (blockStart.some(start => trimmed.startsWith(start))) {
                counts.comment++;
                inBlockComment = true;
                continue;
            }
            
            // Check for line comment
            if (lineComment.some(comment => trimmed.startsWith(comment))) {
                counts.comment++;
                continue;
            }
            
            counts.code++;
        }
        
        return counts;
    }

    detectFunctions(content, lang) {
        const functions = [];
        const lines = content.split('\n');
        
        // Language-specific function patterns
        const patterns = {
            'JavaScript': /(?:async\s+)?function\s+(\w+)\s*\(|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/,
            'TypeScript': /(?:async\s+)?function\s+(\w+)\s*\(|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(?:async\s+)?(\w+)\s*\([^)]*\)\s*:\s*\w+\s*{/,
            'Python': /def\s+(\w+)\s*\(/,
            'Go': /func\s+(?:\([^)]*\)\s*)?(\w+)\s*\(/,
            'Rust': /fn\s+(\w+)\s*\(/,
            'Java': /(?:public|private|protected)?\s*(?:static\s+)?(?:\w+\s+)?(\w+)\s*\([^)]*\)\s*{/,
            'C': /(?:\w+\s+)+(\w+)\s*\([^)]*\)\s*{/,
            'C++': /(?:\w+[\s:*]+)+(\w+)\s*\([^)]*\)\s*(?:const\s*)?{/,
            'Ruby': /def\s+(\w+)/,
            'PHP': /function\s+(\w+)/,
            'Shell': /^(\w+)\s*\(\)|function\s+(\w+)/
        };
        
        const pattern = patterns[lang];
        if (!pattern) return functions;
        
        lines.forEach((line, idx) => {
            const match = line.match(pattern);
            if (match) {
                const name = match[1] || match[2] || match[3];
                if (name && !name.startsWith('_')) {
                    functions.push({
                        name,
                        line: idx + 1,
                        length: 0 // Would need deeper analysis
                    });
                }
            }
        });
        
        return functions;
    }

    findTODOs(lines, filePath) {
        const todos = [];
        const todoPattern = /TODO|FIXME|XXX|HACK|BUG/i;
        
        lines.forEach((line, idx) => {
            if (todoPattern.test(line)) {
                todos.push({
                    file: filePath,
                    line: idx + 1,
                    text: line.trim().substring(0, 80)
                });
            }
        });
        
        return todos;
    }
}

async function analyzeWorkspace(targetPath) {
    const analyzer = new CodeAnalyzer();
    const stats = await analyzer.analyzeDirectory(targetPath);
    
    // Calculate summary
    const summary = {
        totalFiles: stats.files.length,
        totalLines: stats.complexity.totalLines,
        codeLines: stats.complexity.codeLines,
        commentLines: stats.complexity.commentLines,
        blankLines: stats.complexity.blankLines,
        commentRatio: stats.complexity.totalLines > 0 
            ? (stats.complexity.commentLines / stats.complexity.totalLines * 100).toFixed(1)
            : 0,
        avgFileSize: stats.files.length > 0 
            ? Math.round(stats.complexity.totalLines / stats.files.length)
            : 0,
        totalFunctions: stats.functions.length,
        totalTODOs: stats.todos.length
    };
    
    // Get top languages
    const topLanguages = Object.entries(stats.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // Get largest files
    const largestFiles = [...stats.files]
        .sort((a, b) => b.lines - a.lines)
        .slice(0, 5);
    
    // Get hottest directories
    const topDirectories = Object.entries(stats.byDirectory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    return {
        summary,
        languages: topLanguages,
        files: largestFiles,
        directories: topDirectories,
        todos: stats.todos.slice(0, 10),
        complexity: stats.complexity
    };
}

module.exports = { analyzeWorkspace, CodeAnalyzer };
