function openTab(url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel='noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

module.exports = {
    openTab,
    debounce,
};
