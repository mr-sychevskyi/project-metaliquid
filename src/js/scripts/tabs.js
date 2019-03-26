const btnTabItems = document.querySelectorAll('.btn-tab');
const tabContentItems = document.querySelectorAll('.tab-content__item');

if (btnTabItems) {
    [...btnTabItems].forEach(item => item.addEventListener('click', e => {
        e.preventDefault();

        const currItem = e.currentTarget;
        const currItemDataId = currItem.getAttribute('data-tab');
        const currContent = document.querySelector(`.tab-content__item`);

        [...tabContentItems].forEach(item => {
            item.classList.add('hidden');

            if (item.id === currItemDataId) {
                item.classList.remove('hidden');
            }
        });

        currItem.classList.add('active');
        [...btnTabItems].forEach(item => item.classList.remove('active'));
    }));
}
