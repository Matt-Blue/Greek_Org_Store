(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{29:function(e,t,n){e.exports=n(31)},326:function(e,t,n){__NEXT_REGISTER_PAGE("/update",function(){return e.exports=n(339),{page:e.exports.default}})},339:function(e,t,n){"use strict";n.r(t);var r=n(0),i=n.n(r),o=n(8),a=n.n(o),u=n(2),c=n(3),l=n.n(c),p=(n(29),n(15)),f=(n(14),n(11));function s(e){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.forEach(function(t){g(e,t,n[t])})}return e}function m(e,t,n,r,i,o,a){try{var u=e[o](a),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,i)}function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function v(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function E(){var e=P(["\n    mutation UPDATE_ITEM_MUTATION(\n        $id: ID!\n        $title: String\n        $description: String\n        $Price: Int\n    ) {\n        updateItem(\n            id: $id\n            title: $title \n            description: $description \n            Price: $Price\n        ) {\n            id\n            title\n            description\n            Price\n        }\n    } \n"]);return E=function(){return e},e}function w(){var e=P(["\n    query SINGLE_ITEM_QUERY($id: ID!) {\n        item (where: {id: $id}) {\n            id\n            title\n            description\n            Price\n        }\n    }\n"]);return w=function(){return e},e}function P(e,t){return t||(t=e.slice(0)),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}var O=l()(w()),_=l()(E()),j=function(e){function t(){var e,n,r,i;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,u=new Array(o),c=0;c<o;c++)u[c]=arguments[c];return r=this,i=(e=y(t)).call.apply(e,[this].concat(u)),n=!i||"object"!==s(i)&&"function"!=typeof i?v(r):i,g(v(v(n)),"state",{}),g(v(v(n)),"handleChange",function(e){var t=e.target,r=t.name,i=t.type,o=t.value,a="number"===i?parseFloat(o):o;n.setState(g({},r,a))}),g(v(v(n)),"updateItem",function(){var e,t=(e=a.a.mark(function e(t,r){return a.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),console.log("updating item!"),console.log(n.state),e.next=5,r({variables:d({id:n.props.id},n.state)});case 5:e.sent,console.log("updated");case 7:case"end":return e.stop()}},e,this)}),function(){var t=this,n=arguments;return new Promise(function(r,i){var o=e.apply(t,n);function a(e){m(o,r,i,a,u,"next",e)}function u(e){m(o,r,i,a,u,"throw",e)}a(void 0)})});return function(e,n){return t.apply(this,arguments)}}()),n}var n,o,c;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(t,r["Component"]),n=t,(o=[{key:"render",value:function(){var e=this;return i.a.createElement(u.Query,{query:O,variables:{id:this.props.id}},function(t){var n=t.data;return t.loading?i.a.createElement("p",null," Loading . . . "):n.item?i.a.createElement(u.Mutation,{mutation:_,variables:e.state},function(t,r){var o=r.loading,a=r.error;return i.a.createElement(p.a,{onSubmit:function(n){return e.updateItem(n,t)}},i.a.createElement(f.a,{error:a}),i.a.createElement("fieldset",{disabled:o,"aria-busy":o},i.a.createElement("label",{htmlFor:"title"},"Title",i.a.createElement("input",{type:"text",id:"title",name:"title",placeholder:"Title",required:!0,defaultValue:n.item.title,onChange:e.handleChange})),i.a.createElement("label",{htmlFor:"Price"},"Price",i.a.createElement("input",{type:"number",id:"Price",name:"Price",placeholder:"Price",required:!0,defaultValue:n.item.Price,onChange:e.handleChange})),i.a.createElement("label",{htmlFor:"description"},"Description",i.a.createElement("textarea",{id:"description",name:"description",placeholder:"Description",required:!0,defaultValue:n.item.description,onChange:e.handleChange})),i.a.createElement("button",{type:"submit"},"Sav",o?"ing":"e"," Changes")))}):i.a.createElement("p",null," No item found for id ",e.props.id," ")})}}])&&b(n.prototype,o),c&&b(n,c),t}();t.default=function(e){var t=e.query;return i.a.createElement("div",null,i.a.createElement(j,{id:t.id}))}}},[[326,1,0]]]);