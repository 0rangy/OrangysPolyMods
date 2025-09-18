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
                for(let toExec of e.data.toExec) {
                    eval(toExec);
                }
                break;`);
    }
    hotLoad = () => {
        this.modelUrls = [`${this.baseUrl}/copy_pillars.glb`]
        this.blockIds = []
        this.blockTextIds = []
        this.pml.editorExtras.registerBlock("CopyPillar1", "Sign", "b235ea87337c17de7cbaecaf3d381fff9782e8379bcbc1c6cc9882da4aa1da15", "CopyPillars", "CopyPillar1", [[[-1, 0, -1], [0, 0, 0]]])
        this.blockTextIds.push("CopyPillar1");
        this.blockIds.push(this.pml.editorExtras.blockNumberFromId("CopyPillar1"));
        this.pml.getFromPolyTrack("VA").map((e) => { if(this.blockIds.indexOf(e.id) !== -1) this.o(e).then(() => {
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
        })});
    }
    hotUnload = () => {
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
        this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").forEach(blk => {
            if(this.blockIds.indexOf(blk.configuration.id) !== -1) {
                console.log("got em")
                this.get(this.loaderClass, this.pml.getFromPolyTrack("qB"), "f").delete(blk.configuration.id);
            }
        })
        let mz = this.pml.getFromPolyTrack("mz");
        this.get(this.simworkers[0], mz, "f").postMessage({
            messageType: 422,
            blockIds: this.blockIds,
            blockTextIds: this.blockTextIds,
            toExec: [`t.dispose();`,`for(let blk in dd) {
                        if(e.data.blockIds.indexOf(Number.parseInt(blk)) !== -1 || e.data.blockTextIds.indexOf(blk) !== -1) {
                            delete dd[blk];
                        }
                    }`, `for(let cfg of xv) {
                            if(e.data.blockIds.indexOf(cfg.id) !== -1) {
                                xv.splice(xv.indexOf(cfg), 1);
                            }
                        }`,`bv.clear();for (const e of xv) {if (!bv.has(e.id)){ bv.set(e.id, e);}; }`]
        });
        this.get(this.simworkers[1], mz, "f").postMessage({
            messageType: 422,
            blockIds: this.blockIds,
            blockTextIds: this.blockTextIds,
            toExec: [`t.dispose();`,`for(let blk in dd) {
                        if(e.data.blockIds.indexOf(Number.parseInt(blk)) !== -1 || e.data.blockTextIds.indexOf(blk) !== -1) {
                            delete dd[blk];
                        }
                    }`, `for(let cfg of xv) {
                            if(e.data.blockIds.indexOf(cfg.id) !== -1) {
                                xv.splice(xv.indexOf(cfg), 1);
                            }
                        }`,`bv.clear();for (const e of xv) {if (!bv.has(e.id)){ bv.set(e.id, e);}; }`]
        });
        let physicsParts = this.loaderClass.getPhysicsParts();
        for (const { id: t, vertices: n, detector: i, startOffset: r } of physicsParts)
            console.log(!n ? `Block ${t}: ${n}` : !t ? t : `ok`);
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