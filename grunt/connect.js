module.exports = {
    test: {
        options: {
            hostname: 'localhost',
            port: 7000
        }
    },
    'test-server': {
        options: {
            hostname: 'localhost',
            port: 7500,
            keepalive: true,
            options: { livereload: true }
        }
    },
    local: {
        options: {
            hostname: 'localhost',
            port: 9000,
            base: 'build',
            keepalive: true,
            options: { livereload: true }
        }
    }
};