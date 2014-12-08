module.exports = {
    options: {
        additionalFiles: ['bower.json'],
        tagName: 'v<%= version %>',
        commitMessage: 'release <%= version %>',
        npm: false
    }

};