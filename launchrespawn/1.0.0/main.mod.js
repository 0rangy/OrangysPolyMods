import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";

class PolyProxyMod extends PolyMod {
    init = (pml) => {
        pml.registerSimWorkerFuncMixin("s_", MixinType.REPLACEBETWEEN,`const e = new Ammo.btTransform;`,`o_(this, KA, l_(this, ZA, "f").nextCheckpointIndex, "f")`, 
            `l_(this, NA, "f").setWorldTransform(globalThis.lastState.NAworldTramsform)
            l_(this, kA, "f").setWorldTransform(globalThis.lastState.kAworldTramsform)
            const linearV = new Ammo.btVector3(globalThis.lastState.linearVelocity.x,globalThis.lastState.linearVelocity.y,globalThis.lastState.linearVelocity.z);
            const angularV = new Ammo.btVector3(globalThis.lastState.angularVelocity.x,globalThis.lastState.angularVelocity.y,globalThis.lastState.angularVelocity.z);
            l_(this, kA, "f").setLinearVelocity(linearV);
            l_(this, kA, "f").setAngularVelocity(angularV);
            Ammo.destroy(linearV);
            Ammo.destroy(angularV);
            if(l_(this, ZA, "f").nextCheckpointIndex < globalThis.lastCPIndex || globalThis.timeLost > this.getTime().time || globalThis.timeLost < 0)
                globalThis.timeLost = null
            globalThis.timeLost ? globalThis.timeLost += ( this.getTime().time - lastCPTime) : globalThis.timeLost = (this.getTime().time - lastCPTime)
            globalThis.lastCPIndex = l_(this, ZA, "f").nextCheckpointIndex;
            globalThis.lastCPTime = this.getTime().time
            o_(this, KA, l_(this, ZA, "f").nextCheckpointIndex, "f")`
        )
        pml.registerSimWorkerClassMixin("c_.prototype", "step", MixinType.INSERT,`++e), "f"),`, `console.log(),globalThis.lastState = 
            { 
                kAworldTransform: l_(this, kA, "f").getWorldTransform(),
                NAworldTransform: l_(this, NA, "f").getWorldTransform(),
                linearVelocity: { x: l_(this, kA, "f").getLinearVelocity().x(), y: l_(this, kA, "f").getLinearVelocity().y(), z: l_(this, kA, "f").getLinearVelocity().z() },
                angularVelocity: { x: l_(this, kA, "f").getAngularVelocity().x(), y: l_(this, kA, "f").getAngularVelocity().y(), z: l_(this, kA, "f").getAngularVelocity().z() }
            },globalThis.lastCPTime = this.getTime().time,`)
        pml.registerSimWorkerFuncMixin("ammoFunc", MixinType.INSERT, "brakeLightEnabled: r.isBrakeLightEnabled(),", `timeLost: globalThis.timeLost,`)
        pml.registerClassMixin("cU.prototype", "createCar", MixinType.INSERT, `const t = e.data.carStates;`, `ActivePolyModLoader.getMod("${this.modID}").timeLost = t;`)
        this.car = null;
        pml.registerFuncMixin("pP", MixinType.INSERT, `yP(this, eP, "f").setColors(n.carColors),`, `ActivePolyModLoader.getMod("${this.modID}").car = yP(this, eP, "f"),`);
        pml.registerClassMixin("pk.prototype", "update", MixinType.INSERT, `= uk(this, ak, "f")) {`, `
            if(ww(ActivePolyModLoader.getMod("launchrespawn").car, Sv, "f").timeLost) {
                uk(this, $x, "f").textContent = (n.time - ww(ActivePolyModLoader.getMod("launchrespawn").car, Sv, "f").timeLost).toFixed(3);
            }`)
        pml.registerSimWorkerClassMixin("RA.prototype", "setCarState", MixinType.INSERT, `, "f").controls.reset) {`, `console.log("wazzap");`)
    }
}
export let polyMod = new PolyProxyMod();