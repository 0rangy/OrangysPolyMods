import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0-beta2/PolyTypes.js"

class GhostToggleMod extends PolyMod {
    init = (pml) => {
        this.pml = pml;
        this.ghostEnabled = true;
        pml.registerBindCategory("Ghost Toggle Mod");
        pml.registerKeybind("Toggle Ghost", "ghostToggle", "keydown", "KeyO", null, (e) => { this.ghostEnabled = !this.ghostEnabled; });
        pml.registerClassMixin("ps.prototype", "update",MixinType.REPLACEBETWEEN, `e.car.getTime().numberOfFrames`, `e.car.getTime().numberOfFrames`, `(ActivePolyModLoader.getMod("${this.modID}").ghostEnabled ? e.car.getTime().numberOfFrames : 0)`)
        pml.registerClassMixin("ps.prototype", "update",MixinType.INSERT, `e.car.setCarState(t, !1)`, `;if(!ActivePolyModLoader.getMod("${this.modID}").ghostEnabled) break;`)
    }
}

export let polyMod = new GhostToggleMod();