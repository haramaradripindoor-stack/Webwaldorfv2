import pandas as pd
import glob
import re
import datetime

files = glob.glob("/Users/felipeandresvivancocornejo/Downloads/Copia de Google Contacts Import*.xlsx")
all_data = []

for file_path in files:
    try:
        df = pd.read_excel(file_path)
        all_data.append(df)
    except Exception as e:
        pass

combined_df = pd.concat(all_data, ignore_index=True)

# We want kids who will be in 1st to 8th grade in 2027.
# Age in 2027: 6 to 13 years old.
# Birth year: 2014 to 2021.

valid_rows = []

for index, row in combined_df.iterrows():
    is_valid = False
    
    # 1. Try Birthday
    bday = row.get('Birthday')
    if pd.notna(bday):
        if isinstance(bday, datetime.datetime):
            year = bday.year
            if 2014 <= year <= 2021:
                is_valid = True
        elif isinstance(bday, str):
            try:
                # Try to parse string date
                date_obj = pd.to_datetime(bday)
                if 2014 <= date_obj.year <= 2021:
                    is_valid = True
            except:
                pass
                
    # 2. If not valid yet, try to parse the Notes field for 2024 grade
    # Target 2024 grades: Pre-Kinder, Kinder, 1, 2, 3, 4, 5. (To be in 1-8 in 2027)
    if not is_valid:
        notes = str(row.get('Notes', '')).upper()
        
        # Exclude old grades in 2024
        if any(x in notes for x in ['6°', '7°', '8°', '6TO', '7MO', '8VO', 'MEDIA', 'MEDIO', 'SALA CUNA']):
            is_valid = False
        else:
            # Check if it matches valid 2024 grades
            if any(x in notes for x in ['PRE-KINDER', 'PRE KINDER', 'KINDER', '1°', '2°', '3°', '4°', '5°', '1RO', '2DO', '3RO', '4TO', '5TO']):
                is_valid = True

    if is_valid:
        # We need to extract the email and phone for Meta Ads
        email = row.get('E-mail 1 - Value')
        phone = row.get('Phone 1 - Value')
        
        if pd.notna(email) or pd.notna(phone):
            # Try to get parent name from Name or Email
            name_str = str(row.get('Name ', '')).strip()
            if not name_str or name_str == 'nan':
                name_str = str(row.get('First Name', '')).strip()
                
            parts = name_str.split(' ')
            fn = parts[0] if len(parts) > 0 and parts[0] != 'nan' else ''
            ln = parts[1] if len(parts) > 1 and parts[1] != 'nan' else ''
            
            # Clean phone
            clean_phone = ''
            if pd.notna(phone):
                clean_phone = str(phone).replace('+', '').replace(' ', '').replace('.0', '')
                
            clean_email = ''
            if pd.notna(email):
                clean_email = str(email).strip().lower()
                
            valid_rows.append({
                'email': clean_email,
                'phone': clean_phone,
                'fn': fn,
                'ln': ln
            })

# Create final DataFrame
final_df = pd.DataFrame(valid_rows)

# Drop empty rows and duplicates
final_df = final_df.replace('', pd.NA).dropna(subset=['email', 'phone'], how='all')
final_df = final_df.drop_duplicates(subset=['email'])

output_path = '/Users/felipeandresvivancocornejo/Desktop/Trekan_Audiencia_Historica_Meta_Ads.xlsx'
final_df.to_excel(output_path, index=False)
print(f"Exported {len(final_df)} highly qualified historical leads to {output_path}")
