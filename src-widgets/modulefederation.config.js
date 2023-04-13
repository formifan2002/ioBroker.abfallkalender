const makeFederation = require('@iobroker/vis-2-widgets-react-dev/modulefederation.config');

module.exports = makeFederation(
    'vis2abfallkalenderWidgets', // internal name of package - must be unique and identical with io-package.json=>common.visWidgets.vis2abfallkalenderWidget
    {
        './AbfallIcon': './src/AbfallIcon', // List of all widgets in this package
        './AbfallTable': './src/AbfallTable', // List of all widgets in this package
        './translations': './src/translations',
    },
);
