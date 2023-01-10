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

const insertRecord = async (time,seriaId,date) => {
    time = parseFloat(time);
    const body = {
        measured_time: time,
        date,
        seriaId,
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
let seriaId;
async function enterPomiarsLoop() {
    const liczba_iteracji = 10;
    seriaId =Date.now();
    for (let i = 0; i < liczba_iteracji; i++) {
        
        const pomiar = await Neutralino.os.spawnProcess(
            "cd pythonBenchmark && python ./main.py"
        );
        pomiarId = pomiar.id;
        await sleep(10000);
    }
    return;
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function ogarnijWynikiPomiaru(czas){
    let dataPom = Date.now();
    let toSave = `${seriaId};${czas};${dataPom}\n`;
    await Neutralino.filesystem.appendFile('./pythonBenchmark/CDbenchmark.txt', toSave);
    await insertRecord(czas,seriaId,dataPom);
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
                let log = evt.detail.data;
                log =log.replace("\n","");
                log =log.replace("\r","");
                log =log.replace(" ","");
                ogarnijWynikiPomiaru(log);
                console.log(log);
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

