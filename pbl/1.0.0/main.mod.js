import { PolyMod, MixinType } from "https://pml.crjakob.com/cb/PolyTrackMods/PolyModLoader/0.5.2/PolyModLoader.js";

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
    addUrlsToList = (modelUrls) => {
        return Promise.all(
            modelUrls.map((modelUrl) => {
                return new Promise((resolve) => {
                    fetch(`${modelUrl}.json`).then(responce => responce.json()).then(json => {
                        let blocks = {};
                        let blockTextIds = [];
                        for(let block in json["blocks"]) {
                            blockTextIds.push(block)
                            blocks[block] = {
                                categoryId: json["blocks"][block].categoryId,
                                checksum: json["blocks"][block].checksum,
                                sceneName: json["blocks"][block].sceneName,
                                modelName: json["blocks"][block].modelName,
                                editorOverlap: json["blocks"][block].editorOverlap,
                                extraSettings: json["blocks"][block].extraSettings || {}
                            }
                        }
                        this.models.push({
                            url: modelUrl,
                            blockIds: [],
                            blockTextIds,
                            blocks,
                            categories: json["categories"] || []
                        })
                        resolve();
                    });
                });
            })
        ).then(() => {
            console.log("Loaded models")
            this.hotLoadMain();
        });
    }
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
            this.pApi.soundManager.playUIClick();
            importButton.disabled = true;
            let modelUrl = urlInput.value;
            fetch(`${modelUrl}.json`).then(responce => responce.json()).then(json => {
                let blocks = {};
                let blockTextIds = [];
                for(let block in json["blocks"]) {
                    blockTextIds.push(block)
                    blocks[block] = {
                        categoryId: json["blocks"][block].categoryId,
                        checksum: json["blocks"][block].checksum,
                        sceneName: json["blocks"][block].sceneName,
                        modelName: json["blocks"][block].modelName,
                        editorOverlap: json["blocks"][block].editorOverlap,
                        extraSettings: json["blocks"][block].extraSettings || {}
                    }
                }
                this.models.push({
                    url: modelUrl,
                    blockIds: [],
                    blockTextIds,
                    blocks,
                    categories: json["categories"] || []
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
            this.pApi.soundManager.playUIClick();
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
                    loadButton.disabled = true;
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
                    loadButton.disabled = false;
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
                color: var(--text-color);">  ${modelUrl.split("://")[1]}<br>${this.loadedInEditor.indexOf(modelUrl) !== -1 ? "Loaded" : "Unloaded"}</p>`;

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
            this.pApi.soundManager.playUIClick();
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
            this.pApi.soundManager.playUIClick();
            modelsDiv.remove();
            this.promptUserForNewModel();
        });
        buttonWrapper.appendChild(addButton);

        let loadButton = document.createElement("button");
        loadButton.className = "button back";
        loadButton.style = "margin: 10px 0; float: left;padding: 10px";
        loadButton.innerHTML = `<img class="button-icon" src="images/load.svg" style="margin: 0 5"> Load/Unload`;
        loadButton.addEventListener("click", () => {
            this.pApi.soundManager.playUIClick();
            if(!selectedModel) return;
            this.loadedInEditor.indexOf(selectedModel.id) === -1 ? this.loadedInEditor.push(selectedModel.id) : this.loadedInEditor.splice(this.loadedInEditor.indexOf(selectedModel.id), 1);
            console.log(this.loadedInEditor);
            modelsDiv.remove();
            this.showBlockList();
        });
        buttonWrapper.appendChild(loadButton);

        let removeButton = document.createElement("button");
        removeButton.className = "button back";
        removeButton.style =
        "margin: 10px 0; float: left;padding: 10px; margin-left: 0px;";
        removeButton.innerHTML = `<img class="button-icon" src="images/erase.svg" style="margin: 0 5"> Remove`;
        removeButton.addEventListener("click", () => {
            this.pApi.soundManager.playUIClick();
            modelsDiv.remove();
            for(let model of this.models) {
                if(model.url === selectedModel.id) {
                    this.models.splice(this.models.indexOf(model), 1);
                    break;
                }
            }
            this.hotUnloadSimWorker();
            this.hotLoadMain();
            this.showBlockList();
        });
        removeButton.disabled = true;
        loadButton.disabled = true;
    buttonWrapper.appendChild(removeButton);

        menuDiv.appendChild(modelsDiv);
    }
    o = async (e) => {
        var n, i, a, pml;
        pml = this.pml;
        let Matrix4 = pml.getFromPolyTrack("Matrix4"),
            Color = pml.getFromPolyTrack("Color"),
            BufferAttribute = pml.getFromPolyTrack("BufferAttribute"),
            Mesh = pml.getFromPolyTrack("Mesh"),
            vl = pml.getFromPolyTrack("vl"),
            yl = pml.getFromPolyTrack("yl"),
            MeshLambertMaterial = pml.getFromPolyTrack("Ws");
            console.log(e);
        const o = {
            configuration: e,
            colors: new Map(e.colors.map(({ id: e }) => [e, null])),
            physicsShapeVertices: null,
        };
        this.get(this.loaderClass, this.pml.getFromPolyTrack("VB"), "f").set(e.id, o);
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
                    new Matrix4().makeScale(n ? -1 : 1, i ? -1 : 1, r ? -1 : 1)
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
                const e = new Color(t[n.name]);
                (i = e.r), (r = e.g), (a = e.b);
            } else (i = n.color.r), (r = n.color.g), (a = n.color.b);
            const s = e.geometry.clone(),
                o = new Float32Array(s.attributes.position.array.length);
            for (let e = 0; e < o.length; e += 3)
                (o[e + 0] = i), (o[e + 1] = r), (o[e + 2] = a);
            return (s.attributes.color = new BufferAttribute(o, 3)), s;
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
                u = new Mesh(h, new MeshLambertMaterial({ vertexColors: !0 }));
            o.colors.set(t.id, u), null != d || (d = l);
            console.log(o);
        }
        if (null == d) throw new Error("Physics geometry is missing");
        if (!(d.attributes.position instanceof BufferAttribute))
            throw new Error("Vertices must use BufferAttribute");
        (o.physicsShapeVertices = new Float32Array(
            d.attributes.position.array
        ));
        this.get(this.loaderClass, this.pml.getFromPolyTrack("VB"), "f").set(e.id, o);
        console.log(this.get(this.loaderClass, this.pml.getFromPolyTrack("VB"), "f").get(e.id));
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
    preInit = (pml) => {
        // TODO: TRACK ENCODING LOGIC
        pml.registerGlobalMixin(MixinType.INSERT, `author: this.trackAuthor`, `,
            offset: ActivePolyModLoader.getMod("${this.modID}").offset | 0,
            urls: ActivePolyModLoader.getMod("${this.modID}").loadedInEditor`);
        pml.registerGlobalMixin(MixinType.REPLACEBETWEEN, `const r = L = new yR(u, p, A, b, y, m, c, s, g, o, a, E, S, e, t, 'custom', [], null, null, () => Promise.resolve(null), () => {
                                    GP(), r.dispose(!1), L = n, i();
                                }, null);`, `const r = L = new yR(u, p, A, b, y, m, c, s, g, o, a, E, S, e, t, 'custom', [], null, null, () => Promise.resolve(null), () => {
                                    GP(), r.dispose(!1), L = n, i();
                                }, null);`, `
                                console.log("Driving?");console.log(e);
                                e.urls && polyModLoader.getMod("${this.modID}").hotLoadSimWorkerFromUrls(e.urls).then(() => {
                                    const r = L = new yR(u, p, A, b, y, m, c, s, g, o, a, E, S, e, t, 'custom', [], null, null, () => Promise.resolve(null), () => {
                                        GP(), r.dispose(!1), L = n, i();
                                    }, null);
                                });
                                `)
        pml.registerGlobalMixin(MixinType.INSERT, `author: I_(this, C_, 'f').trackAuthor`, `,
            offset: ActivePolyModLoader.getMod("${this.modID}").offset | 0,
            urls: ActivePolyModLoader.getMod("${this.modID}").loadedInEditor`);
    }
    init = (pml) => {
        this.pml = pml;
        this.initVer = 1;
        this.pApi = pml.getMod("pmlapi");
        this.gltfLoader = null;
        this.loaderClass = null;

        this.modelUrls = [];
        this.models = []
        this.loadedInEditor = [];
        this.blockIds = []
        this.blockTextIds = []
        this.simLoadedModels = []
        pml.registerClassMixin("YB.prototype", "init", MixinType.INSERT, `t.rotationAxis == Tb.ZPositive);`, `
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
                for(let blk in dd) {
                    if(e.data.blockIds.indexOf(Number.parseInt(blk)) !== -1 || e.data.blockTextIds.indexOf(blk) !== -1) {
                        delete dd[blk];
                    }
                }
                for(let cfg of bv) {
                    if(e.data.blockIds.indexOf(cfg.id) !== -1) {
                        bv.splice(bv.indexOf(cfg), 1);
                    }
                }
                _box.clear();for (const e of bv) {if (!_box.has(e.id)){ _box.set(e.id, e);}; }
                postMessage({messageType: 423});
                break;`);
        pml.registerFuncMixin("mN", MixinType.INSERT, `const _ = document.createElement('p');`, `
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
            kN(this, cN, "f").appendChild(blockButton),
            kN(this, cN, "f").appendChild(document.createElement("br")),
            kN(this, hN, "f").push(blockButton);
            `);
        pml.registerClassMixin("x_.prototype", "enable", MixinType.REPLACEBETWEEN, `b_(this, US, !0, 'f'), A_(this, dM, 'f').enabled = !0, 1 == A_(this, KM, 'f').length && A_(this, AS, 'm', a_).call(this), null === (e = A_(this, QM, 'f')) || void 0 === e || e.dispose(), b_(this, QM, new Ox(A_(this, SS, 'f')), 'f'), A_(this, QM, 'f').refresh(A_(this, _S, 'f')), A_(this, XS, 'f').show(), A_(this, zS, 'f').className = 'editor';`,
            `b_(this, US, !0, 'f'), A_(this, dM, 'f').enabled = !0, 1 == A_(this, KM, 'f').length && A_(this, AS, 'm', a_).call(this), null === (e = A_(this, QM, 'f')) || void 0 === e || e.dispose(), b_(this, QM, new Ox(A_(this, SS, 'f')), 'f'), A_(this, QM, 'f').refresh(A_(this, _S, 'f')), A_(this, XS, 'f').show(), A_(this, zS, 'f').className = 'editor';`,
            `console.log("Loading editor");
            let simWorkerLoad = [];
            ActivePolyModLoader.getMod("${this.modID}").models.forEach(model => {
                if(ActivePolyModLoader.getMod("${this.modID}").loadedInEditor.indexOf(model.url) !== -1) {
                    simWorkerLoad.push(model);
                }
            });
            ActivePolyModLoader.getMod("${this.modID}").hotLoadSimWorker(simWorkerLoad).then(() => {b_(this, US, !0, 'f'), A_(this, dM, 'f').enabled = !0, 1 == A_(this, KM, 'f').length && A_(this, AS, 'm', a_).call(this), null === (e = A_(this, QM, 'f')) || void 0 === e || e.dispose(), b_(this, QM, new Ox(A_(this, SS, 'f')), 'f'), A_(this, QM, 'f').refresh(A_(this, _S, 'f')), A_(this, XS, 'f').show(), A_(this, zS, 'f').className = 'editor';});`
        )
        pml.registerClassMixin("x_.prototype", "disable", MixinType.INSERT, `var e, t, n;`,
            `console.log("Unloading editor");
            ActivePolyModLoader.getMod("${this.modID}").hotUnloadSimWorker();`
        )
        pml.registerClassMixin("x_.prototype", "dispose", MixinType.INSERT, `var e, t, n;`,
            `console.log("Unloading editor");
            ActivePolyModLoader.getMod("${this.modID}").hotUnloadSimWorker();`
        )
        pml.registerClassMixin("yR.prototype", "dispose", MixinType.REPLACEBETWEEN, `var t, n, i, r, a, s;`, `|| void 0 === s || s.dispose();`,
           `console.log("no longer driving"),ActivePolyModLoader.getMod("${this.modID}").hotUnloadSimWorker();
            var t, n, i, r, a, s;
            null === (t = wR(this, XI, 'f')) || void 0 === t || t.dispose(), vR(this, XI, null, 'f'), wR(this, EI, 'f').setCursorHiddenWhenInactive(!1), wR(this, SI, 'f').hide(), wR(this, pI, 'm', oR).call(this, !1), wR(this, VI, 'f').dispose(), wR(this, MI, 'f').removeChangeListener(wR(this, GI, 'f')), null === (n = wR(this, WI, 'f')) || void 0 === n || n.dispose(), vR(this, WI, null, 'f'), e && wR(this, gI, 'f').clear(), wR(this, vI, 'f').clearMountains(), wR(this, QI, 'f').dispose(), null === (i = wR(this, qI, 'f')) || void 0 === i || i.dispose();
            for (const e of wR(this, YI, 'f'))
                null === (r = e.car) || void 0 === r || r.dispose(), e.car = null, null != e.carId && (wR(this, mI, 'f').deleteCar(e.carId), e.carId = null), e.replay = null;
            for (const e of wR(this, ZI, 'f'))
                e.dispose();
            wR(this, ZI, 'f').length = 0, window.removeEventListener('keydown', wR(this, eR, 'f')), window.removeEventListener('keyup', wR(this, tR, 'f')), wR(this, nR, 'f').dispose(), null === (a = wR(this, iR, 'f')) || void 0 === a || a.dispose(), null === (s = wR(this, rR, 'f')) || void 0 === s || s.dispose();`
        )
        pml.registerClassMixin("YB.prototype", "getCategoryMesh", MixinType.REPLACEBETWEEN, `const r = n.colors.get(i);`, `const r = n.colors.get(i);`, 
            `for(let model of ActivePolyModLoader.getMod("${this.modID}").models) {
                for(let category in model.categories) {
                    if(e === LA[category]) {
                        console.log(e);console.log(Mb[model.categories[category].icon])
                        n = this.getPart(Mb[model.categories[category].icon]) || null;
                        console.log(n);console.log(i);
                        console.log(n.colors);
                    }
                }
            }
            const r = n.colors.get(i);`
        )

        
        pml.registerClassMixin("hx.prototype", "toExportString", MixinType.REPLACEBETWEEN, `const t = new TextEncoder().encode(e.name);`, `return l.push(o, !0), 'PolyTrack1' + AA(l.result);`, `
            const t = new TextEncoder().encode(e.name);
            let n, i;
            console.log(e);
            null != e.author
                ? (i = new TextEncoder().encode(e.author), n = i.length)
                : (i = null, n = 0);

            const u = e.urls || [];
            let r;

            // ─────────────────────────────────────────────
            // DEFAULT PATH (no urls → identical to vanilla)
            // ─────────────────────────────────────────────
            if (u.length === 0) {
                r = new Uint8Array(1 + t.length + 1 + n);
                r[0] = t.length;
                r.set(t, 1);
                r[1 + t.length] = n;
                null != i && r.set(i, 1 + t.length + 1);
            }
            // ─────────────────────────────────────────────
            // EXTENDED PATH (urls present)
            // ─────────────────────────────────────────────
            else {
                const d = e.offset | 0;
                const h = u.map(v => new TextEncoder().encode(v));

                let c = 1 + 4 + 1; // flags + int32 offset + url count
                for (const v of h) c += 1 + v.length;

                r = new Uint8Array(1 + t.length + 1 + n + c);
                let f = 0;

                // name
                r[f++] = t.length;
                r.set(t, f);
                f += t.length;

                // author
                r[f++] = n;
                null != i && (r.set(i, f), f += n);

                // flags (1 = has custom blocks)
                r[f++] = 1;

                // offset
                new DataView(r.buffer).setInt32(f, d, !0);
                f += 4;

                // urls
                r[f++] = h.length;
                for (const v of h) {
                    r[f++] = v.length;
                    r.set(v, f);
                    f += v.length;
                }
            }

            // original logic untouched
            const a = cx(this, ix, 'm', ox).call(this),
                s = new TYPED_ARRAYS.Deflate({
                    level: 9,
                    windowBits: 9,
                    memLevel: 9
                });

            s.push(r, !1);
            s.push(a, !0);

            const o = AA(s.result),
                l = new TYPED_ARRAYS.Deflate({
                    level: 9,
                    windowBits: 15,
                    memLevel: 9
                });

            return l.push(o, !0), 'PolyTrack1' + AA(l.result);`)
        
        pml.registerSimWorkerFuncMixin("ammoFunc", MixinType.INSERT, `let t = new G_([]);`, `let curVer=0;`);
        pml.registerSimWorkerFuncMixin("ammoFunc", MixinType.REPLACEBETWEEN, `t = new G_(e.data.trackParts), function (e) {`, `}(n);`,`
                
                t.dispose(), t = new G_(e.data.trackParts), function (e, ver) {
                    if (e)
                        if (self.requestAnimationFrame) {
                            function t() {
                                if(ver && ver !== curVer) {console.log("new init is in, stopping loop"); return;};
                                l(), self.requestAnimationFrame(t);
                            }
                            t();
                        } else
                            setInterval(l, 1000 / 60);
                    else
                        setInterval(c);
                }(n, e.data.version);`)
        pml.registerClassMixin("hx", "fromExportString", MixinType.REPLACEBETWEEN, `const t = 'PolyTrack1';`, `trackData: u
                        };`, 
            `const t = 'PolyTrack1';
            if (!e.startsWith(t))
                return null;

            const n = xA(e.substring(10));
            if (null == n)
                return null;

            const i = new TYPED_ARRAYS.Inflate({ to: 'string' });
            if (i.push(n, !0), i.err)
                return null;

            const r = i.result;
            if ('string' != typeof r)
                return null;

            const a = xA(r);
            if (null == a)
                return null;

            const s = new TYPED_ARRAYS.Inflate();
            if (s.push(a, !0), s.err)
                return null;

            const o = s.result;
            if (!(o instanceof Uint8Array))
                return null;

            // ─────────────────────────────────────────────
            // vanilla metadata
            // ─────────────────────────────────────────────
            const l = o[0];
            if (o.length < 1 + l)
                return null;

            const c = new TextDecoder('utf-8').decode(o.subarray(1, 1 + l)),
                h = o[1 + l];

            if (o.length < 1 + l + 1 + h)
                return null;

            let d = h > 0
                ? new TextDecoder('utf-8').decode(o.subarray(1 + l + 1, 1 + l + 1 + h))
                : null;

            // vanilla start of track data
            const v = 1 + l + 1 + h;
            let p = v;

            // ─────────────────────────────────────────────
            // speculative extension parse (SAFE)
            // ─────────────────────────────────────────────
            let m = null, g = null;

            try {
                if (p + 1 + 4 + 1 <= o.length) {
                    const y = o[p];

                    if (y & 1) {
                        let q = p + 1;

                        // offset
                        if (q + 4 > o.length) throw 0;
                        const off = new DataView(o.buffer).getInt32(q, !0);
                        q += 4;

                        // url count
                        if (q + 1 > o.length) throw 0;
                        const b = o[q++];
                        if (b > 16) throw 0; // sanity cap

                        const urls = [];
                        for (let k = 0; k < b; k++) {
                            if (q + 1 > o.length) throw 0;
                            const w = o[q++];
                            if (q + w > o.length) throw 0;

                            urls.push(
                                new TextDecoder('utf-8').decode(o.subarray(q, q + w))
                            );
                            q += w;
                        }

                        // extension validated
                        p = v;
                        m = off;
                        g = urls;
                    }
                }
            } catch (_) {
                // rollback to vanilla
                p = v;
                m = null;
                g = null;
            }

            // ─────────────────────────────────────────────
            // track data (unchanged)
            // ─────────────────────────────────────────────
            if(g) {
                console.log(g);
                polyModLoader.getMod("${this.modID}").addUrlsToList(g);
                const u = ex(p, o);
                    if (null == u)
                        return null;
                    console.log({
                            name: c,
                            author: d,
                            offset: m,          // null if not present
                            urls: g             // null if not present
                        });
                    return {
                        trackMetadata: {
                            name: c,
                            author: d,
                            offset: m,          // null if not present
                            urls: g             // null if not present
                        },
                        trackData: u
                    };
            } else {
                const u = ex(p, o);
                if (null == u)
                    return null;
                console.log({
                        name: c,
                        author: d,
                        offset: m,          // null if not present
                        urls: g             // null if not present
                    });
                return {
                    trackMetadata: {
                        name: c,
                        author: d,
                        offset: m,          // null if not present
                        urls: g             // null if not present
                    },
                    trackData: u
                };
            }`)
        pml.registerClassMixin("YB.prototype", "init", MixinType.REPLACEBETWEEN, `return yield qB(this, HB, 'm', QB).call(this);`, `return yield qB(this, HB, 'm', QB).call(this);`, `
            console.log("getting");console.log(polyModLoader.getMod("${this.modID}").models.map(model => model.url));
            return yield polyModLoader.getMod("${this.modID}").hotLoadSimWorkerFromUrls(polyModLoader.getMod("${this.modID}").models.map((model => model.url)), true).then(() => qB(this, HB, 'm', QB).call(this))
            `)
    }
    hotLoadMain = () => {
        this.hotUnloadMain();
        for(let model of this.models) {
            this.modelUrls.push(`${model.url}.glb`);
            for(let category in model.categories) {
                this.pApi.editorExtras.registerCategory(category, model.categories[category].icon);
            }
            for(let block in model.blocks) {
                this.blockTextIds.push(block);
                this.pApi.editorExtras.registerBlock(block, model.blocks[block].categoryId, model.blocks[block].checksum, model.blocks[block].sceneName, model.blocks[block].modelName, model.blocks[block].editorOverlap, model.blocks[block].extraSettings);
                let blockId = this.pApi.editorExtras.blockNumberFromId(block);
                this.blockIds.push(blockId);
                model.blockIds.push(blockId);
            }
        }
    }
    hotLoadSimWorkerFromUrls = (urls, holdBackModels = false) => {
        return new Promise((resolve) => {
            let urlsToLoad = [...urls];
            let usedModels = [];
            for(let model of this.models) {
                if(urls.indexOf(model.url) !== -1) {
                    usedModels.push(model);
                    urlsToLoad.splice(urlsToLoad.indexOf(model.url), 1);
                }
            }
            if(urlsToLoad.length !== 0) {
                const modelPromises = urlsToLoad.map(modelUrl =>
                fetch(`${modelUrl}.json`)
                    .then(response => response.json())
                    .then(json => {
                        const blocks = {};
                        const blockTextIds = [];

                        for (const block in json.blocks) {
                            blockTextIds.push(block);
                            blocks[block] = {
                                categoryId: json.blocks[block].categoryId,
                                checksum: json.blocks[block].checksum,
                                sceneName: json.blocks[block].sceneName,
                                modelName: json.blocks[block].modelName,
                                editorOverlap: json.blocks[block].editorOverlap,
                                extraSettings: json.blocks[block].extraSettings || {}
                            };
                        }

                        const modelData = {
                            url: modelUrl,
                            blockIds: [],
                            blockTextIds,
                            blocks,
                            categories: json.categories || []
                        };

                        this.models.push(modelData);
                        this.usedModels.push({ ...modelData });
                    })
                );

                Promise.all(modelPromises).then(() =>this.hotUnloadSimWorker()).then(() => {
                    console.log("Unloaded sim");
                    console.log(usedModels);
                    this.hotLoadSimWorker(usedModels, holdBackModels).then(() => {console.log("Loaded sim");resolve();});
                });
            } else {
                console.log(usedModels);
                this.hotUnloadSimWorker().then(() => {
                    console.log("Unloaded sim");
                    this.hotLoadSimWorker(usedModels, holdBackModels).then(() => {console.log("Loaded sim");resolve();});
                });
            }
        });
    }
    hotLoadSimWorker = (usedModels, holdBackModels = false) => {
        return new Promise((resolve) => {
            console.log("loading sim step 2");
            if(usedModels.length === 0) { resolve(); console.log("Finished loading sim but no????"); return; }
            this.pml.getFromPolyTrack("GA").map((e) => { for(let model of usedModels) { if(model.blockIds.indexOf(e.id) !== -1) this.simLoadedModels.push(model) && this.o(e).then(() => {
                let mz = this.pml.getFromPolyTrack("hz");
                if(!holdBackModels) {
                    this.get(this.simworkers[0], mz, "f").postMessage({
                        messageType: 421,
                        toExec: [...this.pApi.editorExtras.getSimBlocks, "t.dispose()", "t = new G_(e.data.trackParts);"],
                        trackParts: this.loaderClass.getPhysicsParts()
                    });
                    this.get(this.simworkers[1], mz, "f").postMessage({
                        messageType: 421,
                        toExec: [...this.pApi.editorExtras.getSimBlocks, "t.dispose()", "t = new G_(e.data.trackParts);"],
                        trackParts: this.loaderClass.getPhysicsParts()
                    });
                }
                console.log("Finished loading sim");
                resolve();
            })}});
        })
    }
    hotUnloadMain = () => {
        this.pml.getFromPolyTrack(`
            for(let blk in Mb) {
                if(ActivePolyModLoader.getMod("${this.modID}").blockIds.indexOf(Number.parseInt(blk)) !== -1 || ActivePolyModLoader.getMod("${this.modID}").blockTextIds.indexOf(blk) !== -1) {
                    delete Mb[blk];
                }
            }
            for(let cfg of GA) {
                if(ActivePolyModLoader.getMod("${this.modID}").blockIds.indexOf(cfg.id) !== -1) {
                    _box.splice(_box.indexOf(cfg), 1);
                }
            };`);
        this.pml.getFromPolyTrack(`_box.clear();for (const e of GA) {if (!_box.has(e.id)){ _box.set(e.id, e);}; }`);
    }
    hotUnloadSimWorker = () => {
        return new Promise(res => {
            try {
                this.get(this.loaderClass, this.pml.getFromPolyTrack("VB"), "f").forEach(blk => {
                    if(this.blockIds.indexOf(blk.configuration.id) !== -1) {
                        console.log("got em")
                        this.get(this.loaderClass, this.pml.getFromPolyTrack("VB"), "f").delete(blk.configuration.id);
                    }
                })
            } catch(e) {
                console.warn("No VB!")
                res();
                return;
            }
            let loadedSimIds = [], loadedSimTextIds = [], loadedSimCategories = [];
            for(let model of this.simLoadedModels) {
                loadedSimIds = [...loadedSimIds, ...model.blockIds];
                loadedSimTextIds = [...loadedSimTextIds, ...model.blockTextIds];
                for(let category in model.categories) {
                    loadedSimCategories.push(category);
                }
            }
            let mz = this.pml.getFromPolyTrack("hz");
            let physicsParts = this.loaderClass.getPhysicsParts();
            let sim1done, sim2done = false;
            this.get(this.simworkers[0], mz, "f").postMessage({
                messageType: 422,
                blockIds: loadedSimIds,
                blockTextIds: loadedSimTextIds,
                categories: loadedSimCategories
            });
            let sim1func = (e) => {
                if(e.data.messageType === 423) {
                    if(!sim1done) {
                        sim1done = true;
                        if(sim2done) {
                            console.log(physicsParts);
                            this.blockIds = [];
                            this.blockTextIds = [];
                            console.log("Finished unloading sim");
                            res();
                            this.get(this.simworkers[0], mz, "f").removeEventListener("message", sim1func);
                        }
                    }
                }
            };
            this.get(this.simworkers[0], mz, "f").addEventListener("message", sim1func);
            this.get(this.simworkers[1], mz, "f").postMessage({
                messageType: 422,
                blockIds: loadedSimIds,
                blockTextIds: loadedSimTextIds,
                categories: loadedSimCategories
            });
            let sim2func = (e) => {
                if(e.data.messageType === 423) {
                    if(!sim2done) {
                        sim2done = true;
                        if(sim1done) {
                            console.log(physicsParts);
                            this.blockIds = [];
                            this.blockTextIds = [];
                            console.log("Finished unloading sim");
                            res();
                            this.get(this.simworkers[0], mz, "f").removeEventListener("message", sim2func);
                        }
                    }
                }
            };
            this.get(this.simworkers[0], mz, "f").addEventListener("message", sim2func);
        })
    }
}

export let polyMod = new PolyBlockLoader();