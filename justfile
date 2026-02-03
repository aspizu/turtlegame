fmt:
    bunx --bun prettier -uwu .

fe:
    bun --filter=frontend vite --host

be:
    bun --filter=backend dev

pr-workflow branch-name="BRANCH_NAME" commit-message="COMMIT_MESSAGE":
    ./scripts/pr-workflow.sh "{{branch-name}}" "{{commit-message}}"
