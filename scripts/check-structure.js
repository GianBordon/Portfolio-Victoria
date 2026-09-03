const fs = require('fs').promises;
const path = require('path');

async function checkStructure() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  try {
    const items = await fs.readdir(imagesDir, { withFileTypes: true });
    
    console.log('\n📁 Estructura de public/images:\n');
    
    for (const item of items) {
      if (item.isDirectory()) {
        console.log(`  📂 ${item.name}/`);
        const subItems = await fs.readdir(path.join(imagesDir, item.name));
        console.log(`     └─ ${subItems.length} archivos`);
      } else {
        console.log(`  📄 ${item.name}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkStructure();
