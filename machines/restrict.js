module.exports = {


  friendlyName: 'Restrict access',


  description: 'Restrict access to a package published on NPM.',


  inputs: {

    packageName: {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to retrict access to.',
      example: '@mattmueller/cheerio',
      required: true
    }

  },


  exits: {

    unscopedPackage: {
      description: 'You can\'t change the access level of an unscoped package (e.g. "lodash" is unscoped, whereas "@jdalton/lodash" is scoped.)'
    },

    success: {
      description: 'Done.',
    }

  },


  fn: function (inputs,exits) {
    var Proc = require('machinepack-process');

    console.log('Running:','npm access restricted '+inputs.packageName);
    Proc.spawn({
      command: 'npm access restricted '+inputs.packageName
    }).exec({
      error: function (err){
        console.log('error exit', err);
        try {
          if (err.message.match(/Sorry, you can\'t change the access level of unscoped packages/i)) {
            return exits.unscopedPackage();
          }
        }
        catch (_e){}
        console.log('CALLING EXIT!');
        return exits.error(err);
      },
      success: function (bufferedOutput){
        console.log('success exit');
        return exits.success();
      }
    });
  },



};
