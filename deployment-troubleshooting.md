# GitHub Pages 部署故障排除指南

## 问题诊断

您的GitHub Pages URL `https://xinchengp.github.io/Markdown-Editor/` 无法访问，可能原因如下：

## 解决方案

### 1. 检查GitHub仓库设置

1. 访问 [GitHub仓库设置](https://github.com/xinchengp/Markdown-Editor/settings)
2. 滚动到左侧 "Pages" 菜单
3. 确保 "Source" 设置为 "GitHub Actions"

### 2. 检查工作流运行状态

1. 访问 [Actions标签](https://github.com/xinchengp/Markdown-Editor/actions)
2. 查看最新的工作流运行记录
3. 如果构建失败，查看错误日志

### 3. 常见问题修复

#### 问题1: base路径不匹配
- 当前vite.config.js中base设置为 `/markdown-editor/`
- 确保仓库名确实是 `Markdown-Editor`
- 如果仓库名不同，请修改vite.config.js中的base路径

#### 问题2: 构建失败
如果构建失败，请检查：
- package.json中的依赖是否完整
- 构建脚本是否正确配置

### 4. 手动触发部署

1. 进入GitHub仓库
2. 点击 Actions 标签
3. 选择 "Deploy to GitHub Pages" 工作流
4. 点击 "Run workflow" 按钮
5. 选择main分支并运行

### 5. 检查URL访问

部署成功后，访问地址应该是：
- https://xinchengp.github.io/Markdown-Editor/

注意：GitHub Pages可能需要几分钟时间生效。

## 快速修复步骤

如果上述方案都不行，请按以下步骤操作：

1. 确保仓库设置中的Pages源为GitHub Actions
2. 重新运行工作流
3. 等待5-10分钟后访问URL

如果仍有问题，请检查浏览器控制台是否有404或网络错误。