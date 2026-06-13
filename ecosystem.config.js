module.exports = {
  apps: [{
    name: 'braneiq-web',
    script: './apps/web/server.js',
    cwd: '/var/www/braneiq-web',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    restart_delay: 3000,
    max_restarts: 5,
    min_uptime: '10s',
    kill_timeout: 5000,
    listen_timeout: 10000,
    wait_ready: true
  }]
};
