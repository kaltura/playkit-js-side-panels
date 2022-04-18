const path = require('path');

const config = {
  target: 'web',
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      // {
      //   test: /\.m?js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //   options: {
      //   presets: ['@babel/preset-react'],
      //   plugins: [
      //     [
      //       '@babel/plugin-transform-react-jsx',
      //       {
      //         pragma: 'h',
      //         pragmaFrag: 'Fragment',
      //       },
      //     ],
      //   ],
      // presets: [
      //   '@babel/preset-react',
      //   '@babel/env',
      //   ['@babel/preset-typescript', {jsxPragma: 'h'}],
      // ],
      // plugins: [
      //   [
      //     '@babel/transform-react-jsx',
      //     {pragma: 'h', pragmaFrag: 'Fragment'},
      //   ],
      // ],
      // },
      //   },
      // },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'playkit-panels-manager.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    // library: {
    //   type: 'umd',
    // },
  },
  externals: {
    'kaltura-player-js': 'root KalturaPlayer',
    // preact: 'umd preact',
    preact: 'root KalturaPlayer.ui.preact',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src/demo'),
    },
    client: {
      progress: true,
    },
  },
};

module.exports = (env, {mode}) => {
  if (mode === 'development') {
    config.devtool = 'source-map';
  }
  return config;
};
