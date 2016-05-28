var root = __dirname.substring(0, __dirname.lastIndexOf('/'));
var config = require(root + '/config.js');
var async = require('async');

var tvInterface = require(root + '/tvInterface.js')(config);

tvInterface.groups.getAll(function(error, all){
    // var all_vaults = []
    // all.forEach(function(vault){
    //     if (vault.name !="admin") {
    //         all_vaults.push(vault.id);
    //     }
    // });
    console.log(all);


});
