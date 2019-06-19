export function getHeaderHeight() {
    const header = document.getElementById('header');
    return header ? header.clientHeight : 0;
}

export function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getLocale() {
    let locale = localStorage.getItem('locale');
    if(!locale || locale === 'auto') {
        locale = navigator.language || navigator.userLanguage || 'auto'
    }
    return locale;
}
export function setLocale(locale = 'auto') {
    localStorage.setItem('locale', locale);
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function changeOpacity(color, value) {
    let parts = color.split(',');
    parts[parts.length - 1] = `${value})`;
    return parts.join(',');
}

export function getFileExt(name) {
    return name.split('.').pop();
}

export function dataURItoFile(name, dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    var blob = new Blob([ab], {type: mimeString});
    var file = new File([blob], name, {type: mimeString, lastModified: Date.now()});

    return file
}

export function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

export function mapArrayWithKey(array, keyName) {
    const obj = {}
    array.forEach((each) => {
        obj[each[keyName]] = each;
    })
    return obj;
}