module.exports = {
  apps: [
    {
      name: 'paste2share-backend',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        script: 'dist/main.js',
      },
    },
  ],
};
