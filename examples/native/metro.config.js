// Metro config for the example app. The library is installed as a local
// (file:) dependency that symlinks to ../.., so we (1) watch the library folder
// and (2) force React / React Native / react-native-svg to resolve to THIS
// app's single copy (the symlinked lib would otherwise pull its own).
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const libRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [libRoot];

config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-svg': path.resolve(projectRoot, 'node_modules/react-native-svg'),
};

// Resolve bare imports from this app first, then from the library's own deps
// (where d3-scale / d3-shape / d3-array live).
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(libRoot, 'node_modules'),
];

module.exports = config;
