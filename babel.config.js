module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add dotenv config here (ABOVE reanimated)
      'module:react-native-dotenv',
      // Add this line right here:
      'react-native-reanimated/plugin', 
    ],
  };
};