document.addEventListener('DOMContentLoaded', () =>{

    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const smileyFace = document.querySelector('#smiley')
    const width = 10;
    const height = 10;

    let bombCount = 15;
    let flagCount = 0;
    let tiles = []
    let isGameOver = false;
    let time = 0;

    //Create board
    function createBoard() {
        flagsLeft.innerHTML = pad(bombCount,3);
        smileyFace.src = "images/neutral.png"

        //get shuffled game array with random bombs
        const bombArray = Array(bombCount).fill('bomb');
        const emptyArray = Array(width * height - bombCount).fill('empty');
        const gameArray = emptyArray.concat(bombArray)
        const shuffledArray = gameArray.sort(() => (Math.random() > .5) ? 1 : -1)

        for (let i = 0; i < width*height; i++){
            const tile = document.createElement('div');
            tile.id = i.toString();
            tile.classList.add(shuffledArray[i]);
            grid.appendChild(tile);
            tiles.push(tile);

            //click event
            tile.addEventListener('click', () => {
                click(tile)
            })

            //right click event
            tile.addEventListener('contextmenu', () => {
                addFlag(tile)
            })
        }
        //add numbers
        for (let i = 0; i < tiles.length;i++) {
            let count = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1)

            if (tiles[i].classList.contains('empty') ) {
                //left
                if (i > 0 && !isLeftEdge && tiles[i - 1].classList.contains('bomb')) count++;
                //right
                if (i > 0 && !isRightEdge && tiles[i + 1].classList.contains('bomb')) count++;
                //above
                if (i >= width && tiles[i - width].classList.contains('bomb')) count ++;
                //above left
                if (i >= width && !isLeftEdge && tiles[i - 1 - width].classList.contains('bomb')) count++;
                //above right
                if (i >= width && !isRightEdge && tiles[i + 1 - width].classList.contains('bomb')) count++;
                //below
                if (i < (width * height) - width && tiles[i + width].classList.contains('bomb')) count ++;
                //below left
                if (i < (width * height) - width && !isLeftEdge && tiles[i + width - 1].classList.contains('bomb')) count ++;
                //below right
                if (i < (width * height) - width && !isRightEdge && tiles[i + width + 1].classList.contains('bomb')) count ++;

                let ccolor = "rbg(0,0,0)"
                if (count === 1) ccolor = "#0101F7"
                else if (count === 2) ccolor = "#007E01"
                else if (count === 3) ccolor = "#FE0101"
                else if (count === 4) ccolor = "#010080"
                else if (count === 5) ccolor = "#830203"
                else if (count === 6) ccolor = "#00807F"
                else if (count === 7) ccolor = "#000000"
                else if (count === 8) ccolor = "#808080"


                tiles[i].setAttribute('data', count)
                tiles[i].style.color = ccolor;
            }
        }
    }


    createBoard();
    const timeTimeout = setInterval(updateTime, 1000)

    function updateTime() {
        const timer = document.querySelector("#timer");
        timer.innerHTML = pad(time, 3);
        console.log(time)
        time++;
    }

    //add flag with right click
    function addFlag(tile) {
        if (isGameOver) return;
        if (!tile.classList.contains('checked') && flagCount < bombCount) {
            if (!tile.classList.contains('flag')) {
                tile.classList.add('flag');
                flagCount++;
                const img = new Image()
                img.src = "images/flag.png"
                tile.appendChild(img)
                flagsLeft.innerHTML = pad((bombCount - flagCount),3)
                checkWin()
            }
            else {
                tile.classList.remove('flag');
                flagCount--;
                tile.innerHTML = '';
                flagsLeft.innerHTML = pad((bombCount - flagCount),3)
            }

        }
        else {
            tile.classList.remove('flag');
            flagCount--;
            tile.innerHTML = '';
            flagsLeft.innerHTML = pad((bombCount - flagCount),3)

        }

    }

    function click(tile) {
        if (isGameOver) return;
        if(tile.classList.contains('checked') || tile.classList.contains('flag')) return;

        if (tile.classList.contains('bomb')) {
            endGame();
        } else {
            let total = tile.getAttribute('data')
            if (total != 0) {
                tile.classList.add('checked')
                tile.innerHTML = total
                return
            }
            checkSquare(tile)
        }
        tile.classList.add('checked')
    }

    //check target tile and its neighbors
    function checkSquare(tile) {
        const currentId = parseInt(tile.id)
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(function () {

            //left
            if (currentId > 0 && !isLeftEdge) {
                const newId = tiles[currentId - 1].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //right
            if (currentId > 0 && !isRightEdge) {
                const newId = tiles[currentId + 1].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //above
            if (currentId >= width) {
                const newId = tiles[currentId - width].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //above left
            if (currentId >= width && !isLeftEdge) {
                const newId = tiles[currentId - 1 - width].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //above right
            if (currentId >= width && !isRightEdge) {
                const newId = tiles[currentId + 1 - width].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //below
            if (currentId < (width * height) - width) {
                const newId = tiles[currentId + width].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //below left
            if (currentId < (width * height) - width && !isLeftEdge) {
                const newId = tiles[currentId + width - 1].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
            //below right
            if (currentId < (width * height) - width && !isRightEdge) {
                const newId = tiles[currentId + width + 1].id
                const newTile = document.getElementById(newId)
                click(newTile)
            }
        }, 10)
    }

    function endGame() {
        //result.innerHTML = 'Game Over!'
        isGameOver = true;
        clearInterval(timeTimeout)
        //show all the bombs
        tiles.forEach(function (tile) {
            if (tile.classList.contains('bomb')){
                const img = new Image();
                img.src = "images/bomb.png";
                tile.innerHTML = "";
                tile.appendChild(img);
                tile.classList.remove('bomb');
                tile.classList.add('checked-bomb');
                smileyFace.src = "images/dead.png"
            }
        })
    }

    function checkWin() {
        let matches = 0;

        for (let i = 0; i < tiles.length; i++) {
            if (tiles[i].classList.contains('flag') && tiles[i].classList.contains('bomb')){
                matches++;
            }
        }
        if (matches === bombCount){
            console.log("you win")
            smileyFace.src = "images/win.png"
            clearInterval(timeTimeout)
        }

    }

    function pad(num, size) {
        const s = "000000000" + num;
        return s.substring(s.length-size);
    }
})