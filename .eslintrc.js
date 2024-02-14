module.exports = {
    parser: "babel-eslint",
    extends: ["eslint:recommended", "plugin:react/recommended"],
    plugins: ["react"],
    rules: {
      // Add your rules here
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    overrides: [
      {
        files: ["*.js"],
        rules: {
          // Replace require() with dynamic import()
          "global-require": "off",
          "import/no-commonjs": "error",
          "import/no-amd": "error",
          "import/no-nodejs-modules": "error",
        },
      },
    ],
  };
  
  