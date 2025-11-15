import React, { useState } from 'react'
import { Octokit } from '@octokit/core'
import MarkdownEditor from './components/MarkdownEditor'
import './App.css'

function App() {
  const [markdownContent, setMarkdownContent] = useState('# 欢迎使用Markdown编辑器\n\n开始编写你的Markdown文档吧！\n\n## 功能特点\n\n- 实时预览\n- 支持保存到GitHub仓库\n- 响应式设计\n\n```javascript\nconsole.log("Hello, Markdown!");\n```')
  const [githubConfig, setGithubConfig] = useState({
    token: '',
    owner: '',
    repo: '',
    path: 'document.md',
    message: 'Update document.md'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 处理保存到GitHub的逻辑
  const handleSaveToGithub = async () => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      setSaveStatus('请填写完整的GitHub配置信息')
      return
    }

    setIsSaving(true)
    setIsLoading(true)
    setSaveStatus('正在保存...')

    try {
      const octokit = new Octokit({
        auth: githubConfig.token
      })

      // 首先检查文件是否存在
      let sha = null
      try {
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner: githubConfig.owner,
          repo: githubConfig.repo,
          path: githubConfig.path
        })
        sha = data.sha
      } catch (error) {
        // 如果文件不存在，sha将为null，后续会创建新文件
        console.log('文件不存在，将创建新文件')
      }

      // 创建或更新文件
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: githubConfig.path,
        message: githubConfig.message,
        content: btoa(unescape(encodeURIComponent(markdownContent))),
        sha: sha // 如果是更新现有文件，需要提供sha
      })

      setSaveStatus('保存成功！')
    } catch (error) {
      console.error('保存失败:', error)
      setSaveStatus(`保存失败: ${error.response?.data?.message || error.message || '未知错误'}`)
    } finally {
      setIsSaving(false)
      setIsLoading(false)
    }
  }

  // 处理GitHub配置表单变化
  const handleConfigChange = (e) => {
    const { name, value } = e.target
    setGithubConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>GitHub Markdown 编辑器</h1>
        <p>在浏览器中编写Markdown，并直接保存到GitHub仓库</p>
      </header>

      <main className="app-main">
        <div className="editor-section">
          <h2>编辑区域</h2>
          <MarkdownEditor
            initialValue={markdownContent}
            onChange={setMarkdownContent}
            height={500}
          />
        </div>

        <div className="github-config github-section">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub 配置
          </h2>
          <div className="github-form">
            <div className="form-group github-form">
              <label>GitHub Token:</label>
              <input
                type="password"
                name="token"
                value={githubConfig.token}
                onChange={handleConfigChange}
                placeholder="输入GitHub Personal Access Token"
              />
              <small>需要具有repo权限的token</small>
            </div>

            <div className="form-group">
              <label>仓库所有者:</label>
              <input
                type="text"
                name="owner"
                value={githubConfig.owner}
                onChange={handleConfigChange}
                placeholder="用户名或组织名"
              />
            </div>

            <div className="form-group">
              <label>仓库名:</label>
              <input
                type="text"
                name="repo"
                value={githubConfig.repo}
                onChange={handleConfigChange}
                placeholder="仓库名称"
              />
            </div>

            <div className="form-group">
              <label>文件路径:</label>
              <input
                type="text"
                name="path"
                value={githubConfig.path}
                onChange={handleConfigChange}
                placeholder="例如: docs/example.md"
              />
            </div>

            <div className="form-group">
              <label>提交信息:</label>
              <input
                type="text"
                name="message"
                value={githubConfig.message}
                onChange={handleConfigChange}
                placeholder="提交信息"
              />
            </div>

            <button 
              className="save-button"
              onClick={handleSaveToGithub}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存到GitHub'}
            </button>

            {saveStatus && (
              <div className={`status ${saveStatus.includes('成功') ? 'success' : 'error'}`}>
                {saveStatus.includes('成功') && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {!saveStatus.includes('成功') && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
                {saveStatus}
              </div>
            )}
            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
                正在保存到GitHub...
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Markdown编辑器 | 直接编辑并保存到GitHub仓库</p>
      </footer>
    </div>
  )
}

export default App