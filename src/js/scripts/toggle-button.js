const btnToggleItems = document.querySelectorAll('.toggle-btn');
const playerTimeline = document.querySelector('.player-timeline');

if (btnToggleItems) {
    [...btnToggleItems].forEach(item => item.addEventListener('click', e => {
        e.stopPropagation();

        const currItem = e.currentTarget;
        const currItemParent = currItem.parentElement.parentElement;
        const currItemPanel = currItemParent.querySelector('.accordion-panel');

        const btnText = currItemParent.querySelector('.btn-accordion__text');
        const timelineModelDisplay = playerTimeline.querySelector(`[data-model=${currItemParent.dataset.model}]`);
        const timelineModelDisplaySub = timelineModelDisplay.querySelectorAll('.accordion-panel .sub-models__item');

        const toggleChecked = checked => {
            [...currItemPanel.querySelectorAll('.btn-accordion__text')]
                .forEach(item => checked ? item.classList.remove('disabled') : item.classList.add('disabled'));

            [...currItemPanel.querySelectorAll('.toggle-btn')]
                .forEach(item => checked ? item.classList.remove('pointer-disabled') : item.classList.add('pointer-disabled'));

            [...currItemPanel.querySelectorAll('.toggle-btn input.checkbox')].forEach(item => item.checked = checked);

            checked ? timelineModelDisplay.classList.remove('hidden') : timelineModelDisplay.classList.add('hidden');

            checked && [...timelineModelDisplaySub].forEach(item => item.classList.remove('hidden'));
        };

        if (e.target.type === 'checkbox') {
            e.stopPropagation()
        } else {
            btnText.classList.toggle('disabled');
            timelineModelDisplay.classList.toggle('hidden');

            if (currItemPanel) {
                currItem.querySelector('input.checkbox:checked') ? toggleChecked(false) : toggleChecked(true);
            }
        }
    }));
}
