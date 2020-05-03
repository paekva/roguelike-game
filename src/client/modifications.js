
const onOpenModificationScreenEvent = () => {
    document.getElementById("modificationsScreen").style.display = "flex";

    document.getElementById("backBtn").addEventListener("click", () => {
        document.getElementById("modificationsScreen").style.display = "none";
        document.getElementById("overlayLayer").style.display = "none";
    });

    document.getElementById("saveBtn").addEventListener("click", () => {
        socket.emit(SocketEmitEventType.CHANGE_MODIFICATIONS, currentModifications);
    });

    const holder = document.getElementById("modificationsHolder");
    if (holder.childNodes.length === 0) addModifications();
};

const modificationParams = [
    "damage",
    "defense",
    "health",
    "cost",
    "passive_cost"
];

const addModifications = () => {
    const holder = document.getElementById("modificationsHolder");
    controller.hero.modifications &&
    controller.hero.modifications.forEach(modification => {
        const el = document.createElement("div");
        el.className = "modificationOption";

        let clone = document.importNode(
            document.getElementById("modificationOptions").content,
            true
        );
        el.appendChild(clone);
        const childList = el.children;
        childList[0].innerHTML = modification.name;

        const modificationItems = document.createElement("div");
        modificationItems.style.display = "flex";
        modificationItems.style.flexDirection = "column";

        modificationParams.forEach(param => {
            const item = document.createElement("div");
            item.innerHTML = `${param}:\t${modification[param]}`;
            modificationItems.appendChild(item);
        });
        childList[1].appendChild(modificationItems);
        childList[2].setAttribute("name", modification.name);
        childList[2].addEventListener("mousedown", e => {
            onModificationUpdate(modification.name);
        });

        holder.appendChild(el);
    });
};

const currentModifications = [];
const onModificationUpdate = name => {
    const el = document.getElementsByName(name);
    const title = el[0].getElementsByClassName("text");
    title.text = "On";

    // const index = currentModifications.findIndex(el => el === name);
    // delete currentModifications[index];
    //
    // currentModifications.push(name);
    //
    // console.warn(currentModifications);
};
