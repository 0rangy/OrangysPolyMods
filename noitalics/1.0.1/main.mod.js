import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.getFromPolyTrack(`i(8419).A[0][1] = i(8419).A[0][1].replace("italic", "normal");t()(p.A, f);`);
    }
}
export let polyMod = new PolyProxyMod();