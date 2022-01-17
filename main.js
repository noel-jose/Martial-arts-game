let c = document.getElementById("mycanvas");
if (window.innerWidth < 500) c.width = "300px";
let ctx = c.getContext("2d");

let loadImage = (src, callback) => {
    let img = document.createElement("img");
    img.onload = () => callback(img);
    img.src = src;
};

let imagePath = (frameNumber, animation) => {
    return `./images/${animation}/${frameNumber}.png`;
};

frames = {
    idle: [1, 2, 3, 4, 5, 6, 7, 8],
    kick: [1, 2, 3, 4, 5, 6, 7],
    punch: [1, 2, 3, 4, 5, 6, 7],
    backward: [1, 2, 3, 4, 5, 6],
    block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    forward: [1, 2, 3, 4, 5, 6],
};

let loadImages = (callback) => {
    let images = {
        idle: [],
        kick: [],
        punch: [],
        backward: [],
        block: [],
        forward: [],
    };
    let imagesToLoad = 0;
    //callbacks with an array of the loaded images
    ["idle", "kick", "punch", "forward", "block", "backward"].forEach(
        (animation) => {
            let animatedFrames = frames[animation];
            imagesToLoad = imagesToLoad + animatedFrames.length;

            animatedFrames.forEach((frameNumber) => {
                let path = imagePath(frameNumber, animation);
                loadImage(path, (image) => {
                    images[animation][frameNumber - 1] = image;
                    imagesToLoad = imagesToLoad - 1;

                    if (imagesToLoad === 0) {
                        callback(images);
                    }
                });
            });
        }
    );
};

let animate = (ctx, images, animation, callback) => {
    images[animation].forEach((image, index) => {
        setTimeout(() => {
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(image, 0, 0, 500, 500);
        }, index * 100);
    });
    setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
    let animationQueue = [];
    let aux = () => {
        let selectedAnimation = "";
        if (animationQueue.length === 0) selectedAnimation = "idle";
        else selectedAnimation = animationQueue.shift();
        animate(ctx, images, selectedAnimation, aux);
    };

    aux();
    document.getElementById("kick").addEventListener("click", () => {
        animationQueue.push("kick");
    });

    document.getElementById("punch").addEventListener("click", () => {
        animationQueue.push("punch");
    });

    document.getElementById("forward").addEventListener("click", () => {
        animationQueue.push("forward");
    });

    document.getElementById("backward").addEventListener("click", () => {
        animationQueue.push("backward");
    });

    document.getElementById("block").addEventListener("click", () => {
        animationQueue.push("block");
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight")
            // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
            animationQueue.push("forward");
        if (event.key === "ArrowLeft") animationQueue.push("backward");
        if (event.key === "ArrowUp") animationQueue.push("punch");
        if (event.key === "ArrowDown") animationQueue.push("kick");
        if (event.code === "Space") animationQueue.push("block");
    });
});

alert(
    "Instructions \nRight arrow key - forward\nLeft arrow key - backward\nUp arrow key - punch\nDown arrow key - kick\nSpace - block"
);
