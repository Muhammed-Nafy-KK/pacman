
export const keys = {};

window.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    if (
        key.startsWith("arrow") ||
        key === " "
    ) {
        event.preventDefault();
    }

    keys[key] = true;

});

window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});

window.addEventListener("blur", () => {

    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });

});
