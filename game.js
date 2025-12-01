window.onload = function() {
    var config = {
        width: 1200,
        height: 960,
        backgroundColor: 'rgba(214, 214, 214, 0.2)',
        physics: {
            default: 'arcade',
            arcade: { debug: false }
        },
        scene: [Scene1],
    };

    var game = new Phaser.Game(config);
}
