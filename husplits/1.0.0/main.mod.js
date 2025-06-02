import { PolyMod, MixinType } from "https://pml.orangy.cfd/PolyTrackMods/PolyModLoader/0.5.0/PolyModLoader.js";


class HUSplits extends PolyMod {
    init = (pml) => {
        this.modPmlInstance = pml;
        pml.registerFuncMixin("pP", MixinType.INSERT, `yP(this, eP, "f").notificationAudioEnabled = !0,`, () => {
            yP(this, eP, "f").addCheckpointCallback((e) => {
                if(yP(this, HC, "f") === null) return;
                const curetime = yP(this, eP, "f").getTime();
                let ghostitme = null;
                const i = yP(this, wC, "m", mP).call(this);
                null != i && i.checkpointTimes.length > e && (ghostitme = i.checkpointTimes[e]);
                let timeDelta
                if(ghostitme !== null && ghostitme !== undefined && curetime !== null && curetime !== undefined) {
                    timeDelta = ghostitme.time - curetime.time;
                } else {
                    return;
                }
                let uiDiv = document.getElementById("ui");
                let hintDiv = document.createElement('div');
                hintDiv.style = `interpolate-size: allow-keywords;
    --text-color: #fff;
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
    cursor: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    font-style: italic;
    font-family: ForcedSquare, Arial, sans-serif;
    line-height: 1;
    padding: 0 280px;
    position: absolute;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    color: #fff;
    text-shadow: 0 0 5px #000;
    pointer-events: none;
    top: 150px;
    opacity: 1;
    transition: opacity 0.25s ease-in-out, top 0.25s ease-in-out;`;
                let splitDiv = document.createElement('div');
                splitDiv.style = `    interpolate-size: allow-keywords;
    --text-color: #fff;
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
    cursor: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    text-align: center;
    color: #fff;
    text-shadow: 0 0 5px #000;
    pointer-events: none;
    font-style: italic;
    font-family: ForcedSquare, Arial, sans-serif;
    line-height: 1;
    font-size: 32px;`;
                splitDiv.innerHTML = `<p style="color: ${timeDelta <= 0 ? '#f55' : '#5f5'}">${timeDelta <= 0 ? "+" : ""}${(timeDelta*-1).toFixed(3)}</p>`
                hintDiv.appendChild(splitDiv);
                uiDiv.appendChild(hintDiv);
                setTimeout(() => {
                    hintDiv.remove();
                }, 2000)
            });
        })
    }
}

export let polyMod = new HUSplits();
