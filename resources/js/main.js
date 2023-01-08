function onWindowClose() {
    Neutralino.app.exit();
}

let pomiarId;

async function enterPomiarsLoop() {
    const liczba_iteracji = 1;
    for (let i = 0; i < liczba_iteracji; i++) {
        const pomiar = await Neutralino.os.spawnProcess(
            "cd pythonBenchmark && python ./main.py"
        );
        pomiarId = pomiar.id;
    }
}

function onPomiar() {
    enterPomiarsLoop();
}

Neutralino.init();

Neutralino.events.on("windowClose", onWindowClose);

Neutralino.events.on("spawnedProcess", (evt) => {
    if (pomiarId == evt.detail.id) {
        switch (evt.detail.action) {
            case "stdOut":
                console.log(evt.detail.data);
                break;
            case "stdErr":
                console.error(evt.detail.data);
                break;
            case "exit":
                console.log(`Pomiar się zakończył z kodem: ${evt.detail.data}`);
                break;
        }
    }
});
