import pandas as pd
import glob

files = glob.glob("/Users/felipeandresvivancocornejo/Downloads/Copia de Google Contacts Import*.xlsx")
total = 0
with_bday = 0
with_grade_in_notes = 0

for file_path in files:
    try:
        df = pd.read_excel(file_path)
        total += len(df)
        with_bday += df['Birthday'].notna().sum()
        with_grade_in_notes += df['Notes'].astype(str).str.contains('BÁSICA|MEDIA|KINDER|MEDIO|MENOR|MAYOR|SALA', case=False, na=False).sum()
    except Exception as e:
        print(f"Error in {file_path}: {e}")

print(f"Total rows: {total}")
print(f"With Birthday: {with_bday}")
print(f"With Grade in Notes: {with_grade_in_notes}")
