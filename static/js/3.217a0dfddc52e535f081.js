webpackJsonp([3],{K31e:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"login"},[e("p",[e("input",{ref:"userInput",attrs:{placeholder:"请输入用户名",type:"text",name:"userName"}})]),this._v(" "),this._m(0),this._v(" "),e("p",[e("input",{attrs:{type:"submit",value:"一键登录"},on:{click:this.sendLogin}})]),this._v(" "),e("router-link",{attrs:{to:"/",tag:"div"}},[this._v("返回首页>>>")])],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("p",[e("input",{attrs:{placeholder:"请输入密码",type:"password",name:"password"}})])}]};var n=r("VU/8")({data:function(){return{}},methods:{sendLogin:function(){var t=this.$refs.userInput.value;this.$local.save("miaov",{login:!0,userName:t});var e=this.$route.query.redirect;e||(e="project"),this.$router.push("/project")}}},s,!1,function(t){r("XfXl")},"data-v-92a1a3c2",null);e.default=n.exports},XfXl:function(t,e){}});
//# sourceMappingURL=3.217a0dfddc52e535f081.js.map