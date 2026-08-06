.PHONY: detect build test

detect: ## Show detected project type per repo
	@./01-00-detect.sh

build: ## Build every repo (dispatched by project type)
	@./01-01-build.sh

test: ## Test every repo (dispatched by project type)
	@./01-02-test.sh
