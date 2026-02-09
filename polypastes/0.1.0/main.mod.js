import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";
class PolyPastes extends PolyMod {
    loadFromPaste = (link) => {
        let regex = /https:\/\/pastes\.dev\/[A-Za-z0-9]+/i;
        if(regex.test(link)) {
            const fromExportString = this.pml.getFromPolyTrack("hx.fromExportString");
            console.log(link.split("dev/")[1]);
            fetch(`https://api.pastes.dev/${link.split("dev/")[1]}`)
            const i = new XMLHttpRequest();
            i.open("GET", `https://api.pastes.dev/${link.split("dev/")[1]}`, false);
            i.send();
            return fromExportString(i.responseText);
        }
        return null;
    }
    init = (pml) => {
        this.pml = pml;
        pml.getFromPolyTrack(`window.__polypastesmod = ActivePolyModLoader.getMod("${this.modID}")`);
        pml.registerClassMixin("hx", "fromExportString", MixinType.INSERT, `const s = XA(e);`, `if(s == null) { return window.__polypastesmod.loadFromPaste(e); }`)
    }
}


export let polyMod = new PolyPastes();