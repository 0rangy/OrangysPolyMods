import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.2/PolyTypes.js"

class GhostToggleMod extends PolyMod {
    init = (pml) => {
        this.pml = pml;
        this.ghostEnabled = true;
        pml.registerBindCategory("Ghost Toggle Mod");
        pml.registerKeybind("Toggle Ghost", "ghostToggle", "keydown", "KeyO", null, (e) => { this.ghostEnabled = !this.ghostEnabled; });
        pml.registerClassMixin("ws.prototype", "update", {type: MixinType.REPLACEBETWEEN, tokenStart: `e.car.getTime().numberOfFrames`, tokenEnd: `e.car.getTime().numberOfFrames`, func: `(ActivePolyModLoader.getMod("${this.modID}").ghostEnabled ? e.car.getTime().numberOfFrames : -1)`})
        pml.registerClassMixin("ws.prototype", "update", {type: MixinType.INSERT, token: `e.car.setCarState(t, !1)`, func: `;e.car.setVisible(ActivePolyModLoader.getMod("${this.modID}").ghostEnabled);if(!ActivePolyModLoader.getMod("${this.modID}").ghostEnabled) {break;}`})
    }
}

export let polyMod = new GhostToggleMod();