.PHONY: list status fetch pull push sync

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
