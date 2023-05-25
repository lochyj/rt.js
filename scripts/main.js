import zoom from './zoom.js'

var app = new PIXI.Application({
    resolution: 1,
    autoDensity: true,
    antialias: false,
    backgroundColor: 0x0A0A0A
});

var view = document.getElementById("app")

view.appendChild(app.view);

var container = new PIXI.Container();
const zoomHandler = new zoom(container, app);

app.stage.addChild(container);

function init3DMatrix(width, height, depth) {
    return Array(width).fill().map(() => Array(height).fill().map(() => Array(depth).fill(0)));
}

function set3DMatrix(matrix, x, y, z, value) {
    matrix[x][y][z] = value;
}

function get3DMatrix(matrix, x, y, z) {
    return matrix[x][y][z];
}

function ray(matrix, x, y) {
    // also get the depth of 1 in the row and column
    var Zdepth = 0;

    for (var z = 0; z < depth; z++) {
        if (get3DMatrix(matrix, x, y, z) == 1) {
            Zdepth = z;
            break;
        }
    }

    return Zdepth;
}

// x is width, y is height, z is depth

var width = 500;
var height = 500;
var depth = 500;

var matrix = init3DMatrix(width, height, depth);

function createSphere(x, y, z, radius) {
    // const width = matrix.length;
    // const height = matrix[0].length;
    // const depth = matrix[0][0].length;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            for (let k = 0; k < depth; k++) {
                const dx = i - x;
                const dy = j - y;
                const dz = k - z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance <= radius) {
                    matrix[i][j][k] = 1; // Assuming 1 represents the sphere in the matrix
                }
            }
        }
    }
}

function clampToHexColor(value, max) {
    var scaledValue = Math.floor((value / max) * 255);

    return scaledValue;
}

// draw to the screen based on the matrix using ray and when the ray returns -1, it will draw a black square
function draw(matrix) {
    // create a matrix of width and height the same as matrix and fill it with black squares, then run ray for each x and y and then draw a square at the returned z

    var graphics = new PIXI.Graphics();

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var z = ray(matrix, x, y);
            if (z != 0) {
                graphics.beginFill(clampToHexColor(z, depth));
                graphics.drawRect(x * 10, y * 10, 10, 10);
                graphics.endFill();
            } else {
                graphics.beginFill(0xFFFFFF);
                graphics.drawRect(x * 10, y * 10, 10, 10);
                graphics.endFill();
            }
        }
    }

    container.addChild(graphics);
}

createSphere(width / 2, height / 2, depth / 2, 200);

console.log(matrix);

draw(matrix)
