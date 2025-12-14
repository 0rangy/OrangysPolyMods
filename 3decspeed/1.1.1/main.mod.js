import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js"

class ThreeDecimalSpeedometer extends PolyMod {
    init = (pml) => {
        pml.registerSettingCategory("Custom Decimal Speedometer");
        pml.registerSetting("Decimal places", "speedDecimalPlaces", "custom", 3, [{title: "1", value: 1},{title: "2", value: 2},{title: "3", value: 3},{title: "4", value: 4},{title: "5", value: 5}]);
        pml.registerClassMixin("kT.prototype", "update", MixinType.REPLACEBETWEEN, "Math.trunc(n).toString();", "Math.trunc(n).toString();", `n.toFixed(Number.parseInt(ActivePolyModLoader.getSetting("speedDecimalPlaces")));`)
    }
}

export let polyMod = new ThreeDecimalSpeedometer();