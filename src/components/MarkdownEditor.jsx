import React, { useState, useEffect } from 'react'
import Editor from '@uiw/react-markdown-editor'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import './MarkdownEditor.css'

// 添加工具提示功能
const addTooltips = () => {
  setTimeout(() => {
    const buttons = document.querySelectorAll('.w-md-editor-toolbar button');
    buttons.forEach(button => {
      const name = button.getAttribute('data-name');
      if (name) {
        const tooltipText = getTooltipText(name);
        if (tooltipText) {
          button.setAttribute('title', tooltipText);
        }
      }
    });
  }, 100);
};

const getTooltipText = (name) => {
  const tooltips = {
    'bold': '加粗',
    'italic': '斜体',
    'strikethrough': '删除线',
    'underline': '下划线',
    'dividingLine': '分割线',
    'header1': '一级标题',
    'header2': '二级标题',
    'header3': '三级标题',
    'header4': '四级标题',
    'header5': '五级标题',
    'header6': '六级标题',
    'list': '无序列表',
    'orderedList': '有序列表',
    'todoList': '任务列表',
    'quote': '引用',
    'code': '行内代码',
    'codeBlock': '代码块',
    'link': '链接',
    'image': '图片',
    'table': '表格',
    'undo': '撤销',
    'redo': '重做',
    'fullscreen': '全屏',
    'preview': '预览',
    'wordCount': '字数统计',
    'clear': '清空内容',
    'superscript': '上标',
    'subscript': '下标',
    'mark': '高亮标记',
    'footnote': '脚注',
    'autolink': '自动链接',
    'email': 'Email链接',
    'formatBrush': '格式刷',
    'help': 'Markdown语法帮助'
  };
  return tooltips[name] || name;
};

const MarkdownEditor = ({ initialValue = '', onChange, height = 500 }) => {
  const [value, setValue] = useState(initialValue)

  // 当外部initialValue变化时更新编辑器内容
  useEffect(() => {
    if (initialValue !== value) {
      setValue(initialValue)
    }
  }, [initialValue])

  // 添加工具提示
  useEffect(() => {
    addTooltips();
    // 监听工具栏变化
    const observer = new MutationObserver(() => {
      addTooltips();
    });
    
    const toolbar = document.querySelector('.w-md-editor-toolbar');
    if (toolbar) {
      observer.observe(toolbar, { childList: true, subtree: true });
    }
    
    return () => observer.disconnect();
  }, [])

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
        // 自定义工具栏按钮 - 完整Markdown语法支持
        // 工具栏配置 - 完整功能布局
        toolbarcommands={[
          ['header1', 'header2', 'header3', 'header4', 'header5', 'header6'],
          ['bold', 'italic', 'strikethrough', 'underline', 'mark'],
          ['superscript', 'subscript'],
          ['list', 'orderedList', 'todoList', 'quote'],
          ['code', 'codeBlock', 'table'],
          ['link', 'autolink', 'email', 'image'],
          ['undo', 'redo', 'dividingLine'],
          ['formatBrush', 'footnote'],
          ['fullscreen', 'preview', 'help']
        ]}
        toolbar={{
          // 基础格式
          bold: { name: 'bold', title: '加粗', icon: 'bold' },
          italic: { name: 'italic', title: '斜体', icon: 'italic' },
          strikethrough: { name: 'strikethrough', title: '删除线', icon: 'strikethrough' },
          underline: { name: 'underline', title: '下划线', icon: 'underline' },
          dividingLine: { name: 'dividingLine', title: '分割线', icon: 'minus' },
          
          // 标题 - 支持六级标题
          header1: { 
            name: 'header1', 
            title: '一级标题', 
            icon: 'h1',
            onClick: () => {
              const newValue = (value || '') + '\n# 一级标题\n';
              handleChange(newValue);
            }
          },
          header2: { 
            name: 'header2', 
            title: '二级标题', 
            icon: 'h2',
            onClick: () => {
              const newValue = (value || '') + '\n## 二级标题\n';
              handleChange(newValue);
            }
          },
          header3: { 
            name: 'header3', 
            title: '三级标题', 
            icon: 'h3',
            onClick: () => {
              const newValue = (value || '') + '\n### 三级标题\n';
              handleChange(newValue);
            }
          },
          header4: { name: 'header4', title: '四级标题', icon: 'h4' },
          header5: { name: 'header5', title: '五级标题', icon: 'h5' },
          header6: { name: 'header6', title: '六级标题', icon: 'h6' },
          
          // 列表
          list: { name: 'list', title: '无序列表', icon: 'list-ul' },
          orderedList: { name: 'orderedList', title: '有序列表', icon: 'list-ol' },
          todoList: { name: 'todoList', title: '任务列表', icon: 'tasks' },
          
          // 引用和代码
          quote: { name: 'quote', title: '引用', icon: 'quote-left' },
          code: { name: 'code', title: '行内代码', icon: 'code' },
          codeBlock: { name: 'codeBlock', title: '代码块', icon: 'file-code' },
          
          // 媒体和链接
          link: { name: 'link', title: '链接', icon: 'link' },
          image: { name: 'image', title: '图片', icon: 'image' },
          table: { name: 'table', title: '表格', icon: 'table' },
          
          // 编辑操作
          undo: { name: 'undo', title: '撤销', icon: 'undo' },
          redo: { name: 'redo', title: '重做', icon: 'redo' },
          
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
          
          // 新增功能按钮
          superscript: { name: 'superscript', title: '上标', icon: 'superscript' },
          subscript: { name: 'subscript', title: '下标', icon: 'subscript' },
          mark: { name: 'mark', title: '高亮标记', icon: 'highlighter' },
          footnote: { name: 'footnote', title: '脚注', icon: 'sticky-note' },
          
          // 高级链接功能
          autolink: { 
            name: 'autolink', 
            title: '自动链接', 
            icon: 'external-link-alt',
            onClick: () => {
              const url = prompt('请输入URL:');
              if (url) {
                const newValue = (value || '') + `<${url}>`;
                handleChange(newValue);
              }
            }
          },
          
          email: { 
            name: 'email', 
            title: 'Email链接', 
            icon: 'envelope',
            onClick: () => {
              const email = prompt('请输入邮箱地址:');
              if (email) {
                const newValue = (value || '') + `<${email}>`;
                handleChange(newValue);
              }
            }
          },
          
          // 格式刷
          formatBrush: { 
            name: 'formatBrush', 
            title: '格式刷', 
            icon: 'paint-brush',
            onClick: () => {
              alert('格式刷功能：选中文字后点击格式刷按钮，可以将格式应用到其他文字上');
            }
          },
          
          // 高级帮助
          help: { 
            name: 'help', 
            title: 'Markdown语法帮助', 
            icon: 'question-circle',
            onClick: () => {
              alert(`完整Markdown语法支持：

基础语法：
# 一级标题     ## 二级标题     ### 三级标题
**加粗文字**   *斜体文字*    ~~删除线~~
> 引用文本     \`行内代码\`    \`\`\`代码块\`\`\`

列表语法：
- 无序列表项   1. 有序列表项   - [ ] 任务列表

链接和图片：
[链接文本](URL "标题")
![图片alt](图片URL "标题")
<自动链接URL>  <邮箱地址>

表格：
| 标题1 | 标题2 |
|-------|-------|
| 内容1 | 内容2 |`);
            }
          }
        }}
        // 添加自定义属性来支持工具提示
        data-enable-tooltip={true}
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
          placeholder: '开始编写你的 Markdown 文档...',
          spellCheck: true,
          autoFocus: false,
        }}
      />
    </div>
  )
}

export default MarkdownEditor