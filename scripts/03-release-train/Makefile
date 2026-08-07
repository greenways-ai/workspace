.DEFAULT_GOAL := status

MATRICES := ../../compatibility/tahto-0.1.json ../../compatibility/hodos-workspace-0.1.json

status: ## Show all pinned release trains and gate states
	@for matrix in $(MATRICES); do \
		python3 matrix.py --matrix $$matrix || exit $$?; \
		echo; \
	done

check: ## Verify all release-train gitlinks, URLs and architecture documents
	@for matrix in $(MATRICES); do \
		python3 matrix.py --matrix $$matrix --check || exit $$?; \
		echo; \
	done

gate: ## Require structural consistency and all architectural gates
	@for matrix in $(MATRICES); do \
		python3 matrix.py --matrix $$matrix --require-gates || exit $$?; \
		echo; \
	done
