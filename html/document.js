const rootElement = document.documentElement;
const bodyElement = document.body;
const headElement = document.head;

// create a new element
const newAElement = name => document.createElement(name);
const newAnImage = _ => new Image();
// recall: 回调
const addEventListener = (element, event, recall) => element[`on${event}`] = recall;// element.addEventListener(event,recall);
const getElementLocation = element => element.getBoundingClientRect();

// `设置等级`是那个点击block出来的弹窗
const setLevelTitle = 设置等级.children[0];



const data = {};
const getAllChildrenBlocks = _ => [...地区.children];
const getAllChildrenBlockLevels = _ => getAllChildrenBlocks().map(element => +element.getAttribute('level') || 0);
const localStorageLevelKey = 'china-ex-levels';
const saveLevels = _ => {
    localStorage.setItem(localStorageLevelKey, getAllChildrenBlockLevels().join(''));
};

const graph = bodyElement.children[0];
const setLevelStyle = 设置等级.style;
const minGap = 6;

// 点击每个block的时候
addEventListener(地区, 'click', event => {
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
    const setLevelElementLocation = getElementLocation(设置等级);

    let x = Math.round(rootElement.scrollLeft + childElementLecation.left + childElementLecation.width / 2 - setLevelElementLocation.width / 2);
    x = Math.min(
        x,
        bodyElement.offsetWidth - setLevelElementLocation.width - minGap
    );
    x = Math.max(
        x,
        minGap
    );
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


// 在level弹窗展示的时候/或者不展示，点击别的地方就会把弹窗关掉。
const closeLevelWindow = _ => {
    setLevelStyle.display = '';
};
addEventListener(document, 'click', closeLevelWindow);

// add the new current score
const computeScore = _ => {
    const score = getAllChildrenBlockLevels().reduce((before, current) => {
        return before + current;
    }, 0);
    分数.innerHTML = `分数: ${score}`;
}

// 在level弹窗展示的时候，点击，可以设置level。
// 设置完了计分，关闭弹窗，保存level
addEventListener(设置等级, 'click', event => {
    // 阻止事件冒泡到父元素
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
    // for eache block, set level and of course the color will be set
    getAllChildrenBlocks().forEach((element, index) => {
        element.setAttribute('level', levels[index])
    })
};

getLevelsAndExecute();
computeScore();

const 读文件成地址 = (originalData, recall) => {
    const 读 = new FileReader();
    读.onload = event => recall(event.target.result);
    读.readAsDataURL(originalData);
};
const 获取字体数据地址 = (address, recall) => {
    fetch(address).then(资源 => 资源.blob()).then(originalData => 读文件成地址(originalData, recall));
};
const 获取字体样式 = (字体名, recall) => {
    获取字体数据地址(`${字体名}.woff?v=a`, address => recall(`@font-face {
        font-family: ${字体名};
        src: url(${address});
    };`));
};
获取字体样式('slice', 样式字串 => {
    graph.querySelector('style').innerHTML = 样式字串;
    const 样式元素 = newAElement('style');
    样式元素.innerHTML = 样式字串;
    headElement.appendChild(样式元素);
    setTimeout(_ => rootElement.removeAttribute('data-loading'), 2e3);
});

const width = 1134;
const height = 976;
const ratio = 2;

const canvas = newAElement('canvas');

canvas.width = width * ratio;
canvas.height = width * ratio;

const context = canvas.getContext('2d');

const newImageFromText = text => {
    const originalData = new Blob([text], { type: 'image/svg+xml' });
    return URL.createObjectURL(originalData);
};
const isSocialMedia = /weibo|qq/i.test(navigator.userAgent);
// alert(navigator.userAgent)
const downloadFile = (link, fileName, element = newAElement('a')) => {
    if (!isSocialMedia) {
        element.download = fileName;
    }
    element.href = link;
    element.click();
};
const 地址变图像元素 = (address, recall) => {
    const 图 = newAnImage();
    addEventListener(图, 'load', _ => setTimeout(_ => recall(图), 500));
    图.src = address;
};
const log = _ => (newAnImage()).src = `https://lab.magiconch.com/api/china-ex/log?levels=${getAllChildrenBlockLevels().join('')}`;

const outputImageStyle = output_image.style;
const saveImage = _ => {
    rootElement.setAttribute('data-running', 'true');

    const text = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}px" height="${height}px">${graph.innerHTML}</svg>`;
    const 数据地址 = newImageFromText(text);
    // open(数据地址);
    // return ;
    地址变图像元素(数据地址, 图 => {
        context.fillStyle = '#efb4b4';
        context.fillRect(
            0, 0,
            width * ratio, width * ratio
        );
        context.drawImage(
            图,
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

addEventListener(保存, 'click', saveImage);

addEventListener(output_image.querySelector('a'), 'click', _ => {
    outputImageStyle.display = 'none'
});
