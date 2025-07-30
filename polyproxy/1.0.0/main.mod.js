import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.registerClassMixin("HB.prototype", "getLeaderboard", MixinType.REPLACEBETWEEN, `eu + "leaderboard?version="`, `eu + "leaderboard?version="`, `"https://polyproxy.orangy.cfd/leaderboard?version="`)
        pml.registerClassMixin("HB.prototype", "getRecordings", MixinType.REPLACEBETWEEN, `eu + "recordings?version="`, `eu + "recordings?version="`, `"https://polyproxy.orangy.cfd/recordings?version="`)
        pml.registerClassMixin("HB.prototype", "submitLeaderboard", MixinType.REPLACEBETWEEN, `eu + "leaderboard"`, `eu + "leaderboard"`, `"https://polyproxy.orangy.cfd/leaderboard"`)
        pml.registerClassMixin("HB.prototype", "submitUserProfile", MixinType.REPLACEBETWEEN, `eu + "user"`, `eu + "user"`, `"https://polyproxy.orangy.cfd/user"`)
        pml.registerClassMixin("HB.prototype", "verifyRecordings", MixinType.REPLACEBETWEEN, `eu + "verifyRecordings"`, `eu + "verifyRecordings"`, `"https://polyproxy.orangy.cfd/verifyRecordings"`)    
        pml.registerClassMixin("HB.prototype", "getUser", MixinType.REPLACEBETWEEN, `eu + "user?`, `eu + "user?`, `"https://polyproxy.orangy.cfd/user?`)
    }
}

export let polyMod = new PolyProxyMod();