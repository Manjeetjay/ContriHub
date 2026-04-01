const { spawn } = require('child_process');
const waitOn = require('wait-on');

const vite = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true,
});

waitOn({ resources: ['tcp:5173'], timeout: 30000 })
  .then(() => {
    const electron = spawn(
      require('electron'),
      ['.'],
      { stdio: 'inherit' }
    );

    electron.on('close', () => {
      vite.kill();
      process.exit();
    });
  })
  .catch((err) => {
    console.error('Failed to start Vite dev server:', err);
    vite.kill();
    process.exit(1);
  });
