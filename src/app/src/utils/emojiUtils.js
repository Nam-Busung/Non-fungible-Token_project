export const getImgSrc = (imgId, path) => {

    if (imgId === null) {
        return `/images/emoji/logo.svg`
    } else {
        return `/images/emoji/${path}/${imgId}.svg` //template literals
    }

}