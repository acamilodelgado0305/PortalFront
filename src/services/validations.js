export const verifyNumber = (number)=> {
return /^\d+$/.test(number);
}

export const verifyEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}