"""
Download small/targeted public-data samples for retraining.
This script is intentionally capped. Do NOT bulk-download 22M NYC rows or 12GB RDD2022
for an SIH demo. The goal is to pull representative rows and build a reproducible pipeline.
"""
import os, requests, pandas as pd
from pathlib import Path

OUT=Path("data/raw_public"); OUT.mkdir(parents=True,exist_ok=True)

def get_json(url, params=None, timeout=60):
    r=requests.get(url,params=params,timeout=timeout)
    r.raise_for_status()
    return r.json()

def nyc(limit=5000):
    url="https://data.cityofnewyork.us/resource/erm2-nwe9.json"
    params={"$limit":limit,"$order":"created_date DESC",
            "$select":"unique_key,created_date,closed_date,agency,agency_name,complaint_type,descriptor,status,latitude,longitude,borough"}
    data=get_json(url,params)
    pd.DataFrame(data).to_csv(OUT/"nyc_311_sample.csv",index=False)

def chicago(limit=5000):
    url="https://data.cityofchicago.org/resource/v6vf-nfxy.json"
    params={"$limit":limit,"$order":"created_date DESC"}
    data=get_json(url,params)
    pd.DataFrame(data).to_csv(OUT/"chicago_311_sample.csv",index=False)

def civicdex():
    # Hugging Face raw CSV path; if repository layout changes, use the dataset viewer/API.
    url="https://huggingface.co/datasets/JadeSamLee/civicdex/resolve/main/train.csv"
    r=requests.get(url,timeout=120); r.raise_for_status()
    (OUT/"civicdex_train.csv").write_bytes(r.content)

if __name__=="__main__":
    for fn in (nyc,chicago,civicdex):
        try:
            fn(); print("downloaded",fn.__name__)
        except Exception as e:
            print("SKIPPED",fn.__name__,":",e)
