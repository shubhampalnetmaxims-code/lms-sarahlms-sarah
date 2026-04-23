#!/bin/bash

# Define files to process
FILES=$(grep -rIl "grade" src/components | grep -v "node_modules")

for file in $FILES; do
  echo "Processing $file..."
  
  # Replace grade_id with level_id
  sed -i 's/grade_id/level_id/g' "$file"
  
  # Replace gradeId with levelId
  sed -i 's/gradeId/levelId/g' "$file"
  
  # Replace gradeIds with levelIds
  sed -i 's/gradeIds/levelIds/g' "$file"
  
  # Replace Grade with Level
  sed -i 's/Grade/Level/g' "$file"
  
  # Replace grade with level (case sensitive, usually labels or variable names)
  sed -i 's/grade /level /g' "$file"
  sed -i 's/ grades/ levels/g' "$file"
  sed -i 's/ grade-/ level-/g' "$file"
  sed -i 's/grade\./level./g' "$file"
  sed -i 's/grade\?/level?/g' "$file"
  sed -i 's/grade)/level)/g' "$file"
  sed -i 's/grade,/level,/g' "$file"
  sed -i 's/grade\//level\//g' "$file"
  sed -i 's/: grade/: level/g' "$file"
  sed -i 's/grade"/level"/g' "$file"
  sed -i 's/grade\x27/level\x27/g' "$file"
  
  # Catch some common ones
  sed -i 's/filteredGrades/filteredLevels/g' "$file"
  sed -i 's/paginatedGrades/paginatedLevels/g' "$file"
  sed -i 's/totalGradePages/totalLevelPages/g' "$file"
  sed -i 's/isGradeModalOpen/isLevelModalOpen/g' "$file"
  sed -i 's/editingGrade/editingLevel/g' "$file"
  sed -i 's/gradeForm/levelForm/g' "$file"
  sed -i 's/gradeSort/levelSort/g' "$file"
  sed -i 's/handleSaveGrade/handleSaveLevel/g' "$file"
  sed -i 's/toggleGradeStatus/toggleLevelStatus/g' "$file"
  sed -i 's/INITIAL_GRADES/INITIAL_LEVELS/g' "$file"
  sed -i 's/aquire_grades/aquire_levels/g' "$file"
  sed -i 's/renderGrades/renderLevels/g' "$file"
  
done

echo "Done."
