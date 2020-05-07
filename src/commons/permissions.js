const onlyDME = (role) => {
    return role === 'dme';
};

const overCompany = (role) => {
    return role === 'dme' || role === 'company';
};

module.exports = {
    onlyDME,
    overCompany
};
