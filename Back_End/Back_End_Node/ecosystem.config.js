module.exports = {
    apps : [{
      name: 'TEST_IMPACT_API',
      script: './server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
      env_testing: {
        NODE_ENV: 'testing',
        PORT: 8080,
      }
    }],
  }