module.exports = {
    test: {
        options: {
            hostname: 'localhost',
            port: 7000
        }
    },
    local: {
        options: {
            hostname: 'localhost',
            port: 9000,
            keepalive: true,
            options: { livereload: true }
        }
    }
};