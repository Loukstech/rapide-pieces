const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Empêche Metro de remonter dans l'arborescence (le dossier parent contient
// d'autres projets avec d'énormes node_modules — vitrine Vite + app Next.js —
// ce qui ralentissait/bloquait le scan du bundler).
config.watchFolders = [projectRoot];
config.resolver.nodeModulesPaths = [require('path').join(projectRoot, 'node_modules')];

module.exports = config;
