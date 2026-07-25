export type Customer = {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    address: string;
};
export interface CustomerUpdate {
    name?: string;
    email?: string;
    address?: string;
}
// we can just use Omit <Customer , "id") instead of this.
export type CustomerCreate = Omit<Customer, "id">;

export type PaginatedCustomerList = {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Customer[];
};
