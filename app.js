require('babel-register')({
  presets: ["stage-0", "es2015"],
  plugins: ["add-module-exports"]
});

require('./server/app');
