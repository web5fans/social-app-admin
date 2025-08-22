# 乡建DAO 管理后台

> 项目使用 Vite 5 + React 18 + TypeScript，路由为文件路由，由 generouted 自动生成。
> 建议 Node 版本与 Volta 配置一致（node 22.11.0, npm 10.9.0）。


## 项目结构
 
```
social-app-admin/
 ├─ src/
 │  ├─ assets/
 │  ├─ components/
 │  ├─ pages/
 │  ├─ server/
 │  ├─ store/
 │  ├─ utils/
 │  ├─ i18n/           # 国际化
 │  ├─ main.tsx        # 入口
 │  └─ router.ts       # generouted 自动生成，手动修改无效
 ├─ .gitignore
 ├─ public/
 ├─ scripts/           # 接口代码生成等脚本（mjs）
 ├─ typings/
 ├─ vite-plugins/
 ├─ uno.config.ts      # UnoCSS 配置
 ├─ vite.config.ts     # Vite 配置
 ├─ tsconfig*.json
 └─ package.json
```
 
## 开发
 
```bash
npm run dev
```
### 接口定义生成

```bash
node scripts/generateServiceAPI.mjs
```

## 部署与预览
 
- 构建产物（输出到 dist/）
 
```bash
npm run build
```
 
- 本地预览构建结果
 
```bash
npm run preview
```
