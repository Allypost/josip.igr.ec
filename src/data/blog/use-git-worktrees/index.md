---
title: "Using Git Worktrees to speed up your workflow"
description: "Having multiple branches of a repo on your local machine is a pain. Git worktrees to the rescue!"
pubDate: "2025-04-25"
tags: ["technology", "programming", "git", "tips"]
---

Git is a magical piece of software. The only downfall is that it's a bit arcane to do stuff that isn't `commit` and `push`.
People usually try to be helpful and give you a bunch of commands to do what you need to do, but discovering the thing you want to do is the hard part.

I've recently learned about Git worktrees. They're basically a way to have multiple branches of a repo on your local machine.
Each worktree is esentially a branch in a folder and you can have as many as you want.

## How to use them

To create a new worktree, you can use the following command:

```bash
git worktree add $PATH_TO_DIRECTORY $BRANCH_NAME
```

This will create a new directory at `$PATH_TO_DIRECTORY` and checkout (switch to) the branch `$BRANCH_NAME`.
You have to first create the branch yourself, otherwise it'll complain.

```bash
git branch $BRANCH_NAME
```

You can list all the worktrees with

```bash
git worktree list
```

And when you're done with the worktree, you can remove it with

```bash
git worktree remove $PATH_TO_DIRECTORY
```

Usually it complains about the branch having changes. You can force remove it with

```bash
git worktree remove $PATH_TO_DIRECTORY --force
```

## My workflow

I usually create a overview directory in which I keep all the branches I'm working on.

In it, I first manually clone the main branch into a folder called `main`.

Afterwards, for creating new worktrees I use a little script I wrote:

```bash:worktree-create.sh
#!/usr/bin/env bash

SCRIPT_PATH="$(
  cd "$(dirname "$0")" >/dev/null 2>&1
  pwd -P
)"
cd "$SCRIPT_PATH"

function main() {
  local BRANCH_NAME="$1"

  if [ -z "$BRANCH_NAME" ]; then
    echo "Usage: $0 <branch-name>"
    exit 1
  fi

  cd "${SCRIPT_PATH}/main"

  if git rev-parse --verify "$BRANCH_NAME" >/dev/null 2>&1; then
    echo "Branch '$BRANCH_NAME' already exists"
  else
    echo "Creating branch '$BRANCH_NAME'"
    git branch "$BRANCH_NAME"
  fi

  git worktree add ../"$BRANCH_NAME" "$BRANCH_NAME"
}

if [ -x "${DEBUG:-}" ]; then
  set -x
fi
set -euo pipefail

main "$@"
```

I keep the script in the overview directory.

```shell
$ tree -L 1 .
.
├── feature
├── main
└── worktree-create.sh
```

Usage of the script is simple:

```bash
./worktree-create.sh $BRANCH_NAME
```

It should create the branch if it doesn't exist and create a worktree in the overview directory.

It's really useful if you eg. like to name branches `feature/my-feature` or `fix/my-fix` as the worktree command won't create parent directories.

### Why not just checkout to $BRANCH_NAME?

Well, you can, but then you have to switch the branch every time you want to change anything.
It also kinda sucks when you have uncommitted changes in the branch you're currently on.

### Why not have multiple directories?

This is pretty close to what worktrees do, but it lacks some nice things.

For example, you can cherry-pick or rebase commits from one branch to another without having to push to the remote in one directory only to pull it in your current one.
