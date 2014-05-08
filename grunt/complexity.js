module.exports = {
    generic: {
        src: ['<%= project.workspace %>/assets/scripts/**/*.js'],
        options: {
            breakOnErrors: true,
            //jsLintXML: 'report.xml',         // create XML JSLint-like report
            //checkstyleXML: 'checkstyle.xml', // create checkstyle report
            errorsOnly: false,               // show only maintainability errors
            cyclomatic: [3, 7, 12],          // or optionally a single value, like 3
            halstead: [8, 13, 20],           // or optionally a single value, like 8
            maintainability: 100,
            hideComplexFunctions: false      // only display maintainability
        }
    }
};