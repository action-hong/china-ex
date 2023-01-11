const root = document.documentElement;
const body = document.body;
const head = document.head;

const newAnElement = name => document.createElement(name);
const newAnImage = _ => new Image();
const addListener = (element, event, recall) => element[`on${event}`] = recall;

const data = {};

// when block is clicked, show level window ************************************
const setLevelTitle = set_level.children[0];
const setLevelStyle = set_level.style;
const minimumGap = 6;

const getLocation = element => element.getBoundingClientRect();
addListener(blocks, 'click', event => {
    event.stopPropagation();

    const { target: childElement } = event;
    // get block location
    const childElementLocation = getLocation(childElement);
    const { id } = childElement;
    data.childElement = childElement;
    data.id = id;

    setLevelTitle.innerHTML = id;
    setLevelStyle.display = 'block';
    // level window place
    const levelLocation = getLocation(set_level);

    let x = Math.round(
        root.scrollLeft + childElementLocation.left
        + childElementLocation.width / 2 - levelLocation.width / 2
    );
    x = Math.min(
        x,
        body.offsetWidth - levelLocation.width - minimumGap
    );
    x = Math.max(x, minimumGap);

    let y = Math.round(
        root.scrollTop + childElementLocation.top
        + childElementLocation.height / 2 - levelLocation.height / 2
    );
    y = Math.min(
        y,
        body.offsetHeight - levelLocation.height - minimumGap
    );
    y = Math.max(y, minimumGap);

    setLevelStyle.left = x + 'px';
    setLevelStyle.top = y + 'px';
});


// when level window showing, click other place to close it. ******************
const closeLevelWindow = _ => {
    setLevelStyle.display = '';
};
addListener(document, 'click', closeLevelWindow);


// when level window is showing, click it to set level. ***********************
// add the new current score
const getBlockList = _ => [...blocks.children];
const getBlockLevelList = _ =>
    getBlockList().map(element => + element.getAttribute('level') || 0);

const computeScore = _ => {
    const score = getBlockLevelList().reduce((before, current) => {
        return before + current;
    }, 0);
    分数.innerHTML = `分数: ${score}`;
}

// key to level info, saved locally
const localStorageLevelKey = 'language-ex-levels';
const saveLevels = _ => {
    localStorage.setItem(localStorageLevelKey, getBlockLevelList().join(''));
};

// then close the window and save level
addListener(set_level, 'click', event => {
    // keep event from parent element
    event.stopPropagation();

    // find the square user clicked and get its level
    const level = event.target.getAttribute('data-level');
    if (!level) return false;
    data.childElement.setAttribute('level', level);

    computeScore();
    closeLevelWindow();
    saveLevels();
})


// when html loaded, compute the score *****************************************
const blockLevelRegex = /^\d{9}$/;
const getLevelsAndExecute = _ => {
    // a string like '223232443', each means a level number
    const levelString = localStorage.getItem(localStorageLevelKey);
    // check length
    if (!blockLevelRegex.test(levelString)) return;

    // split and become level array
    const levels = levelString.split('');
    // for each block, set level and of course the color will be set
    getBlockList().forEach((element, i) => {
        element.setAttribute('level', levels[i])
    })
};

getLevelsAndExecute();
computeScore();


// get font *********************************************************************
const readAddressFromFile = (originalData, recall) => {
    const fileReader = new FileReader();
    fileReader.onload = event => recall(event.target.result);
    fileReader.readAsDataURL(originalData);
};

const getFontDataAddress = (address, recall) => {
    fetch(address)
        .then(resource => resource.blob())
        .then(originalData => readAddressFromFile(originalData, recall));
};

const getFontStyle = (fontName, recall) => {
    getFontDataAddress(`${fontName}.woff?v=a`, address => recall(`@font-face {
        font-family: ${fontName};
        src: url(${address});
    };`));
};

const svgGraph = body.children[0];

getFontStyle('slice', styleString => {
    svgGraph.querySelector('style').innerHTML = styleString;
    const style = newAnElement('style');
    style.innerHTML = styleString;
    head.appendChild(style);
    setTimeout(_ => root.removeAttribute('data-loading'), 2e3);
});


// save image button *******************************************************

const width = 1134;
const height = 976;
const ratio = 2;

const log = _ =>
    (newAnImage()).
        src = `https://lab.magiconch.com/api/china-ex/log?levels=${getBlockLevelList().join('')}`;

const outputImageStyle = output_image.style;

const canvas = newAnElement('canvas');
canvas.width = width * ratio;
canvas.height = width * ratio;
const context = canvas.getContext('2d');

// get text and return picture
const newImageFromText = text => {
    const originalData = new Blob([text], { type: 'image/svg+xml' });
    return URL.createObjectURL(originalData);
};

const addressToImageElement = (address, recall) => {
    const image = newAnImage();
    addListener(image, 'load', _ => setTimeout(_ => recall(image), 500));
    image.src = address;
};

// download
const isSocialMedia = /weibo|qq/i.test(navigator.userAgent);
const downloadFile = (link, fileName, element = newAnElement('a')) => {
    if (!isSocialMedia) {
        element.download = fileName;
    }
    element.href = link;
    element.click();
};

const saveImage = _ => {
    root.setAttribute('data-running', 'true');

    const text =
        `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${svgGraph.innerHTML}</svg>`;
    const dataAddress = newImageFromText(text);
    addressToImageElement(dataAddress, image => {
        context.fillStyle = '#efb4b4';
        context.fillRect(
            0, 0,
            width * ratio, width * ratio
        );
        context.drawImage(
            image,
            0, 0,
            width, height,
            0, (width - height) * ratio / 2,
            width * ratio, height * ratio
        );
        canvas.toBlob(elementData => {
            const link = URL.createObjectURL(elementData);
            output_image.querySelector('img').src = link;
            outputImageStyle.display = '';

            setTimeout(_ => {
                downloadFile(link, `[编程语言制霸]${+new Date()}.png`);
                root.removeAttribute('data-running');
            }, 50)
        }, 'image/png');
    });
    log();
};

addListener(save_pic, 'click', saveImage);


// close window button ***********************************
addListener(output_image.querySelector('a'), 'click', _ => {
    outputImageStyle.display = 'none'
});
