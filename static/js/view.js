document.querySelector('.filter-button').addEventListener('click', () => {
    if (document.querySelector('.filter-content').classList.contains('hide'))
        document.querySelector('.filter-content').classList.remove('hide');
    else
        document.querySelector('.filter-content').classList.add('hide');
});
