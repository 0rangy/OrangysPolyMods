import { PolyMod, MixinType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0/PolyTypes.js";


class HUSplits extends PolyMod {
    init = (pml) => {
        this.modPmlInstance = pml;

        pml.registerSettingCategory("Heads Up Splits");
        pml.registerSetting("Size", "huSplitsSize", "slider", 0.5);
        pml.registerSetting("Height", "huSplitsHeight", "slider", 0.1);
        pml.registerSetting("Opacity", "huSplitsOpacity", "slider", 1);
        pml.registerSetting("Show Speed Split", "huSplitsShowSpeed", "boolean", true);

        pml.registerFuncMixin("Xa", {type: MixinType.INSERT, token: `(s.notificationAudioEnabled = !0),`, func:`
            s.addCheckpointCallback((e) => {
                if (null == s) return;
                const curetime = s.getTime();
                let ghostitme = null;
                const i = (0, C.gn)(this, _r, "m", Za).call(this);
                null != i && i.checkpoints.length > e && (ghostitme = i.checkpoints[e]);
                let timeDelta;
                let speedDelta;
                if(ghostitme !== null && ghostitme !== undefined && curetime !== null && curetime !== undefined) {
                    timeDelta = ghostitme.time.time - curetime.time;
                    speedDelta = s.getSpeedKmh() - (i ? i.checkpoints ? i.checkpoints[e].speedKmh : i.car.getSpeedKmh() : i.car.getSpeedKmh());
                } else {
                    return;
                }
                let uiDiv = document.getElementById("ui");

                let checkpointBox = document.createElement('div');
                checkpointBox.style = \`
                position: fixed;
                top: $\{ActivePolyModLoader.getSetting("huSplitsHeight") * 100}%;
                left: 50%;
                opacity: $\{ActivePolyModLoader.getSetting("huSplitsOpacity")};
                transform: translateX(-50%);
                font-family: ForcedSquare;
                font-style: normal;
                font-size: \${4*ActivePolyModLoader.getSetting("huSplitsSize")}rem;
                color: white;
                display: flex;
                flex-direction: column;
                gap: 2px;
                user-select: none;
                pointer-events: none;
                z-index: 9999;
                \`;
                checkpointBox.id = "huSplitCpBox";

                let topRow = document.createElement('div');
                topRow.style = \`display: flex;\`;

                let speedDiv = document.createElement('div');
                speedDiv.style = \`
                padding: 4px 8px;
                text-align: center;
                flex: 1;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                \`;

                let speedDeltaDiv = document.createElement('div');
                speedDeltaDiv.style = \`
                padding: 4px 8px;
                text-align: center;
                flex: 1;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                \`;

                let midRow = document.createElement('div');
                midRow.style = \`display: flex;\`;

                let timeDiv = document.createElement('div');
                timeDiv.style = \`
                padding: 4px 8px;
                text-align: center;
                flex: 1;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                \`;

                let bottomRow = document.createElement('div');
                bottomRow.style = \`
                display: flex;
                justify-content: left;
                \`;

                bottomRow.innerHTML = \`
                <p style="
                    margin: 0;
                    padding: 4px 8px;
                    font-weight: bold;
                    background-color:\${timeDelta <= 0 ? '#f55' : '#334bffcc'};
                    text-align: center;
                ">
                    $\{timeDelta <= 0 ? "+" : ""}$\{(-timeDelta).toFixed(3)}
                </p>
                \`;

                speedDiv.innerHTML = \`\${s.getSpeedKmh().toFixed(1)}\`;
                speedDeltaDiv.innerHTML = \`
                <p style="
                    margin: 0;
                    font-weight: bold;
                    color: $\{speedDelta < 0 ? '#f55' : speedDelta === 0 ? '#808080' : '#5f5'};
                ">
                    \${speedDelta <= 0 ? "" : "+"}$\{(speedDelta).toFixed(1)}
                </p>
                \`;

                timeDiv.innerHTML = \`$\{Ve.A.formatTimeString(curetime, !1)}\`;

                topRow.appendChild(speedDiv);
                topRow.appendChild(speedDeltaDiv);
                midRow.appendChild(timeDiv);

                if(ActivePolyModLoader.getSetting("huSplitsShowSpeed") === "true") {
                    checkpointBox.appendChild(topRow);
                }
                checkpointBox.appendChild(midRow);
                checkpointBox.appendChild(bottomRow);
                document.getElementById("huSplitCpBox")?.remove(); 
                uiDiv.appendChild(checkpointBox);

                setTimeout(() => {
                    checkpointBox.remove();
                }, 2000)
            }),
        `})
    }
}

export let polyMod = new HUSplits();