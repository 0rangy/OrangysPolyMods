import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, `font-style: italic;`, `font-style: italic;`, `font-style: normal;`);
    }
}
export let polyMod = new PolyProxyMod();