import pandas as pd, re
from pathlib import Path
RAW=Path("data/raw_public"); OUT=Path("data/normalized_public"); OUT.mkdir(parents=True,exist_ok=True)

MAP={
"water_supply":"water","roads":"roads","sanitation":"sanitation","electricity":"electricity",
"drainage":"sanitation","public_health":"health","certificates":"certificates",
"welfare":"welfare","transport":"transport","education":"education"
}
def norm(s): return re.sub(r"\s+"," ",str(s).strip())

def civicdex():
    f=RAW/"civicdex_train.csv"
    if not f.exists(): return
    d=pd.read_csv(f)
    d["text"]=d.get("raw_text",d.get("normalized_text","")).map(norm)
    d["category"]=d["category"].map(lambda x: MAP.get(str(x),str(x)))
    d["source"]="CivicDex"
    keep=[c for c in ["text","category","urgency","severity","source"] if c in d.columns]
    d[keep].to_csv(OUT/"civicdex_normalized.csv",index=False)

def socrata(name):
    f=RAW/f"{name}_311_sample.csv"
    if not f.exists(): return
    d=pd.read_csv(f)
    if name=="nyc":
        text=(d.get("complaint_type","").fillna("").astype(str)+" "+d.get("descriptor","").fillna("").astype(str)).map(norm)
        d2=pd.DataFrame({"text":text,"source":"NYC311","status":d.get("status",""),"latitude":d.get("latitude",""),"longitude":d.get("longitude","")})
        # category is intentionally mapped by keyword; use as weak labels, not ground truth
        d2["category"]=d2.text.str.lower().map(lambda x:
            "roads" if any(k in x for k in ["pothole","street","road","sidewalk"]) else
            "sanitation" if any(k in x for k in ["garbage","waste","rodent","trash"]) else
            "water" if any(k in x for k in ["water","hydrant"]) else
            "electricity" if any(k in x for k in ["electric","light"]) else
            "environment" if any(k in x for k in ["air","noise","pollution"]) else
            "public_safety" if any(k in x for k in ["hazard","unsafe","building"]) else
            "transport")
    else:
        # Chicago column names vary; use a broad text join.
        text=d.astype(str).agg(" ".join,axis=1).map(norm)
        d2=pd.DataFrame({"text":text,"source":"Chicago311"})
        d2["category"]=d2.text.str.lower().map(lambda x:
            "roads" if any(k in x for k in ["pothole","street","road","sidewalk"]) else
            "sanitation" if any(k in x for k in ["garbage","waste","alley","sanitation"]) else
            "water" if any(k in x for k in ["water","flood","sewer"]) else
            "public_safety" if any(k in x for k in ["vacant","building","danger"]) else
            "transport" if any(k in x for k in ["traffic","vehicle","bus"]) else
            "environment")
    d2.to_csv(OUT/f"{name}_normalized.csv",index=False)

if __name__=="__main__":
    civicdex(); socrata("nyc"); socrata("chicago")
