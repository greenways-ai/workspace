WORKSPACE_ROOT := $(abspath ../..)
HARA_NATIVE ?= $(WORKSPACE_ROOT)/technology/hara/core/rust/target/debug/hara
HARA_TEST ?= $(WORKSPACE_ROOT)/technology/hara/core/rust/target/debug/hara-test
CONTRACT_PROJECT := $(WORKSPACE_ROOT)/tools/connector-contract
CONTRACT_TEST := $(CONTRACT_PROJECT)/test/connector/contract/checker_test.hal

.PHONY: detect build test connector-contract-check

detect: ## Show detected project type per repo
	@./01-00-detect.sh

build: ## Build every repo (dispatched by project type)
	@./01-01-build.sh

test: ## Test every repo (dispatched by project type)
	@./01-02-test.sh

connector-contract-check: ## Run the read-only native connector contract check
	@test -x "$(HARA_NATIVE)" || { echo "missing native Hara binary: $(HARA_NATIVE)" >&2; exit 1; }
	@test -x "$(HARA_TEST)" || { echo "missing native Hara test runner: $(HARA_TEST)" >&2; exit 1; }
	@"$(HARA_NATIVE)" --project "$(CONTRACT_PROJECT)" --offline project check
	@"$(HARA_NATIVE)" --project "$(CONTRACT_PROJECT)" --offline project run
	@"$(HARA_TEST)" --root "$(CONTRACT_PROJECT)" "$(CONTRACT_TEST)"
