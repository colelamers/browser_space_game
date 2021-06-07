// space-game.js
// don't forget to validate at jslint.com

/*jslint devel: true, browser: true */
/*global window Audio*/

(function () {
    "use strict";

    const RIGHTARROW_KEYCODE = 68;
    const LEFTARROW_KEYCODE = 65;
    const UPARROW_KEYCODE = 87;
    const DOWNARROW_KEYCODE = 83;
    const ESCAPE_KEYCODE = 27;
    const BULLET_LEFT = 37;
    const BULLET_RIGHT = 39;
    const BULLET_UP = 38;
    const BULLET_DOWN = 40;
    //const SPACE_KEYCODE = 32;

    const winNotification = ("Congragulations! You won!");
    const addictNotification = ("You're playing too much!");

    let _left_key_down = false; //in game for multiple keys at once
    let _right_key_down = false;
    let _down_key_down = false;
    let _up_key_down = false;

    // spacegame global functions

    function byID(e) {
        return document.getElementById(e);
    }

/*
    function startUpMusic() {
        if (START_KEYCODE === false) {
            let gologo = new Audio("mp3/gologo.mp3");
            gologo.play();
            byID("universe").removeEventListener("keypress", startUpMusic);
        }
    }
*/
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // shortcut function to make code more readable


    function Ship(image_file) {

        let _left = getRandomInt(0, byID("gameboard").clientWidth);
        let _top = getRandomInt(0, byID("gameboard").clientHeight);
        let _width = 150;
        let _height = 78;
        let _img = document.createElement("img");

        let my = {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            img: _img
        };

        _img.src = image_file;

        my.left = function (value) {
            if (value === undefined) {
                return _left;
            }
            _left = value;

            return my;
        };

        my.top = function (value) {
            if (value === undefined) {
                return _top;
            }
            _top = value;

            return my;
        };

        my.width = function (value) {
            if (value === undefined) {
                return _width;
            }
            _width = value;

            return my;
        };

        my.height = function (value) {
            if (value === undefined) {
                return _height;
            }
            _height = value;

            return my;
        };

        my.img = function (value) {
            if (value === undefined) {
                return _img;
            }
            _img = value;

            return my;
        };

        my.boundaryCheck = function () {

            if (_left < 0) {
                _left = 0;
            }
            if (_top < 0) {
                _top = 0;
            }
            if (_left + _width > byID("gameboard").clientWidth) {
                _left = byID("gameboard").clientWidth - _width;
            }
            if (_top + _height > byID("gameboard").clientHeight) {
                _top = byID("gameboard").clientHeight - _height;
            }
        };

        my.navigate = function (keys, pressed) {

            switch (keys) {
            case RIGHTARROW_KEYCODE:
                _right_key_down = pressed;
                break;
            case LEFTARROW_KEYCODE:
                _left_key_down = pressed;
                break;
            case UPARROW_KEYCODE:
                _up_key_down = pressed;
                break;
            case DOWNARROW_KEYCODE:
                _down_key_down = pressed;
                break;
            }

            my.boundaryCheck();
        };

        my.moveShip = function (paused) {
            if (!paused) {
                if (_right_key_down) {
                    _left += 5;
                }
                if (_left_key_down) {
                    _left -= 5;
                }
                if (_up_key_down) {
                    _top -= 5;
                }
                if (_down_key_down) {
                    _top += 5;
                }
            }
            my.boundaryCheck();
        };

        my.moveRandom = function (paused) {
            if (!paused) {
                let left_rnd = Boolean(getRandomInt(0, 2));
                let top_rnd = Boolean(getRandomInt(0, 2));
                if (left_rnd) {
                    _left -= getRandomInt(1, 10);
                } else {
                    _left += getRandomInt(1, 10);
                }
                if (top_rnd) {
                    _top -= getRandomInt(1, 10);
                } else {
                    _top += getRandomInt(1, 10);
                }
            }
            my.boundaryCheck();
        };

        return my;
    }

    function Bullet(image_file) {

        let _left = 0;
        let _top = 0;
        let _width = 36;
        let _height = 36;
        let _img = document.createElement("img");
        let _visible = false;
        let _direction = "";

        let my = {
            left: _left,
            top: _top,
            width: _width,
            height: _height,
            img: _img,
            visible: _visible,
            direction: _direction
        };

        _img.src = image_file;

        my.left = function (value) {
            if (value === undefined) {
                return _left;
            }
            _left = value;

            return my;
        };

        my.top = function (value) {
            if (value === undefined) {
                return _top;
            }
            _top = value;

            return my;
        };

        my.width = function (value) {
            if (value === undefined) {
                return _width;
            }
            _width = value;

            return my;
        };

        my.height = function (value) {
            if (value === undefined) {
                return _height;
            }
            _height = value;

            return my;
        };

        my.img = function (value) {
            if (value === undefined) {
                return _img;
            }
            _img = value;

            return my;
        };

        my.visible = function (value) {
            if (value === undefined) {
                return _visible;
            }
            _visible = value;

            return my;
        };

        my.direction = function (value) {
            if (value === undefined) {
                return _direction;
            }
            _direction = value;

            return my;
        };

        my.boundaryCheck = function () {

            if (_left < 0) {
                _left = 0;
                _visible = false;
            }
            if (_top < 0) {
                _top = 0;
                _visible = false;
            }
            if (_left + _width > byID("gameboard").clientWidth) {
                _left = byID("gameboard").clientWidth - _width;
                _visible = false;
            }
            if (_top + _height > byID("gameboard").clientHeight) {
                _top = byID("gameboard").clientHeight - _height;
                _visible = false;
            }
        };

        /*
        my.setDirection = function (x1, y1, x2, y2) {
            let _deltax = x2 - x1;
            let _deltay = y2 - y1;
            let _absdx = Math.abs(_deltax);
            let _absdy = Math.abs(_deltay);

            if (_absdy > _absdx) {
                if (_deltay > 0) {
                    _direction = "down";
                } else {
                    _direction = "up";
                }
            } else {
                if (_deltax > 0) {
                    _direction = "right";
                } else {
                    _direction = "left";
                }
            }
        };

        */

        //Allows you to shoot in any direction
        my.bulletDirection = function (x1, y1, x2, y2) {
            let _deltax = x2 - x1;
            let _deltay = y2 - y1;
            let _absdx = Math.abs(_deltax);
            let _absdy = Math.abs(_deltay);

            if (_absdy > _absdx) {
                if (_deltay > 0) {
                    _direction = "down";
                } else {
                    _direction = "up";
                }
            } else {
                if (_deltax > 0) {
                    _direction = "right";
                } else {
                    _direction = "left";
                }
            }
        };

        my.setDirection = function (keys) {

            let bulDirection = keys;

            if (bulDirection === BULLET_DOWN) {
                _direction = "down";
            } else if (bulDirection === BULLET_UP) {
                _direction = "up";
            } else if (bulDirection === BULLET_RIGHT) {
                _direction = "right";
            } else if (bulDirection === BULLET_LEFT) {
                _direction = "left";
            }
        };

        my.shoot = function (
            keys,
            player_left,
            player_top
        ) {

            //Bug in firefox, music stops playing if builet is shot
            //while music is still playing
            let audio = new Audio("mp3/gologo2.mp3");

            if (keys === BULLET_UP) {
                if (!_visible) {
                    _visible = true;
                    audio.play();
                    _left = player_left;
                    _top = player_top;
                    my.setDirection(
                        keys
                    );
                }
            } else if (keys === BULLET_LEFT) {
                if (!_visible) {
                    _visible = true;
                    audio.play();
                    _left = player_left;
                    _top = player_top;
                    my.setDirection(
                        keys
                    );
                }
            }

            if (keys === BULLET_DOWN) {
                if (!_visible) {
                    _visible = true;
                    audio.play();
                    _left = player_left;
                    _top = player_top;
                    my.setDirection(
                        keys
                    );
                }
            }

            if (keys === BULLET_RIGHT) {
                if (!_visible) {
                    _visible = true;
                    audio.play();
                    _left = player_left;
                    _top = player_top;
                    my.setDirection(
                        keys
                    );
                }
            }
            my.boundaryCheck();
        };

        my.move = function (paused) {
            let _rate = 2;
            if (!paused) {
                if (_visible) {
                    switch (_direction) {
                    case "left":
                        _left -= _rate;
                        break;
                    case "right":
                        _left += _rate;
                        break;
                    case "up":
                        _top -= _rate;
                        break;
                    case "down":
                        _top += _rate;
                        break;
                    default:
                        _left += _rate;
                    }
                }
            }
            my.boundaryCheck();
        };

        return my;
    }

    // Constructor for Game object
    function Game() {

        // total points
        let _total_points = 0;

        // is the game paused?
        let _game_paused = false;

        // player ship
        let _player_ship = new Ship("images/player.png");

        // enemy ship
        let _enemy_ship = new Ship("images/enemy.png");
        let _enemy_ship2 = new Ship("images/enemy.png");

        let _bullet = new Bullet("images/bullet.png");

        let my = {
            total_points: _total_points,
            game_paused: _game_paused,
            player_ship: _player_ship,
            enemy_ship: _enemy_ship,
            enemy_ship2: _enemy_ship2,
            bullet: _bullet
        };

        my.total_points = function (value) {
            if (value === undefined) {
                return _total_points;
            }
            _total_points = value;

            return my;
        };

        my.game_paused = function (value) {
            if (value === undefined) {
                return _game_paused;
            }
            _game_paused = value;

            return my;
        };

        my.player_ship = function (value) {
            if (value === undefined) {
                return _player_ship;
            }
            _player_ship = value;

            return my;
        };

        my.enemy_ship = function (value) {
            if (value === undefined) {
                return _enemy_ship;
            }
            _enemy_ship = value;

            return my;
        };

        my.enemy_ship2 = function (value) {
            if (value === undefined) {
                return _enemy_ship2;
            }
            _enemy_ship2 = value;

            return my;
        };

        my.bullet = function (value) {
            if (value === undefined) {
                return _bullet;
            }
            _bullet = value;

            return my;
        };

        // METHODS

        // display total points
        my.displayPoints = function () {
            gcontext.clearRect(0, 0, 250, 150);
            gcontext.fillStyle = "#ffffff";
            gcontext.fillRect(0, 0, 250, 150);
            gcontext.font = "30px Arial";
            gcontext.fillStyle = "#000000";
            gcontext.fillText("Score: " + _total_points, 10, 50);
        };


        my.moveBackground = function () {
            if (!_game_paused) {
                let bg = byID("universe");
                let bg_cs = window.getComputedStyle(bg);
                let raw_x = bg_cs.getPropertyValue("background-position-x");
                let raw_y = bg_cs.getPropertyValue("background-position-y");
                let current_x = parseInt(raw_x, 10);
                let current_y = parseInt(raw_y, 10);
                let new_x = current_x - 1;
                let new_y = current_y;
                let newpos = new_x + "px " + new_y + "px";
                byID("universe").style.backgroundPosition = newpos;
            }
        };

        my.clearObjects = function () {
            //remove ships from canvas
            gcontext.clearRect(
                _player_ship.left(),
                _player_ship.top(),
                _player_ship.width(),
                _player_ship.height()
            );

            gcontext.clearRect(
                _enemy_ship.left(),
                _enemy_ship.top(),
                _enemy_ship.width(),
                _enemy_ship.height()
            );

            gcontext.clearRect(
                _enemy_ship2.left(),
                _enemy_ship2.top(),
                _enemy_ship2.width(),
                _enemy_ship2.height()
            );

            if (_bullet.visible()) {
                gcontext.clearRect(
                    _bullet.left(),
                    _bullet.top(),
                    _bullet.width(),
                    _bullet.height()
                );
            }
        };

        my.drawObjects = function () {
            //redraw player ship and enemy ship on canvas
            gcontext.drawImage(
                _player_ship.img(),
                _player_ship.left(),
                _player_ship.top()
            );

            gcontext.drawImage(
                _enemy_ship.img(),
                _enemy_ship.left(),
                _enemy_ship.top()
            );

            gcontext.drawImage(
                _enemy_ship2.img(),
                _enemy_ship2.left(),
                _enemy_ship2.top()
            );

            if (_bullet.visible()) {
                gcontext.drawImage(
                    _bullet.img(),
                    _bullet.left(),
                    _bullet.top()
                );
            }
        };

        my.checkKeys = function () {

            document.addEventListener("keydown", function (key_event) {
                if (key_event.which === ESCAPE_KEYCODE) {
                    if (_game_paused) {
                        _game_paused = false;
                        byID("pause").classList.add("hidden");
                    } else {
                        _game_paused = true;
                        byID("pause").classList.remove("hidden");
                    }
                } else if (!_game_paused) {
                    my.clearObjects();

                    //update player ship position based on keys
                    _player_ship.navigate(key_event.which, true);
                    _bullet.shoot(
                        key_event.which,
                        _player_ship.left(),
                        _player_ship.top(),
                        _enemy_ship.left(),
                        _enemy_ship.top()
                    );

                    my.displayPoints();
                    my.drawObjects();
                }
            });
        };
        my.releaseKeys = function () {
            document.addEventListener("keyup", function (key_event) {
                if (!_game_paused) {
                    my.clearObjects();

                    //update player ship position based on keys
                    _player_ship.navigate(key_event.which, false);

                    my.displayPoints();
                    my.drawObjects();
                }
            });
        };

        my.checkResize = function () {
            window.addEventListener("resize", function () {
                let u_width = byID("universe").clientWidth;
                gcontext.canvas.width = u_width;
                let u_height = byID("universe").clientHeight;
                gcontext.canvas.height = u_height;
                _player_ship.boundaryCheck();
                _enemy_ship.boundaryCheck();
                _enemy_ship2.boundaryCheck();
                _bullet.boundaryCheck();
            });
        };

        my.collisions = function (shipNumber) {
            if (!_game_paused && _bullet.visible()) {
                let bl = _bullet.left();
                let bw = _bullet.width();
                let bt = _bullet.top();
                let bh = _bullet.height();

                let el = _enemy_ship.left();
                let ew = _enemy_ship.width();
                let et = _enemy_ship.top();
                let eh = _enemy_ship.height();

                if (shipNumber === 2) {
                    el = _enemy_ship2.left();
                    ew = _enemy_ship2.width();
                    et = _enemy_ship2.top();
                    eh = _enemy_ship2.height();
                }

                if (
                    (
                        (bl + bw < el) || (bl > el + ew)
                    ) ||
                    (
                        (bt + bh < et) || (bt > et + eh)
                    )
                ) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };

        my.play = function () {
            my.clearObjects();
            _player_ship.moveShip(_game_paused);
            _enemy_ship.moveRandom(_game_paused);
            _enemy_ship2.moveRandom(_game_paused);
            _bullet.move(_game_paused);
            my.displayPoints();
            my.drawObjects();
            if (my.collisions(1) || my.collisions(2)) {
                _total_points += 1;
                my.displayPoints();
                if (_total_points >= 100 && _total_points < 101) {
                    alert(winNotification);
                } else if (_total_points >= 500 && _total_points < 501) {
                    alert(addictNotification);
                }
            }
        };

        return my;
    }

    function popUp() {
        let winner = ("");
        alert(winner);
    }


    byID("universe").addEventListener("keypress", popUp);

    // spacegame global gameboard canvas context letiable
    let gcontext = byID("gameboard").getContext("2d");

    // gameboard canvas
    let u_width = byID("universe").clientWidth;
    gcontext.canvas.width = u_width;
    let u_height = byID("universe").clientHeight;
    gcontext.canvas.height = u_height;

    let game = new Game();

    game.checkResize();
    game.checkKeys();
    game.releaseKeys();
    setInterval(game.moveBackground, 10);
    setInterval(game.play, 1);
}());
