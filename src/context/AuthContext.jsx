import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const login = (response) => {

        localStorage.setItem("token", response.accessToken);

        localStorage.setItem(
            "user",
            JSON.stringify({
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
                role: response.role
            })
        );

        setToken(response.accessToken);

        setUser({
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email,
            role: response.role
        });
    };

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}