import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.registerClassMixin("nz.prototype", "getLeaderboard", MixinType.REPLACEBETWEEN, `vu +
            "leaderboard?version="`, `vu +
            "leaderboard?version="`, `"https://polyproxy.orangy.cfd/leaderboard?version="`)
        pml.registerClassMixin("nz.prototype", "getRecordings", MixinType.REPLACEBETWEEN, `vu + "recordings?version="`, `vu + "recordings?version="`, `"https://polyproxy.orangy.cfd/recordings?version="`)
        pml.registerClassMixin("nz.prototype", "submitLeaderboard", MixinType.REPLACEBETWEEN, `vu + "leaderboard"`, `vu + "leaderboard"`, `"https://polyproxy.orangy.cfd/leaderboard"`)
        pml.registerClassMixin("nz.prototype", "submitUserProfile", MixinType.REPLACEBETWEEN, `vu + "user"`, `vu + "user"`, `"https://polyproxy.orangy.cfd/user"`)
        pml.registerClassMixin("nz.prototype", "verifyRecordings", MixinType.REPLACEBETWEEN, `vu + "verifyRecordings"`, `vu + "verifyRecordings"`, `"https://polyproxy.orangy.cfd/verifyRecordings"`)    
        pml.registerClassMixin("nz.prototype", "getUser", MixinType.REPLACEBETWEEN, `vu +
                "user?`, `vu +
                "user?`, `"https://polyproxy.orangy.cfd/user?`)
    }
}

export let polyMod = new PolyProxyMod();