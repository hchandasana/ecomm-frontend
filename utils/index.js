const convertToRupees = (num) => {
    return num.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
    });
};

export { convertToRupees };