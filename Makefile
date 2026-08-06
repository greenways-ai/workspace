.DEFAULT_GOAL := help

repo-%:
	@$(MAKE) -sC scripts/00-repo $*

projects-%:
	@$(MAKE) -sC scripts/01-projects $*

crossover-%:
	@$(MAKE) -sC scripts/02-crossover $*

help: ## Show available targets
	@echo "Usage: make <section>-<target>"
	@echo
	@for d in scripts/00-repo scripts/01-projects scripts/02-crossover; do \
	  sec=$$(basename "$$d" | sed 's/^[0-9]*-//'); \
	  grep -hE '^[a-zA-Z0-9_-]+:.*## ' "$$d/Makefile" | \
	  sed -E "s/^([a-zA-Z0-9_-]+):[^#]*## (.*)/  make $$sec-\1\n      \2/"; \
	done
