export {};

const sectionEl = document.querySelector('.stats');
const iconImgElList = document.querySelectorAll('.stats__icon-img');
const iconTextElList = document.querySelectorAll('.stats__icon-text');

window.addEventListener('scroll', () => {
  let breakpoint = 0;
  const screenWidth = document.documentElement.scrollWidth;

  if (screenWidth <= 650) {
    breakpoint = -531;
  }
  if (screenWidth > 650 && screenWidth <= 800) {
    breakpoint = -240;
  }
  if (screenWidth > 800 && screenWidth < 1920) {
    breakpoint = -327;
  }
  if (sectionEl && sectionEl.getBoundingClientRect().top < breakpoint) {
    iconImgElList.forEach((iconImgEl, i) => {
      setTimeout(() => {
        iconImgEl.classList.add('stats__icon-img_shown');
      }, i * 250);
    });
    iconTextElList.forEach((iconTextEl, i) => {
      setTimeout(() => {
        iconTextEl.classList.add('stats__icon-text_shown');
      }, i * 250);
    });
  }
});
