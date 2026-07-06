
import type { Token } from "./token";

export type AuthContextType = {
    token: null | Token;
    logIn: (token: Token) => void;
    logOut: () => void;
};
