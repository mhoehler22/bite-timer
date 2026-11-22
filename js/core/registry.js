/* Bite Timer: the content library.
   Creatures, homes and decorations each register themselves from their own file,
   so adding one is: write the file, add one <script> line to index.html.
   See docs/ADDING_CONTENT.md for the recipe. */
(function (BT) {
  BT.creatures = {};
  BT.homes = {};
  BT.decor = {};
  const problems = BT.contentProblems = [];

  /* A creature:
     { id, label, home: '<home id>', color: '<default color id>', sound: '<audio name>',
       poses: { sit: { anchors: ['floor','shelf'], draw(p) }, ...more poses } }
     Poses draw with the origin at the bottom center (feet on y=0), except a pose whose
     anchors are ['hang'], which draws from its hands at y=0 downward. */
  BT.addCreature = def => {
    if (!def.id || !def.poses || !def.poses.sit) { problems.push('creature missing id or sit pose: ' + def.id); return; }
    def.sound = def.sound || 'boop';
    def.color = def.color || 'pink';
    BT.creatures[def.id] = def;
  };

  /* A home:
     { id, label, title(name), moods: [ {...colors} ], host: { x, y, s, pose, a },
       slots: [ { a: 'floor'|'shelf'|'hang'|'wall', x, y, s } ], air: { x, y, w, h },
       noShared: [decor ids that don't belong here], petWrap: 'bubble' (optional),
       draw(mood, rng) -> backdrop SVG for a 400 x 400 scene } */
  BT.addHome = def => {
    if (!def.id || !def.draw || !def.moods || !def.slots) { problems.push('home missing parts: ' + def.id); return; }
    def.noShared = def.noShared || [];
    BT.homes[def.id] = def;
  };

  /* A decoration:
     { id, anchors: [...], draw(p), origin: 'bottom'|'center'|'top', h: height,
       homes: ['<home id>'] (omit to allow everywhere), scale, sound } */
  BT.addDecor = def => {
    if (!def.id || !def.draw || !def.anchors) { problems.push('decor missing parts: ' + def.id); return; }
    def.origin = def.origin || 'center';
    def.h = def.h || 40;
    def.scale = def.scale || 1;
    def.sound = def.sound || 'chime';
    BT.decor[def.id] = def;
  };

  BT.decorFor = homeId => {
    const home = BT.homes[homeId];
    return Object.values(BT.decor).filter(d => d.homes ? d.homes.includes(homeId) : !(home && home.noShared.includes(d.id)));
  };

  // Called once at start-up: catch a creature pointing at a home that doesn't exist, etc.
  BT.checkContent = () => {
    for (const c of Object.values(BT.creatures)) {
      if (!BT.homes[c.home]) problems.push(`creature "${c.id}" lives in "${c.home}", which isn't registered`);
    }
    for (const h of Object.values(BT.homes)) {
      const anchors = new Set(h.slots.map(s => s.a));
      for (const a of anchors) {
        const fits = BT.decorFor(h.id).some(d => d.anchors.includes(a));
        if (!fits) problems.push(`home "${h.id}" has ${a} spots but no decoration that fits them`);
      }
    }
    if (problems.length) console.warn('Bite Timer content problems:\n' + problems.join('\n'));
    return problems;
  };
})(window.BT);
