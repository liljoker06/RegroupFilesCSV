const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const results = [];

const folderPath = 'C:/chemin de votre dossier qui contient la liste des fichier CSV ';

//  fonction qui va lire les fichier .csv
function processCSV(file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// fonction pour lire les csv du dossier indiquée dans notre const FolderPath
async function processCSVFiles() {
  try {
    const files = fs.readdirSync(folderPath);
    const csvFiles = files.filter((file) => path.extname(file).toLowerCase() === '.csv');

    for (const file of csvFiles) {
      const filePath = path.join(folderPath, file);
      await processCSV(filePath);
    }

    // Convertir les données combinées en CSV
    const combinedCSV = convertToCSV(results);

    // Écrire les données combinées dans un fichier
    const combinedFilePath = path.join(folderPath, 'Le nom que vous souhaitez donnée à votre fichier suivis du .csv');
    fs.writeFileSync(combinedFilePath, combinedCSV);
    console.log('Le fichier CSV combiné a été créé avec succès.');
  } catch (error) {
    console.error('Une erreur s\'est produite :', error);
  }
}

// Fonction pour convertir les données en CSV
function convertToCSV(dataArray) {
  const header = Object.keys(dataArray[0]).join(',') + '\n';
  const rows = dataArray.map((data) => Object.values(data).join(','));
  return header + rows.join('\n');
}

// Appeler la fonction principale pour traiter les fichiers CSV
processCSVFiles();