function onWindowClose() {
    Neutralino.app.exit();
}

const envs = {};

const setEnvVars = async () => {
    const content = await Neutralino.filesystem.readFile(
        "./resources/js/.env-local"
    );
    content.split("\r\n").forEach((s) => {
        const [key, value] = s.split("=");
        envs[key] = value;
    });
};

const getAllRecords = async () => {
    const pomiary = document.getElementById("pomiary");
    const body = {
        page: {
            size: 15,
        },
    };
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${envs.XATA_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };

    try {
        let response = await fetch(`${envs.DB_URL}/query`, options);
        response = await response.json();
        let arr = response.records;

        arr = arr.map(
            ({ measured_time, date }, id) =>
                `<p>${id}. ${measured_time} (${date})</p>`
        );
        pomiary.innerHTML = arr.join(" ");
    } catch (err) {
        console.log(err);
    }
};

const insertRecord = async (time) => {
    const body = {
        measured_time: time,
        date: new Date(),
    };
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${envs.XATA_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
    try {
        await fetch(`${envs.DB_URL}/data?columns=id`, options);
    } catch (err) {
        console.log(err);
    }
};

let pomiarId;

async function enterPomiarsLoop() {
    insertRecord(1222);
    return;
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

setEnvVars();

(() => {
    const container = document.getElementById("intro-container");
    const intro = document.getElementById("intro");
    const containerWidth = container.offsetWidth;
    const width = intro.offsetWidth;
    let offset = 0;
    setInterval(() => {
        if (width < containerWidth) {
            if (offset < -width) {
                offset = containerWidth;
            }
            intro.style = `translate: ${offset}px`;
            offset -= 16;
        }
    }, 400);
})();

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
