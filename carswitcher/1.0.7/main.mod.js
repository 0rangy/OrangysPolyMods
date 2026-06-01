import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.2/PolyTypes.js";

let Variables = {
    TemplateCar: "B",
    UIMixin: "u.appendChild(b));"
}

class OrangysCarSwitcherMod extends PolyMod {
    addUI = () => { setTimeout(() => {
                let carMod = window.polyModLoader.getMod("carswitcher");
                const modButtonCarChooser = document.createElement("button");
            modButtonCarChooser.className = "button",
                modButtonCarChooser.innerHTML = '<img class="button-icon" src="images/test.svg"> ',
                modButtonCarChooser.append(document.createTextNode("Select Car"));
            const carSelectMenu = document.createElement("div");
            carSelectMenu.className = "car-select-menu";
            document.getElementById("ui").childNodes[0].childNodes[2].appendChild(carSelectMenu);
            carSelectMenu.style.position = "absolute";
            carSelectMenu.style.zIndex = "1000";
            carSelectMenu.style.visibility = "hidden";
            carSelectMenu.style.width = "90%";
            carSelectMenu.style.transform = "translate(-50%)";
            carSelectMenu.style.top = "5rem";
            carSelectMenu.style.left = "50%";
            carSelectMenu.innerHTML = `${carMod.carModels.map(carModel =>{
                return `<button class = "button" onclick=\'javascript:{this.querySelector(".loading").style.display = "";window.polyModLoader.getMod("carswitcher").carApi.setNewCarTemplateModel("${carModel.url}").then((x)=>{window.polyModLoader.getMod("carswitcher").applyWheelPositions(${JSON.stringify(carModel.wheelPositions || this.wheelPositions)});window.localStorage.MyCar = "${carModel.url}";this.querySelector(".loading").style.display = "none";if(window.polyModLoader.getMod("pmlapi")) { window.polyModLoader.getMod("pmlapi").soundManager.load("engine", ["${carModel.sound}"])} window.localStorage.setItem("carSound", "${carModel.sound}")})}'>${carModel.name}<span class = "loading" style = "display:none;"> loading</span></button>`
            })}`;
            carSelectMenu.style.backgroundColor = "var(--surface-color)";
            modButtonCarChooser.addEventListener("click", ( () => {
                    carSelectMenu.style.visibility = carSelectMenu.style.visibility == "visible" ? "hidden" : "visible";
                }
            )),
            document.getElementById("ui").childNodes[0].childNodes[2].appendChild(modButtonCarChooser);
            }, 200)
        }
    applyWheelPositions = (positions) => {
        console.log(positions)
        this.pmlInstance.getFromPolyTrack(`
          i(641).evalHere(\`ae = { value: [
            new c.Pq0(${positions.wheelFR[0]}, ${positions.wheelFR[1]}, ${positions.wheelFR[2]}),
            new c.Pq0(${positions.wheelFL[0]}, ${positions.wheelFL[1]}, ${positions.wheelFL[2]}),
            new c.Pq0(${positions.wheelBR[0]}, ${positions.wheelBR[1]}, ${positions.wheelBR[2]}),
            new c.Pq0(${positions.wheelBL[0]}, ${positions.wheelBL[1]}, ${positions.wheelBL[2]}),
        ]}\`);
      `)
    }
    getWheels = () => {
      return this.wheelVectorPos;
    }
    preInit = (pml) => {
      this.wheelVectorPos = [];
      pml.registerGlobalMixin({
        type: MixinType.INSERT,
        token: `A: () => lt`,
        func: `, TemplateCar: () => B, evalHere: (stuff) => function(str) { return eval(str); } `
      });
      pml.registerGlobalMixin({type: MixinType.REPLACEBETWEEN, tokenStart: `"models/car.glb"`, tokenEnd: `"models/car.glb"`, func: `window.localStorage.MyCar || "models/car.glb"`})
      pml.registerChunkMixin(`604.bundle.js`, { type: MixinType.INSERT, token: `${Variables.UIMixin}`, func: `window.polyModLoader.getMod("carswitcher").addUI();`})
        
    }
    init = (pml) => {
        const pApi = pml.getMod("pmlapi");
        this.pmlInstance = pml;
        this.pApi = pApi;
        this.fdThing = null;
        this.touchingPhysics = true;
        this.wheelPositions = {
          wheelFR: [0.627909, 0.27, 1.3478],
          wheelFL: [-0.627909, 0.27, 1.3478],
          wheelBR: [0.720832, 0.27, -1.52686],
          wheelBL: [-0.720832, 0.27, -1.52686] 
        };
        
        this.carModels = [
            {
                "name": "Poly Car",
                "url": "models/car.glb",
                "sound": "audio/engine.mp3"
            },
            {
                "name": "Trackmania 2020",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/tm2020.glb`,
                "sound": "audio/engine.mp3",
                "wheelPositions": {
                  wheelFR: [0.845606, 0.27, 1.3478],
                  wheelFL: [-0.833504, 0.27, 1.3478],
                  wheelBR: [0.882136, 0.27, -1.52686],
                  wheelBL: [-0.882545, 0.27, -1.52686] 
                }
            },
            {
                "name": "Pingu",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Pingu3.glb`,
                "sound": "audio/click.mp3"
            },
            {
                "name": "Trackmania Stadium",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/TMStadium.glb`,
                "sound": "audio/engine.mp3",
                "wheelPositions": {
                  wheelFR: [0.740905, 0.27, 1.3478],
                  wheelFL: [-0.740905, 0.27, 1.3478],
                  wheelBR: [0.763992, 0.27, -1.52686],
                  wheelBL: [-0.763992, 0.27, -1.52686] 
                }
            },
            {
                "name": "Forklift",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Forklift2.glb`,
                "sound": "audio/engine.mp3"
            },
            {
                "name": "Spooky Car",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/spookycar2.glb`,
                "sound": "audio/engine.mp3",
                "wheelPositions": {
                  wheelFR: [0.627909, 0.27, 1.3478],
                  wheelFL: [-0.627909, 0.27, 1.3478],
                  wheelBR: [0.627909, 0.27, -1.52686],
                  wheelBL: [-0.627909, 0.27, -1.52686] 
                },
            },
            {
                "name": "F16",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/F16.glb`,
                "sound": "audio/engine.mp3"
            },
            {
                "name": "LightningMcQueen",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/McQueen.glb`,
                "sound": "audio/engine.mp3"
            },
            {
                "name": "Delorean",
                "url": `${this.modBaseUrl}/${this.modVersion}/assets/Delorean.glb`,
                "sound": "audio/engine.mp3",
                "wheelPositions": {
                  wheelFR: [0.545703, 0.276128, 0.921115],
                  wheelFL: [-0.545703, 0.276128, 0.921115],
                  wheelBR: [0.545703, 0.276128, -1.34245],
                  wheelBL: [-0.545703, 0.276128, -1.34245] 
                }
            }
        ]
        this.carList = []
        this.carApi = {

            /**
             * @param {String} carPath
             * @returns {Promise<Object>}
             */
            getComputedCarModel: async (carPath)=>{
                return this.pmlInstance.getFromPolyTrack(`
                  let it = async function () {
                if (null == B.models)
                  throw new Error("Car models are not loaded yet");
                const e = new Float32Array(B.models.collisionShapeVertices),
                  t = await window.crypto.subtle.digest("SHA-256", e.buffer),
                  n = Array.from(new Uint8Array(t))
                    .map((e) => e.toString(16).padStart(2, "0"))
                    .join(""),
                  i =
                    "c12d4421883ae86b922550f98efea3cf5e6b9c168436f9f5c989ad33a41ce50b",
                  r = n == i;
                return (
                  r ||
                    console.error(
                      "Car collision model checksum mismatch: " +
                        n +
                        " != " +
                        i,
                    ),
                  r
                );
              },
              nt = function (e) {
                const t = e.geometry.toNonIndexed();
                if (!(t.attributes.position instanceof c.THS))
                  throw new Error("Vertices must use BufferAttribute");
                return Array.from(t.attributes.position.array);
              };

          var B = i(641).TemplateCar,
           w = i(8724),
           l = i(1635),
           h = i(1566),
           d = i(1507),
           U = i(3339),
           c = i(4922);
          const decoderclass = i(1728);
          const loaderclass = i(7888);
          const decoder = new decoderclass.Z(), loader = new loaderclass.B();
          decoder.setDecoderPath("lib/draco/");
          loader.setDRACOLoader(decoder);
          new Promise((t, n) => {
                    loader.load(
                      "${carPath}",
                      (e) => {
                        function i(t, n) {
                          const i = e.scene.getObjectByName(t);
                          if (null == i)
                            throw new Error('Mesh "' + t + '" does not exist');
                          if (0 == i.children.length) {
                            if (!(i instanceof c.eaF))
                              throw new Error(
                                'Mesh "' + t + '" is not a valid mesh',
                              );
                            const e = i;
                            return (
                              n &&
                                (e.updateMatrixWorld(!0),
                                e.geometry.applyMatrix4(e.matrix.clone()),
                                e.geometry.computeVertexNormals(),
                                e.matrix.identity()),
                              e
                            );
                          }
                          const r = i.children.map((e) => {
                              if (!(e instanceof c.eaF))
                                throw new Error(
                                  'Mesh "' + t + '" has invalid child meshes',
                                );
                              return e;
                            }),
                            a = r.map((e) => e.geometry),
                            s = h.pP(a, !0);
                          (n &&
                            (i.updateMatrixWorld(!0),
                            s.applyMatrix4(i.matrix.clone())),
                            s.computeVertexNormals());
                          const o = r.map((e) => e.material),
                            l = new c.eaF(s, o);
                          return ((l.name = t), l);
                        }
                        function r(e) {
                          let t;
                          t = Array.isArray(e.material)
                            ? e.material
                            : [e.material];
                          for (const e of t)
                            ((e.side = c.hB5), (e.shadowSide = c.hB5));
                          return e;
                        }
                        const a = new Map();
                        for (let e = 0; e < w.A.rims.length; e++) {
                          if (!w.A.isValidRims(e))
                            throw new Error("Invalid car style rims");
                          a.set(e, r(i(w.A.rims[e].model, !1)));
                        }
                        const s = new Map();
                        for (let e = 0; e < w.A.exhausts.length; e++) {
                          if (!w.A.isValidExhaust(e))
                            throw new Error("Invalid car style exhaust");
                          s.set(e, r(i(w.A.exhausts[e].model, !0)));
                        }
                        ((B.models = {
                          chassis: r(i("Body", !0)),
                          suspension: r(i("Suspension", !0)),
                          rims: a,
                          exhausts: s,
                          collisionShapeVertices: (0, l.gn)(B, B, "m", nt).call(
                            B,
                            i("Collision", !0),
                          ),
                        }),
                          (0, l.gn)(B, B, "m", it)
                            .call(B)
                            .then((e) => {
                              t(e);
                            })
                            .catch(n));
                      },
                      void 0,
                      n,
                    );
                  })`);
            },
            /**
             * @param {String} carPath
             * @returns {undefined}
             */
            setNewCarTemplateModel:async (carPath)=>{
              typeof carPath == "string" ? await this.carApi.getComputedCarModel(carPath): carPath //so you can submit a computed model
            },
            carList: this.carList,
            templateCar: pml.getFromPolyTrack(`${Variables.TemplateCar}`)
        }
        for(let carModel of this.carModels){
          if(window.localStorage.getItem("MyCar") == carModel.url){
            this.applyWheelPositions(carModel.wheelPositions || this.wheelPositions);
          }
        }
    }
    postInit = () => {
      if(window.localStorage.getItem("carSound") && this.pApi){
        this.pApi.soundManager.load("engine", [window.localStorage.getItem("carSound")]);
      }
    }
}

export let polyMod = new OrangysCarSwitcherMod();