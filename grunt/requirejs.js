module.exports = {
    compile: {
        options: {
            baseUrl: 'src/modules',
            dir: "build",
            useStrict: true,
            paths: {
                'element-utils': '../../external/element-kit/utils'
            }
        }
    }
};