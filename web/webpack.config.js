// webpack.config.js
const path = require('path');

module.exports = {
  // Entry point where Webpack will start bundling
  entry: './src/index.js',

  // Output configuration for the bundled file
  output: {
    filename: 'bundle.js',  // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },

  // Rules for loading different types of files
  module: {
    rules: [
      {
        test: /\.js$/,  // Apply the following rule to all JavaScript files
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,  // Apply the following rule to all CSS files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Optional: For optimizing and minifying JavaScript in production
  optimization: {
    minimize: true,
  },
};
