**ABOUT:**

Simple online multiplayer io game that you can play on a browser.<br />
Uses nodejs, express, socket.io and typescript.<br />

**HOW TO RUN:**

First make sure you have Node.js and npm installed.<br />
Download the entire iogame depot.<br />
On your terminal navigate to your iogame folder and run this command to build and install any dependencies:<br />
`npm install`<br />
Then navigate to /builds and run this command to start the server:<br />
`node app.js`<br />

The game is served on port 3000.<br />
If you're running on your local machine then just open a tab in your browser and type:<br />
localhost:2000<br />

If you have this game running on a server than just go to ipAddress:2000 <br />

**GAME INPUTS & RULES:**

wasd keys move your character around.<br />
arrow keys shoot bullets.<br />
keys 1-4 change weapon type.<br />

Colorful squares are players.<br />
Smaller colorful squares are bullets.<br />
Black square are obstacles (rocks) that players & bullets can't go through.<br />

- Each player starts with 11 hp.
- Each time a player shoots a bullet he/she loses hp (the weapon bullet cost).
- You can shoot as many bullets as long as you have hp to do so. You can not shoot at hp 1.
- Bullets will bounce off rocks, but will hit other bullets and players.
- When a bullet hits another bullet they cancel each other out and return their hp cost back to their respective owners.
- If a bullet hits its owner then it just returns its hp cost back to the owner.
- If a bullet hits an enemy then it will cause the enemy some damage AND return its hp cost back to its owner.
- If your bullet kills an enemy then you level up.
- Each time you level up you increase 1 hp point and becomes larger.
- If a player touches another player then they both die!

**WEAPONS:**

You can switch weapons by pressing keys 1, 2, 3 and 4.

- 1 default bullet: cost/damage 1hp, speed: 2, size:10, duration: until hits something.
- 2 big bullet: cost/damage 3hp, speed: 1, size:20, duration: until hits something.
- 3 drop bullet: cost/damage 5hp, speed: 0, size:5, duration: until hits something.
- 4 knife bullet: cost/damage 10hp, speed: 1, size:10, duration: 1second.
