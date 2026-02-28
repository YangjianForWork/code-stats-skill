# openclaw-wk-skill

OpenClaw Agent Skills - 代码统计分析工具

## code-stats

代码统计分析工具，可视化展示项目复杂度。

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

*Generated for OpenClaw Agent*
