// import styles
require('./style.css');

// import components
require('components/hello_component');
require('components/hello_button');


// export the template as a DOM element
module.exports = $(require('./template.html'));