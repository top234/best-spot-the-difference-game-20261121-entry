// scenes.js — the five scenes and every hidden difference in each one.
// A difference is a spot on the 560x420 picture: { id, x, y, r, label }.
// The painter in render.js draws the scene twice: once plain, once with the
// differences in `altered` applied. A difference is always fair at full size:
// a missing object, a colour change, a shifted item or an added detail.

export const PANEL_W = 560;
export const PANEL_H = 420;

export const SCENES = [
  {
    id: 'market',
    title: 'Pasar Malam',
    subtitle: 'Night market lane — lanterns, satay smoke and string lights',
    timeLimit: 180,
    par: 90,
    differences: [
      { id: 'lantern', x: 302, y: 62, r: 20, label: 'A paper lantern is missing' },
      { id: 'awning', x: 115, y: 192, r: 24, label: 'The stall awning changed colour' },
      { id: 'cat', x: 468, y: 332, r: 22, label: 'A cat appeared on the crate' },
      { id: 'balloon', x: 118, y: 118, r: 20, label: 'A green balloon is missing' },
      { id: 'satay', x: 115, y: 272, r: 20, label: 'One satay stick is missing' },
      { id: 'chili', x: 478, y: 172, r: 18, label: 'The chili on the sign is gone' },
      { id: 'star', x: 88, y: 42, r: 16, label: 'An extra star in the sky' },
    ],
  },
  {
    id: 'library',
    title: 'The Old Library',
    subtitle: 'Dusty shelves, a reading lamp and a very old clock',
    timeLimit: 180,
    par: 100,
    differences: [
      { id: 'book', x: 151, y: 125, r: 18, label: 'A book spine changed colour' },
      { id: 'flame', x: 372, y: 276, r: 18, label: 'The candle flame is out' },
      { id: 'clock', x: 282, y: 62, r: 22, label: 'The clock hands moved' },
      { id: 'globe', x: 452, y: 300, r: 22, label: 'The globe turned around' },
      { id: 'cat', x: 490, y: 88, r: 20, label: 'A cat is asleep on the shelf' },
      { id: 'pot', x: 67, y: 343, r: 20, label: 'The plant pot changed colour' },
      { id: 'moon', x: 512, y: 52, r: 18, label: 'The moon left the window' },
      { id: 'rung', x: 212, y: 300, r: 18, label: 'A ladder rung is missing' },
    ],
  },
  {
    id: 'garden',
    title: 'Botanical Garden',
    subtitle: 'Morning in the glasshouse — bees, blooms and one frog',
    timeLimit: 150,
    par: 100,
    differences: [
      { id: 'flower', x: 150, y: 190, r: 22, label: 'A flower changed colour' },
      { id: 'butterfly', x: 330, y: 120, r: 20, label: 'The butterfly flew away' },
      { id: 'frog', x: 420, y: 330, r: 20, label: 'A frog joined the pond' },
      { id: 'bee', x: 250, y: 90, r: 16, label: 'A bee is missing' },
      { id: 'mushroom', x: 80, y: 350, r: 20, label: 'A mushroom changed colour' },
      { id: 'can', x: 500, y: 340, r: 22, label: 'The watering can is gone' },
      { id: 'cloud', x: 460, y: 55, r: 22, label: 'A cloud drifted away' },
      { id: 'snail', x: 215, y: 372, r: 18, label: 'A snail appeared on the leaf' },
    ],
  },
  {
    id: 'bakery',
    title: 'Bakery at Dawn',
    subtitle: 'Fresh bread, warm ovens and the smell of cinnamon',
    timeLimit: 150,
    par: 90,
    differences: [
      { id: 'croissant', x: 180, y: 300, r: 20, label: 'A croissant is missing' },
      { id: 'mitt', x: 350, y: 205, r: 20, label: 'The oven mitt changed colour' },
      { id: 'clock', x: 282, y: 62, r: 22, label: 'The bakery clock moved on' },
      { id: 'jar', x: 455, y: 265, r: 22, label: 'Cookies vanished from the jar' },
      { id: 'cat', x: 505, y: 130, r: 20, label: 'A cat watches from the window' },
      { id: 'pin', x: 105, y: 330, r: 20, label: 'The rolling pin is gone' },
      { id: 'loaf', x: 200, y: 150, r: 20, label: 'A loaf left the shelf' },
    ],
  },
  {
    id: 'kites',
    title: 'Kite Festival',
    subtitle: 'A windy hill, a dozen kites and one very proud kite-flyer',
    timeLimit: 120,
    par: 100,
    differences: [
      { id: 'kite', x: 280, y: 130, r: 24, label: 'The big kite changed colour' },
      { id: 'tail', x: 295, y: 207, r: 18, label: 'A bow fell off the kite tail' },
      { id: 'cloud', x: 90, y: 70, r: 22, label: 'A cloud drifted away' },
      { id: 'bird', x: 456, y: 92, r: 16, label: 'A bird flew away' },
      { id: 'flag', x: 72, y: 220, r: 18, label: 'The festival flag changed colour' },
      { id: 'ball', x: 400, y: 370, r: 18, label: 'A ball rolled away' },
      { id: 'hat', x: 205, y: 280, r: 18, label: 'The flyer’s hat changed colour' },
      { id: 'kite2', x: 470, y: 180, r: 20, label: 'A second kite appeared' },
    ],
  },
];

export function totalDifferences() {
  return SCENES.reduce((n, s) => n + s.differences.length, 0);
}
