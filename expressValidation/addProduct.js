const addProductSchema = {
    productId: {
        notEmpty: {
            errorMessage: "please input product id",
        },
        isDecimal: {
            errorMessage: 'The product id must be a decimal'
        }
    },
    price: {
        notEmpty: {
            errorMessage: "please input product price",
        },
        isDecimal: {
            errorMessage: 'The product price must be a decimal'
        }
    },
    title: {
        notEmpty: {
            errorMessage: "please input product title",
        }
    },
    description: {
        notEmpty: {
            errorMessage: "please input product details",
        }
    },
    images: {
        optional: {
            options: { checkFalsy: true }
        },
        isArray: {
            errorMessage: "plese input array only"
        }
    },
    colors: {
        optional: {
            options: { checkFalsy: true }
        },
        isArray: {
            errorMessage: "plese input array only"
        }
    },
    stock: {
        optional: {
            options: { checkFalsy: true }
        },
        isDecimal: {
            errorMessage: "plese input decimal only"
        }
    },
    category: {
        notEmpty: {
            errorMessage: "please input product categorie",
        },
    }
};
export default addProductSchema