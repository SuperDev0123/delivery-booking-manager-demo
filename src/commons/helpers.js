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

    return result;
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

    return result;
}

function isInt(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

function getDimRatio(dimUOM){
    const _dimUOM = dimUOM.toUpperCase();

    if (_dimUOM === 'CM' || _dimUOM === 'CENTIMETER')
        return 0.01;
    else if (_dimUOM === 'METER' || _dimUOM === 'M')
        return 1;
    else if (_dimUOM === 'MILIMETER' || _dimUOM === 'MM')
        return 0.001;
    else
        return 1;
}

function getWeightRatio(weightUOM){
    const _weightUOM = weightUOM.toUpperCase();

    if (_weightUOM === 'T' || _weightUOM === 'TON')
        return 1000;
    else if (_weightUOM === 'KG' || _weightUOM === 'KILOGRAM')
        return 1;
    else if (_weightUOM === 'G' || _weightUOM === 'GRAM')
        return 0.001;
    else
        return 1;
}

function getM3ToKgFactor(freight_provider, length, width, height, weight, dimUOM, weightUOM) {
    if (freight_provider) {
        if (freight_provider.toLowerCase() === 'hunter') {
            const _length = length * getDimRatio(dimUOM);
            const _width = width * getDimRatio(dimUOM);
            const _height = height * getDimRatio(dimUOM);
            const _weight = weight * getWeightRatio(weightUOM);

            if (_length > 1.2 && _width > 1.2) return 333;
            if (_height > 1.8) return 333;
            if ((_length > 1.2 || _width > 1.2) && _weight > 59) return 333;
        } else if (freight_provider && freight_provider.toLowerCase() === 'northline') {
            return 333;
        }
    }

    return 250;
}

// https://stackoverflow.com/questions/34077449/fastest-way-to-cast-a-float-to-an-int-in-javascript
const milliseconds2Days = (milliseconds) => ~~(milliseconds / (1000*60*60*24));
const milliseconds2Hours = (milliseconds) => ~~(milliseconds / (1000*60*60));

module.exports = {
    encodeBase64,
    decodeBase64,
    getCubicMeter,
    getWeight,
    isInt,
    getDimRatio,
    getWeightRatio,
    getM3ToKgFactor,
    milliseconds2Days,
    milliseconds2Hours,
};
