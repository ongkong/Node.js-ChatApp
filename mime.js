path = require('path');
exports.check = function(file){
  var ext = file.split(/[\/\.]/);
  ext = ext.pop()
  switch (ext){
    case 'txt':
    case 'doc':
    case 'docx':
      return 'text/plain';
    case 'html':
      return 'text/html';
    case 'css':
      return 'text/css';
    case 'js':
      return 'application/javascript';
    default:
      throw new Error('not recognized ext');
}
}; 
