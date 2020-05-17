let currentCurrency;

(async function() {
    const res = await fetch('https://www.floatrates.com/daily/usd.json');
    currentCurrency = await res.json();
})();

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
    });
}

document.querySelector('.top-inputs__number').addEventListener('input', function() {
    const topCustomSelect = document.querySelector('.top-custom-select');
    const bottomCustomSelect = document.querySelector('.bottom-custom-select');
    const bottomInput = document.querySelector('.bottom-inputs__number');

    let firstMultiplier;
    if (topCustomSelect.dataset.select === 'usd') {
        firstMultiplier = +this.value;
    } else {
        firstMultiplier = +this.value / currentCurrency[topCustomSelect.dataset.select].rate;
    }

    let secondMultiplier;
    if (bottomCustomSelect.dataset.select === 'usd') {
        secondMultiplier = 1;
    } else {
        secondMultiplier = currentCurrency[bottomCustomSelect.dataset.select].rate;
    }

    bottomInput.value = new Intl.NumberFormat('en-EN').format(+(firstMultiplier * secondMultiplier).toFixed(2));
});

document.querySelector('.bottom-inputs__number').addEventListener('input', function() {
    const bottomCustomSelect = document.querySelector('.bottom-custom-select');
    const topCustomSelect = document.querySelector('.top-custom-select');
    const topInput = document.querySelector('.top-inputs__number');

    let firstMultiplier;
    if (bottomCustomSelect.dataset.select === 'usd') {
        firstMultiplier = +this.value;
    } else {
        firstMultiplier = +this.value / currentCurrency[bottomCustomSelect.dataset.select].rate;
    }

    let secondMultiplier;
    if (topCustomSelect.dataset.select === 'usd') {
        secondMultiplier = 1;
    } else {
        secondMultiplier = currentCurrency[topCustomSelect.dataset.select].rate;
    }

    topInput.value = new Intl.NumberFormat('en-EN').format(+(firstMultiplier * secondMultiplier).toFixed(2));
});