module.exports = {
    compile: {
        options: {
            baseUrl: 'src/modules',
            dir: "build",
            removeCombined: true,
            useStrict: true,
            paths: {
                'element-utils': '../../external/element-kit/utils'
            }
        }
    }
};