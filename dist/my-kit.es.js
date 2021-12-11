import { defineComponent, openBlock, createElementBlock, renderSlot } from "vue";
var index_vue_vue_type_style_index_0_scoped_true_lang$1 = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  emits: ["click"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: "my-button",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ]);
    };
  }
});
var Button = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-5102a2ab"]]);
const ButtonPlugin = {
  install(app) {
    app.component("my-button", Button);
  }
};
var index_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main = {};
const _hoisted_1 = { class: "my-foo" };
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1, " \u6211\u662F\u6D4B\u8BD5\u7EC4\u4EF6\u7EC4\u4EF6 ");
}
var Foo = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1df37c44"]]);
const FooPlugin = {
  install(app) {
    app.component("my-foo", Foo);
  }
};
const MYKitPlugin = {
  install(app) {
    var _a, _b;
    (_a = ButtonPlugin.install) == null ? void 0 : _a.call(ButtonPlugin, app);
    (_b = FooPlugin.install) == null ? void 0 : _b.call(FooPlugin, app);
  }
};
export { Button, ButtonPlugin, Foo, FooPlugin, MYKitPlugin as default };
