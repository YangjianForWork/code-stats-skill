# code-stats-skill

[中文](#中文) | [English](#english)

---

## 中文

OpenClaw Agent Skill - 代码统计分析工具

### 功能

- 📁 **文件统计**: 总文件数、代码行数、注释行数、空行数
- 🔤 **语言分布**: 按编程语言统计代码量
- 📄 **大文件检测**: 找出代码量最大的文件
- 📂 **目录分析**: 按目录统计代码分布
- ✅ **TODO 追踪**: 扫描代码中的 TODO/FIXME/XXX
- ⚙️ **复杂度指标**: 平均文件大小、注释率、最大文件

### 使用方法

```bash
# 分析当前目录
node code-stats/index.js

# 分析指定目录
node code-stats/index.js /path/to/project

# JSON 输出
node code-stats/index.js --json

# CSV 输出
node code-stats/index.js --csv
```

### 支持的语言

JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, C#, Ruby, PHP, Swift, Kotlin, Shell 等 30+ 种语言。

---

## English

OpenClaw Agent Skill - Code Statistics & Analysis Tool

### Features

- 📁 **File Statistics**: Total files, lines of code, comment lines, blank lines
- 🔤 **Language Distribution**: Code volume by programming language
- 📄 **Large File Detection**: Find files with the most code
- 📂 **Directory Analysis**: Code distribution by directory
- ✅ **TODO Tracking**: Scan for TODO/FIXME/XXX in code
- ⚙️ **Complexity Metrics**: Average file size, comment ratio, largest file

### Usage

```bash
# Analyze current directory
node code-stats/index.js

# Analyze specific directory
node code-stats/index.js /path/to/project

# JSON output
node code-stats/index.js --json

# CSV output
node code-stats/index.js --csv
```

### Supported Languages

JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, C#, Ruby, PHP, Swift, Kotlin, Shell, and 30+ more.

---

*Generated for OpenClaw Agent*
