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
    let result;

    if (!e_qty || !e_dimUOM || !e_dimLength || !e_dimWidth || !e_dimHeight)
        return 0;

    if (e_dimUOM.toUpperCase() === 'CM' || e_dimUOM.toUpperCase() === 'CENTIMETER')
        result = parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight) / 1000000);
    else if (e_dimUOM.toUpperCase() === 'METER' || e_dimUOM.toUpperCase() === 'M')
        result = parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight));
    else
        result = parseInt(e_qty) * (parseFloat(e_dimLength) * parseFloat(e_dimWidth) * parseFloat(e_dimHeight) / 1000000000);

    return result.toFixed(2);
}

function getWeight(e_qty, e_weightUOM, e_weightPerEach) {
    let result;

    if (!e_qty || !e_weightUOM || !e_weightPerEach)
        return 0;

    if (e_weightUOM.toUpperCase() === 'GRAM' || e_weightUOM.toUpperCase() === 'GRAMS' || e_weightUOM.toUpperCase() === 'G')
        result = parseInt(e_qty) * parseFloat(e_weightPerEach) / 1000;
    else if (e_weightUOM.toUpperCase() === 'KILOGRAM' || e_weightUOM.toUpperCase() === 'KILOGRAMS' || e_weightUOM.toUpperCase() === 'KG' || e_weightUOM.toUpperCase() === 'KGS')
        result = parseInt(e_qty) * parseFloat(e_weightPerEach);
    else if (e_weightUOM.toUpperCase() === 'TON' || e_weightUOM.toUpperCase() === 'TONS' || e_weightUOM.toUpperCase() === 'T')
        result = parseInt(e_qty) * parseFloat(e_weightPerEach) * 1000;

    return result.toFixed(2);
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

module.exports = {
    encodeBase64,
    decodeBase64,
    getCubicMeter,
    getWeight,
    isInt,
};
