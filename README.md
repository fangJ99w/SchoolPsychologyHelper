# 校园心理助手

这是一个基于Next.js开发的校园心理健康助手应用，旨在为学生提供心理健康支持和资源。

## 功能特点

- 实时聊天界面
- 基于OpenAI的智能回复
- 提供情感支持和基本心理健康建议
- 推荐校园心理健康资源
- 响应式设计，适配不同设备

## 技术栈

- Next.js 14 (React框架)
- TypeScript
- Tailwind CSS (样式)
- OpenAI API (聊天功能)
- Axios (HTTP请求)

## 快速开始

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- OpenAI API密钥

### 安装步骤

1. 克隆仓库
```
git clone <仓库地址>
cd mental-health-simple
```

2. 安装依赖
```
npm install
# 或
yarn install
```

3. 配置环境变量
   - 复制 `.env.local.example` 文件为 `.env.local`
   - 在 `.env.local` 中填入你的 OpenAI API 密钥

4. 启动开发服务器
```
npm run dev
# 或
yarn dev
```

5. 在浏览器中访问 `http://localhost:3000`

## 使用指南

1. 在主页面的聊天界面输入你的问题或感受
2. 心理助手会提供响应和支持
3. 紧急情况请联系校园心理咨询中心

## 注意事项

- 该应用不能替代专业的心理健康咨询
- 在紧急情况下，请直接联系专业人员或拨打心理健康热线
- 所有聊天内容会发送到OpenAI进行处理，请勿分享敏感个人信息

## 许可证

MIT 