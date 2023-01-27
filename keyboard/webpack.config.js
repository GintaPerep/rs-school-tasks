const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EsLintPlugin = require('eslint-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    compress: true,
  }
};

const esLintPlugin = (isDev) => isDev ? [] : [ new EsLintPlugin({ extensions: ['ts', 'js']}) ];

module.exports = ({develop}) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main_keyboard.js',
    assetModuleFilename: 'assets/[name][ext]',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: false },
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader',
             'css-loader',
             'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  'src/styles/vars.scss',
                ]
              }
            }
          ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',        
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({ 
      filename: '[name].[contenthash].css'
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }), 
    ...esLintPlugin(develop),
  ],
  ...devServer(develop),
});
