const si = require('systeminformation');

// promises style - new since version 3
// si.blockDevices(cb)
si.blockDevices(data => console.log(data))
    // .then(data => console.log(data))
    // .catch(error => console.error(error));

// si.cpu()
//   .then(data => console.log(data))
//   .catch(error => console.error(error));