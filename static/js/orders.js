document.querySelector('.filter-button').addEventListener('click', () => {
    if (document.querySelector('.filter-content').classList.contains('hide'))
        document.querySelector('.filter-content').classList.remove('hide');
    else
        document.querySelector('.filter-content').classList.add('hide');
});

document.getElementById('reset-filters').addEventListener('click', () => {
    const selects = document.querySelectorAll('.filter-content select');
    selects.forEach(select => {
        select.value = 'all';
    });
});