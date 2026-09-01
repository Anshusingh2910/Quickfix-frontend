import api from "./api";

export const chatWithAI = async (message) => {
    const response = await api.post("/ai/chat", {
        message,
    });

    return response.data;
};