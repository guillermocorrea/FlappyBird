/**
 * Created by LuisGuillermo on 5/1/2015.
 */
(function () {
    var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

    // Create our 'main' state that will contain the game
    var mainState = {
        /**
         * This function will be executed at the beginning.
         * That's where we load the game's assets.
         */
        preload: function() {
            // Change the background color of the game
            game.stage.backgroundColor = '#71c5cf';
            // Load the bird sprite
            game.load.image('bird', 'assets/bird.png');
            // Load the pipe sprite
            game.load.image('pipe', 'assets/pipe.png');
            // Load the jump sound
            game.load.audio('jump', 'assets/jump.wav');
        },

        /**
         * This function is called after the preload function.
         * Here we set up the game, display sprites, etc.
         */
        create: function() {
            // Set the physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            // Display the bird on the screen
            this.bird = this.game.add.sprite(100, 245, 'bird');

            // Add gravity to the bird to make it fall
            game.physics.arcade.enable(this.bird);
            this.bird.body.gravity.y = 1000;

            // Call the 'jump' function when the spacekey is hit
            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);

            // Setup the pipes
            this.pipes = game.add.group(); // Create a group
            this.pipes.enableBody = true;  // Add physics to the group
            this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes

            this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

            // Score handling
            this.score = 0;
            this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

            // Change the center of the bird
            this.bird.anchor.setTo(-0.2, 0.5);

            // Add the jump sound to the game
            this.jumpSound = game.add.audio('jump');
        },

        /**
         * This function is called 60 times per second.
         * It contains the game's logic.
         */
        update: function() {
            // If the bird is out of the world (too high or too low), call the 'restartGame' function
            if (this.bird.inWorld == false)
                this.restartGame();

            // Collision detection
            game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

            if (this.bird.angle < 20)
                this.bird.angle += 1;
        },

        /**
         * Dead animation when the bird hit the pipe
         */
        hitPipe: function() {
            // If the bird has already hit a pipe, we have nothing to do
            if (this.bird.alive == false)
                return;

            // Set the alive property of the bird to false
            this.bird.alive = false;

            // Prevent new pipes from appearing
            game.time.events.remove(this.timer);

            // Go through all the pipes, and stop their movement
            this.pipes.forEachAlive(function(p){
                p.body.velocity.x = 0;
            }, this);
        },

        /**
         * Make the bird jump
         */
        jump: function() {
            if (this.bird.alive == false) {
                return;
            }

            // Play the jump sound
            this.jumpSound.play();

            // Add a vertical velocity to the bird
            this.bird.body.velocity.y = -350;

            // Create an animation on the bird
            game.add.tween(this.bird).to({angle: -20}, 100).start();
        },

        /**
         * Restart the game
         */
        restartGame: function() {
            // Start the 'main' state, which restarts the game
            game.state.start('main');
        },

        /**
         * Add one pipe to the scene
         * @param x
         * @param y
         */
        addOnePipe: function(x, y) {
            // Get the first dead pipe of our group
            var pipe = this.pipes.getFirstDead();

            // Set the new position of the pipe
            pipe.reset(x, y);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -200;

            // Kill the pipe when it's no longer visible
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;
        },

        /**
         * Add row of 6 pipes
         */
        addRowOfPipes: function() {
            // Pick where the hole will be
            var hole = Math.floor(Math.random() * 5) + 1;

            // Add the 6 pipes
            for (var i = 0; i < 8; i++)
                if (i != hole && i != hole + 1)
                    this.addOnePipe(400, i * 60 + 10);

            // Update score
            this.score += 1;
            this.labelScore.text = this.score;
        }
    };

    // Add and start the 'main' state to start the game
    game.state.add('main', mainState);
    game.state.start('main');
})();