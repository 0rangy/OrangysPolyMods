import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.getFromPolyTrack(`i(8419).A[0][1] = i(8419).A[0][1].replace("italic", "normal");t()(p.A, f);`);
    }
}
export let polyMod = new PolyProxyMod();