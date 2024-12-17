# Career Site

一个现代化的企业招聘网站，使用Next.js和Tailwind CSS构建。支持职位发布、简历投递和后台管理等功能。

## 功能特点

- 职位列表和详情展示
- 简历投递系统
- 后台应用管理
- 公司文化展示
- 活动页面
- 响应式设计
- 中英文支持
- 文件上传和管理

## 技术栈

- **前端框架**
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS
  - Hero Icons

- **后端和数据库**
  - Next.js API Routes
  - Prisma ORM
  - SQLite数据库

- **测试和开发工具**
  - Jest
  - React Testing Library
  - ESLint
  - TypeScript

## 快速开始

1. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd career-site
npm install
```

2. 设置环境变量：
```bash
cp .env.example .env
```

3. 初始化数据库：
```bash
npx prisma generate
npx prisma db push
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:8080](http://localhost:8080)

## 项目结构

```
career-site/
├── src/
│   ├── app/                 # Next.js App Router页面
│   │   ├── admin/          # 管理后台
│   │   ├── api/            # API路由
│   │   ├── jobs/           # 职位相关页面
│   │   └── events/         # 活动相关页面
│   ├── components/         # 可复用组件
│   │   ├── ui/            # UI基础组件
│   │   └── __tests__/     # 组件测试
│   └── lib/               # 工具函数和数据处理
├── data/                  # 静态数据文件
│   ├── jobs.json         # 职位数据
│   └── departments.json   # 部门数据
├── prisma/               # 数据库模型和迁移
└── uploads/              # 文件上传目录
```

## 开发命令

- `npm run dev` - 启动开发服务器 (http://localhost:8080)
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm test` - 运行测试
- `npm run lint` - 运行代码检查
- `npm run typecheck` - 运行类型检查

## 主要功能模块

### 职位管理
- 职位列表展示
- 职位详情页
- 按部门筛选
- 职位搜索

### 简历投递
- 在线填写申请表
- 上传简历文件
- 申请状态跟踪

### 后台管理
- 查看所有申请
- 下载简历文件
- 申请处理

### 公司文化
- 公司介绍
- 团队展示
- 活动信息

## 测试覆盖

项目包含完整的测试套件：
- 组件单元测试
- API接口测试
- 页面集成测试

总代码量约3600行，测试覆盖率达20%。

## 部署

项目使用Next.js构建，可以部署到任何支持Node.js的平台：

1. 构建项目：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

## 许可证

[MIT License](LICENSE)
