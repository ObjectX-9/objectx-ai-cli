#!/bin/bash
# 撤销最近一次 commit，保留文件改动
git reset --soft HEAD~1
echo "Last commit undone. Changes are staged."
