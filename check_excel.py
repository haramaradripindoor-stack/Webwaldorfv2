import pandas as pd
import sys

file_path = "/Users/felipeandresvivancocornejo/Downloads/Copia de Google Contacts Import Template (1).xlsx"
try:
    df = pd.read_excel(file_path)
    print("Columns:", list(df.columns))
    print("Sample row:", df.iloc[1].to_dict())
except Exception as e:
    print("Error:", e)
