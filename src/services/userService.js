import api from "../api/axios";

const userService = {

    getProfile: async () => {

        const response = await api.get("/api/users/me");

        return response.data;
    }

};

export default userService;