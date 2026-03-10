# New Feature Workflow

## 步骤

1. **创建分支**
   ```bash
   git checkout main && git pull
   git checkout -b feat/<feature-name>
   ```

2. **开发**
   - 先写类型定义
   - 再写核心逻辑
   - 最后写测试

3. **提交**
   ```bash
   git add .
   git commit -m "feat: <description>"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feat/<feature-name>
   ```

5. **PR 描述模板**
   - What: 做了什么
   - Why: 为什么这么做
   - How: 关键实现思路
