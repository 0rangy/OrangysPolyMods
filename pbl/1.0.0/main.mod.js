import { PolyMod, MixinType } from "https://pml.crjakob.com/cb/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

class PolyBlockLoader extends PolyMod {
    get = function (e, t, n, i) {
        if ("a" === n && !i)
            throw new TypeError(
                "Private accessor was defined without a getter"
            );
        if ("function" == typeof t ? e !== t || !i : !t.has(e))
            throw new TypeError(
                "Cannot read private member from an object whose class did not declare it"
            );
        return "m" === n ? i : "a" === n ? i.call(e) : i ? i.value : t.get(e);
    };
    promptUserForNewModel = () => {
        let menuDiv = document.getElementById("ui").children[0];

        let promptDiv = document.createElement("div");
        promptDiv.className = "nickname";

        let modelUrlHead = document.createElement("h1");
        modelUrlHead.innerText = "Model URL";
        modelUrlHead.style = "float: left;";
        promptDiv.appendChild(modelUrlHead);

        let urlInput = document.createElement("input");
        urlInput.type = "text";
        promptDiv.appendChild(urlInput);


        let warningh2 = document.createElement("h2");
        warningh2.style = "color: #f66;margin:5px;";
        warningh2.innerText = "Only install models from trusted sources!";
        promptDiv.appendChild(warningh2);

        let importButton = document.createElement("button");
        importButton.style = "float: right;";
        importButton.className = "button right";
        importButton.innerHTML = `<img class="button-icon" src="images/import.svg"> Import`;
        importButton.addEventListener("click", () => {
            this.pml.soundManager.playUIClick();
            importButton.disabled = true;
            let modelUrl = urlInput.value;
            fetch(`${modelUrl}.json`).then(responce => responce.json()).then(json => {
                let blocks = {};
                let blockTextIds = [];
                for(let block in json) {
                    blockTextIds.push(block)
                    blocks[block] = {
                        categoryId: json[block].categoryId,
                        checksum: json[block].checksum,
                        sceneName: json[block].sceneName,
                        modelName: json[block].modelName,
                        editorOverlap: json[block].editorOverlap,
                        extraSettings: json[block].extraSettings || {}
                    }
                }
                this.models.push({
                    url: modelUrl,
                    blockIds: [],
                    blockTextIds,
                    blocks
                })
                this.hotUnloadMain();
                this.hotUnloadSimWorker();
                this.hotLoadMain();
                promptDiv.remove();
                this.showBlockList();
            });
        });
        promptDiv.appendChild(importButton);

        let goBackButton = document.createElement("button");
        goBackButton.style = "float: left;";
        goBackButton.className = "button left";
        goBackButton.innerHTML = `<img class="button-icon" src="images/back.svg"> Back`;
        goBackButton.addEventListener("click", () => {
            this.pml.soundManager.playUIClick();
            promptDiv.remove();
            this.showBlockList();
        });
        promptDiv.appendChild(goBackButton);

        menuDiv.appendChild(promptDiv);
    };
    showBlockList = () => {
        let menuDiv;
        for (let elem of document.getElementById("ui").children) {
            if (elem.classList.contains("menu")) {
                menuDiv = elem;
            }
        }
        let hideList = [3, 4, 5];
        for (let intToHide of hideList) {
            try {
                menuDiv.children[intToHide].classList.add("hidden")
            } catch {
                console.log("oops")
            }
        }
        let modelsDiv = document.createElement("div");
        modelsDiv.className = "leaderboard";
        modelsDiv.style = `position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);`
        
        let loadedModelsLabel = document.createElement("h2");
        loadedModelsLabel.textContent = "Loaded Models";
        modelsDiv.appendChild(loadedModelsLabel);

        let modelsContainer = document.createElement("div");
        modelsContainer.className = "container";
        modelsDiv.appendChild(modelsContainer);

        let selectedModel = null;
        for(let model of this.models) {
            let modelUrl = model.url;
            let modelDiv = document.createElement("div");
            modelDiv.style = `--text-color: #fff;
                --text-disabled-color: #5d6a7c;
                --surface-color: #28346a;
                --surface-secondary-color: #212b58;
                --surface-tertiary-color: #192042;
                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                --button-color: #112052;
                --button-hover-color: #334b77;
                --button-active-color: #151f41;
                --button-disabled-color: #313d53;
                scrollbar-color: #7272c2 #223;
                -webkit-tap-highlight-color: transparent;
                user-select: none;
                text-align: left;
                pointer-events: auto;
                font-family: ForcedSquare, Arial, sans-serif;
                line-height: 1;
                position: relative;
                margin: 10px 10px 0 10px;
                padding: 0;`;

            let modelMainButton = document.createElement("button");
            modelMainButton.id = `${modelUrl}`;
            modelMainButton.className = "button";
            modelMainButton.style = `    --text-color: #fff;
                --text-disabled-color: #5d6a7c;
                --surface-color: #28346a;
                --surface-secondary-color: #212b58;
                --surface-tertiary-color: #192042;
                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                --button-color: #112052;
                --button-hover-color: #334b77;
                --button-active-color: #151f41;
                --button-disabled-color: #313d53;
                scrollbar-color: #7272c2 #223;
                -webkit-tap-highlight-color: transparent;
                font-family: ForcedSquare, Arial, sans-serif;
                line-height: 1;
                position: relative;
                border: none;
                color: var(--text-color);
                font-size: 32px;
                pointer-events: auto;
                user-select: none;
                cursor: pointer;
                margin: 0;
                padding: 0;
                vertical-align: top;
                width: 100%;
                height: 100px;
                clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
                text-align: left;
                white-space: nowrap;`;
            modelMainButton.innerHTML = `<img src="${polyMod.iconSrc}" style="max-width:100px;max-height=100px;">`;
            modelMainButton.addEventListener("click", () => {
                if (selectedModel === modelMainButton) {
                    removeButton.disabled = true;
                    modelMainButton.style = `    --text-color: #fff;
                    --text-disabled-color: #5d6a7c;
                    --surface-color: #28346a;
                    --surface-secondary-color: #212b58;
                    --surface-tertiary-color: #192042;
                    --surface-transparent-color: rgba(40, 52, 106, 0.5);
                    --button-color: #112052;
                    --button-hover-color: #334b77;
                    --button-active-color: #151f41;
                    --button-disabled-color: #313d53;
                    scrollbar-color: #7272c2 #223;
                    -webkit-tap-highlight-color: transparent;
                    font-family: ForcedSquare, Arial, sans-serif;
                    line-height: 1;
                    position: relative;
                    border: none;
                    color: var(--text-color);
                    font-size: 32px;
                    pointer-events: auto;
                    user-select: none;
                    cursor: pointer;
                    margin: 0;
                    padding: 0;
                    vertical-align: top;
                    width: 100%;
                    height: 100px;
                    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
                    text-align: left;
                    white-space: nowrap;`;
                    selectedModel = null;
                } else {
                    if (selectedModel) {
                        selectedModel.style = `    --text-color: #fff;
                                    --text-disabled-color: #5d6a7c;
                                    --surface-color: #28346a;
                                    --surface-secondary-color: #212b58;
                                    --surface-tertiary-color: #192042;
                                    --surface-transparent-color: rgba(40, 52, 106, 0.5);
                                    --button-color: #112052;
                                    --button-hover-color: #334b77;
                                    --button-active-color: #151f41;
                                    --button-disabled-color: #313d53;
                                    scrollbar-color: #7272c2 #223;
                                    -webkit-tap-highlight-color: transparent;
                                    font-family: ForcedSquare, Arial, sans-serif;
                                    line-height: 1;
                                    position: relative;
                                    border: none;
                                    color: var(--text-color);
                                    font-size: 32px;
                                    pointer-events: auto;
                                    user-select: none;
                                    cursor: pointer;
                                    margin: 0;
                                    padding: 0;
                                    vertical-align: top;
                                    width: 100%;
                                    height: 100px;
                                    clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
                                    text-align: left;
                                    white-space: nowrap;`;
                        
                    }
                    modelMainButton.style = `    --text-color: #fff;
                                --text-disabled-color: #5d6a7c;
                                --surface-color: #28346a;
                                --surface-secondary-color: #212b58;
                                --surface-tertiary-color: #192042;
                                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                                --button-color: #112052;
                                --button-hover-color: #334b77;
                                --button-active-color: #151f41;
                                --button-disabled-color: #313d53;
                                scrollbar-color: #7272c2 #223;
                                -webkit-tap-highlight-color: transparent;
                                font-family: ForcedSquare, Arial, sans-serif;
                                background: var(--button-hover-color);
                                line-height: 1;
                                position: relative;
                                border: none;
                                color: var(--text-color);
                                font-size: 32px;
                                pointer-events: auto;
                                user-select: none;
                                cursor: pointer;
                                margin: 0;
                                padding: 0;
                                vertical-align: top;
                                width: 100%;
                                height: 100px;
                                clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
                                text-align: left;
                                white-space: nowrap;`;
                    selectedModel = modelMainButton;
                    removeButton.disabled = false;
                }
            });

            let leftDiv = document.createElement("div");
            leftDiv.style = `    --text-color: #fff;
                --text-disabled-color: #5d6a7c;
                --surface-color: #28346a;
                --surface-secondary-color: #212b58;
                --surface-tertiary-color: #192042;
                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                --button-color: #112052;
                --button-hover-color: #334b77;
                --button-active-color: #151f41;
                --button-disabled-color: #313d53;
                scrollbar-color: #7272c2 #223;
                -webkit-tap-highlight-color: transparent;
                color: var(--text-color);
                font-size: 32px;
                pointer-events: auto;
                user-select: none;
                cursor: pointer;
                text-align: left;
                white-space: nowrap;
                font-family: ForcedSquare, Arial, sans-serif;
                line-height: 1;
                display: inline-block;
                vertical-align: top;`;
            leftDiv.innerHTML = `<p style="    --text-color: #fff;
                --text-disabled-color: #5d6a7c;
                --surface-color: #28346a;
                --surface-secondary-color: #212b58;
                --surface-tertiary-color: #192042;
                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                --button-color: #112052;
                --button-hover-color: #334b77;
                --button-active-color: #151f41;
                --button-disabled-color: #313d53;
                scrollbar-color: #7272c2 #223;
                -webkit-tap-highlight-color: transparent;
                pointer-events: auto;
                user-select: none;
                cursor: pointer;
                text-align: left;
                white-space: nowrap;
                font-family: ForcedSquare, Arial, sans-serif;
                line-height: 1;
                margin: 0;
                padding: 12px;
                font-size: 28px;
                color: var(--text-color);">  ${modelUrl.split("://")[1]}</p>`;

            let rightDiv = document.createElement("div");
            rightDiv.style = `    --text-color: #fff;
                --text-disabled-color: #5d6a7c;
                --surface-color: #28346a;
                --surface-secondary-color: #212b58;
                --surface-tertiary-color: #192042;
                --surface-transparent-color: rgba(40, 52, 106, 0.5);
                --button-color: #112052;
                --button-hover-color: #334b77;
                --button-active-color: #151f41;
                --button-disabled-color: #313d53;
                scrollbar-color: #7272c2 #223;
                -webkit-tap-highlight-color: transparent;
                color: var(--text-color);
                font-size: 32px;
                pointer-events: auto;
                user-select: none;
                cursor: pointer;
                text-align: left;
                white-space: nowrap;
                font-family: ForcedSquare, Arial, sans-serif;
                line-height: 1;
                display: inline-block;
                vertical-align: top;`;

            modelMainButton.appendChild(leftDiv);
            modelMainButton.appendChild(rightDiv);
            modelDiv.appendChild(modelMainButton);
            modelsContainer.appendChild(modelDiv);
        }

        let buttonWrapper = document.createElement("div");
        buttonWrapper.className = "button-wapper";
        modelsDiv.appendChild(buttonWrapper);

        let backButton = document.createElement("button");
        backButton.className = "button back";
        backButton.style = "margin: 10px 0; float: left;padding: 10px";
        backButton.innerHTML = `<img class="button-icon" src="images/back.svg" style="margin: 0 5"> Back`;
        backButton.addEventListener("click", () => {
            this.pml.soundManager.playUIClick();
            for (let intToUnhide of hideList) {
                menuDiv.children[intToUnhide].classList.remove("hidden");
            }
            modelsDiv.remove();
        });
        buttonWrapper.appendChild(backButton);

        let addButton = document.createElement("button");
        addButton.className = "button back";
        addButton.style = "margin: 10px 0; float: left;padding: 10px";
        addButton.innerHTML = `<img class="button-icon" src="images/load.svg" style="margin: 0 5"> Add`;
        addButton.addEventListener("click", () => {
            this.pml.soundManager.playUIClick();
            modelsDiv.remove();
            this.promptUserForNewModel();
        });
        buttonWrapper.appendChild(addButton);

        let removeButton = document.createElement("button");
        removeButton.className = "button back";
        removeButton.style =
        "margin: 10px 0; float: left;padding: 10px; margin-left: 0px;";
        removeButton.innerHTML = `<img class="button-icon" src="images/erase.svg" style="margin: 0 5"> Remove`;
        removeButton.addEventListener("click", () => {
            this.pml.soundManager.playUIClick();
            modelsDiv.remove();
            for(let model of this.models) {
                if(model.url === selectedModel.id) {
                    this.models.splice(this.models.indexOf(model), 1);
                    break;
                }
            }
            this.showBlockList();
        });
        removeButton.disabled = true;
    buttonWrapper.appendChild(removeButton);

        menuDiv.appendChild(modelsDiv);
    }
    o = async (e) => {
        var n, i, a, pml;
        pml = this.pml;
        let Xn = pml.getFromPolyTrack("Xn"),
            Hi = pml.getFromPolyTrack("Hi"),
            Xi = pml.getFromPolyTrack("Xi"),
            yr = pml.getFromPolyTrack("yr"),
            vl = pml.getFromPolyTrack("vl"),
            yl = pml.getFromPolyTrack("yl"),
            Ws = pml.getFromPolyTrack("Ws");
        if (this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").has(e.id)) throw new Error("Track part types have same Id");
        const o = {
            configuration: e,
            colors: new Map(e.colors.map(({ id: e }) => [e, null])),
            physicsShapeVertices: null,
        };
        this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").set(e.id, o);
        const l = await this.loadGltfs(this.modelUrls);
        function c(e, t, n, i, r, a) {
            const s = l.find((t) => t.scene.name == e);
            if (null == s)
                throw new Error('Scene "' + e + '" does not exist');
            const o = s.scene.getObjectByName(t);
            if (null == o)
                throw new Error(
                'Mesh "' + t + '" does not exist in scene "' + e + '"'
                );
            let c;
            if (0 == o.children.length) {
                const e = o,
                t = h(e, a);
                e.updateMatrixWorld(!0),
                t.applyMatrix4(e.matrix),
                (c = [t]);
            } else {
                (c = o.children.map((e) => h(e, a))),
                o.updateMatrixWorld(!0);
                for (const e of c) e.applyMatrix4(o.matrix);
            }
            let d = -1 / 0;
            if (i)
                for (const e of c)
                for (
                    let t = 0;
                    t < e.attributes.position.array.length;
                    t += 3
                )
                    d = Math.max(d, e.attributes.position.array[t + 1]);
            for (const e of c) {
                if (
                (e.applyMatrix4(
                    new Xn().makeScale(n ? -1 : 1, i ? -1 : 1, r ? -1 : 1)
                ),
                n || i || r)
                ) {
                const t = e.index;
                if (null != t)
                    for (let e = 0; e < t.count; e += 3) {
                    const n = t.getX(e),
                        i = t.getX(e + 1),
                        r = t.getX(e + 2);
                    t.setXYZ(e, n, r, i);
                    }
                else {
                    const t = e.attributes.position;
                    for (let e = 0; e < t.count; e += 3) {
                    const n = e,
                        i = e + 1,
                        r = e + 2,
                        a = t.getX(n),
                        s = t.getY(n),
                        o = t.getZ(n),
                        l = t.getX(i),
                        c = t.getY(i),
                        h = t.getZ(i),
                        d = t.getX(r),
                        u = t.getY(r),
                        p = t.getZ(r);
                    t.setXYZ(n, a, s, o),
                        t.setXYZ(i, d, u, p),
                        t.setXYZ(r, l, c, h);
                    }
                }
                }
                i && e.translate(0, d, 0);
            }
            return c;
        }
        function h(e, t) {
            const n = e.material;
            if (!(n instanceof pml.getFromPolyTrack("Os")))
                throw new Error("Material is not a MeshStandardMaterial");
            let i, r, a;
            if (Object.prototype.hasOwnProperty.call(t, n.name)) {
                const e = new Hi(t[n.name]);
                (i = e.r), (r = e.g), (a = e.b);
            } else (i = n.color.r), (r = n.color.g), (a = n.color.b);
            const s = e.geometry.clone(),
                o = new Float32Array(s.attributes.position.array.length);
            for (let e = 0; e < o.length; e += 3)
                (o[e + 0] = i), (o[e + 1] = r), (o[e + 2] = a);
            return (s.attributes.color = new Xi(o, 3)), s;
        }
        let d = null;
        for (const t of e.colors) {
            const r = [];
            for (const [s, o, l] of e.models) {
                const e = c(
                s,
                o,
                null !== (n = null == l ? void 0 : l.flipX) &&
                    void 0 !== n &&
                    n,
                null !== (i = null == l ? void 0 : l.flipY) &&
                    void 0 !== i &&
                    i,
                null !== (a = null == l ? void 0 : l.flipZ) &&
                    void 0 !== a &&
                    a,
                t.colors
                );
                for (const t of e) r.push(t);
            }
            const l = vl(r, !0).toNonIndexed();
            l.computeVertexNormals();
            const h = yl(l),
                u = new yr(h, new Ws({ vertexColors: !0 }));
            o.colors.set(t.id, u), null != d || (d = l);
        }
        if (null == d) throw new Error("Physics geometry is missing");
        if (!(d.attributes.position instanceof Xi))
            throw new Error("Vertices must use BufferAttribute");
        (o.physicsShapeVertices = new Float32Array(
            d.attributes.position.array
        ));
    };
    loadGltfs = async(paths) => {
        return await Promise.all(
            paths.map((e) => {
                return new Promise((resolve) => {
                    this.gltfLoader.load(e, (t) => {
                        resolve(t);
                    });
                });
            })
        );
    }
    init = (pml) => {
        this.pml = pml;
        this.gltfLoader = null;
        this.loaderClass = null;

        this.modelUrls = [];
        this.models = []
        this.loadedInEditor = [];
        this.blockIds = []
        this.blockTextIds = []
        this.simLoadedModels = []
        pml.registerClassMixin("eU.prototype", "init", MixinType.INSERT, `t.rotationAxis == _b.ZPositive)));`, `
            ActivePolyModLoader.getMod("${this.modID}").gltfLoader = n;
            ActivePolyModLoader.getMod("${this.modID}").loaderClass = this;
            console.log(yield r);
            `)
        pml.registerFuncMixin("polyInitFunction", MixinType.INSERT, `f = u.testDeterminism();`,`ActivePolyModLoader.getMod("${this.modID}").simworkers = [u,p];`);
        pml.registerSimWorkerFuncMixin("ammoFunc", MixinType.INSERT, `switch (e.data.messageType) {`, `
            case 421: 
                for(let toExec of e.data.toExec) {eval(toExec);};
                break;
            case 422:
                t.dispose();
                for(let blk in dd) {
                    if(e.data.blockIds.indexOf(Number.parseInt(blk)) !== -1 || e.data.blockTextIds.indexOf(blk) !== -1) {
                        delete dd[blk];
                    }
                }
                for(let cfg of xv) {
                    if(e.data.blockIds.indexOf(cfg.id) !== -1) {
                        xv.splice(xv.indexOf(cfg), 1);
                    }
                }
                bv.clear();for (const e of xv) {if (!bv.has(e.id)){ bv.set(e.id, e);}; }
                break;`);
        pml.registerFuncMixin("bN", MixinType.INSERT, `const _ = document.createElement("p");`, `
            const blockButton = document.createElement("button");
            blockButton.className = "button small";
            blockButton.innerHTML = '<img src="images/import.svg">';
            blockButton.appendChild(
                    document.createTextNode(" Blocks")
                  );
            blockButton.addEventListener("click", (e) => {
                n.playUIClick();
                e.preventDefault();
                ActivePolyModLoader.getMod("${this.modID}").showBlockList();
            });
            TN(this, fN, "f").appendChild(blockButton),
            TN(this, fN, "f").appendChild(document.createElement("br")),
            TN(this, mN, "f").push(blockButton);
            `);
        pml.registerClassMixin("A_.prototype", "enable", MixinType.INSERT, `var e;`,
            `console.log("Loading editor"); 
            ActivePolyModLoader.getMod("${this.modID}").editorPartialLoad();`
        )
        pml.registerClassMixin("A_.prototype", "disable", MixinType.INSERT, `var e, t, n;`,
            `console.log("Unloading editor");
            ActivePolyModLoader.getMod("${this.modID}").editorPartialUnload();`
        )
        pml.registerClassMixin("A_.prototype", "dispose", MixinType.INSERT, `var e, t, n;`,
            `console.log("Unloading editor");
            ActivePolyModLoader.getMod("${this.modID}").editorPartialUnload();`
        )
        pml.registerClassMixin("xz.prototype", "createCar", MixinType.INSERT, `var s, o;`,
            `r ? void 0 : console.log("now driving");console.log(i);`
        )
        pml.registerClassMixin("EC.prototype", "dispose", MixinType.INSERT, `window.removeEventListener("keydown", kC(this, yC, "f")),`,
            `console.log("no longer driving"),`
        )
    }
    hotLoadMain = () => {
        for(let model of this.models) {
            this.modelUrls.push(`${model.url}.glb`);
            for(let block in model.blocks) {
                this.blockTextIds.push(block);
                this.pml.editorExtras.registerBlock(block, model.blocks[block].categoryId, model.blocks[block].checksum, model.blocks[block].sceneName, model.blocks[block].modelName, model.blocks[block].editorOverlap, model.blocks[block].extraSettings);
                let blockId = this.pml.editorExtras.blockNumberFromId(block);
                this.blockIds.push(blockId);
                model.blockIds.push(blockId);
            }
        }
    }
    hotLoadSimWorker = (usedModels) => {
        this.pml.getFromPolyTrack("VA").map((e) => { for(let model of usedModels) { if(model.blockIds.indexOf(e.id) !== -1) this.simLoadedModels.push(model) && this.o(e).then(() => {
            let mz = this.pml.getFromPolyTrack("mz");
            this.get(this.simworkers[0], mz, "f").postMessage({
                messageType: 421,
                toExec: [...this.pml.editorExtras.getSimBlocks, "t.dispose()"]
            });
            this.get(this.simworkers[1], mz, "f").postMessage({
                messageType: 421,
                toExec: [...this.pml.editorExtras.getSimBlocks, "t.dispose()"]
            });
            this.get(this.simworkers[0], mz, "f").postMessage({
                messageType: this.pml.getFromPolyTrack("uz").Init,
                isRealtime: 1,
                trackParts: this.loaderClass.getPhysicsParts(),
            });
            this.get(this.simworkers[1], mz, "f").postMessage({
                messageType: this.pml.getFromPolyTrack("uz").Init,
                isRealtime: 0,
                trackParts: this.loaderClass.getPhysicsParts(),
            });
        })}});
    }
    editorPartialLoad = () => {
        this.pml.getFromPolyTrack("VA").map((e) => { for(let model of this.models) { if(model.blockIds.indexOf(e.id) !== -1) this.o(e) }});
    }
    editorPartialUnload = () => {
        this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").forEach(blk => {
            if(this.blockIds.indexOf(blk.configuration.id) !== -1) {
                console.log("got em")
                this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").delete(blk.configuration.id);
            }
        })
    }
    hotUnloadMain = () => {
        this.pml.getFromPolyTrack(`
            for(let blk in Sb) {
                if(ActivePolyModLoader.getMod("${this.modID}").blockIds.indexOf(Number.parseInt(blk)) !== -1 || ActivePolyModLoader.getMod("${this.modID}").blockTextIds.indexOf(blk) !== -1) {
                    delete Sb[blk];
                }
            }
            for(let cfg of VA) {
                if(ActivePolyModLoader.getMod("${this.modID}").blockIds.indexOf(cfg.id) !== -1) {
                    VA.splice(VA.indexOf(cfg), 1);
                }
            };`);
        this.pml.getFromPolyTrack(`GA.clear();for (const e of VA) {if (!GA.has(e.id)){ GA.set(e.id, e);}; }`);
    }
    hotUnloadSimWorker = () => {
        this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").forEach(blk => {
            if(this.blockIds.indexOf(blk.configuration.id) !== -1) {
                console.log("got em")
                this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").delete(blk.configuration.id);
            }
        })
        let loadedSimIds = [], loadedSimTextIds = [];
        for(let model of this.simLoadedModels) {
            loadedSimIds = [...loadedSimIds, ...model.blockIds];
            loadedSimTextIds = [...loadedSimTextIds, ...model.blockTextIds];
        }
        let mz = this.pml.getFromPolyTrack("mz");
        this.get(this.simworkers[0], mz, "f").postMessage({
            messageType: 422,
            blockIds: loadedSimIds,
            blockTextIds: loadedSimTextIds
        });
        this.get(this.simworkers[1], mz, "f").postMessage({
            messageType: 422,
            blockIds: loadedSimIds,
            blockTextIds: loadedSimTextIds
        });
        let physicsParts = this.loaderClass.getPhysicsParts();
        this.get(this.simworkers[0], mz, "f").postMessage({
                messageType: this.pml.getFromPolyTrack("uz").Init,
                isRealtime: 1,
                trackParts: physicsParts,
            });
        this.get(this.simworkers[1], mz, "f").postMessage({
                messageType: this.pml.getFromPolyTrack("uz").Init,
                isRealtime: 0,
                trackParts: physicsParts,
            });
        this.blockIds = [];
        this.blockTextIds = [];
    }
}

export let polyMod = new PolyBlockLoader();