const e = () => {
  const DIRS = [
    [0, -1], // north
    [-1, 0], // west
    [0, 1],  // south
    [1, 0],  // east
  ];

  const rand = (p) => Math.random() < p;

  (function generate(track) {
    track.clear();

    let collision = false;
    const parts = new Map();

    let x = 0, y = 0, z = 0;
    let dir = Math.floor(Math.random() * 4);

    function place(type, direction = dir, extra = {}) {
      const key = `${x}|${y}|${z}`;
      if (parts.has(key)) collision = true;
      parts.set(key, { type, direction: ((direction % 4) + 4) % 4, x, y, z, ...extra });
    }

    function step() {
      const [dx, dz] = DIRS[dir];
      x += dx;
      z += dz;
    }

    // --- Start piece ---
    place(Sb.Start, dir, { checkpoint: 0 });
    step();

    function build(steps) {
      for (let i = 0; i < steps; i++) {
        const r = Math.random();

        if (r < 0.6) {
          // straight
          place(0, dir);
          step();
        } else if (r < 0.75) {
          // right turn
          place(1, dir);
          dir = (dir + 3) % 4;
          step();
        } else if (r < 0.9) {
          // left turn
          place(1, dir - 1);
          dir = (dir + 1) % 4;
          step();
        } else {
          // ramp
          if (y === 0) {
            place(2, dir); // ramp up only
            y++;
          } else {
            if (rand(0.5)) {
              place(2, dir); // ramp up
              y++;
            } else {
              y--;
              place(3, dir); // ramp down
            }
          }
          step();
        }
      }
      place(6, dir); // end cap
    }

    build(50);

    if (!collision) {
      for (const part of parts.values()) {
        let checkpoint = null;
        if (part.type === Sb.Start) checkpoint = 0;

        track.setPart(
          4 * part.x,
          part.y,
          4 * part.z,
          part.type,
          part.direction,
          _b.YPositive,
          kb.Default,
          null,
          checkpoint
        );
      }
    } else {
      generate(track); // retry if overlap
    }
  })(b_(this, MS, "f"));

  b_(this, MS, "f").generateMeshes();
  const refresh = b_(this, jM, "f");
  if (refresh) refresh.refresh(b_(this, MS, "f"));

  b_(this, QS, "f").setFromExistingCheckpoints(b_(this, MS, "f"));
  b_(this, HM, "f").length = 0;
  b_(this, VM, "f").length = 0;
  b_(this, WS, "f").disabled = true;
  b_(this, HS, "f").disabled = true;
  y_(this, bM, true, "f");
};