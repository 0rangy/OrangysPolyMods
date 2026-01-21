import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    preInit = (pml) => {
        this.pml = pml;
        this.url = "https://polyproxy.orangy.cfd/";
        this.alternateUrl = "https://polyproxy.polymodloader.com/";
        pml.registerSettingCategory("PolyProxy");
        pml.registerSetting("Use secondary proxy", "secondaryProxy", "boolean", false);
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, ` vu = 'https://vps.kodub.com/'`, ` vu = 'https://vps.kodub.com/'`, ` vu_1 = "ehehehehehehhehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehehe"`);
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, ` vu `, ` vu `, ` ActivePolyModLoader.getMod("polyproxy").getUrl() `);
    }
    getUrl = () => {
        try {
            console.log(this.pml.getSetting("secondaryProxy"));
            if(this.pml.getSetting("secondaryProxy") === "true") {
                return this.alternateUrl;
            } else {
                return this.url;
            }
        } catch (e) {
            console.log(e);
            return this.url;
        }
    }
}

export let polyMod = new PolyProxyMod();