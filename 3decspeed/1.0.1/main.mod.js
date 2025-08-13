import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js"

class ThreeDecimalSpeedometer extends PolyMod {
    init = (pml) => {
        pml.registerClassMixin("xT.prototype", "update", MixinType.REPLACEBETWEEN, "Math.trunc(n).toString();", "Math.trunc(n).toString();", "n.toFixed(3);")
    }
}

export let polyMod = new ThreeDecimalSpeedometer();