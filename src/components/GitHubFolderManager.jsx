import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/core';
import './GitHubFolderManager.css';

const GitHubFolderManager = ({ githubConfig, onPathSelect, currentPath }) => {
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // 解析当前路径
  useEffect(() => {
    const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];
    setBreadcrumbs(pathParts);
    const folderPath = pathParts.slice(0, -1).join('/');
    setCurrentFolder(folderPath);
  }, [currentPath]);

  // 列出仓库文件
  const listRepositoryFiles = async (path = '') => {
    if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
      setError('请先配置GitHub信息');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const octokit = new Octokit({ auth: githubConfig.token });
      
      // 获取指定路径的内容
      const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: path
      });

      // 过滤和处理文件列表
      const fileList = Array.isArray(data) ? data.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path,
        size: item.size,
        download_url: item.download_url,
        sha: item.sha
      })) : [{
        name: data.name,
        type: data.type,
        path: data.path,
        size: data.size,
        download_url: data.download_url,
        sha: data.sha
      }];

      // 按类型和名称排序
      fileList.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'dir' ? -1 : 1;
      });

      setFiles(fileList);
    } catch (error) {
      console.error('获取文件列表失败:', error);
      setError(`获取文件列表失败: ${error.response?.data?.message || error.message}`);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // 进入文件夹
  const enterFolder = (folderPath) => {
    listRepositoryFiles(folderPath);
    setCurrentFolder(folderPath);
  };

  // 返回上一级
  const goBack = () => {
    const parentPath = currentFolder.split('/').slice(0, -1).join('/');
    enterFolder(parentPath);
  };

  // 选择文件或文件夹
  const handleItemClick = (item) => {
    if (item.type === 'dir') {
      enterFolder(item.path);
    } else if (item.type === 'file' && item.name.endsWith('.md')) {
      onPathSelect(item.path);
    }
  };

  // 创建新文件夹
  const createNewFolder = async () => {
    const folderName = prompt('请输入新文件夹名称:');
    if (!folderName) return;

    const newFolderPath = currentFolder ? `${currentFolder}/${folderName}/README.md` : `${folderName}/README.md`;
    
    try {
      const octokit = new Octokit({ auth: githubConfig.token });
      
      // 创建README.md文件来初始化文件夹
      await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: githubConfig.owner,
        repo: githubConfig.repo,
        path: newFolderPath,
        message: `创建文件夹: ${folderName}`,
        content: btoa(unescape(encodeURIComponent(`# ${folderName}\n\n这是 ${folderName} 文件夹的说明文件。`)))
      });

      // 刷新文件列表
      listRepositoryFiles(currentFolder);
      alert(`文件夹 "${folderName}" 创建成功！`);
    } catch (error) {
      console.error('创建文件夹失败:', error);
      alert(`创建文件夹失败: ${error.response?.data?.message || error.message}`);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (type, name) => {
    if (type === 'dir') return '📁';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return '📄';
    if (name.endsWith('.css')) return '🎨';
    if (name.endsWith('.json')) return '📋';
    if (name.endsWith('.html')) return '🌐';
    if (name.endsWith('.txt')) return '📃';
    return '📎';
  };

  return (
    <div className="github-folder-manager">
      <div className="folder-header">
        <h3>📂 GitHub仓库文件浏览器</h3>
        <div className="folder-actions">
          <button onClick={() => listRepositoryFiles(currentFolder)} disabled={loading}>
            {loading ? '🔄' : '🔄'} 刷新
          </button>
          <button onClick={createNewFolder}>
            ➕ 新建文件夹
          </button>
        </div>
      </div>

      {/* 面包屑导航 */}
      <div className="breadcrumbs">
        <span onClick={() => enterFolder('')} style={{cursor: 'pointer', color: '#0366d6'}}>
          🏠 根目录
        </span>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span style={{margin: '0 8px', color: '#666'}}>/</span>
            <span 
              onClick={() => enterFolder(breadcrumbs.slice(0, index + 1).join('/'))}
              style={{cursor: index < breadcrumbs.length - 1 ? 'pointer' : 'default', color: index < breadcrumbs.length - 1 ? '#0366d6' : '#333'}}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* 返回上一级按钮 */}
      {currentFolder && (
        <div className="back-button">
          <button onClick={goBack} style={{padding: '8px 16px', cursor: 'pointer'}}>
            ⬅️ 返回上一级
          </button>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* 文件列表 */}
      <div className="file-list">
        {loading ? (
          <div className="loading">正在加载文件列表...</div>
        ) : files.length === 0 ? (
          <div className="empty-message">
            {currentFolder ? '此文件夹为空' : '请输入GitHub配置信息并点击刷新查看文件'}
          </div>
        ) : (
          files.map((item) => (
            <div 
              key={item.path} 
              className={`file-item ${item.type === 'dir' ? 'folder' : 'file'} ${item.path === currentPath ? 'selected' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="file-info">
                <span className="file-icon">{getFileIcon(item.type, item.name)}</span>
                <span className="file-name">{item.name}</span>
                {item.type === 'file' && (
                  <span className="file-size">{formatFileSize(item.size)}</span>
                )}
              </div>
              <div className="file-actions">
                {item.type === 'dir' ? (
                  <span className="enter-folder">进入</span>
                ) : item.name.endsWith('.md') ? (
                  <span className="select-file">选择</span>
                ) : (
                  <span className="file-type">文件</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 使用说明 */}
      <div className="usage-tips">
        <p><strong>使用说明：</strong></p>
        <ul>
          <li>📁 点击文件夹可以进入查看内容</li>
          <li>📝 点击Markdown文件可以选择保存路径</li>
          <li>➕ 可以创建新文件夹来组织文档</li>
          <li>🔄 点击刷新按钮更新文件列表</li>
        </ul>
      </div>
    </div>
  );
};

export default GitHubFolderManager;