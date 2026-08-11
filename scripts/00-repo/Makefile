.PHONY: list status fetch pull push sync force-update force-update-hard commit-push sync-children lfs-install lfs-pull lfs-check

list: ## List discovered repos and placeholder dirs
	@./00-00-list.sh

status: ## Read-only branch/dirty/ahead-behind overview
	@./00-01-status.sh

fetch: ## git fetch --all --prune in every repo
	@./00-02-fetch.sh

pull: ## git pull --rebase --autostash in every repo
	@./00-03-pull.sh

push: ## Push repos that are ahead of upstream
	@./00-04-push.sh

sync: ## Fetch then pull in every repo
	@./00-05-sync.sh

force-update: ## Reset super-repo + all repos to origin/main, on main (stashes uncommitted changes)
	@./00-06-force-update.sh --stash

force-update-hard: ## Like force-update but DISCARDS uncommitted changes in tracked files
	@./00-06-force-update.sh --hard

commit-push: ## Commit dirty repos with M="msg" (children first, super-repo last), then push
	@./00-07-commit-push.sh "$(M)"

sync-children: ## Clone newly added children, switch children to main, then pull all
	@./00-08-sync-children.sh

lfs-install: ## Install Git LFS hooks for the workspace clone
	@git -C ../.. lfs install

lfs-pull: ## Hydrate canonical 3D and video sources from Git LFS
	@git -C ../.. lfs pull --include="assets/3d/**,assets/video/**"

lfs-check: ## Verify the workspace media Git LFS contract
	@./00-09-lfs-check.sh
