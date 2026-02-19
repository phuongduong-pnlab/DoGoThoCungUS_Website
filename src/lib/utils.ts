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

/**
 * Optimizes Cloudinary URLs by adding q_auto,f_auto transformation
 */
export const optimizeCloudinary = (url: string, width?: number) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Check if it already has transformations
    if (url.includes('/upload/')) {
        const parts = url.split('/upload/');
        const transformation = width ? `q_auto,f_auto,w_${width}` : 'q_auto,f_auto';

        // If there's already some transformation, we might want to be more careful, 
        // but for now let's just insert ours
        return `${parts[0]}/upload/${transformation}/${parts[1]}`;
    }

    return url;
};

/**
 * Converts cm measurements in a string to inches
 * Example: "Cao 45cm, Ngang 30cm" -> "Cao 17.7in, Ngang 11.8in"
 */
export const cmToInches = (str: string) => {
    if (!str) return "";

    // 1 cm = 0.393701 inches
    // This regex looks for numbers followed by 'cm' (case insensitive)
    return str.replace(/(\d+(?:[.,]\d+)?)\s*cm/gi, (match, p1) => {
        const cm = parseFloat(p1.replace(',', '.'));
        const inches = Number((cm * 0.393701).toFixed(1));
        return `${inches}in`;
    });
};

/**
 * Converts cm numbers in a size string (e.g. "30x30x30") to inches rounded up to 0.5
 */
export const formatSizeInches = (sizeStr: string) => {
    if (!sizeStr) return "";
    // Regular expression to find numbers that represent measurements
    return sizeStr.replace(/(\d+(?:[.,]\d+)?)/g, (match) => {
        const cm = parseFloat(match.replace(',', '.'));
        // Convert to inches and round UP to the nearest 0.5
        const inches = Math.ceil(cm * 0.393701 * 2) / 2;
        // Format to remove decimal if it's a whole number
        return inches.toString();
    });
};
