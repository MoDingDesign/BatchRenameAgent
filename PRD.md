# 产品需求文档 (PRD) - 智能批量重命名 Agent (SmartRename)

## 1. 产品概述
**SmartRename** 是一款专为 macOS 设计的智能批量重命名工具。它摒弃了传统重命名软件复杂的规则配置（如正则表达式、通配符组合），通过**自然语言交互**驱动 Agent，智能理解用户意图，并利用底层强大的系统工具（Bash, grep, glob）高效完成任务。

产品核心理念：**极简输入 (Simplicity)** -> **透明预览 (Visibility)** -> **安全执行 (Safety)**。

## 2. 用户痛点
- 传统工具规则复杂，普通用户难以掌握正则表达式。
- 简单的查找替换无法满足复杂逻辑（如 "将所有文件名中的日期格式从 YYYYMMDD 改为 YYYY-MM-DD"）。
- 批量操作风险大，缺乏直观的执行前预览。

## 3. 功能需求 (Functional Requirements)

### 3.1 核心流程
1.  **投喂 (Input)**: 用户拖拽文件夹或文件到应用窗口。
2.  **指令 (Command)**: 用户输入自然语言指令，例如：
    - "把文件名里的空格都换成下划线"
    - "给所有图片文件加上 'Trip_2024_' 的前缀"
    - "把 .jpeg 后缀都改成 .jpg"
3.  **规划 (Thinking)**: Agent 分析当前目录结构，生成重命名方案。
4.  **预览 (Preview)**: 界面展示 "原文件名 -> 新文件名" 的对比列表，高亮变化部分。
5.  **执行 (Execute)**: 用户确认后，Agent 调用系统工具执行重命名。

### 3.2 关键特性
- **Mac 原生体验**: 支持 macOS 深色模式，流畅的拖拽交互。
- **智能筛选**: 支持利用 `fileGlob` / `fileGrep` 逻辑的自然语言筛选（如 "只修改包含 'draft' 的 PDF 文件"）。
- **安全回滚**: 记录操作日志，支持一键撤销（Undo）。

## 4. Agent 实现规划 (Implementation Strategy)

这是本 PRD 的核心部分，重点阐述如何利用 Agent 技术实现重命名逻辑。

### 4.1 架构层级
- **Frontend (UI Layer)**: Electron + React。负责展示文件列表、接收用户输入、渲染 Diff 预览。
- **Agent Core (Brain)**: 负责将自然语言转化为可执行的操作。
- **Execution Layer (Tools)**: 非传统的逐个文件重命名 API，而是倾向于生成和执行 Shell 脚本或使用高性能的 Glob 工具。

### 4.2 Agent 工作流 (Workflow)

#### 步骤 1: 上下文感知 (Context Awareness)
当用户拖入文件夹时，前端通过 Node.js (`fs` / `fast-glob`) 快速扫描目录。
- **输入**: 目录路径、文件列表采样（如果文件过多，仅通过 LLM 处理 Token 限制内的部分，或分批处理）。
- **Prompt 构建**:
  ```text
  You are a bash scripting expert on macOS.
  Current Directory: /Users/user/updates
  Files sample: [report 1.pdf, report 2.pdf, image.png, ...]
  User Request: "把文件名里的空格换成下划线，但不改图片"
  ```

#### 步骤 2: 逻辑映射与工具调用 (Tool Usage)
Agent 不直接修改文件，而是**生成中间数据结构**或**Shell命令**。为了保证稳定性和可控性，建议采用 **"Plan-Code-Execute"** 模式。

1.  **筛选 (Filter)**: Agent 决定使用 `glob` 模式匹配文件。
    *   *Prompt 推理*: 用户说 "不改图片"，生成 glob pattern: `!(*.png|*.jpg|...)` 或在代码逻辑中过滤。
2.  **变换 (Transform)**: Agent 生成变换规则。
    *   简单替换 -> 字符串 replace。
    *   复杂逻辑 -> 生成一段简短的 JavaScript 函数或 Python 脚本，或者直接构造 Bash `mv` 命令序列。

#### 步骤 3: 预览生成 (Simulation)
Agent 返回一个 JSON 结构的 "Diff Plan" 给前端：
```json
{
  "rationale": "Detected files with spaces. Will exclude .png files.",
  "operations": [
    { "original": "report 1.pdf", "new": "report_1.pdf" },
    { "original": "report 2.pdf", "new": "report_2.pdf" }
  ]
}
```
**技术难点**: 如何确保 LLM 生成的 Plan 是 100% 准确的？
**解决方案**:
- 使用代码解释器 (Code Interpreter) 思想。Agent 生成一段 JS 代码，在本地沙箱中跑一遍文件列表，输出变换后的结果。这样比让 LLM 直接输出结果字符串更准确。

### 4.3 工具集集成 (Tool Integration)
- **Bash**: 对于极简单的批量操作（如扩展名修改），Agent 可以直接输出 `rename` (brew install rename) 或 `mv` 命令供用户参考或执行。
- **fileGrep**: 当用户指令涉及内容匹配时（如 "文件名包含 'ERROR' 的日志"），Agent 构造 `grep` 命令筛选文件列表。
- **fileGlob**: 标准化文件匹配，Frontend 预先扫描时支持 Glob 语法，Agent 只需输出 Glob 字符串即可获得目标文件全集。

## 5. 技术栈推荐
- **Framework**: **Electron** (使用 Vite + React/Vue)。Electron 提供了完整的 Node.js 环境，方便调用系统 Shell 和文件系统，适合开发 Mac 桌面应用。
- **Styling**: **TailwindCSS** + **ShadcnUI**。打造极简、现代、Premium 的视觉风格。
- **Agent/LLM**: 调用 OpenAI API / Anthropic API，或允许用户配置本地模型 (Ollama)。

## 6. 开发路线图 (Roadmap)
1.  **Phase 1 (MVP)**:
    - 基础 UI 搭建。
    - 文件列表读取与展示。
    - 接入 LLM：文本指令 -> JSON Plan -> 预览 -> Node.js `fs.rename` 执行。
2.  **Phase 2 (Advanced)**:
    - 支持 Bash 脚本直接预览与执行（类似 Copilot for Terminal）。
    - 增加 Undo 功能。
3.  **Phase 3 (Optimization)**:
    - 大文件列表性能优化（Virtual Scroll）。
    - 更多智能特性（根据文件内容元数据重命名）。
