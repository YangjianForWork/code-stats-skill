/**
 * Visualizer - Format analysis results
 */

function formatOutput(stats, format = 'pretty') {
    switch (format) {
        case 'json':
            return JSON.stringify(stats, null, 2);
        case 'csv':
            return formatCSV(stats);
        default:
            return formatPretty(stats);
    }
}

function formatPretty(stats) {
    const lines = [];
    
    // Header
    lines.push('╔════════════════════════════════════════════════════════╗');
    lines.push('║              📊 CODE STATISTICS REPORT                 ║');
    lines.push('╚════════════════════════════════════════════════════════╝');
    lines.push('');
    
    // Summary
    lines.push('📁 SUMMARY');
    lines.push('─'.repeat(50));
    lines.push(`  Total Files:        ${stats.summary.totalFiles.toLocaleString()}`);
    lines.push(`  Total Lines:        ${stats.summary.totalLines.toLocaleString()}`);
    lines.push(`  Code Lines:         ${stats.summary.codeLines.toLocaleString()}`);
    lines.push(`  Comment Lines:      ${stats.summary.commentLines.toLocaleString()}`);
    lines.push(`  Blank Lines:        ${stats.summary.blankLines.toLocaleString()}`);
    lines.push(`  Comment Ratio:      ${stats.summary.commentRatio}%`);
    lines.push(`  Avg File Size:      ${stats.summary.avgFileSize} lines`);
    lines.push(`  Total Functions:    ${stats.summary.totalFunctions.toLocaleString()}`);
    lines.push(`  TODOs Found:        ${stats.summary.totalTODOs}`);
    lines.push('');
    
    // Languages
    if (stats.languages.length > 0) {
        lines.push('🔤 TOP LANGUAGES');
        lines.push('─'.repeat(50));
        const total = stats.languages.reduce((a, b) => a + b[1], 0);
        stats.languages.forEach(([lang, count]) => {
            const pct = ((count / total) * 100).toFixed(1);
            const bar = '█'.repeat(Math.round(pct / 5));
            lines.push(`  ${lang.padEnd(15)} ${bar.padEnd(20)} ${pct}% (${count.toLocaleString()})`);
        });
        lines.push('');
    }
    
    // Largest files
    if (stats.files.length > 0) {
        lines.push('📄 LARGEST FILES');
        lines.push('─'.repeat(50));
        stats.files.forEach(f => {
            lines.push(`  ${f.path.substring(0, 45).padEnd(47)} ${f.lines.toLocaleString().padStart(5)} lines`);
        });
        lines.push('');
    }
    
    // Top directories
    if (stats.directories.length > 0) {
        lines.push('📂 TOP DIRECTORIES (by line count)');
        lines.push('─'.repeat(50));
        stats.directories.forEach(([dir, count]) => {
            const dirStr = dir === '.' ? '(root)' : dir;
            lines.push(`  ${dirStr.substring(0, 40).padEnd(42)} ${count.toLocaleString().padStart(8)} lines`);
        });
        lines.push('');
    }
    
    // TODOs
    if (stats.todos.length > 0) {
        lines.push('✅ TOP TODOs');
        lines.push('─'.repeat(50));
        stats.todos.forEach(todo => {
            const file = `${todo.file}:${todo.line}`;
            lines.push(`  ${file.substring(0, 35).padEnd(37)} ${todo.text.substring(0, 40)}`);
        });
        lines.push('');
    }
    
    // Complexity metrics
    lines.push('⚙️  COMPLEXITY METRICS');
    lines.push('─'.repeat(50));
    lines.push(`  Max File Lines:     ${stats.complexity.maxFileLines.toLocaleString()}`);
    lines.push(`  Max File:           ${stats.complexity.maxFileName.substring(0, 45)}`);
    lines.push('');
    
    return lines.join('\n');
}

function formatCSV(stats) {
    const lines = [];
    
    // Header
    lines.push('metric,value');
    
    // Summary
    lines.push(`total_files,${stats.summary.totalFiles}`);
    lines.push(`total_lines,${stats.summary.totalLines}`);
    lines.push(`code_lines,${stats.summary.codeLines}`);
    lines.push(`comment_lines,${stats.summary.commentLines}`);
    lines.push(`blank_lines,${stats.summary.blankLines}`);
    lines.push(`comment_ratio,${stats.summary.commentRatio}`);
    lines.push(`avg_file_size,${stats.summary.avgFileSize}`);
    lines.push(`total_functions,${stats.summary.totalFunctions}`);
    lines.push(`total_todos,${stats.summary.totalTODOs}`);
    
    return lines.join('\n');
}

module.exports = { formatOutput, formatPretty, formatCSV };
