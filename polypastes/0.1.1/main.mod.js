import { PolyMod, MixinType } from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.2/PolyTypes.js";

class PolyPastes extends PolyMod {
    loadFromPaste = (link) => {
        let regex = /https:\/\/pastes\.dev\/[A-Za-z0-9]+/i;
        if (regex.test(link)) {
            const fromExportString = this.pml.getFromPolyTrack("Ml.A.fromExportString");
            console.log(link.split("dev/")[1]);
            fetch(`https://api.pastes.dev/${link.split("dev/")[1]}`)
            const i = new XMLHttpRequest();
            i.open("GET", `https://api.pastes.dev/${link.split("dev/")[1]}`, false);
            i.send();
            return fromExportString(i.responseText);
        }
        return null;
    }
    preInit = (pml) => {
        this.pml = pml;
        pml.registerGlobalMixin({ type: MixinType.INSERT, token: `const o = m.U(e);`, func: `if(o == null) { return window.__polypastesmod.loadFromPaste(e); }` });
    }
    init = (pml) => {
        pml.getFromPolyTrack(`window.__polypastesmod = ActivePolyModLoader.getMod("${this.modID}")`);
    }
}


export let polyMod = new PolyPastes();