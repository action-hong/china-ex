const rootElement = document.documentElement;
const bodyElement = document.body;
const headElement = document.head;

// create a new element
const newAElement = name => document.createElement(name);
const newAnImage = _ => new Image();
// recall: 回调
const addEventListener = (element, event, recall) => element[`on${event}`] = recall;// element.addEventListener(event,recall);
const getElementLocation = element => element.getBoundingClientRect();

const 设置等级标题 = 设置等级.children[0];

const 全关闭 = _ => {
    设置等级样式.display = '';
};
const 数据 = {};
const 获取所有省元素们 = _ => [...地区.children];
const 获取所有省等级们 = _ => 获取所有省元素们().map(element => +element.getAttribute('level') || 0);
const 本地存储等级们钥匙 = 'china-ex-levels';
const 保存等级们 = _ => {
    localStorage.setItem(本地存储等级们钥匙, 获取所有省等级们().join(''));
};
const 省等级们正则 = /^\d{9}$/;
const 获取等级们并生效 = _ => {
    const 等级们字串 = localStorage.getItem(本地存储等级们钥匙);
    if (!省等级们正则.test(等级们字串)) return;
    const 等级们 = 等级们字串.split('');
    获取所有省元素们().forEach((element, 下标) => {
        element.setAttribute('level', 等级们[下标])
    })
};
const 图形 = bodyElement.children[0];
const 设置等级样式 = 设置等级.style;
const 最小间距 = 6;
addEventListener(地区, 'click', event => {
    event.stopPropagation();

    const { target: 省元素 } = event;
    const 省元素方位 = getElementLocation(省元素);
    const { id } = 省元素;
    数据.省元素 = 省元素;
    数据.id = id;

    设置等级标题.innerHTML = id;
    设置等级样式.display = 'block';
    const 设置等级元素方位 = getElementLocation(设置等级);

    let 左 = Math.round(rootElement.scrollLeft + 省元素方位.left + 省元素方位.width / 2 - 设置等级元素方位.width / 2);
    左 = Math.min(
        左,
        bodyElement.offsetWidth - 设置等级元素方位.width - 最小间距
    );
    左 = Math.max(
        左,
        最小间距
    );

    let 上 = Math.round(rootElement.scrollTop + 省元素方位.top + 省元素方位.height / 2 - 设置等级元素方位.height / 2);
    上 = Math.min(
        上,
        bodyElement.offsetHeight - 设置等级元素方位.height - 最小间距
    );
    上 = Math.max(
        上,
        最小间距
    );

    设置等级样式.left = 左 + 'px';
    设置等级样式.top = 上 + 'px';
});
addEventListener(document, 'click', 全关闭);
const 计分 = _ => {
    const 分 = 获取所有省等级们().reduce((全, 当前) => {
        return +全 + 当前;
    }, 0);
    分数.innerHTML = `分数: ${分}`;
}
addEventListener(设置等级, 'click', event => {
    event.stopPropagation();
    const 等级 = event.target.getAttribute('data-level');
    if (!等级) return false;
    数据.省元素.setAttribute('level', 等级);
    计分();
    全关闭();
    保存等级们();
})

获取等级们并生效();
计分();

const 读文件成地址 = (原始数据, recall) => {
    const 读 = new FileReader();
    读.onload = event => recall(event.target.result);
    读.readAsDataURL(原始数据);
};
const 获取字体数据地址 = (地址, recall) => {
    fetch(地址).then(资源 => 资源.blob()).then(原始数据 => 读文件成地址(原始数据, recall));
};
const 获取字体样式 = (字体名, recall) => {
    获取字体数据地址(`${字体名}.woff?v=a`, 地址 => recall(`@font-face {
        font-family: ${字体名};
        src: url(${地址});
    };`));
};
获取字体样式('slice', 样式字串 => {
    图形.querySelector('style').innerHTML = 样式字串;
    const 样式元素 = newAElement('style');
    样式元素.innerHTML = 样式字串;
    headElement.appendChild(样式元素);
    setTimeout(_ => rootElement.removeAttribute('data-loading'), 2e3);
});

const 宽 = 1134;
const 高 = 976;
const 比 = 2;

const 画板 = newAElement('canvas');

画板.width = 宽 * 比;
画板.height = 宽 * 比;

const 上下文 = 画板.getContext('2d');

const 从文档文本新建图形文件 = 文档文本 => {
    const 原始数据 = new Blob([文档文本], { type: 'image/svg+xml' });
    return URL.createObjectURL(原始数据);
};
const 是社交媒体 = /weibo|qq/i.test(navigator.userAgent);
// alert(navigator.userAgent)
const 下载文件 = (链接, 文件名, element = newAElement('a')) => {
    if (!是社交媒体) {
        element.download = 文件名;
    }
    element.href = 链接;
    element.click();
};
const 地址变图像元素 = (地址, recall) => {
    const 图 = newAnImage();
    addEventListener(图, 'load', _ => setTimeout(_ => recall(图), 500));
    图.src = 地址;
};
const 日志 = _ => (newAnImage()).src = `https://lab.magiconch.com/api/china-ex/log?levels=${获取所有省等级们().join('')}`;

const 输出图像样式 = 输出图像.style;
const 保存图像 = _ => {
    rootElement.setAttribute('data-running', 'true');

    const 文档文本 = `<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${宽} ${高}" width="${宽}px" height="${高}px">${图形.innerHTML}</svg>`;
    const 数据地址 = 从文档文本新建图形文件(文档文本);
    // open(数据地址);
    // return ;
    地址变图像元素(数据地址, 图 => {
        上下文.fillStyle = '#efb4b4';
        上下文.fillRect(
            0, 0,
            宽 * 比, 宽 * 比
        );
        上下文.drawImage(
            图,
            0, 0,
            宽, 高,
            0, (宽 - 高) * 比 / 2,
            宽 * 比, 高 * 比
        );
        画板.toBlob(元素数据 => {
            const 地址 = URL.createObjectURL(元素数据);
            输出图像.querySelector('img').src = 地址;
            输出图像样式.display = '';

            setTimeout(_ => {
                下载文件(地址, `[福建制霸]${+new Date()}.png`);
                rootElement.removeAttribute('data-running');
            }, 50)
        }, 'image/png');
    });
    日志();
};

addEventListener(保存, 'click', 保存图像);

addEventListener(输出图像.querySelector('a'), 'click', _ => {
    输出图像样式.display = 'none'
});
