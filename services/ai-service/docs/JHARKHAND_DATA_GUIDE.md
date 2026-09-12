# JHARKHAND DATA SWAP
Public bulk grievance text is the main missing real-world component.
Until official data is available, use the bundled synthetic data clearly marked synthetic.

When real data arrives:
- preserve raw text
- map to JSICP category/subcategory
- keep source and validation provenance
- remove PII
- add human-validated priority labels
- add resolution/status outcomes for future routing and priority learning
- retrain with `scripts/retrain_with_real_jharkhand.py`
