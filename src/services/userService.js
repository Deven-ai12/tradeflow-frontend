import api from "../api/axios";

const userService = {

    getProfile: async () => {

        const response = await api.get("/users/me");

        return response.data;
    }

};

export default userService;