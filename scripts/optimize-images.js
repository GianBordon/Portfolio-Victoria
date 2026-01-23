const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const QUALITY = 80;
const SIZES = [400, 800, 1600];
const INPUT_DIR = path.join(__dirname, '../assets/img');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');
const IMAGES_DATA = require('../data/images.json');

async function optimizeImages() {
  console.log('🔍 Buscando imágenes en:', INPUT_DIR);
  
  const categories = Object.keys(IMAGES_DATA);
  
  for (const category of categories) {
    console.log(`\n📂 Procesando categoría: ${category}`);
    
    const outputPath = path.join(OUTPUT_DIR, category);
    await fs.mkdir(outputPath, { recursive: true });
    
    const images = IMAGES_DATA[category];
    
    for (const imageData of images) {
      const imageName = typeof imageData === 'string' ? imageData : imageData.name;
      const extension = imageData.extension || 'jpg';
      
      // Buscar la imagen con diferentes extensiones
      const possibleExtensions = ['.jpg', '.jpeg', '.JPG', '.JPEG', '.png', '.PNG'];
      let inputFile = null;
      
      for (const ext of possibleExtensions) {
        const testPath = path.join(INPUT_DIR, `${imageName}${ext}`);
        try {
          await fs.access(testPath);
          inputFile = testPath;
          break;
        } catch {
          continue;
        }
      }
      
      if (!inputFile) {
        console.log(`⚠️  No encontrada: ${imageName}`);
        continue;
      }
      
      // Generate responsive versions
      for (const size of SIZES) {
        const outputFile = path.join(outputPath, `${imageName}-${size}w.webp`);
        
        try {
          await sharp(inputFile)
            .resize(size, null, { withoutEnlargement: true })
            .webp({ quality: QUALITY })
            .toFile(outputFile);
          console.log(`✓ ${category}/${imageName}-${size}w.webp`);
        } catch (error) {
          console.log(`❌ Error en ${imageName}: ${error.message}`);
        }
      }
    }
  }
  
  console.log('\n✨ ¡Optimización completada!');
}

optimizeImages().catch(console.error);
