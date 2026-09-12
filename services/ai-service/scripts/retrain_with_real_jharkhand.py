"""
Retrain JSICP text model after adding real Jharkhand data.
Put one or more CSV files in data/jharkhand_real/ with at minimum:
text/raw_text and category. Category must use the JSICP taxonomy.
"""
import glob, pandas as pd, joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path

BASE=Path(".")
frames=[pd.read_csv(BASE/"data"/"synthetic_jharkhand_fusion.csv")]
for f in glob.glob(str(BASE/"data/jharkhand_real/*.csv")):
    d=pd.read_csv(f)
    text_col="text" if "text" in d else ("raw_text" if "raw_text" in d else None)
    if text_col and "category" in d:
        frames.append(d[[text_col,"category"]].rename(columns={text_col:"raw_text"}))
df=pd.concat(frames,ignore_index=True).dropna(subset=["raw_text","category"]).drop_duplicates("raw_text")
vec=TfidfVectorizer(analyzer="char_wb",ngram_range=(2,5),min_df=2,max_features=150000,sublinear_tf=True)
X=vec.fit_transform(df.raw_text.astype(str))
clf=LogisticRegression(max_iter=1800,class_weight="balanced")
clf.fit(X,df.category.astype(str))
joblib.dump({"vectorizer":vec,"classifier":clf,"categories":sorted(df.category.unique())},BASE/"models/jsicp_text_classifier.joblib")
print("Retrained on",len(df),"rows")
