import { PolyMod, MixinType } from "https://pml.crjakob.com/PolyTrackMods/PolyModLoader/0.5.1/PolyModLoader.js";

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

class PolyBlockLoader extends PolyMod {
    c(sceneName, meshName, flipX, flipY, flipZ, colorMap) {
        const models = this.gltfModels.find(m => m.scene.name === sceneName);
        if (models == null) throw new Error(`Scene "${sceneName}" does not exist`);

        const mesh = models.scene.getObjectByName(meshName);
        if (mesh == null) {
            throw new Error(`Mesh "${meshName}" does not exist in scene "${sceneName}"`);
        }

        let geoms;
        if (mesh.children.length === 0) {
            const geom = h(mesh, colorMap);
            mesh.updateMatrixWorld(true);
            geom.applyMatrix4(mesh.matrix);
            geoms = [geom];
        } else {
            geoms = mesh.children.map(child => h(child, colorMap));
            mesh.updateMatrixWorld(true);
            for (const geom of geoms) geom.applyMatrix4(mesh.matrix);
        }

        let maxY = -Infinity;
        if (flipY) {
            for (const geom of geoms) {
                const pos = geom.attributes.position.array;
                for (let i = 0; i < pos.length; i += 3) {
                    maxY = Math.max(maxY, pos[i + 1]);
                }
            }
        }

        for (const geom of geoms) {
            geom.applyMatrix4(
                new Xn().makeScale(flipX ? -1 : 1, flipY ? -1 : 1, flipZ ? -1 : 1)
            );

            if (flipX || flipY || flipZ) {
                const index = geom.index;
                if (index != null) {
                    for (let idx = 0; idx < index.count; idx += 3) {
                        const a = index.getX(idx);
                        const b = index.getX(idx + 1);
                        const c = index.getX(idx + 2);
                        index.setXYZ(idx, a, c, b);
                    }
                } else {
                    const pos = geom.attributes.position;
                    for (let idx = 0; idx < pos.count; idx += 3) {
                        const n0 = idx;
                        const n1 = idx + 1;
                        const n2 = idx + 2;
                        const ax = pos.getX(n0), ay = pos.getY(n0), az = pos.getZ(n0);
                        const bx = pos.getX(n1), by = pos.getY(n1), bz = pos.getZ(n1);
                        const cx = pos.getX(n2), cy = pos.getY(n2), cz = pos.getZ(n2);
                        pos.setXYZ(n0, ax, ay, az);
                        pos.setXYZ(n1, cx, cy, cz);
                        pos.setXYZ(n2, bx, by, bz);
                    }
                }
            }

            if (flipY) geom.translate(0, maxY, 0);
        }
        return geoms;
    }
    o = async (partConfig) => {

        if (get(this.loaderClass, this.pml.getFromPolyTrack(`qB`), "f").has(partConfig.id)) {
            throw new Error("Track part types have same Id");
        }

        const partData = {
            configuration: partConfig,
            colors: new Map(partConfig.colors.map(({ id }) => [id, null])),
            physicsShapeVertices: null,
        };
        get(this.loaderClass, this.pml.getFromPolyTrack(`qB`), "f").set(partConfig.id, partData);

        const l = await r;
        let mergedGeom = null;

        for (const colorEntry of partConfig.colors) {
            const geoms = [];
            for (const [sceneName, meshName, flipOpts] of partConfig.models) {
                const meshes = c(
                    sceneName,
                    meshName,
                    flipOpts?.flipX ?? false,
                    flipOpts?.flipY ?? false,
                    flipOpts?.flipZ ?? false,
                    colorEntry.colors
                );
                geoms.push(...meshes);
            }

            const merged = this.pml.getFromPolyTrack('vl')(geoms, true).toNonIndexed();
            merged.computeVertexNormals();

            const baked = this.pml.getFromPolyTrack('yl')(merged);
            const meshObj = new this.pml.getFromPolyTrack('yr')(baked, s);
            partData.colors.set(colorEntry.id, meshObj);

            if (!mergedGeom) mergedGeom = merged;
        }

        if (!mergedGeom) throw new Error("Physics geometry is missing");
        if (!(mergedGeom.attributes.position instanceof Xi)) {
            throw new Error("Vertices must use BufferAttribute");
        }

        partData.physicsShapeVertices = new Float32Array(
            mergedGeom.attributes.position.array
        );
    };
    loadGltfs = async(paths) => {
        return await Promise.all(
            paths.map((e) => {
                return new Promise((resolve) => {
                    n.load(e, (t) => {
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
    }
    onGameLoad = () => {
        this.modelUrls = [`${this.baseUrl}/copy_pillars.glb`]
        this.pml.editorExtras.registerBlock("CopyPillar1", "CopyPillars", "b235ea87337c17de7cbaecaf3d381fff9782e8379bcbc1c6cc9882da4aa1da15", "Signs", "CopyPillar1", [[[-1, 0, -1], [0, 0, 0]]], { ignoreOnExport: true })
        this.gltfModels = this.loadGltfs(this.modelUrls);
        
    }
}

export let polyMod = new PolyBlockLoader();