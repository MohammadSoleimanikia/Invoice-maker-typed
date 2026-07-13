export type User = {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    date_joined: string;
    profile: {
        store_name: string | null;
        store_description: string | null;
        store_address: string | null;
        insta_link: string | null;
        hexcolor: string;
        logo: string;
        payment_description: string | null;
    };
};

export type UserCreate = {
    first_name: string;
    last_name: string;
    store_name: string;
    store_description: string;
    store_address: string;
    insta_link: string;
};
export type UserUpdate = {
    first_name?: string;
    last_name?: string;

    store_name?: string | null;
    store_description?: string | null;
    store_address?: string | null;
    insta_link?: string | null;
    hexcolor?: string;
    logo?: File | string;
    payment_description?: string | null;
};
