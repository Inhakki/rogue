module.exports = {
    options: {
        files: ['package.json', 'bower.json'],
        commit: false,
        commitMessage: 'release %VERSION%',
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'v%VERSION%',
        push: false,
        pushTo: 'origin',
        updateConfigs: ['pkg']
    }

};