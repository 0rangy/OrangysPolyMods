import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

class OrangysCarSwitcherMod extends PolyMod {
    init = (pml) => {
        this.pmlInstance = pml;
        this.fdThing = null;
        this.touchingPhysics = true;
        this.carModels = [
            {
                "name": "Poly Car",
                "url": "models/car.glb",
                "sound": "audio/engine.flac"
            },
            {
                "name": "Trackmania 2020",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/tm2020.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "Pingu",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Pingu3.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "Trackmania Stadium",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/TMStadium.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "Forklift",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Forklift2.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "Spooky Car",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/spookycar2.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "F16",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/F16.glb`,
                "sound": "audio/engine.flac"
            },
            {
                "name": "LightningMcQueen",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/McQueen.glb`,
                "sound": "audio/click.flac"
            },
            {
                "name": "Delorean",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Delorean.glb`,
                "sound": "audio/engine.flac"
            }
        ]
        this.carList = []
        this.carApi = {
            /**
             * reloads all car models based on template model
             * template model is stored in Pg.models or modAPI.templateCar.models
             */
            reloadAllCarModels:()=>{
                let Pg = pml.getFromPolyTrack("dv")
                for(let x of this.carList){
                    let carColor = x.getColors()
                    for(let i of x.modelData.children){
                        for(let z of Object.keys(Pg.models)){
                            if(Pg.models[z].name == i.name){
                                i.geometry = Pg.models[z].geometry
                                i.material = Pg.models[z].material
                            }
                        }
                    }
                    {
                        const e = document.createElement("canvas");
                        e.width = 2048,
                            e.height = 2048;
                        const t = e.getContext("2d");
                        if (null == t)
                            throw "Failed to get context for car texture";
                        const n = new Cn(e);
                        let i;
                        n.flipY = !1,
                            n.anisotropy = Ov(x, $g, "f").getMaxAnisotropy(),
                            n.needsUpdate = !0,
                            Iv(x, av, t, "f"),
                            Iv(x, ov, n, "f");
                        let rand=wu.random();
                        Iv(x, lv, rand, "f"),
                            Ov(x, Cg, "m", yv).call(x),
                            Iv(x, sv, {
                                value: new Un(0,0,0)
                            }, "f"),
                            i = Array.isArray(Ov(x, tv, "f").material) ? Ov(x, tv, "f").material : [Ov(x, tv, "f").material];
                        for (let e = 0; e < i.length; ++e) {
                            const t = i[e];
                            "Main" == t.name ? t.onBeforeCompile = e => {
                                    e.fragmentShader = "uniform sampler2D carColorPattern;\nuniform vec3 carColorSecondary;\n" + e.fragmentShader,
                                        e.fragmentShader = e.fragmentShader.replace("vec4 diffuseColor = vec4( diffuse, opacity );", "float colorSource = texture(carColorPattern, vUv).a;\nvec4 diffuseColor = vec4( carColorSecondary * colorSource + diffuse * (1.0 - colorSource), opacity );"),
                                        e.uniforms.carColorPattern = {
                                            value: n
                                        },
                                        e.uniforms.carColorSecondary = Ov(x, sv, "f"),
                                    null == e.defines && (e.defines = {}),
                                        e.defines.USE_UV = !0
                                }
                                : "Metal" == t.name ? t.needsUpdate = !0 : "BrakeLight" == t.name && Iv(x, rv, t, "f")
                        }
                    }
                    x.setColors(carColor)
                }
            },
            /**
             * @param {String} carPath
             * @returns {Promise<Object>}
             */
            getComputedCarModel: async (carPath)=>{
                return new Promise((resolve, reject) => {
                    this.fdThing.load(carPath, (t) => {
                        function n(e) {
                            const n = t.scene.getObjectByName(e);
                            if (null == n) throw 'Mesh "' + e + '" does not exist';
                            if (0 == n.children.length) {
                                const e = n;
                                return (
                                    e.updateMatrixWorld(!0),
                                        e.geometry.applyMatrix4(e.matrix.clone()),
                                        e.matrix.identity(),
                                        e
                                );
                            }
                            let pl = pml.getFromPolyTrack('vl');
                            const i = pl(
                                n.children.map((e) => e.geometry),
                                !0,
                            );
                            n.updateMatrixWorld(!0), i.applyMatrix4(n.matrix.clone());
                            let Br = pml.getFromPolyTrack("yr");
                            const r = n.children.map((e) => e.material),
                                a = new Br(i, r);
                            return (a.name = e), a;
                        }
                        function i(e) {
                            let t;
                            return (
                                (t = Array.isArray(e.material) ? e.material : [e.material]),
                                    t.forEach((e) => (e.side = 0)),
                                    e
                            );
                        }
                        let resVal = {
                            chassis: i(n("Body")),
                            suspension: i(n("Suspension")),
                            suspensionFL: i(n("SuspensionFL")),
                            suspensionFR: i(n("SuspensionFR")),
                            suspensionBL: i(n("SuspensionBL")),
                            suspensionBR: i(n("SuspensionBR")),
                            wheelFL: i(n("WheelFL")),
                            wheelFR: i(n("WheelFR")),
                            wheelBL: i(n("WheelBL")),
                            wheelBR: i(n("WheelBR")),
                            collisionShapeVertices: pml.getFromPolyTrack(`Vw(Dv, Dv, "m", Ow)`).call(pml.getFromPolyTrack("Dv"), n("Collision")),
                        }
        
                        resVal.wheelFL.geometry.translate(-.627909, .218824, -1.3478),
                            resVal.wheelFR.geometry.translate(.627909, .218824, -1.3478),
                            resVal.wheelBL.geometry.translate(-.720832, .218824, 1.52686),
                            resVal.wheelBR.geometry.translate(.720832, .218824, 1.52686),
                            resVal.wheelFL.geometry.rotateZ(Math.PI),
                            resVal.wheelFR.geometry.rotateZ(Math.PI),
                            resVal.wheelBL.geometry.rotateZ(Math.PI),
                            resVal.wheelBR.geometry.rotateZ(Math.PI)
                        resolve(resVal)
                    });
                });
            },
            /**
             * @param {String} carPath
             * @returns {undefined}
             */
            setNewCarTemplateModel:async (carPath)=>{
                var newCar = typeof carPath == "string"? await this.carApi.getComputedCarModel(carPath): carPath //so you can submit a computed model
                pml.getFromPolyTrack('jw').models = await newCar
                return await newCar
            },
            carList: this.carList,
            templateCar: pml.getFromPolyTrack('jw')


        }
        pml.registerClassMixin("Gw", "initResources", MixinType.OVERRIDE, ["Al", "jw", "Ww", `Vw(Dv, Dv, "m", Ow)`, `Vw(Dv, Dv, "m", Fw)`, "vl", "yr"], (vl, dv, gw, dvdvfw, dvdvmw, pl, wr) => {
            return gw(this, void 0, void 0, (function*() {
                const e = yield new Promise(( (e, t) => {
                    this.fdThing = (new vl)
                    this.fdThing.load(window.localStorage.MyCar || "models/car.glb", (n => {
                        function i(e) {
                            const t = n.scene.getObjectByName(e);
                            if (null == t)
                                throw new Error('Mesh "' + e + '" does not exist');
                            if (0 == t.children.length) {
                                const e = t;
                                return e.updateMatrixWorld(!0),
                                e.geometry.applyMatrix4(e.matrix.clone()),
                                e.matrix.identity(),
                                e
                            }
                            const i = pl(t.children.map((e => e.geometry)), !0);
                            t.updateMatrixWorld(!0),
                            i.applyMatrix4(t.matrix.clone());
                            const r = t.children.map((e => e.material))
                              , a = new wr(i,r);
                            return a.name = e,
                            a
                        }
                        function r(e) {
                            let t;
                            t = Array.isArray(e.material) ? e.material : [e.material];
                            for (const e of t)
                                e.side = 0;
                            return e
                        }
                        dv.models = {
                            chassis: r(i("Body")),
                            suspension: r(i("Suspension")),
                            suspensionFL: r(i("SuspensionFL")),
                            suspensionFR: r(i("SuspensionFR")),
                            suspensionBL: r(i("SuspensionBL")),
                            suspensionBR: r(i("SuspensionBR")),
                            wheelFL: r(i("WheelFL")),
                            wheelFR: r(i("WheelFR")),
                            wheelBL: r(i("WheelBL")),
                            wheelBR: r(i("WheelBR")),
                            collisionShapeVertices: dvdvfw.call(dv, i("Collision"))
                        },
                        dv.models.wheelFL.geometry.translate(-.627909, .218824, -1.3478),
                        dv.models.wheelFR.geometry.translate(.627909, .218824, -1.3478),
                        dv.models.wheelBL.geometry.translate(-.720832, .218824, 1.52686),
                        dv.models.wheelBR.geometry.translate(.720832, .218824, 1.52686),
                        dv.models.wheelFL.geometry.rotateZ(Math.PI),
                        dv.models.wheelFR.geometry.rotateZ(Math.PI),
                        dv.models.wheelBL.geometry.rotateZ(Math.PI),
                        dv.models.wheelBR.geometry.rotateZ(Math.PI),
                        dvdvmw.call(dv).then((t => {
                            e(t)
                        }
                        )).catch(t)
                    }
                    ), void 0, t)
                }
                ));
                return yield new Promise(( (e, t) => {
                    const n = new Image;
                    n.addEventListener("load", ( () => {
                        e()
                    }
                    )),
                    n.addEventListener("error", ( () => {
                        t(new Error("Failed to load image"))
                    }
                    )),
                    n.src = "images/car_stripe.svg",
                    dv.images = {
                        stripe: n
                    }
                }
                )),
                e
            }
            ))
        })
        pml.registerFuncMixin("bN", MixinType.INSERT, "u()", () => {
            ;setTimeout(() => {
                let carMod = ActivePolyModLoader.getMod("carswitcher");
                const modButtonCarChooser = document.createElement("button");
            modButtonCarChooser.className = "button",
                modButtonCarChooser.innerHTML = '<img class="button-icon" src="images/test.svg"> ',
                modButtonCarChooser.append(document.createTextNode(t.get("Select Car")));
            const carSelectMenu = document.createElement("div");
            carSelectMenu.className = "car-select-menu";
            document.getElementById("ui").childNodes[0].childNodes[1].appendChild(carSelectMenu);
            carSelectMenu.style.position = "absolute";
            carSelectMenu.style.visibility = "hidden";
            carSelectMenu.style.width = "90%";
            carSelectMenu.style.transform = "translate(-50%)";
            carSelectMenu.style.top = "5rem";
            carSelectMenu.style.left = "50%";
            carSelectMenu.innerHTML = `${carMod.carModels.map(carModel =>{
                return `<button class = "button" onclick=\'javascript:{this.querySelector(".loading").style.display = "";window.polyModLoader.getMod("carswitcher").carApi.setNewCarTemplateModel("${carModel.url}").then((x)=>{window.localStorage.MyCar = "${carModel.url}";window.polyModLoader.getMod("carswitcher").carApi.reloadAllCarModels();this.querySelector(".loading").style.display = "none";window.localStorage.setItem("carSound", "${carModel.sound}")})}'>${carModel.name}<span class = "loading" style = "display:none;"> loading</span></button>`
            })}`;
            carSelectMenu.style.backgroundColor = "var(--surface-color)";
            modButtonCarChooser.addEventListener("click", ( () => {
                    carSelectMenu.style.visibility = carSelectMenu.style.visibility == "visible" ? "hidden" : "visible";
                }
            )),
            document.getElementById("ui").childNodes[0].childNodes[1].appendChild(modButtonCarChooser);
            }, 300)
        })
        if(pml.localStorage.getItem("carSound")){
            pml.registerSoundOverride("engine",pml.localStorage.getItem("carSound"));
        }
    }
}

export let polyMod = new OrangysCarSwitcherMod();