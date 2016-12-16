require('./globals');

var reporters = require('jasmine-reporters');
var junitReporter = new reporters.JUnitXmlReporter({
    savePath: './artifacts',
    consolidateAll: false
});

jasmine.getEnv().addReporter(junitReporter);
