#!/usr/bin/env node
/**
 * Code Statistics Skill for OpenClaw
 * Analyzes codebase complexity and generates visual reports
 */

const { analyzeWorkspace } = require('./analyzer');
const { formatOutput } = require('./visualizer');
const path = require('path');

async function main() {
    const args = process.argv.slice(2);
    const targetPath = args[0] || process.cwd();
    const format = args.includes('--json') ? 'json' : 
                   args.includes('--csv') ? 'csv' : 'pretty';
    
    try {
        console.log(`📊 Analyzing: ${targetPath}\n`);
        
        const stats = await analyzeWorkspace(targetPath);
        const output = formatOutput(stats, format);
        
        console.log(output);
        
        // Exit with summary
        console.log(`\n✅ Analysis complete: ${stats.summary.totalFiles} files analyzed`);
        
    } catch (err) {
        console.error('❌ Analysis failed:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { main };
