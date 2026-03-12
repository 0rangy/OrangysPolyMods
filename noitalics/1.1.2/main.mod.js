import {
    PolyMod,
    MixinType,
} from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0/PolyTypes.js";

class NoItalicsMod extends PolyMod {
    preInit = (pml) => {
        pml.registerGlobalMixin({
            type: MixinType.REPLACEBETWEEN,
            tokenStart: `font-style: italic;`,
            tokenEnd: `font-style: italic;`,
            func: `font-style: normal;`,
        });
    };
}
export let polyMod = new NoItalicsMod();
