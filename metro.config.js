// Create this file: WorcesterWatch/metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
};

module.exports = config;
