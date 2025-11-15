import React, { useState, useEffect } from 'react'
import Editor from '@uiw/react-markdown-editor'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import './MarkdownEditor.css'

const MarkdownEditor = ({ initialValue = '', onChange, height = 500 }) => {
  const [value, setValue] = useState(initialValue)

  // 当外部initialValue变化时更新编辑器内容
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue])

  // 处理编辑器内容变化
  const handleChange = (newValue) => {
    setValue(newValue || '')
    // 触发外部onChange回调
    if (onChange) {
      onChange(newValue || '')
    }
  }

  return (
    <div className="markdown-editor-container">
      <Editor
        value={value}
        onChange={handleChange}
        height={height}
        preview="edit"
        // 自定义工具栏按钮 - 增强版
        toolbar={{
          // 基础格式
          bold: { name: 'bold', title: '加粗 (Ctrl+B)', icon: 'bold' },
          italic: { name: 'italic', title: '斜体 (Ctrl+I)', icon: 'italic' },
          strikethrough: { name: 'strikethrough', title: '删除线 (Ctrl+D)', icon: 'strikethrough' },
          underline: { name: 'underline', title: '下划线 (Ctrl+U)', icon: 'underline' },
          dividingLine: { name: 'dividingLine', title: '分割线 (Ctrl+H)', icon: 'minus' },
          
          // 标题
          header1: { name: 'header1', title: '一级标题 (Ctrl+1)', icon: 'h1' },
          header2: { name: 'header2', title: '二级标题 (Ctrl+2)', icon: 'h2' },
          header3: { name: 'header3', title: '三级标题 (Ctrl+3)', icon: 'h3' },
          
          // 列表
          list: { name: 'list', title: '列表', icon: 'list-ul' },
          orderedList: { name: 'orderedList', title: '有序列表', icon: 'list-ol' },
          todoList: { name: 'todoList', title: '任务列表', icon: 'tasks' },
          
          // 引用和代码
          quote: { name: 'quote', title: '引用', icon: 'quote-left' },
          code: { name: 'code', title: '行内代码', icon: 'code' },
          codeBlock: { name: 'codeBlock', title: '代码块', icon: 'file-code' },
          
          // 媒体和链接
          link: { name: 'link', title: '链接 (Ctrl+K)', icon: 'link' },
          image: { name: 'image', title: '图片 (Ctrl+P)', icon: 'image' },
          table: { name: 'table', title: '表格', icon: 'table' },
          
          // 编辑操作
          undo: { name: 'undo', title: '撤销 (Ctrl+Z)', icon: 'undo' },
          redo: { name: 'redo', title: '重做 (Ctrl+Y)', icon: 'redo' },
          
          // 视图
          fullscreen: { name: 'fullscreen', title: '全屏', icon: 'expand' },
          preview: { name: 'preview', title: '预览', icon: 'eye' },
          
          // 自定义按钮
          wordCount: { 
            name: 'wordCount', 
            title: '字数统计', 
            icon: 'calculator',
            onClick: () => {
              const text = value || '';
              const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
              const chars = text.length;
              alert(`字数统计\n字数: ${words}\n字符数: ${chars}`);
            }
          },
          
          clear: { 
            name: 'clear', 
            title: '清空内容', 
            icon: 'trash',
            onClick: () => {
              if (confirm('确定要清空所有内容吗？')) {
                handleChange('');
              }
            }
          },
          
          help: { 
            name: 'help', 
            title: '帮助', 
            icon: 'question-circle',
            onClick: () => {
              alert(`Markdown 快捷键：
Ctrl+B: 加粗
Ctrl+I: 斜体
Ctrl+K: 链接
Ctrl+P: 图片
Ctrl+Z: 撤销
Ctrl+Y: 重做`);
            }
          }
        }}
        // 自定义编辑器配置
        previewoptions={{
          components: {
            // 可以在这里自定义渲染组件
            code: ({ inline, children, className, node, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <pre className={className} {...props}>
                  <code>{String(children).replace(/\n$/, '')}</code>
                </pre>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          },
        }}
        // 额外的编辑器配置
        textareaprops={{
          placeholder: '开始编写你的 Markdown 文档...\n\n支持快捷键：\nCtrl+B: 加粗\nCtrl+I: 斜体\nCtrl+K: 链接\nCtrl+P: 图片',
          spellCheck: true,
          autoFocus: false,
        }}
      />
    </div>
  )
}

export default MarkdownEditor