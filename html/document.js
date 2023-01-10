const rootElement = document.documentElement;
const bodyElement = document.body;
const headElement = document.head;

const newAnElement = name => document.createElement(name);
const newAnImage = _ => new Image();

// recall: 回调
const addEventListener = (element, event, recall) => element[`on${event}`] = recall;// element.addEventListener(event,recall);
const getElementLocation = element => element.getBoundingClientRect();

// `set_level`是那个点击block出来的弹窗
const setLevelTitle = set_level.children[0];

const data = {};


const getAllChildrenBlocks = _ => [...blocks.children];
const getAllChildrenBlockLevels = _ => getAllChildrenBlocks().map(element => +element.getAttribute('level') || 0);

const graph = bodyElement.children[0];
const setLevelStyle = set_level.style;
const minGap = 6;

// 点击每个block的时候
addEventListener(blocks, 'click', event => {
    event.stopPropagation();

    const { target: childElement } = event;
    // get block location
    const childElementLecation = getElementLocation(childElement);
    const { id } = childElement;
    data.childElement = childElement;
    data.id = id;

    setLevelTitle.innerHTML = id;
    setLevelStyle.display = 'block';
    // 小弹窗的位置
    const setLevelElementLocation = getElementLocation(set_level);

    let x = Math.round(rootElement.scrollLeft + childElementLecation.left + childElementLecation.width / 2 - setLevelElementLocation.width / 2);
    x = Math.min(
        x,
        bodyElement.offsetWidth - setLevelElementLocation.width - minGap
    );
    x = Math.max(x, minGap);
    // console.log(x);

    let y = Math.round(rootElement.scrollTop + childElementLecation.top + childElementLecation.height / 2 - setLevelElementLocation.height / 2);
    y = Math.min(
        y,
        bodyElement.offsetHeight - setLevelElementLocation.height - minGap
    );
    y = Math.max(
        y,
        minGap
    );
    // console.log(y);

    setLevelStyle.left = x + 'px';
    setLevelStyle.top = y + 'px';
});




// add the new current score
const computeScore = _ => {
    const score = getAllChildrenBlockLevels().reduce((before, current) => {
        return before + current;
    }, 0);
    分数.innerHTML = `分数: ${score}`;
}

// when level window showing, click other place to close it.
const closeLevelWindow = _ => {
    setLevelStyle.display = '';
};
addEventListener(document, 'click', closeLevelWindow);

// key to level info, saved locally
const localStorageLevelKey = 'language-ex-levels';
const saveLevels = _ => {
    localStorage.setItem(localStorageLevelKey, getAllChildrenBlockLevels().join(''));
};

// when level window is showing, click to set level.
// then close the window and save level
addEventListener(set_level, 'click', event => {
    // keep event from parent element
    event.stopPropagation();

    const level = event.target.getAttribute('data-level');
    if (!level) return false;
    data.childElement.setAttribute('level', level);
    computeScore();
    closeLevelWindow();
    saveLevels();
})

const blockLevelRegex = /^\d{9}$/;
const getLevelsAndExecute = _ => {
    // a string like '223232443', each means a level number
    const levelsString = localStorage.getItem(localStorageLevelKey);
    // check length
    if (!blockLevelRegex.test(levelsString)) return;
    // split and become level array
    const levels = levelsString.split('');
    // for each block, set level and of course the color will be set
    getAllChildrenBlocks().forEach((element, index) => {
        element.setAttribute('level', levels[index])
    })
};

getLevelsAndExecute();
computeScore();

const readAddressFromFile = (originalData, recall) => {
    const fileReader = new FileReader();
    fileReader.onload = event => recall(event.target.result);
    fileReader.readAsDataURL(originalData);
};

const getFontDataAddress = (address, recall) => {
    fetch(address).then(resource => resource.blob()).then(originalData => readAddressFromFile(originalData, recall));
};

const getFontStyle = (fontName, recall) => {
    getFontDataAddress(`${fontName}.woff?v=a`, address => recall(`@font-face {
        font-family: ${fontName};
        src: url(${address});
    };`));
};

getFontStyle('slice', styleString => {
    graph.querySelector('style').innerHTML = styleString;
    const styleElement = newAnElement('style');
    styleElement.innerHTML = styleString;
    headElement.appendChild(styleElement);
    setTimeout(_ => rootElement.removeAttribute('data-loading'), 2e3);
});

const width = 1134;
const height = 976;
const ratio = 2;

const canvas = newAnElement('canvas');

canvas.width = width * ratio;
canvas.height = width * ratio;

const context = canvas.getContext('2d');

const newImageFromText = text => {
    const originalData = new Blob([text], { type: 'image/svg+xml' });
    return URL.createObjectURL(originalData);
};
const isSocialMedia = /weibo|qq/i.test(navigator.userAgent);

const downloadFile = (link, fileName, element = newAnElement('a')) => {
    if (!isSocialMedia) {
        element.download = fileName;
    }
    element.href = link;
    element.click();
};
const addressToImageElement = (address, recall) => {
    const image = newAnImage();
    addEventListener(image, 'load', _ => setTimeout(_ => recall(image), 500));
    image.src = address;
};
const log = _ => (newAnImage()).src = `https://lab.magiconch.com/api/china-ex/log?levels=${getAllChildrenBlockLevels().join('')}`;

// 按钮保存图片 *******************************************************
const outputImageStyle = output_image.style;
const saveImage = _ => {
    rootElement.setAttribute('data-running', 'true');

    const text = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${graph.innerHTML}</svg>`;
    const dataAddress = newImageFromText(text);
    // open(dataAddress);
    // return ;
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
            const address = URL.createObjectURL(elementData);
            output_image.querySelector('img').src = address;
            outputImageStyle.display = '';

            setTimeout(_ => {
                downloadFile(address, `[编程语言制霸]${+new Date()}.png`);
                rootElement.removeAttribute('data-running');
            }, 50)
        }, 'image/png');
    });
    log();
};

addEventListener(save_pic, 'click', saveImage);
// 按钮保存图片 *******************************************************


// 关闭按钮被点击时候关闭保存图片窗口 ***********************************
addEventListener(output_image.querySelector('a'), 'click', _ => {
    outputImageStyle.display = 'none'
});
// 关闭按钮被点击时候关闭保存图片窗口 ***********************************
