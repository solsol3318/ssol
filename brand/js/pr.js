const sections = document.querySelectorAll('.product > div');
const fixedImg = document.getElementById('fixedImage');

const images = {
    blemish: 'img/product_1.png',
    teatree: 'img/product_2.png',
    eggplant: 'img/product_3.png'
};

function onScroll() {
    sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        const secName = sec.className;

        if (rect.top < window.innerHeight * 0.4 &&
            rect.bottom > window.innerHeight * 0.4) {

            fixedImg.src = images[secName];
        }
    });
}

window.addEventListener('scroll', onScroll);