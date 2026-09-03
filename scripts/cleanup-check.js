const fs = require('fs').promises;
const path = require('path');

async function checkCleanup() {
  console.log('🔍 Revisando proyecto...\n');
  
  const checks = {
    oldImages: [],
    unusedDeps: [],
    recommendations: []
  };

  // 1. Verificar imágenes originales no optimizadas en assets/img
  try {
    const assetsDir = path.join(__dirname, '../assets/img');
    const files = await fs.readdir(assetsDir);
    const imageFiles = files.filter(f => 
      ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'].includes(path.extname(f))
    );
    
    if (imageFiles.length > 0) {
      checks.oldImages = imageFiles;
      checks.recommendations.push({
        type: '📦 Imágenes Originales',
        action: 'MOVER A BACKUP',
        reason: 'Las imágenes JPG/PNG originales ya fueron optimizadas a WebP',
        files: imageFiles.length,
        suggestion: 'Crear carpeta assets/img-backup/ y mover las originales allí'
      });
    }
  } catch (e) {
    console.log('⚠️  No se pudo revisar assets/img');
  }

  // 2. Verificar WebP antiguos en assets/img
  try {
    const assetsDir = path.join(__dirname, '../assets/img');
    const files = await fs.readdir(assetsDir);
    const oldWebp = files.filter(f => f.endsWith('.webp'));
    
    if (oldWebp.length > 0) {
      checks.recommendations.push({
        type: '🗑️  WebP Sin Optimizar',
        action: 'ELIMINAR',
        reason: 'Ahora usas las versiones responsivas optimizadas',
        files: oldWebp.length,
        suggestion: 'Eliminar assets/img/*.webp (ya tienes versiones optimizadas)'
      });
    }
  } catch (e) {}

  // 3. Verificar componentes React innecesarios
  try {
    const componentsPath = path.join(__dirname, '../components/OptimizedImage.jsx');
    await fs.access(componentsPath);
    checks.recommendations.push({
      type: '⚠️  Componente React',
      action: 'ELIMINAR',
      reason: 'Tu proyecto es HTML/Tailwind/JS, no usa React',
      files: 1,
      suggestion: 'Eliminar carpeta components/ completa'
    });
  } catch (e) {}

  // 4. Verificar package.json para dependencias innecesarias
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(await fs.readFile(packagePath, 'utf8'));
    
    if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
      checks.recommendations.push({
        type: '📦 Dependencias de Producción',
        action: 'REVISAR',
        reason: 'Un sitio HTML estático no debería tener dependencies',
        files: Object.keys(pkg.dependencies).length,
        suggestion: 'Mover todo a devDependencies'
      });
    }
  } catch (e) {}

  // Imprimir resultados
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (checks.recommendations.length === 0) {
    console.log('✅ ¡Proyecto limpio! No se encontraron archivos innecesarios.\n');
  } else {
    checks.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. ${rec.type}`);
      console.log(`   Acción: ${rec.action}`);
      console.log(`   Razón: ${rec.reason}`);
      console.log(`   Archivos: ${rec.files}`);
      console.log(`   💡 ${rec.suggestion}\n`);
    });
  }

  console.log('═══════════════════════════════════════════════════════\n');
  
  // Checklist pre-deploy
  console.log('📋 CHECKLIST PRE-DEPLOY:\n');
  console.log('  ☐ 1. Ejecutar: npm run optimize (ya hecho ✓)');
  console.log('  ☐ 2. Verificar que las imágenes carguen en localhost');
  console.log('  ☐ 3. Probar en diferentes dispositivos/tamaños');
  console.log('  ☐ 4. Verificar que netlify.toml esté configurado');
  console.log('  ☐ 5. Commit de los cambios a Git');
  console.log('  ☐ 6. Push a GitHub');
  console.log('  ☐ 7. Netlify auto-desplegará\n');
}

checkCleanup().catch(console.error);
