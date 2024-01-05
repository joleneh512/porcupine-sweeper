var board = []; 
var rows = 8; 
var columns = 8; 

var porcupines_count = 8; 
var porcupines_location = []; // "2-2" "3-4" etc

var tiles_clicked = 0; 
var search_enabled = false; 

var game_over = false; 

window.onload = function() {
    start_game(); 
}


function set_mines() {
    let porcupines_left = porcupines_count; 
    while (porcupines_left > 0) {
        let r = Math.floor(Math.random() * rows); 
        let c = Math.floor(Math.random() * columns); 
        let id = r.toString() + "-" + c.toString(); 

        if (!porcupines_location.includes(id)) {
            porcupines_location.push(id); 
            porcupines_left -= 1; 
        }
        
    }
}


function start_game() {
    document.getElementById("porcupines-count").innerText = porcupines_count; 
    document.getElementById("search-button").addEventListener("click", set_search);
    set_mines(); 

    for (let r = 0; r < rows; r++) {
        let row = []; 
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", click_tile); 
            document.getElementById("board").append(tile); 
            row.push(tile); 
        }
        board.push(row); 
    }
    console.log(board); 
}


function set_search() {
    if (search_enabled) {
        search_enabled = false; 
        document.getElementById("search-button").style.backgroundColor = "#d1ded1"; 
    }
    else {
        search_enabled = true; 
        document.getElementById("search-button").style.backgroundColor = "#8e8e8e"; 
    }

}


function click_tile() {
    if (game_over) {
        reveal_porcupines(); 
    }
    else if (this.classList.contains("tile-clicked")) {
        return; 
    }

    let tile = this; 
    if (search_enabled) {
        if (tile.innerText == "") {
            tile.innerText = "🔍"; 
        }
        else if (tile.innerText == "🔍") {
            tile.innerText = ""; 
        }
        return; 
    }

    if (porcupines_location.includes(tile.id)) {
        alert("GAME OVER"); 
        game_over = true; 
        reveal_porcupines(); 
        return; 
    }

    let coords = tile.id.split("-"); // "0-0" -> ["0", "0"]
    let r = parseInt(coords[0]); 
    let c = parseInt(coords[1]); 
    check_porcupine(r, c); 

}


function reveal_porcupines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c]; 
            if (porcupines_location.includes(tile.id)) {
                tile.innerText = "🦔"; 
                tile.style.backgroundColor = "yellow"; 
            }
        }
    }
}


function check_porcupine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return; 
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked"); 
    tiles_clicked += 1; 

    let porcupines_found = 0; 

    // checking the 3 boxes on top
    porcupines_found += check_tile(r - 1, c - 1); // top left
    porcupines_found += check_tile(r - 1, c); // top middle
    porcupines_found += check_tile(r - 1, c + 1); // top right

    // checking left and right
    porcupines_found += check_tile(r, c - 1); // left
    porcupines_found += check_tile(r, c + 1); // right

    // checking the 3 boxes on bottom
    porcupines_found += check_tile(r + 1, c - 1); // bottom left
    porcupines_found += check_tile(r + 1, c); // bottom middle
    porcupines_found += check_tile(r + 1, c + 1); // bottom right

    if (porcupines_found > 0) {
        if (porcupines_found == 1) {
            board[r][c].innerText = "🌱";
        }
        else if (porcupines_found == 2) {
            board[r][c].innerText = "🌰";
        }
        else if (porcupines_found == 3) {
            board[r][c].innerText = "🥬";
        }
        else if (porcupines_found == 4) {
            board[r][c].innerText = "🥜";
        }
        else if (porcupines_found == 5) {
            board[r][c].innerText = "🫘";
        }
        else if (porcupines_found == 6) {
            board[r][c].innerText = "🫐";
        }
        else if (porcupines_found == 7) {
            board[r][c].innerText = "🍠";
        }
        else if (porcupines_found == 8) {
            board[r][c].innerText = "🎍";
        }
    }
    else {
        // check top tiles
        check_porcupine(r - 1, c -1); // top left
        check_porcupine(r - 1, c) // top middle
        check_porcupine(r - 1, c + 1) // top right

        // check left and right
        check_porcupine(r, c - 1) // left
        check_porcupine(r, c + 1) // right

        // check bottom tiles
        check_porcupine(r + 1, c -1); // bottom left
        check_porcupine(r + 1, c) // bottom middle
        check_porcupine(r + 1, c + 1) // bottom right
    }

    if (tiles_clicked == rows * columns - porcupines_count) {
        document.getElementById("porcupines-count").innerText = "FOUND 🦔🦔🦔"; 
        game_over = true; 
    }
}

function check_tile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0; 
    }
    if (porcupines_location.includes(r.toString() + "-" + c.toString())) {
        return 1; 
    }
    return 0; 
}
