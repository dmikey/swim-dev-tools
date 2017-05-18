// import stylesheet
require('./style.css');

// export component as tag
// Swim-Dev-Tools use X-Tag: https://x-tag.github.io/docs
tag('x-hello-component', {
    template: require('./template.html')
});