# GitHub Markdown 编辑器

一个基于React的Markdown编辑器，可以直接在浏览器中编辑Markdown文件并保存到GitHub仓库。

## 功能特性

- 📝 **实时Markdown编辑** - 支持语法高亮和实时预览
- 🔄 **GitHub集成** - 直接保存到GitHub仓库
- 📱 **响应式设计** - 适配各种设备屏幕
- 🎨 **现代化UI** - 美观的用户界面和交互体验
- ⚡ **快速构建** - 基于Vite的快速开发体验

## 快速开始

### 本地开发

1. 克隆项目
```bash
git clone <repository-url>
cd markdown-editor
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 部署到GitHub Pages

### 自动部署（推荐）

1. 将代码推送到GitHub仓库
2. 在仓库设置中启用GitHub Pages：
   - 进入仓库的 **Settings** 页面
   - 在左侧菜单选择 **Pages**
   - 在 **Source** 部分选择 **GitHub Actions**
   - 保存设置

3. 每次推送到 `main` 分支时，GitHub Actions会自动构建并部署到GitHub Pages

### 手动部署

1. 构建项目：`npm run build`
2. 将 `dist` 目录的内容推送到 `gh-pages` 分支

## 使用说明

### GitHub配置

要使用GitHub保存功能，需要配置以下信息：

1. **GitHub Token**
   - 前往 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
   - 生成一个新的token，选择 `repo` 权限
   - 将token复制到编辑器的GitHub配置中

2. **仓库信息**
   - **仓库所有者**：GitHub用户名或组织名
   - **仓库名称**：目标仓库的名称
   - **文件路径**：要保存的Markdown文件路径（如：`docs/README.md`）

3. **提交信息**（可选）
   - 自定义提交信息，默认为"Update markdown file"

### 编辑Markdown

- 在左侧编辑区域编写Markdown内容
- 右侧实时预览渲染效果
- 支持常见的Markdown语法：
  - 标题、粗体、斜体
  - 列表、表格
  - 代码块、引用
  - 链接、图片

## 项目结构

```
markdown-editor/
├── .github/workflows/     # GitHub Actions工作流
├── src/
│   ├── components/        # React组件
│   │   └── MarkdownEditor.jsx
│   ├── App.jsx           # 主应用组件
│   ├── App.css           # 样式文件
│   └── main.jsx          # 应用入口
├── index.html            # HTML模板
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── README.md            # 项目说明
```

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **Markdown编辑器**: @uiw/react-markdown-editor
- **GitHub API**: @octokit/core
- **样式**: CSS3 + 响应式设计

## 开发指南

### 添加新功能

1. 在 `src/components/` 目录下创建新的React组件
2. 在 `App.jsx` 中引入并使用新组件
3. 在 `App.css` 中添加相应的样式

### 自定义样式

项目使用现代化的CSS设计，主要特性包括：
- CSS变量和自定义属性
- Flexbox和Grid布局
- 响应式断点设计
- 动画和过渡效果

## 故障排除

### 常见问题

**Q: GitHub保存失败**
A: 检查以下配置：
- GitHub Token是否正确且有repo权限
- 仓库所有者、名称和文件路径是否正确
- 网络连接是否正常

**Q: 构建失败**
A: 检查以下配置：
- Node.js版本是否兼容（推荐v16+）
- 依赖是否完整安装
- 配置文件语法是否正确

**Q: 页面空白**
A: 检查以下配置：
- GitHub Pages基础路径是否正确
- 构建产物是否完整
- 浏览器控制台是否有错误

## 贡献

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License

---

**注意**: 请妥善保管GitHub Token，不要将其提交到公开仓库中。