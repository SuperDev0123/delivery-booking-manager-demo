/**
 * Encode a string of text as base64
 *
 * @param data The string of text.
 * @returns The base64 encoded string.
 */
function encodeBase64(data) {
    if (typeof btoa === 'function') {
        return btoa(data);
    } else if (typeof Buffer === 'function') {
        return Buffer.from(data, 'utf-8').toString('base64');
    } else {
        throw new Error('Failed to determine the platform specific encoder');
    }
}

/**
 * Decode a string of base64 as text
 *
 * @param data The string of base64 encoded text
 * @returns The decoded text.
 */
function decodeBase64(data) {
    if (typeof atob === 'function') {
        return atob(data);
    } else if (typeof Buffer === 'function') {
        return Buffer.from(data, 'base64').toString('utf-8');
    } else {
        throw new Error('Failed to determine the platform specific decoder');
    }
}

function getCubicMeter(e_qty, e_dimUOM, e_dimLength, e_dimWidth, e_dimHeight) {
    if (e_dimUOM.toUpperCase() === 'CM' || e_dimUOM.toUpperCase() === 'CENTIMETER')
        return parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight) / 1000000);
    else if (e_dimUOM.toUpperCase() === 'METER' || e_dimUOM.toUpperCase() === 'M')
        return parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight));
    else
        return parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight) / 1000000000);
}

function getWeight(e_qty, e_weightUOM, e_weightPerEach) {
    if (e_weightUOM.toUpperCase() === 'GRAM' || e_weightUOM.toUpperCase() === 'GRAMS')
        return parseInt(e_qty) * parseFloat(e_weightPerEach) / 1000;
    else if (e_weightUOM.toUpperCase() === 'KILOGRAM' || e_weightUOM.toUpperCase() === 'KILOGRAMS' || e_weightUOM.toUpperCase() === 'KG' || e_weightUOM.toUpperCase() === 'KGS')
        return parseInt(e_qty) * parseFloat(e_weightPerEach);
    else if (e_weightUOM.toUpperCase() === 'TON' || e_weightUOM.toUpperCase() === 'TONS')
        return parseInt(e_qty) * parseFloat(e_weightPerEach) * 1000;
}

module.exports = {
    encodeBase64,
    decodeBase64,
    getCubicMeter,
    getWeight,
};
