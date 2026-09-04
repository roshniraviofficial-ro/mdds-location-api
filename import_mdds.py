import os
import glob
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

def import_all_state_files(data_folder="./data/dataset"):
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Initialize Country
    cursor.execute("""
        INSERT INTO "Country" (name, code, "createdAt") 
        VALUES ('India', 'IND', NOW()) 
        ON CONFLICT (code) DO NOTHING;
    """)
    cursor.execute('SELECT id FROM "Country" WHERE code = \'IND\';')
    country_id = cursor.fetchone()[0]
    conn.commit()

    files = glob.glob(os.path.join(data_folder, "*.*"))
    print(f"Found {len(files)} state files to process.")

    # In-memory Caching
    state_cache = {}
    district_cache = {}
    subdistrict_cache = {}

    for file_path in files:
        if not file_path.endswith(('.xls', '.xlsx', '.ods')):
            continue

        file_name = os.path.basename(file_path)
        print(f"\n⚡ Fast Processing: {file_name}")
        
        try:
            if file_path.endswith('.ods'):
                df = pd.read_excel(file_path, engine='odf')
            else:
                df = pd.read_excel(file_path)
            
            df.columns = df.columns.str.strip()
            batch_villages = []

            for idx, row in df.iterrows():
                # State
                st_code, st_name = int(row['MDDS STC']), str(row['STATE NAME']).strip()
                if st_code not in state_cache:
                    cursor.execute("""
                        INSERT INTO "State" ("mddsCode", name, "countryId", "createdAt")
                        VALUES (%s, %s, %s, NOW())
                        ON CONFLICT ("mddsCode") DO UPDATE SET name = EXCLUDED.name
                        RETURNING id;
                    """, (st_code, st_name, country_id))
                    state_cache[st_code] = cursor.fetchone()[0]
                state_id = state_cache[st_code]

                # District
                dt_code, dt_name = int(row['MDDS DTC']), str(row['DISTRICT NAME']).strip()
                if dt_code not in district_cache:
                    cursor.execute("""
                        INSERT INTO "District" ("mddsCode", name, "stateId", "createdAt")
                        VALUES (%s, %s, %s, NOW())
                        ON CONFLICT ("mddsCode") DO UPDATE SET name = EXCLUDED.name
                        RETURNING id;
                    """, (dt_code, dt_name, state_id))
                    district_cache[dt_code] = cursor.fetchone()[0]
                district_id = district_cache[dt_code]

                # SubDistrict
                sub_code = int(row['MDDS Sub_DT'])
                sub_name = str(row['SUB-DISTRICT NAME']).strip()
                if sub_code not in subdistrict_cache:
                    cursor.execute("""
                        INSERT INTO "SubDistrict" ("mddsCode", name, "districtId", "createdAt")
                        VALUES (%s, %s, %s, NOW())
                        ON CONFLICT ("mddsCode") DO UPDATE SET name = EXCLUDED.name
                        RETURNING id;
                    """, (sub_code, sub_name, district_id))
                    subdistrict_cache[sub_code] = cursor.fetchone()[0]
                sub_district_id = subdistrict_cache[sub_code]

                # Village
                v_code = int(row['MDDS PLCN'])
                v_name = str(row['Area Name']).strip()
                batch_villages.append((v_code, v_name, sub_district_id))

                # Ultra fast batch insert (10,000 records per chunk)
                if len(batch_villages) >= 10000:
                    insert_villages(cursor, batch_villages)
                    conn.commit()
                    batch_villages = []
                    print(f"   -> Batch Inserted {idx + 1} villages...")

            if batch_villages:
                insert_villages(cursor, batch_villages)
                conn.commit()

            print(f"✅ Completed: {file_name}")

        except Exception as e:
            print(f"❌ Error in {file_name}: {e}")
            conn.rollback()

    conn.close()
    print("\n🚀 All state files processing completed in high speed!")

def insert_villages(cursor, villages):
    query = """
        INSERT INTO "Village" ("mddsCode", name, "subDistrictId", "createdAt") 
        VALUES %s 
        ON CONFLICT ("mddsCode") DO NOTHING;
    """
    execute_values(cursor, query, villages, template="(%s, %s, %s, NOW())", page_size=5000)

if __name__ == "__main__":
    import_all_state_files("./data/dataset")