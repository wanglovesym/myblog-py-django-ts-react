import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';

/**
 * 创建根节点并渲染
 * root：匹配index.html中的<div id="root"></div>
 * `!` ts非空断言（假设 root 元素一定存在）
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  /**
   * 作用：启用 React 严格模式
   * 功能：
   *    识别不安全的生命周期
   *    警告过时的API
   *    检测意外的副作用（如重复渲染）
   * 生产环境：仅开发阶段生效，不影响性能
   */
  <React.StrictMode>
    {/* 直接渲染路由，无需额外的 App 组件包装 */}
    <RouterProvider router={router} />
  </React.StrictMode>
);