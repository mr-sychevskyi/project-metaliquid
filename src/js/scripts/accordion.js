const accordionBtn = document.querySelectorAll('.btn-accordion');
const accordionBtnModels = document.querySelectorAll('.models .btn-accordion');

// Accordion open state
if (accordionBtnModels) {
    [...accordionBtnModels].forEach(item => {
        const panel = item.parentElement.querySelector('.accordion-panel');

        if (panel) {
            item.classList.toggle('open');
            panel.classList.add('d-block');
        }
    });
}

if (accordionBtn) {
    [...accordionBtn].forEach(item => item.addEventListener('click', e => {
        e.preventDefault();

        const currItem = e.currentTarget;
        const currItemTimeline = currItem.querySelector('.timeline');
        const currItemPanel = currItem.parentElement.querySelector('.accordion-panel');

        if (currItemPanel) {
            currItem.classList.toggle("open");
            currItemPanel.classList.toggle('d-block');

            if (currItemTimeline) {
                currItemTimeline.classList.toggle('hidden');
            }
        }
    }));
}
