#!/bin/bash

# Script to create new branch, commit, create PR, merge and delete branch using gh

set -e

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: gh CLI is not installed. Please install it first."
    exit 1
fi

# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Check if we're on main branch
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Warning: You're not on main branch. Current branch: $CURRENT_BRANCH"
fi

# Get branch name from argument or prompt
if [ -z "$1" ]; then
    read -p "Enter branch name: " BRANCH_NAME
else
    BRANCH_NAME="$1"
fi

if [ -z "$BRANCH_NAME" ]; then
    echo "Error: Branch name is required."
    exit 1
fi

# Get commit message from argument or prompt
if [ -z "$2" ]; then
    read -p "Enter commit message: " COMMIT_MESSAGE
else
    COMMIT_MESSAGE="$2"
fi

if [ -z "$COMMIT_MESSAGE" ]; then
    echo "Error: Commit message is required."
    exit 1
fi

echo "🌿 Creating new branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

echo "📝 Adding all changes"
git add .

echo "💾 Committing changes"
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing branch to remote"
git push -u origin "$BRANCH_NAME"

echo "🔍 Checking if PR already exists"
if gh pr view --json title --jq '.title' "$BRANCH_NAME" 2>/dev/null; then
    echo "⚠️  PR already exists for branch $BRANCH_NAME"
    PR_EXISTS=true
else
    echo "📄 Creating pull request"
    gh pr create --title "$COMMIT_MESSAGE" --body "## Summary

$COMMIT_MESSAGE"
    PR_EXISTS=false
fi

echo "⏳ Waiting for PR to be ready for merge..."
sleep 2

# Get PR number
PR_NUMBER=$(gh pr view --json number --jq '.number')

echo "🔗 Checking PR status..."
PR_STATE=$(gh pr view --json state --jq '.state')
MERGEABLE=$(gh pr view --json mergeable --jq '.mergeable')

if [ "$PR_STATE" = "OPEN" ] && [ "$MERGEABLE" = "MERGEABLE" ]; then
    echo "✅ Merging pull request #$PR_NUMBER"
    gh pr merge --merge
    
    echo "🏠 Switching back to main branch"
    git checkout main
    
    echo "📥 Pulling latest changes from main"
    git pull origin main
    
    echo "🗑️  Deleting local branch"
    git branch -d "$BRANCH_NAME"
    
    echo "🗑️  Deleting remote branch"
    git push origin --delete "$BRANCH_NAME"
    
    echo "🎉 Workflow completed successfully!"
else
    echo "⚠️  PR is not ready for merge (State: $PR_STATE, Mergeable: $MERGEABLE)"
    echo "🔗 PR URL: $(gh pr view --json url --jq '.url')"
    echo "Please check the PR and merge manually if needed."
fi