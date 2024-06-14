const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './.next/static/chunks/pages/_app-340528798bb11f1d.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
  },
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Your Next.js Application</title>
          <script src="main.bundle.js"></script>

        </head>
        <body>
          <div id="root"></div>
        </body>
        </html>
      `,
    }),
  ],
}
