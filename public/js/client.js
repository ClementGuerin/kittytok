var socket = io();

socket.on('chat', function(data) {
    //console.log('chat', data);
    giveLife(data);
});

socket.on('follow', function(data) {
    //console.log('follow', data);
    createCat(data);
    
});

socket.on('share', function(data) {
    //console.log('share', data);
});

socket.on('like', function(data) {
    //console.log(data);
    giveLife(data);
});

socket.on('emote', function(data) {
    //console.log(data);
});

socket.on('member', function(data) {
    //console.log('member', data);
    if(data.followRole === 1) {
        createCat(data);
    }
});

// Game

const gameWindow = document.querySelector("#game");

function createCat(user) {
    // Cat
    let newCat = document.createElement("div");
    newCat.classList.add("cat");
    newCat.setAttribute("data-id", user.userId);
    newCat.setAttribute("data-nickname", user.nickname);
    newCat.setAttribute("data-sprite", "0");
    newCat.setAttribute("data-life", "100");
    newCat.style.left = (gameWindow.offsetWidth / 2) + "px";
    
    // Cat > Cat Skin
    let newCatSkin = document.createElement("div");
    newCatSkin.classList.add("cat-skin");
    newCatSkin.style.backgroundImage = 'url(/img/cat-sprites-' + randomNum(0,7) + '.png)';
    newCat.appendChild(newCatSkin);

    // Cat > Cat Avatar
    if(user.profilePictureUrl) {
        let newCatAvatar = document.createElement("img");
        newCatAvatar.src = user.profilePictureUrl;
        newCatAvatar.classList.add("cat-avatar");
        newCat.appendChild(newCatAvatar);
    }

    // Add Cat to Game Window
    gameWindow.appendChild(newCat);
};

function giveLife(user) {
    let cat = gameWindow.querySelector('.cat[data-id="' + user.userId + '"]');

    if(cat) {
        cat.setAttribute("data-life", "100");
    } else {
        createCat(user);
    }
}

// Loop Cats Movement & Life
setInterval(function(){
    const movementForce = randomNum(10,100);
    var allCats = document.querySelectorAll(".cat");

    for (let index = 0; index < allCats.length; index++) {
        const cat = allCats[index];
        const catSkin = cat.querySelector(".cat-skin");         
        const catPos = cat.offsetLeft + (cat.offsetWidth / 2);
        const newDirection = randomNum(0,1);

        // Move to direction
        switch (newDirection) {
            case 0:
                if(catPos > 0) {                        
                    cat.style.left = (cat.offsetLeft - movementForce) + "px";
                    catSkin.style.transform = "scaleX(1)";
                }
                break;
                
            case 1:
                if(catPos < gameWindow.offsetWidth) {
                    cat.style.left = (cat.offsetLeft + movementForce) + "px";
                    catSkin.style.transform = "scaleX(-1)";
                }
                break;
        }

        const catLife = parseInt(cat.getAttribute("data-life"));

        if(catLife <= 0) {
            cat.remove();
        } else {
            let greyCalc = (-catLife / 100) + 1;
            cat.style.filter = "grayscale(" + greyCalc + ")";
            cat.style.opacity = catLife / 100;

            cat.setAttribute("data-life", catLife - 3);
        }

    }

}, 3000);

// Loop Cats Sprites
setInterval(function(){
    var allCats = document.querySelectorAll(".cat");

    for (let index = 0; index < allCats.length; index++) {
        const cat = allCats[index];
        const catSkin = cat.querySelector(".cat-skin");

        // Change Cat Sprite
        switch (cat.getAttribute("data-sprite")) {
            case '0':
                catSkin.style.backgroundPositionX = "center";
                cat.setAttribute("data-sprite", 1);
                break;
            case '1':
                catSkin.style.backgroundPositionX = "right";
                cat.setAttribute("data-sprite", 2);
                break;
            case '2':
                catSkin.style.backgroundPositionX = "left";
                cat.setAttribute("data-sprite", 0);
                break;
        }
    }
}, 300);

// Help functions
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}