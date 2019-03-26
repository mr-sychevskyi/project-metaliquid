const btnDetailsOpen = document.querySelectorAll('.btn-shot-open');
const btnDetailsClose = document.querySelectorAll('.btn-shot-close');
const shotDetailTable = document.querySelector('.shot-detail-table');
const shotDetailItems = document.querySelectorAll('.shot-detail-item');

if (btnDetailsOpen) {
    [...btnDetailsOpen].forEach(item => item.addEventListener('click', e => {
        e.preventDefault();

        let currShot;
        const currShotItem = e.currentTarget;
        const currShotParent = currShotItem.parentElement.parentElement;
        const currShotData = currShotParent.getAttribute('data-shot');

        const toggleOpenDetail = () => {
            shotDetailTable.classList.toggle('hidden');
            currShot.classList.toggle('hidden');
        };

        const currShotDetail = [...shotDetailItems].forEach(item => {
            if (item.dataset.shot === currShotData) {
                currShot = item;
                toggleOpenDetail();
            }
        });

        const moveBack = () => {
            toggleOpenDetail();
            setTimeout(() => [...btnDetailsClose].forEach(item => item.removeEventListener('click', moveBack)), 0)
        };

        [...btnDetailsClose].forEach(item => item.addEventListener('click', moveBack));
    }))
}
