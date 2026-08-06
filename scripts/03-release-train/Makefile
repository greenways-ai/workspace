.DEFAULT_GOAL := status

status: ## Show the pinned Tahto release train and gate state
	@python3 matrix.py

check: ## Verify release-train gitlinks, URLs and architecture documents
	@python3 matrix.py --check

gate: ## Require structural consistency and all architectural gates
	@python3 matrix.py --require-gates
