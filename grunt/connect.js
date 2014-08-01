module.exports = {
    local: {
        options: {
            keepalive: true,
            options: { livereload: true }
        }
    },
    test: {
        options: {
            hostname: 'localhost',
            port: 7000
        }
    }
};