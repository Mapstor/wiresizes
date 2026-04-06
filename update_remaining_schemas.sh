#!/bin/bash

# Script to update remaining calculator pages with CombinedSchema
# Usage: ./update_remaining_schemas.sh

echo "Updating remaining calculator pages with CombinedSchema..."

# Get list of pages that don't have CombinedSchema yet
pages_to_update=$(grep -L "CombinedSchema" src/app/calculators/*/page.tsx | grep -v "/calculators/page.tsx" | grep -v "/\[slug\]/page.tsx")

for page in $pages_to_update; do
    echo "Processing: $page"
    
    # Extract calculator name from path
    calc_name=$(basename $(dirname $page))
    
    # Get the H1 title from the page
    h1_title=$(grep -o '<h1[^>]*>[^<]*</h1>\|text-[34]xl.*font-bold[^>]*>[^<]*' "$page" | head -1 | sed 's/<[^>]*>//g' | sed 's/.*>//' | xargs)
    
    # Get description from metadata
    description=$(grep -A 5 "description:" "$page" | grep -o "'[^']*'" | head -1 | sed "s/'//g")
    
    if [[ -n "$h1_title" && -n "$description" ]]; then
        echo "  Title: $h1_title"
        echo "  Description: $description"
        echo "  URL slug: $calc_name"
        
        # Replace import
        sed -i '' 's/import { FAQSchema } from .*/import { CombinedSchema } from '\''@\/components\/seo\/CombinedSchema'\'';/' "$page"
        
        # Add webAppData (this is a simple version - manual review recommended)
        echo "  Adding webAppData object..."
        
        # Replace FAQSchema with CombinedSchema (this needs manual review for correct FAQ key)
        echo "  Please manually update the schema calls in: $page"
    else
        echo "  Could not extract title or description from: $page"
    fi
    
    echo ""
done

echo "Automation complete. Please manually review and complete the schema replacements."
echo "Remember to:"
echo "1. Remove old structuredData objects"
echo "2. Remove old <script> tags with structuredData"
echo "3. Replace FAQSchema calls with CombinedSchema"
echo "4. Use the correct FAQ key for calculatorFAQs['key']"