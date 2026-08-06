.PHONY: list status fetch pull push sync force-update force-update-hard commit-push

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
