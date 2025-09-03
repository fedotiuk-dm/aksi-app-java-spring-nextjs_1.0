#!/usr/bin/env python3
"""
Скрипт для парсингу Excel файлу OGEdge All Services test.xlsx
Конвертує дані в JSON та CSV формати
ПЕРЕЗАПИСУЄ існуючі файли (видаляє стару директорію parsed_data)
"""

import pandas as pd
import json
import os
import shutil
from pathlib import Path

def parse_excel_file():
    """Парсинг Excel файлу та конвертація в різні формати"""

    # Шлях до файлу
    excel_file = "OGEdge All Services test.xlsx"

    # Перевірка наявності файлу
    if not os.path.exists(excel_file):
        print(f"❌ Файл {excel_file} не знайдено!")
        return

    try:
        # Читання всіх аркушів з Excel файлу
        excel_data = pd.read_excel(excel_file, sheet_name=None)

        print("📊 Знайдені аркуші в Excel файлі:")
        for sheet_name in excel_data.keys():
            print(f"  - {sheet_name}")

        # Створення директорії для результатів (з видаленням існуючої)
        output_dir = "parsed_data"

        # Видалення існуючої директорії, якщо вона існує
        if os.path.exists(output_dir):
            print(f"🗑️  Видалення існуючої директорії: {output_dir}")
            shutil.rmtree(output_dir)

        # Створення нової директорії
        os.makedirs(output_dir)
        print(f"📁 Створено нову директорію: {output_dir}")

        # Обробка кожного аркуша
        for sheet_name, df in excel_data.items():
            print(f"\n🔄 Обробка аркуша: {sheet_name}")

            # Інформація про дані
            print(f"   Рядків: {len(df)}")
            print(f"   Колонок: {len(df.columns)}")
            print(f"   Назви колонок: {list(df.columns)}")

            # Очищення даних (видалення повністю порожніх рядків та колонок)
            df_cleaned = df.dropna(how='all').dropna(axis=1, how='all')

            if df_cleaned.empty:
                print(f"   ⚠️  Аркуш {sheet_name} порожній або містить тільки порожні комірки")
                continue

            # Заповнення NaN значень порожніми рядками для кращої сумісності
            df_cleaned = df_cleaned.fillna('')

            # Конвертація в JSON (з обробкою datetime)
            json_file = os.path.join(output_dir, f"{sheet_name}.json")

            # Конвертуємо DataFrame в словник з обробкою datetime
            data_dict = df_cleaned.to_dict('records')

            # Обробка datetime об'єктів для JSON серіалізації
            def convert_datetime(obj):
                if isinstance(obj, pd.Timestamp):
                    return obj.strftime('%Y-%m-%d %H:%M:%S')
                elif pd.isna(obj):
                    return None
                else:
                    return obj

            # Застосовуємо конвертацію до всіх значень
            for record in data_dict:
                for key, value in record.items():
                    record[key] = convert_datetime(value)

            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data_dict, f, indent=2, ensure_ascii=False, default=str)
            print(f"   ✅ JSON збережений: {json_file}")

            # Конвертація в CSV
            csv_file = os.path.join(output_dir, f"{sheet_name}.csv")
            df_cleaned.to_csv(csv_file, index=False, encoding='utf-8-sig')
            print(f"   ✅ CSV збережений: {csv_file}")

            # Створення структурованого JSON з додатковою інформацією
            # Обробка даних для структурованого JSON
            structured_data_dict = df_cleaned.to_dict('records')
            for record in structured_data_dict:
                for key, value in record.items():
                    record[key] = convert_datetime(value)

            structured_data = {
                "sheet_name": sheet_name,
                "total_rows": len(df_cleaned),
                "total_columns": len(df_cleaned.columns),
                "columns": list(df_cleaned.columns),
                "data": structured_data_dict
            }

            structured_json_file = os.path.join(output_dir, f"{sheet_name}_structured.json")
            with open(structured_json_file, 'w', encoding='utf-8') as f:
                json.dump(structured_data, f, indent=2, ensure_ascii=False, default=str)
            print(f"   ✅ Структурований JSON збережений: {structured_json_file}")

        print("\n🎉 Парсинг завершено успішно!")
        print(f"📁 Результати збережені в директорії: {output_dir}")
        print(f"🔄 Усі файли перезаписані (якщо були попередні версії)")

        # Створення індексного файлу з інформацією про всі аркуші
        index_data = {
            "source_file": excel_file,
            "total_sheets": len(excel_data),
            "sheets": {}
        }

        for sheet_name, df in excel_data.items():
            df_cleaned = df.dropna(how='all').dropna(axis=1, how='all')
            index_data["sheets"][sheet_name] = {
                "rows": len(df_cleaned),
                "columns": len(df_cleaned.columns),
                "column_names": list(df_cleaned.columns) if not df_cleaned.empty else [],
                "files": {
                    "json": f"{sheet_name}.json",
                    "csv": f"{sheet_name}.csv",
                    "structured_json": f"{sheet_name}_structured.json"
                }
            }

        index_file = os.path.join(output_dir, "index.json")
        with open(index_file, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, indent=2, ensure_ascii=False)
        print(f"📋 Індексний файл створений: {index_file}")

    except Exception as e:
        print(f"❌ Помилка при парсингу файлу: {str(e)}")
        return False

    return True

if __name__ == "__main__":
    print("🚀 Початок парсингу Excel файлу...")
    parse_excel_file()
