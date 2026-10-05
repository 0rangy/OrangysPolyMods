import {
  PolyMod,
  MixinType,
} from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.2/PolyTypes.js";

class ThreeDecimalSpeedometer extends PolyMod {
  preInit = (pml) => {
    pml.registerSettingCategory("Custom Decimal Speedometer");
    pml.registerSetting("Decimal places", "speedDecimalPlaces", "custom", "3", [
      { title: "1", value: "1" },
      { title: "2", value: "2" },
      { title: "3", value: "3" },
      { title: "4", value: "4" },
      { title: "5", value: "5" },
    ]);
  };
  init = (pml) => {
    pml.registerClassMixin("We.prototype", "update", {
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `Math.trunc(t)`,
      tokenEnd: `Math.trunc(t)`,
      func: `t.toFixed(Number.parseInt(ActivePolyModLoader.getSetting("speedDecimalPlaces")))`,
    });
  };
}

export let polyMod = new ThreeDecimalSpeedometer();
