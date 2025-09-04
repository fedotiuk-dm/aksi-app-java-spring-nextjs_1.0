#!/usr/bin/env python3
"""
Скрипт для очищення розпарсених Excel даних від сміття
Видаляє порожні рядки, декоративні символи, непотрібні колонки
"""

import pandas as pd
import json
import os
import shutil
from pathlib import Path

def clean_excel_data():
    """Очищення розпарсених даних від сміття"""

    input_dir = "parsed_data"
    output_dir = "cleaned_data"

    # Перевірка наявності вхідної директорії
    if not os.path.exists(input_dir):
        print(f"❌ Директорія {input_dir} не знайдена!")
        return

    # Створення директорії для результатів (з видаленням існуючої)
    if os.path.exists(output_dir):
        print(f"🗑️  Видалення існуючої директорії: {output_dir}")
        shutil.rmtree(output_dir)

    os.makedirs(output_dir)
    print(f"📁 Створено нову директорію: {output_dir}")

    # Читання індексного файлу
    index_file = os.path.join(input_dir, "index.json")
    if not os.path.exists(index_file):
        print("❌ Індексний файл не знайдено!")
        return

    with open(index_file, 'r', encoding='utf-8') as f:
        index_data = json.load(f)

    print(f"\n📊 Очищення {index_data['total_sheets']} аркушів...")

    # Аркуші що містять тільки сміття (повністю видаляємо)
    junk_sheets = [
        "-Template-",
        "Sheet45",
        "Sheet46"
    ]

    # Колонки що завжди є сміттям
    junk_columns = [
        "Unnamed: 0", "xxx", "---", "---.1", "---.2",
        "a", "a.1", "a.2", "a.3", "a.4",
        "Unnamed: 11", "Unnamed: 12", "Unnamed: 17"
    ]

    # Зберігаємо статистику очищення
    cleaning_stats = {
        "total_sheets": 0,
        "junk_sheets_removed": 0,
        "cleaned_sheets": 0,
        "total_rows_before": 0,
        "total_rows_after": 0,
        "removed_rows": 0
    }

    # Функція для конвертації datetime об'єктів
    def convert_datetime(obj):
        if isinstance(obj, pd.Timestamp):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif pd.isna(obj):
            return None
        else:
            return obj

    cleaned_sheets_data = {}

    for sheet_name, sheet_info in index_data["sheets"].items():
        cleaning_stats["total_sheets"] += 1
        cleaning_stats["total_rows_before"] += sheet_info["rows"]

        print(f"\n🔄 Обробка аркуша: {sheet_name}")

        # Повністю видаляємо аркуші що містять тільки сміття
        if sheet_name in junk_sheets:
            print(f"   🗑️  Аркуш {sheet_name} містить тільки сміття - видаляємо повністю")
            cleaning_stats["junk_sheets_removed"] += 1
            continue

        # Шлях до CSV файлу (використовуємо CSV для очищення)
        csv_file = os.path.join(input_dir, f"{sheet_name}.csv")

        if not os.path.exists(csv_file):
            print(f"   ⚠️  Файл {csv_file} не знайдено, пропускаємо")
            continue

        try:
            # Читання CSV файлу
            df = pd.read_csv(csv_file)

            # Видаляємо сміттєві колонки
            columns_to_drop = [col for col in junk_columns if col in df.columns]
            if columns_to_drop:
                df = df.drop(columns=columns_to_drop)
                print(f"   🧹 Видалено колонок: {columns_to_drop}")

            # Видаляємо повністю порожні рядки
            df_cleaned = df.dropna(how='all')

            # Видаляємо рядки що містять тільки декоративні символи або інструкції
            def is_junk_row(row):
                # Перевіряємо чи рядок містить тільки декоративні символи
                text_content = ' '.join(str(val) for val in row.values if pd.notna(val))
                if any(char in text_content for char in ['▬', '█', '▓', '▒', '░']):
                    return True
                # Перевіряємо чи це інструкції
                if any(keyword in text_content.lower() for keyword in [
                    'copy & paste', 'example', 'like the example', 'most popular',
                    'platform', 'service requested', 'account login', 'account password'
                ]):
                    return True
                return False

            # Фільтруємо рядки
            rows_before = len(df_cleaned)
            df_cleaned = df_cleaned[~df_cleaned.apply(is_junk_row, axis=1)]
            rows_after = len(df_cleaned)
            removed_rows = rows_before - rows_after

            if removed_rows > 0:
                print(f"   🧹 Видалено {removed_rows} сміттєвих рядків")

            # Видаляємо колонки що стали повністю порожніми після очищення
            df_cleaned = df_cleaned.dropna(axis=1, how='all')

            # Заповнюємо NaN порожніми рядками
            df_cleaned = df_cleaned.fillna('')

            # Зберігаємо очищені дані
            if not df_cleaned.empty:
                # Створюємо нові файли
                json_file = os.path.join(output_dir, f"{sheet_name}.json")
                csv_clean_file = os.path.join(output_dir, f"{sheet_name}.csv")
                structured_json_file = os.path.join(output_dir, f"{sheet_name}_structured.json")

                # Фільтруємо дані перед збереженням
                def filter_data_row(row):
                    # Видаляємо рядки з ліками на зовнішні сайти або сміттям
                    for value in row.values():
                        if isinstance(value, str):
                            # Лінки на бустинг сайти які не потрібні
                            if any(site in value.lower() for site in [
                                'playerauctions.com', 'epicnpc.com', 'ownedcore.com',
                                'elitepvpers.com', 'sythe.org', 'gamerebels.com',
                                'mmobc.com', 'raiditem.com', 'igvault.com'
                            ]):
                                return False
                            # Видаляємо рядки з декоративними символами
                            if any(char in value for char in ['▬', '█', '▓', '▒', '░', '■', '□']):
                                return False
                            # Видаляємо рядки з інструкціями та сміттям
                            if any(garbage in value.lower() for garbage in [
                                'copy & paste like the example', 'most popular',
                                'platform (pc/ps4/xbox):', 'service requested:',
                                'account login:', 'account password:', 'email for updates:'
                            ]):
                                return False
                    return True

                # Фільтруємо дані
                data_dict = df_cleaned.to_dict('records')
                filtered_data = [row for row in data_dict if filter_data_row(row)]

                # Видаляємо повністю порожні об'єкти (адаптивний фільтр)
                def is_meaningful_row(row):
                    # Для різних типів файлів різні важливі поля
                    if 'Discord' in row:  # A-Boosters файл
                        important_fields = ['Discord', 'Contact Email', 'Game 1']
                    elif 'Site$' in row:  # Ігрові файли
                        important_fields = ['Site$', 'PA$', 'Game Name']
                    else:  # Інші файли
                        important_fields = list(row.keys())[:3]  # Перші 3 поля

                    has_meaningful_data = False

                    for field in important_fields:
                        if field in row:
                            value = row[field]
                            if isinstance(value, str) and value.strip() and value.strip() not in ['', '0', '0.0']:
                                has_meaningful_data = True
                                break
                            elif pd.notna(value) and str(value).strip() and str(value).strip() not in ['0', '0.0', 'nan']:
                                has_meaningful_data = True
                                break

                    return has_meaningful_data

                filtered_data = [row for row in filtered_data if is_meaningful_row(row)]

                # Якщо після фільтрації немає даних, пропускаємо файл
                if not filtered_data:
                    print(f"   ⚠️  Після фільтрації аркуш {sheet_name} став порожнім")
                    return

                # Зберігаємо JSON
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(filtered_data, f, indent=2, ensure_ascii=False, default=str)

                # Зберігаємо CSV з відфільтрованими даними
                filtered_df = pd.DataFrame(filtered_data)
                filtered_df.to_csv(csv_clean_file, index=False, encoding='utf-8-sig')

                # Зберігаємо структурований JSON
                structured_data_dict = filtered_data.copy()
                for record in structured_data_dict:
                    for key, value in record.items():
                        record[key] = convert_datetime(value)

                structured_data = {
                    "sheet_name": sheet_name,
                    "total_rows": len(filtered_data),
                    "total_columns": len(df_cleaned.columns),
                    "columns": list(df_cleaned.columns),
                    "data": structured_data_dict
                }
                with open(structured_json_file, 'w', encoding='utf-8') as f:
                    json.dump(structured_data, f, indent=2, ensure_ascii=False, default=str)

                print(f"   ✅ Очищений файл збережено: {len(filtered_data)} рядків, {len(df_cleaned.columns)} колонок")

                # Зберігаємо інформацію про очищений аркуш
                cleaned_sheets_data[sheet_name] = {
                    "original_rows": sheet_info["rows"],
                    "cleaned_rows": len(filtered_data),
                    "removed_rows": sheet_info["rows"] - len(filtered_data),
                    "original_columns": sheet_info["columns"],
                    "cleaned_columns": len(df_cleaned.columns),
                    "removed_columns": sheet_info["columns"] - len(df_cleaned.columns),
                    "files": {
                        "json": f"{sheet_name}.json",
                        "csv": f"{sheet_name}.csv",
                        "structured_json": f"{sheet_name}_structured.json"
                    }
                }

                cleaning_stats["total_rows_after"] += len(filtered_data)
                cleaning_stats["cleaned_sheets"] += 1
            else:
                print(f"   ⚠️  Після очищення аркуш {sheet_name} став порожнім")

        except Exception as e:
            print(f"   ❌ Помилка при обробці {sheet_name}: {str(e)}")
            continue

    # Створюємо новий індексний файл
    cleaned_index_data = {
        "source_file": index_data["source_file"],
        "total_original_sheets": index_data["total_sheets"],
        "total_cleaned_sheets": cleaning_stats["cleaned_sheets"],
        "junk_sheets_removed": cleaning_stats["junk_sheets_removed"],
        "cleaning_stats": {
            "total_rows_before": cleaning_stats["total_rows_before"],
            "total_rows_after": cleaning_stats["total_rows_after"],
            "removed_rows": cleaning_stats["total_rows_before"] - cleaning_stats["total_rows_after"],
            "data_reduction_percent": round(
                (1 - cleaning_stats["total_rows_after"] / max(cleaning_stats["total_rows_before"], 1)) * 100, 2
            )
        },
        "sheets": cleaned_sheets_data
    }

    cleaned_index_file = os.path.join(output_dir, "index.json")
    with open(cleaned_index_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned_index_data, f, indent=2, ensure_ascii=False)

    print("\n🎉 Очищення завершено!")
    print(f"📁 Результати збережені в директорії: {output_dir}")
    print(f"📊 Статистика очищення:")
    print(f"   - Загальна кількість аркушів: {cleaning_stats['total_sheets']}")
    print(f"   - Видалено сміттєвих аркушів: {cleaning_stats['junk_sheets_removed']}")
    print(f"   - Очищено аркушів: {cleaning_stats['cleaned_sheets']}")
    print(f"   - Рядків до очищення: {cleaning_stats['total_rows_before']}")
    print(f"   - Рядків після очищення: {cleaning_stats['total_rows_after']}")
    print(f"   - Видалено рядків: {cleaning_stats['total_rows_before'] - cleaning_stats['total_rows_after']}")
    print(f"   - Зменшення даних: {cleaned_index_data['cleaning_stats']['data_reduction_percent']}%")

    return True

if __name__ == "__main__":
    print("🧹 Початок очищення Excel даних...")
    clean_excel_data()
