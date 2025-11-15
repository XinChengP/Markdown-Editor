import React, { useState, useEffect } from 'react'
import Editor from '@uiw/react-markdown-editor'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

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
        // 自定义工具栏按钮
        toolbar={{
          bold: true,
          italic: true,
          header: true,
          strikeThrough: true,
          underline: true,
          table: true,
          link: true,
          image: true,
          list: true,
          codeBlock: true,
          code: true,
          quote: true,
          dividingLine: true,
          fullscreen: true,
        }}
        // 自定义编辑器配置
        previewOptions={{
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
      />
    </div>
  )
}

export default MarkdownEditor