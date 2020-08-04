export const state = () => ({
    header: {
        title: "Wkwkwkw",
        backButton: false
    }
});

export const mutations = {
    setHeader(state, data) {
        state.header = data;
    }
};