module.exports = {
    test: {
        options: {
            hostname: 'localhost',
            port: 7000,
            base: '.'
        }
    },
    local: {
        options: {
            hostname: 'localhost',
            port: 9000,
            base: 'build',
            keepalive: true
        }
    }
};