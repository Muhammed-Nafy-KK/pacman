# 🟡 Pac-Man (Web Edition)

I built a browser-based version of the classic **Pac-Man** arcade game from scratch using plain **HTML, CSS, and JavaScript**. No game engines, no frameworks—just pure web code to recreate the nostalgia of dodging ghosts, grabbing power pellets, and chasing high scores.

👉 **[Play it in your browser](#)** *(Swap this link out once you host it!)*

---

## What's Inside?

* **The Classic Maze Loop:** Eat all the dots to clear the board while avoiding four ghosts.
* **Different Ghost Behaviors:** Each ghost hunts you down a little differently—some chase you directly, while others try to cut you off or wander.
* **Power Pellets & Combos:** Grab a big flashing dot to turn the ghosts blue and eat them for bonus points (`200`, `400`, `800`, and `1600`).
* **Side Warp Tunnels:** Slip through the left and right edges of the screen to escape tight spots.
* **Pure Vanilla Code:** Everything runs on standard HTML, CSS, and JS without any external libraries.

---

## How to Play

* **Arrow Keys** (or **W, A, S, D**) — Move Pac-Man around the maze
* **Space / P** — Pause or restart *(delete this line if you didn't add it)*

---

## Running It on Your Computer

Since there are no dependencies or build steps, getting it running takes about ten seconds:

1. Download or clone this repo:
   ```bash
   git clone https://github.com
   ```
2. Open the folder and double-click `index.html` to launch the game in Chrome, Firefox, Edge, or Safari.

---

## Files in This Project

```text
├── index.html      # The game page and layout
├── style.css       # Arcade colors, board styling, and score UI
├── script.js       # Game loop, collision detection, and ghost logic
└── assets/         # Sprites and audio files (if you have them)
```

---

## Ideas I Want to Add Next

* [ ] Retro arcade sound effects and wakka-wakka audio
* [ ] Saving high scores in the browser using `localStorage`
* [ ] Swipe controls so it's playable on phones
* [ ] New maze layouts as you beat each level

---

## License

Feel free to fork, tweak, or learn from this code—it's open-source under the [MIT License](LICENSE).
