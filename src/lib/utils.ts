export const toSlug = (str: string) => {
    return str
        .normalize('NFD') // separate accents from characters
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '') // remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
};

export const removeAccents = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};
