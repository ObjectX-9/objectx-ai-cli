# Code Review Workflow

## 步骤

1. **拉取最新代码**
   ```bash
   git fetch origin
   git checkout <branch>
   git pull
   ```

2. **检查代码质量**
   - 阅读 PR 描述，理解改动目的
   - 检查是否有测试覆盖
   - 检查命名规范、代码风格

3. **运行测试**
   ```bash
   pnpm test
   ```

4. **提交 Review 意见**
   - 使用 `suggestion` 给出具体修改建议
   - 区分 `nit`（小问题）和 `blocking`（必须改）

5. **Approve 或 Request Changes**
