# JSICP AI — REAL DATA FUSION FINAL

This package is the consolidated AI handoff for SIH 2026.

## What is inside

1. A trained JSICP text classifier using a larger, varied synthetic Jharkhand dataset.
2. Public-data ingestion adapters for NYC 311, Chicago 311 and CivicDex.
3. A priority model with an explicit replaceable target pipeline.
4. University routing using the earlier expertise table, with a clear AISHE/OpenAlex enrichment path.
5. Duplicate detection using the same text vector space against an existing complaint set.
6. SDG tagging.
7. Language detection.
8. Image validation API with an offline-safe fallback and a clear place to plug RDD2022/TACO/Civic Issue Detection YOLO weights.
9. Assistant endpoint.
10. One unified `/api/ai/process-complaint` endpoint.
11. A retraining script for future real Jharkhand grievance data.

## IMPORTANT DATA TRUTH

The current runtime could not download huge external datasets directly. Therefore:
- The bundled trained text model is trained on synthetic Jharkhand-oriented data plus source-taxonomy-inspired variations.
- The package contains reproducible download/normalization scripts for NYC 311, Chicago 311 and CivicDex.
- Large visual datasets (RDD2022 is ~12.36 GB) and gated IndicVoices are NOT bundled.
- Do not claim that the current bundled model was trained on raw NYC/Chicago/RDD/TACO rows.
- When network access is available, run the public-source download and normalization scripts, then retrain.

## Real Jharkhand data swap

Put CSV files in:
`data/jharkhand_real/`

Minimum:
- `text` or `raw_text`
- `category`

Then:
`python scripts/retrain_with_real_jharkhand.py`

The frontend API does not need to change.

## Run

`pip install -r requirements.txt`

`uvicorn app:app --reload --port 8000`

Main endpoint:
`POST /api/ai/process-complaint`

## Web developer

Connect:
- Submit Complaint -> `/api/ai/process-complaint`
- Classification -> `/api/classify`
- Priority -> `/api/priority-score`
- Duplicate -> `/api/duplicate-check`
- University Routing -> `/api/route-university`
- Image -> `/api/image-validate`
- Assistant -> `/api/assistant`
- SDG -> `/api/sdg-tag`
- Language -> `/api/language`

## Human-in-the-loop

AI outputs are recommendations. The UI should show `human_review.required=true` and allow a nodal officer/validator to confirm or edit category, priority and routing.
