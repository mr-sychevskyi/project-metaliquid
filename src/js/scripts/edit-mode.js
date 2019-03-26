const btnEditItems = document.querySelectorAll('.btn-edit');

// Readable/editable input
if (btnEditItems) {
    [...btnEditItems].forEach(item => item.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        const currItem = e.currentTarget;
        const currItemParent = currItem.parentElement.parentElement;
        const currItemPanel = currItemParent.querySelector('.accordion-panel');
        const currItemInputs = currItemParent.querySelectorAll('.accordion-panel .content-list__input');
        const btnSave = currItemParent.querySelector(".btn-save");

        const toggleEditable = foo => {
            currItem.classList.toggle('hidden');
            btnSave.classList.toggle('hidden');

            [...currItemInputs].forEach(item => {
                item.classList.toggle('editable');
                item.readOnly = foo;
            });
        };

        const toggleSave = e => {
            e.stopPropagation();

            toggleEditable(true);
            btnSave.removeEventListener('click', toggleEditMode);
        };

        const toggleEditMode = e => toggleSave(e);

        if (!currItemPanel.classList.contains('d-block')) {
            currItemPanel.classList.add('d-block');
        }

        btnSave.addEventListener('click', toggleEditMode);

        toggleEditable(false);
    }));
}
