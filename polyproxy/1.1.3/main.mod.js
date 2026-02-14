import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0-beta1/PolyTypes.js";

class PolyProxyMod extends PolyMod {
    preInit = (pml) => {
        // this.url = "https://polyproxy.orangywastaken.workers.dev/";
        this.url = "https://polyproxy.orangywastaken.workers.dev/";
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, `https://vps.kodub.com:43274/`, `https://vps.kodub.com:43274/`, this.url);
    }
}

export let polyMod = new PolyProxyMod();