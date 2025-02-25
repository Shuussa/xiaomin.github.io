
if ('ontouchstart' in window) {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOMContentLoaded event triggered'); // 调试信息

        const buttons = document.querySelectorAll('.buttons button');

        buttons.forEach(button => {
            let pressTimer;

            button.addEventListener('touchstart', function (event) {
                try {
                    event.preventDefault();
                    pressTimer = setTimeout(() => {
                        button.style.transform = 'scale(0.9)';
                    }, 100);
                    console.log('已处理的 touchStart 事件'); // 调试信息
                } catch (error) {
                    console.error('处理 touchstart 事件时出错:', error);
                }
            });

            button.addEventListener('touchend', function (event) {
                try {
                    event.preventDefault();
                    clearTimeout(pressTimer);
                    button.style.transform = '';
                    console.log('已处理的 touchStart 事件'); // 调试信息
                } catch (error) {
                    console.error('处理 touchstart 事件时出错:', error);
                }
            });

            button.addEventListener('touchmove', function (event) {
                try {
                    event.preventDefault();
                    clearTimeout(pressTimer);
                    console.log('touchmove 事件已处理'); // 调试信息
                } catch (error) {
                    console.error('处理 touchmove 事件时出错:', error);
                }
            });

            button.addEventListener('click', function (event) {
                try {
                    event.preventDefault();
                    console.log('触发的点击事件'); // 调试信息
                    button.style.transform = 'translateY(2px)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 100);
                    console.log('单击已处理的事件'); // 调试信息
                } catch (error) {
                    console.error('处理 click 事件时出错:', error);
                }
            });
        });
    });
} else {
    console.log('Mobile touch events not detected'); // 调试信息
}
const noTexts = ['是不是手滑了...', '？你认真的吗...', '要不再想想', '不许选这个！', '我会很伤心的T-T', '不行:('];
// 生成 questionTexts 数组
const questionBaseText = '喜欢你( *￣▽￣)((≧︶≦*)';
const questionTexts = Array.from({ length: 520 }, (_, i) => {
    let text = questionBaseText;
    for (let j = 0; j < i; j++) {
        text += '最';
    }
    return text + '喜欢你了小敏(●′ω`●)';
});
const imagePaths = [
    'img/bg1.png',
    'img/bg2.png',
    'img/bg3.png'
];
let noClickCount = 0;
let questionCount = 0;

function pageClickHandler(event) {
    if (event.target.closest('#header')) {
        return;
    }
    const header = document.getElementById('header');

    header.style.display = 'none';
    document.removeEventListener('click', pageClickHandler);

}

window.onload = function () {
    const noButton = document.getElementById('no');
    const yesButton = document.getElementById('yes');
    let headerShown = false; // 新增标志变量
    // 禁用文本选择
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
    });
    // 绑定 no 按钮的点击事件
    noButton.addEventListener('click', (event) => {
        event.stopPropagation(); // 阻止事件传播

        // 只有当 header 未显示过时才显示 header
        if (!headerShown) {
            document.getElementById('header').style.display = 'block'; // 显示 header
            headerShown = true; // 设置 header 已显示

            // 禁用所有按钮
            noButton.disabled = true;
            yesButton.disabled = true;

            // 三秒后隐藏 header 并重新启用点击事件
            setTimeout(() => {
                document.getElementById('header').style.display = 'none';
                // 重新启用按钮
                noButton.disabled = false;
                yesButton.disabled = false;
            }, 3000);
        }

        // 更新 no 按钮的文本内容
        if (noClickCount < noTexts.length) {
            noButton.textContent = noTexts[noClickCount];
            console.log('当前计数:', noClickCount); // 调试日志
            noClickCount++;
        } else {
            noButton.textContent = noTexts[noTexts.length - 1];
        }

        // 获取当前“可以”按钮的缩放比例
        const currentYesButtonTransform = window.getComputedStyle(yesButton).transform;
        const currentScale = new WebKitCSSMatrix(currentYesButtonTransform).a || 1;

        // 在当前的缩放比例基础上乘以 1.2
        const newScale = currentScale * 1.4;

        // 应用新的缩放比例
        yesButton.style.transform = `scale(${newScale})`;
        yesButton.style.transformOrigin = 'center';

        // 获取当前“不要”按钮的平移距离
        const currentNoButtonTransform = window.getComputedStyle(noButton).transform;
        const currentTranslateX = new WebKitCSSMatrix(currentNoButtonTransform).e || 0;
        // 计算新的“不要”按钮的平移距离
        const yesButtonWidth = yesButton.offsetWidth;
        const originalYesButtonWidth = yesButtonWidth / currentScale;
        const offsetMultiplier = 1; // 你可以根据需要调整这个系数
        const newTranslateX = currentTranslateX + offsetMultiplier * (yesButtonWidth - originalYesButtonWidth);
        // 检查 noButton 是否移出视口外
        const viewportWidth = window.innerWidth;
        const noButtonRightEdge = newTranslateX + noButton.offsetWidth;

        if (noButtonRightEdge > viewportWidth) {
            // 重置 noButton 的位置
            noButton.style.transform = `translateX(0px)`;
            noButton.style.transformOrigin = 'center';
            // 重置 noClickCount
            noClickCount = 0;
        } else {
            // 应用新的平移距离
            noButton.style.transform = `translateX(${newTranslateX}px)`;
            noButton.style.transformOrigin = 'center';
        }

        // 计算并应用mainImage和question的新的平移距离
        const translateY = -100 / 2;

        try {
            ['mainImage', 'question'].forEach(id => {
                const element = document.getElementById(id);
                const currentTransform = window.getComputedStyle(element).transform;
                const currentTranslateY = new WebKitCSSMatrix(currentTransform).f || 0;
                const newTranslateY = currentTranslateY + translateY;

                element.style.transform = `translateY(${newTranslateY}px)`;
                element.style.transformOrigin = 'center';
            });
        } catch (error) {
            console.error('处理 noButton 点击事件时出错:', error);
        }
    });

    // 绑定 yes 按钮的点击事件
    yesButton.addEventListener('click', (event) => {
        event.stopPropagation();
        noButton.disabled = true;
        yesButton.disabled = true;
        mainImage.src = imagePaths[2];
        yesButton.textContent = '好耶！';
        noButton.style.display = 'none';
        // 恢复 yesButton 的缩放比例
        yesButton.style.transform = 'scale(1)';
        // 恢复 mainImage 和 question 的位置
        ['mainImage', 'question'].forEach(id => {
            const element = document.getElementById(id);
            element.style.transform = 'translateY(0px)';
            element.style.transformOrigin = 'center';
        });

        let i = 0;
        const intervalId = setInterval(() => {
            if (i < questionTexts.length) {
                document.getElementById('question').textContent = questionTexts[i];
                i++;
            } else {
                clearInterval(intervalId); // 停止定时器
            }
        }, 150); // 每1秒更新一次
    });
}
