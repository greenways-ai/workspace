.PHONY: grep branch exec

grep: ## Search a pattern in every repo: make grep Q="pattern"
	@./02-00-grep.sh "$(Q)"

branch: ## Checkout/create a branch in every repo: make branch B="name"
	@./02-01-branch.sh "$(B)"

exec: ## Run a command in every repo: make exec CMD="git remote -v"
	@./02-02-exec.sh $(CMD)
