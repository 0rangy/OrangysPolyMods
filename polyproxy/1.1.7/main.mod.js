import {
  PolyMod,
  MixinType,
} from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0/PolyTypes.js";

class PolyProxyMod extends PolyMod {
  preInit = (pml) => {
    this.url = "https://polyproxy.polymodloader.com/";
    pml.registerGlobalMixin({
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `https://vps.kodub.com/`,
      tokenEnd: `https://vps.kodub.com/`,
      func: this.url,
    });
  };
}

export let polyMod = new PolyProxyMod();
