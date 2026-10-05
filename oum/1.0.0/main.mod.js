import { PolyMod, MixinType, SettingType } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.3/PolyTypes.js";

const MOD_ID = "oum";

const EYE_SVG =
  "data:image/svg+xml;utf8," +
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'>" +
  "<path d='M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 " +
  "11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 " +
  "10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'/></svg>";

class OUMod extends PolyMod {

  #state = { targetId: null, cockpit: false, active: false };
  #ctx = null;
  #overlay = null;
  #pendingEndSession = null;

  get eyeSvg() { return EYE_SVG; }
  get isSpectating() { return this.#state.targetId !== null; }

  preInit = (_pml) => {}

  init = async (pml) => {
    this.pml = pml;

    // ---- binds ---------------------------------------------------------
    pml.registerBindCategory("Multiplayer Spectate");

    pml.registerKeybind(
      "Spectate: Cycle player",
      "msxNext", "keydown", "KeyV", null,
      (e) => this.cycleTarget(e),
    );
    pml.registerKeybind(
      "Spectate: Toggle cockpit camera",
      "msxCamera", "keydown", "KeyB", null,
      (e) => this.toggleCamera(e),
    );

    // ---- settings ------------------------------------------------------
    pml.registerSettingCategory("Multiplayer Spectate");

    pml.registerSetting(
      "Remote car interpolation",
      "msxInterpMode",
      SettingType.CUSTOM,
      "responsive",
      [
        { title: "Off",        value: "off" },
        { title: "Gentle",     value: "gentle" },
      ],
    );
    pml.registerSetting(
      "Delay session end while driving",
      "msxEndSessionDelay",
      SettingType.BOOL,
      true,
    );
    pml.registerSetting(
      "Session end grace period",
      "msxEndSessionGrace",
      SettingType.CUSTOM,
      "30",
      [
        { title: "10 s",  value: "10" },
        { title: "30 s",  value: "30" },
        { title: "60 s",  value: "60" },
        { title: "120 s", value: "120" },
      ],
    );

    // ---- interpolation mixin -------------------------------------------
    //
    // Replaces the vanilla ±50 ms snap. When the mod is absent, or the
    // user picked "Off", we reproduce the original branch verbatim so
    // the behaviour is byte-for-byte identical.
    pml.registerClassMixin("Is.prototype", "update", {
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `t < i - r ? (a -= 0.5 * r) : t > i + r && (a += 0.5 * r);`,
      tokenEnd:   `t < i - r ? (a -= 0.5 * r) : t > i + r && (a += 0.5 * r);`,
      func:
        `{` +
        `  const _mplus = ActivePolyModLoader.getMod("${MOD_ID}");` +
        `  const _rate  = _mplus ? _mplus.interpolationRate(t - i) : null;` +
        `  if (_rate === null) {` +
        `    if (t < i - r) a -= 0.5 * r;` +
        `    else if (t > i + r) a += 0.5 * r;` +
        `  } else {` +
        `    a += _rate * n;` +
        `  }` +
        `}`,
    });

    // ---- tick mixin ----------------------------------------------------
    pml.registerClassMixin("Is.prototype", "update", {
      type: MixinType.INSERT,
      token: `(0, R.gn)(this, Xa, "f").update(n),`,
      func:
        `ActivePolyModLoader.getMod("${MOD_ID}")?.spectateTick(` +
        `this, n,` +
        `(0, R.gn)(this, Za, "f"),` +
        `(0, R.gn)(this, Xa, "f"),` +
        `(0, R.gn)(this, as, "f"),` +
        `(0, R.gn)(this, la, "f"),` +
        `(0, R.gn)(this, ua, "f"),` +
        `P.A),`,
    });

    // ---- lock our own inputs while spectating --------------------------
    pml.registerClassMixin("Is.prototype", "update", {
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `(0, R.gn)(this, Xa, "f").isControlsDisabled =`,
      tokenEnd:   `(0, R.gn)(this, ta, "m", bs).call(this)),`,
      func:
        `(0, R.gn)(this, Xa, "f").isControlsDisabled = ` +
        `(0, R.gn)(this, fs, "f").isEnabled || ` +
        `(0, R.gn)(this, ta, "m", bs).call(this) || ` +
        `(ActivePolyModLoader.getMod("${MOD_ID}")?.isSpectating ?? false)),`,
    });

    // ---- defer end-session while driving -------------------------------
    //
    // Push the *wrapped* callback, not a thunk that returns it. The
    // previous version stored an inert closure and silently disabled the
    // whole teardown path — that's what broke the results screen.
    pml.registerClassMixin("vc.prototype", "addEndSessionCallback", {
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `((0, R.gn)(this, Xl, "f").push(t),`,
      tokenEnd:   `((0, R.gn)(this, Xl, "f").push(t),`,
      func:
        `((0, R.gn)(this, Xl, "f").push(` +
        `ActivePolyModLoader.getMod("${MOD_ID}")?.wrapEndSessionCallback(t) ?? t),`,
    });

    // ---- defer new-session while end-session is held -------------------
    //
    // NewSession arrives on the same channel a few milliseconds after
    // EndSession. Without this, the "host switched maps" packet tears
    // down the local Is and rebuilds it on the new track, cutting the
    // player's run short even though EndSession is still queued.
    pml.registerClassMixin("vc.prototype", "addNewSessionCallback", {
      type: MixinType.REPLACEBETWEEN,
      tokenStart: `((0, R.gn)(this, Yl, "f").push(t),`,
      tokenEnd:   `((0, R.gn)(this, Yl, "f").push(t),`,
      func:
        `((0, R.gn)(this, Yl, "f").push(` +
        `ActivePolyModLoader.getMod("${MOD_ID}")?.wrapNewSessionCallback(t) ?? t),`,
    });

    // ---- cleanup -------------------------------------------------------
    pml.registerClassMixin("Is.prototype", "dispose", {
      type: MixinType.INSERT,
      token: `(0, R.gn)(this, ka, "f")?.cancel(),`,
      func:
        `ActivePolyModLoader.getMod("${MOD_ID}")?.spectateDispose(this),`,
    });

    // ---- eye button in the multiplayer player list ---------------------
    pml.registerFuncMixin("wr", {
      type: MixinType.INSERT,
      token: `((p.className = "ping"), r.appendChild(p));`,
      func: `
        if (!i.isSelf) {
          const _mplus_eye = document.createElement("button");
          _mplus_eye.className = "button kick-button";
          _mplus_eye.title = "Spectate";
          _mplus_eye.innerHTML =
            '<img class="button-icon" src="' +
            ActivePolyModLoader.getMod("${MOD_ID}").eyeSvg +
            '">';
          _mplus_eye.addEventListener("click", () => {
            (0, R.gn)(this, or, "f").playUIClick();
            ActivePolyModLoader.getMod("${MOD_ID}")?.spectatePlayerById(i.id);
          });
          r.appendChild(_mplus_eye);
        }
      `,
    });
  }

  // =====================================================================
  //  Interpolation controller
  // =====================================================================
  //
  // Returns the *fractional* rate to add to `a` on top of the natural
  // frame delta. `null` means "fall through to the vanilla branch".
  //
  // err = bufferDepth − targetDepth  (seconds)
  //   positive -> buffer is deeper than we want; speed the clock up
  //   negative -> we're ahead of the buffer; slow the clock down
  interpolationRate(err) {
    let mode = "responsive";
    try {
      mode = this.pml?.getSetting?.("msxInterpMode") ?? "responsive";
    } catch (_) { /* keep default */ }

    if (mode === "off") return null;

    const params = mode === "gentle"
      ? { deadband: 0.1,  kp: 1, max: 0.15 }
      : { deadband: 0.03, kp: 3, max: 0.25 };

    if (Math.abs(err) <= params.deadband) return 0;
    const excess = err - Math.sign(err) * params.deadband;
    return Math.max(-params.max, Math.min(params.max, excess * params.kp));
  }

  // =====================================================================
  //  Called every frame from `Is.update`
  // =====================================================================
  spectateTick(game, dt, mpInfo, ownCar, remoteCars, renderer, settings, settingEnum) {
    if (!mpInfo) {
      if (this.#state.active) {
        try {
          renderer.setCamera(
            settings.getSettingBoolean(settingEnum.DefaultCameraMode)
              ? ownCar.cameraCockpit
              : ownCar.cameraOrbit,
          );
        } catch (e) { console.warn("[mplusplus]", e); }
      }
      this.#state.targetId = null;
      this.#state.cockpit = false;
      this.#state.active = false;
      this.#ctx = null;
      this.#setOverlayVisible(false);
      return;
    }

    this.#ctx = {
      game, mpInfo, ownCar, remoteCars, renderer, settings, settingEnum,
    };

    // ---- deferred session end: release now if the run is over ---------
    if (this.#pendingEndSession) {
      const p = this.#pendingEndSession;
      const timedOut = performance.now() >= p.deadline;
      const runEnded = !ownCar.hasStarted() || ownCar.hasFinished();
      if (timedOut || runEnded) {
        this.#pendingEndSession = null;
        // Let the current frame finish, then run the EndSession
        // callback followed by any queued NewSession callbacks, in
        // arrival order.
        setTimeout(() => {
          try {
            p.callback();
          } catch (e) { console.error("[mplusplus] EndSession callback:", e); }
          for (const fn of p.queuedNewSessions) {
            try { fn(); }
            catch (e) { console.error("[mplusplus] NewSession callback:", e); }
          }
        }, 0);
      }
    }

    const wasActive = this.#state.active;
    let isActive = false;

    if (this.#state.targetId !== null) {
      const remote = remoteCars.get(this.#state.targetId);
      if (remote) {
        remote.car.updateCameras(dt);
        const targetCam = this.#state.cockpit
          ? remote.car.cameraCockpit
          : remote.car.cameraOrbit;
        if (renderer.camera !== targetCam) {
          renderer.setCamera(targetCam);
        }
        isActive = true;
      } else {
        this.#state.targetId = null;
        this.#state.cockpit = false;
      }
    }

    if (!isActive && wasActive) {
      renderer.setCamera(
        settings.getSettingBoolean(settingEnum.DefaultCameraMode)
          ? ownCar.cameraCockpit
          : ownCar.cameraOrbit,
      );
    }

    this.#state.active = isActive;
    if (isActive) this.#refreshOverlay();
    else this.#setOverlayVisible(false);
  }

  spectateDispose(game) {
    if (this.#ctx && this.#ctx.game === game) {
      this.#ctx = null;
      this.#state = { targetId: null, cockpit: false, active: false };
      this.#pendingEndSession = null;
      this.#setOverlayVisible(false);
    }
  }

  // =====================================================================
  //  End-session deferral
  // =====================================================================
  wrapEndSessionCallback(callback) {
    return () => {
      const ctx = this.#ctx;
      if (!ctx || !ctx.mpInfo) { callback(); return; }

      let enabled = true;
      try {
        enabled = this.pml?.getSetting("msxEndSessionDelay") === "true";
      } catch (_) { /* ignore */ }
      if (!enabled) { callback(); return; }

      const ownCar = ctx.ownCar;
      if (!ownCar.hasStarted() || ownCar.hasFinished()) {
        callback(); return;
      }

      let graceSec = 30;
      try {
        const parsed = parseInt(this.pml?.getSetting("msxEndSessionGrace"), 10);
        if (Number.isFinite(parsed) && parsed > 0) graceSec = parsed;
      } catch (_) { /* ignore */ }

      this.#pendingEndSession = {
        callback,
        deadline: performance.now() + graceSec * 1000,
        queuedNewSessions: [],
      };
    };
  }

  // =====================================================================
  //  New-session deferral
  // =====================================================================
  wrapNewSessionCallback(callback) {
    return (...args) => {
      const ctx = this.#ctx;
      // If an EndSession is currently being held, queue the new-session
      // transition so it runs right after the teardown, not before it.
      if (ctx && ctx.mpInfo && this.#pendingEndSession) {
        this.#pendingEndSession.queuedNewSessions.push(() => callback(...args));
        return;
      }
      callback(...args);
    };
  }

  // =====================================================================
  //  Keybind handlers
  // =====================================================================
  cycleTarget(e) {
    const ctx = this.#ctx;
    if (!ctx || !ctx.mpInfo) return;

    const ids = [null, ...ctx.remoteCars.keys()];
    const current = ids.indexOf(this.#state.targetId);
    this.#state.targetId = ids[(current + 1) % ids.length];

    if (this.#state.targetId === null) this.#state.cockpit = false;

    this.#refreshOverlay();
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  toggleCamera(e) {
    if (!this.#ctx) return;
    if (this.#state.targetId === null) return;

    this.#state.cockpit = !this.#state.cockpit;
    this.#refreshOverlay();
    e.preventDefault();
    e.stopImmediatePropagation();
  }

  // =====================================================================
  //  Public API for the player-list eye button
  // =====================================================================
  spectatePlayerById(id) {
    if (!this.#ctx || !this.#ctx.mpInfo) return;
    if (this.#state.targetId === id) {
      this.#state.targetId = null;
      this.#state.cockpit = false;
    } else {
      this.#state.targetId = id;
      this.#state.cockpit = false;
    }
    this.#refreshOverlay();
  }

  // =====================================================================
  //  HUD
  // =====================================================================
  #ensureOverlay() {
    if (this.#overlay) return this.#overlay;
    const ui = document.getElementById("ui");
    if (!ui) return null;

    const o = document.createElement("div");
    o.id = "mplusplus-overlay";
    o.style.position = "absolute";
    o.style.top = "10px";
    o.style.left = "50%";
    o.style.transform = "translateX(-50%)";
    o.style.margin = "0";
    o.style.padding = "8px 20px";
    o.style.boxSizing = "border-box";
    o.style.borderRadius = "8px";
    o.style.background = "var(--surface-transparent-color)";
    o.style.color = "#fff";
    o.style.textAlign = "center";
    o.style.textShadow = "2px 2px 0 #112052, 0 0 2px #000";
    o.style.fontFamily = "ForcedSquare, Arial, sans-serif";
    o.style.fontStyle = "italic";
    o.style.lineHeight = "1";
    o.style.fontSize = "28px";
    o.style.pointerEvents = "none";
    o.style.transition = "opacity 0.15s ease-out";
    o.style.zIndex = "5";

    const title = document.createElement("div");
    title.style.fontSize = "28px";
    title.style.fontWeight = "bold";
    const subtitle = document.createElement("div");
    subtitle.style.marginTop = "4px";
    subtitle.style.fontSize = "18px";
    subtitle.style.opacity = "0.7";

    o.appendChild(title);
    o.appendChild(subtitle);
    o._mplus_title = title;
    o._mplus_subtitle = subtitle;

    ui.appendChild(o);
    this.#overlay = o;
    return o;
  }

  #setOverlayVisible(visible) {
    const o = this.#ensureOverlay();
    if (!o) return;
    o.style.opacity = visible ? "1" : "0";
  }

  #refreshOverlay() {
    if (!this.#state.active || this.#state.targetId === null) {
      this.#setOverlayVisible(false);
      return;
    }
    const o = this.#ensureOverlay();
    if (!o) return;

    let name = "Player";
    try {
      const players = this.#ctx.mpInfo.multiplayerConnection.getPlayers();
      const match = players.find((p) => p.id === this.#state.targetId);
      if (match) name = match.nickname;
    } catch (e) { /* ignore */ }

    o._mplus_title.textContent = `Spectating: ${name}`;
    o._mplus_subtitle.textContent =
      this.#state.cockpit ? "Cockpit camera" : "Orbit camera";
    this.#setOverlayVisible(true);
  }
}

export let polyMod = new OUMod();