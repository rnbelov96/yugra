import '../scss/thanks.scss';
// import './modals';

const nameLabelEl = document.querySelector('.js-name') as HTMLSpanElement;
nameLabelEl.textContent = localStorage.getItem('userName') || 'Гость';
