import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    preInit = (pml) => {
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, `https://vps.kodub.com/`, `https://vps.kodub.com/`, `https://polyproxy.orangy.cfd/`);
    }
}

export let polyMod = new PolyProxyMod();