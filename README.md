# Bite Timer

A cozy, pastel kawaii dinner helper for kids. A gentle timer counts down, a music-box chime plays, and a big **"I took a bite! ✨"** button pops up. Every bite adds a surprise decoration or a visiting friend to tonight's room.

- **Before dinner:** pick tonight's creature (sloth, kitten, puppy, unicorn, bunny, panda, penguin or baby dragon), choose its color, and give it a name. Pick a suggested name, or spell your own on a big ABC board.
- **During dinner:** each creature has its own home, from a treehouse to a cloud castle. Rewards fill it as the bites add up. Tap anything to make it squish, purr or sparkle. Every 5 bites brings a shower of hearts and stars.
- **After dinner:** finished rooms are saved in **My Rooms** to visit later.
- **Grown-up controls:** 10, 15 or 20 seconds, pause, and press-and-hold ⚙️ for settings and backups.

## Put it on a phone

Open the site, then add it to the home screen. It runs full screen and works offline.

- **iPhone / iPad:** in Safari, tap Share → **Add to Home Screen**.
- **Android:** in Chrome, tap ⋮ → **Install app**.

Everything is saved on the device only. Nothing is sent anywhere.

## Run it locally

```
node tools/serve.js 8147
```

Open <http://localhost:8147/>. Add `?fast=1` for 3-second countdowns. `tools/gallery.html` shows every creature, decoration and home; `tools/phone.html` shows the app in phone-sized frames.

Plain HTML, CSS and JavaScript, with no build step and no dependencies. All art is SVG drawn in code, and all sounds are made with the Web Audio API. Each creature and home is a single file in `js/creatures/` or `js/homes/` that registers itself, so new ones are easy to add.
