#!/bin/bash
# 清理已合并到 main 的本地分支
git checkout main
git pull
git branch --merged main | grep -v "^\* main$" | xargs -r git branch -d
echo "Done. Cleaned merged branches."
