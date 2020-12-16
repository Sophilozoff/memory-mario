
var app = {
    init: function () {
        app.game_container = document.getElementById("gameContainer");
        app.game_info = document.getElementById("info");
        app.page = document.getElementById("opacity");
        app.timer_launched = false;
        app.click_allowed = true;
        app.card_position = [];
        app.click_counter = 1;
        app.timer_counter = 1;
        app.remaining_pair = 14;
        app.generateCards();
        app.generateBoard();
    },
    generateCards: function () {
        app.card_position = app.shuffle([100, 100, 200, 200, 300, 300, 400, 400, 500, 500, 600, 600, 700, 700, 800, 800, 900, 900, 1000, 1000, 1100, 1100, 1200, 1200, 1300, 1300, 1400, 1400]);
    },
    // generateScoreTable: function() {
    //     //création du tableau des scores
    //     let scoreTable = document.createElement('div');
    //     scoreTable.className = "scoreTable";
    //     app.game_container.appendChild(scoreTable);

    //     //
    //     let score = document.createElement('div');
    // },
    generateBoard: function () {
        for (let cell_number = 0; cell_number < 28; cell_number++) {
            app.createCell(cell_number);
        }
        let timer = document.createElement('div');
        timer.className = "timer"
        app.page.appendChild(timer)
        app.inner_timer = document.createElement('div');
        app.inner_timer.className = "inner_timer"
        timer.appendChild(app.inner_timer)
    },
    createCell: function (number) {

        // creation du parent de la carte
        let cell_parent = document.createElement('div')
        cell_parent.className = "card";
        cell_parent.id = number;
        app.game_container.appendChild(cell_parent);

        // creation de l'enfant partie visible avec le fruit
        let cell_son_picture = document.createElement('div');
        cell_son_picture.className = "card_child image hidden";
        cell_son_picture.style.backgroundPositionY = app.card_position[number] + "px"
        cell_parent.appendChild(cell_son_picture);

        // creation de l'enfant partie non visible avec le fruit
        let cell_son_back = document.createElement('div')
        cell_son_back.className = "card_child back";
        cell_parent.appendChild(cell_son_back);

        cell_parent.addEventListener('click', app.handle_click)
    },
    handle_click: function (event_obj) {

        // je récupère les éléments sur lesquels j'ai cliqué
        let cell_parent = event_obj.target.parentElement;
        let cell_son_picture = cell_parent.children[0];
        let cell_son_back = cell_parent.children[1];

        // je test si la carte est retourné
        let card_hidden = cell_son_picture.className.includes('hidden');

        // si j'ai le droit de cliquer + carte bien cachée
        if (app.click_allowed && card_hidden) {

            cell_son_picture.classList.toggle("hidden")
            cell_son_back.classList.toggle("hidden")

            // premier click
            if (app.click_counter == 1) {
                if (!app.timer_launched) {
                    app.timer_launched = true;
                    app.launch_timer();
                }
                app.first_card = cell_son_picture
                app.click_counter++;

                // deuxième click
            } else if (app.click_counter == 2) {
                app.second_card = cell_son_picture

                let same_card = app.second_card.style.backgroundPositionY === app.first_card.style.backgroundPositionY;

                if (same_card) {
                    app.remaining_pair--;
                    if (app.remaining_pair === 0) {
                        app.win();
                    }
                    app.click_allowed = true;
                    app.click_counter = 1;
                } else {
                    app.click_allowed = false;
                    setTimeout(function () {
                        app.second_card.classList.toggle("hidden")
                        app.first_card.classList.toggle("hidden")
                        app.second_card.parentElement.children[1].classList.toggle("hidden")
                        app.first_card.parentElement.children[1].classList.toggle("hidden")
                        app.click_allowed = true;
                        app.click_counter = 1;
                    }, 1000);
                }
            }
        } else {
            // rien
        }
    },
    win: function () {
        app.game_info.innerHTML = '<button onClick="window.location.reload();" class="winButton" type="button">REJOUER</button>';
        app.gameOver= true;
        app.click_allowed = false;
        app.timer_counter = 99;
    },
    over: function(){
        app.game_info.innerHTML = '<button onClick="window.location.reload();" class="refreshButton" type="button">ESSAYE ENCORE !</button>';
        app.gameOver= true;
        app.click_allowed = false;
    },
    launch_timer: function () {
        let timer = setInterval(() => {
            if (app.timer_counter <= 99){
                app.inner_timer.style.width = app.timer_counter + '%'
                app.timer_counter++;
            }else{
                if(!app.gameOver){
                    app.over();
                }
                clearInterval(timer);
            }
        }, 1000);
    },

    ////////////////////// UTILS

    shuffle: function (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },
}


document.addEventListener("DOMContentLoaded", app.init)