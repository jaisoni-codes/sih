# WEB DEV HANDOFF

Use the entire ZIP as the AI service.

Do NOT copy only `app.py`.

The trained model is in:
`models/jsicp_text_classifier.joblib`

Start:
`uvicorn app:app --host 0.0.0.0 --port 8000`

Main call:
`POST /api/ai/process-complaint`

The frontend should render the JSON dynamically. Never hard-code a single complaint result.

For later real Jharkhand data:
1. Put CSVs in `data/jharkhand_real/`
2. Run `python scripts/retrain_with_real_jharkhand.py`
3. Restart API
4. Frontend endpoints stay unchanged.
