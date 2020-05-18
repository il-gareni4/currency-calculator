let currentCurrency;

(async function() {
    const res = await fetch('https://www.floatrates.com/daily/usd.json');
    currentCurrency = await res.json();
})();

function updateCutomOptionsSize() {
    const bottomCusOpt = document.querySelector(".bottom-custom-options")
    const marginBottom = Number.parseInt(getComputedStyle(bottomCusOpt.parentElement.parentElement).marginBottom);
    const wrapperPadding = Number.parseInt(getComputedStyle(document.querySelector(".wrapper")).paddingBottom);

    bottomCusOpt.style.height = marginBottom + 80 + wrapperPadding + "px"
    document.querySelector(".top-custom-options").style.height = window.innerHeight - wrapperPadding - 80 + "px"
}
updateCutomOptionsSize();

window.addEventListener('resize', updateCutomOptionsSize);

for (const elem of document.querySelectorAll('.custom-select-wrapper')) {
    elem.addEventListener('click', function(event) {
        this.querySelector('.custom-select').classList.toggle('open');
    });
}

for (const elem of document.querySelectorAll(".custom-option")) {
    elem.addEventListener('click', async function() {
        const option = this;
        const customSelect = option.parentElement.parentElement;
        const selectText = customSelect.childNodes[3].firstChild;
        const newFlagSrc = this.firstElementChild.src;
        const newImgAlt = this.firstElementChild.alt;

        customSelect.childNodes[1].src = newFlagSrc;
        customSelect.childNodes[1].alt = newImgAlt;

        this.parentElement.querySelector(".selected").classList.remove('selected');
        option.classList.add("selected");
        customSelect.dataset.select = option.dataset.value;
        selectText.textContent = option.textContent;

        if (option.parentElement.classList.contains('top-custom-options')) {
            calculateFromTop();
            startCssAnimation(document.querySelector('.bottom-inputs__number'), 'changed', 'value-changed');
        } else {
            calculateFromBottom();
            startCssAnimation(document.querySelector('.top-inputs__number'), 'changed', 'value-changed');
        }
    });
}

function startCssAnimation(elem, animName, animClass) {
    function animEnd(event) {
        if (event.animationName === animName) {
            event.target.classList.remove(animClass);
            event.target.removeEventListener('animationend', animEnd)
        }
    }

    elem.addEventListener('animationend', animEnd);
    elem.classList.add(animClass);
}

function calculateFromTop() {
    const topCustomSelect = document.querySelector('.top-custom-select');
    const bottomCustomSelect = document.querySelector('.bottom-custom-select');
    const bottomInput = document.querySelector('.bottom-inputs__number');
    const topInput = document.querySelector('.top-inputs__number');

    let firstMultiplier;
    if (topCustomSelect.dataset.select === 'usd') {
        firstMultiplier = +topInput.value.replace(/,/g, '');
    } else {
        firstMultiplier = +topInput.value.replace(/,/g, '') / currentCurrency[topCustomSelect.dataset.select].rate;
    }

    let secondMultiplier;
    if (bottomCustomSelect.dataset.select === 'usd') {
        secondMultiplier = 1;
    } else {
        secondMultiplier = currentCurrency[bottomCustomSelect.dataset.select].rate;
    }

    const result = +(firstMultiplier * secondMultiplier).toFixed(2);

    bottomInput.value = new Intl.NumberFormat('en-EN').format(result);
}

function calculateFromBottom() {
    const bottomCustomSelect = document.querySelector('.bottom-custom-select');
    const topCustomSelect = document.querySelector('.top-custom-select');
    const topInput = document.querySelector('.top-inputs__number');
    const bottomInput = document.querySelector('.bottom-inputs__number');

    let firstMultiplier;
    if (bottomCustomSelect.dataset.select === 'usd') {
        firstMultiplier = +bottomInput.value.replace(/,/g, '');
    } else {
        firstMultiplier = +(bottomInput.value).replace(/,/g, '') / currentCurrency[bottomCustomSelect.dataset.select].rate;
    }

    let secondMultiplier;
    if (topCustomSelect.dataset.select === 'usd') {
        secondMultiplier = 1;
    } else {
        secondMultiplier = currentCurrency[topCustomSelect.dataset.select].rate;
    }

    topInput.value = new Intl.NumberFormat('en-EN').format(+(firstMultiplier * secondMultiplier).toFixed(2));
}

document.querySelector('.top-inputs__number').addEventListener('input', calculateFromTop);
document.querySelector('.bottom-inputs__number').addEventListener('input', calculateFromBottom);