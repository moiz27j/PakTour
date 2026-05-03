import json
import os

def update_page_names(response_file='response.json', output_file='page_names.json'):
    # Load JSON data from response.json
    with open(response_file, 'r', encoding='utf-8') as file:
        data = json.load(file)

    # Extract pageName values
    page_names = []
    for result in data.get('data', {}).get('searchQueries', {}).get('search', {}).get('results', []):
        basic_property_data = result.get('basicPropertyData', {})
        page_name = basic_property_data.get('pageName')
        if page_name:
            page_names.append(page_name)

    # Load existing page names if file exists
    existing_names = set()
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as existing_file:
                existing_data = json.load(existing_file)
                existing_names = set(existing_data.get('pageNames', []))
        except json.JSONDecodeError:
            print(f"Warning: '{output_file}' is not valid JSON. Starting fresh.")

    # Merge and remove duplicates
    combined_names = existing_names.union(page_names)

    # Write updated, unique list back to file
    with open(output_file, 'w', encoding='utf-8') as output_file:
        json.dump({"pageNames": sorted(combined_names)}, output_file, indent=4, ensure_ascii=False)

    new_names_count = len(combined_names) - len(existing_names)
    print(f"{new_names_count} new page names added to '{output_file}'")
    
    return new_names_count

# Example usage:
if __name__ == "__main__":
    update_page_names()
