---
name: code-stats
description: Analyze codebase complexity and generate visual statistics reports. Shows file counts, language distribution, line metrics, TODOs, and complexity indicators.
---

# Code Stats

代码统计分析工具，可视化展示项目复杂度。

## 功能

- 📁 **文件统计**: 总文件数、代码行数、注释行数、空行数
- 🔤 **语言分布**: 按编程语言统计代码量
- 📄 **大文件检测**: 找出代码量最大的文件
- 📂 **目录分析**: 按目录统计代码分布
- ✅ **TODO 追踪**: 扫描代码中的 TODO/FIXME/XXX
- ⚙️ **复杂度指标**: 平均文件大小、注释率、最大文件

## 使用方法

### CLI

```bash
# 分析当前目录
node skills/code-stats/index.js

# 分析指定目录
node skills/code-stats/index.js /path/to/project

# JSON 输出
node skills/code-stats/index.js --json

# CSV 输出
node skills/code-stats/index.js --csv
```

### Programmatic

```javascript
const { analyzeWorkspace } = require('./skills/code-stats/analyzer');
const { formatOutput } = require('./skills/code-stats/visualizer');

const stats = await analyzeWorkspace('./my-project');
console.log(formatOutput(stats, 'pretty'));
```

## 输出示例

```
╔════════════════════════════════════════════════════════╗
║              📊 CODE STATISTICS REPORT                 ║
╚════════════════════════════════════════════════════════╝

📁 SUMMARY
──────────────────────────────────────────────────
  Total Files:        156
  Total Lines:        12,450
  Code Lines:         9,876
  Comment Lines:      1,234
  Blank Lines:        1,340
  Comment Ratio:      9.9%
  Avg File Size:      80 lines
  Total Functions:    342
  TODOs Found:        12

🔤 TOP LANGUAGES
──────────────────────────────────────────────────
  Python          ████████░░░░░░░░░░░░ 40.2% (5,006)
  JavaScript      ██████░░░░░░░░░░░░░░ 30.1% (3,747)
  TypeScript      ███░░░░░░░░░░░░░░░░░ 15.5% (1,930)
  Markdown        ██░░░░░░░░░░░░░░░░░░ 10.2% (1,270)
  JSON            █░░░░░░░░░░░░░░░░░░░  4.0% (497)
```

## 支持的语言

JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, C#, Ruby, PHP, Swift, Kotlin, Shell, 等 30+ 种语言。

## 忽略目录

自动忽略: node_modules, .git, __pycache__, dist, build, venv, .env 等
