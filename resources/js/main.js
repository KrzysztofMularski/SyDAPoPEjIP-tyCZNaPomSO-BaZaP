function onWindowClose() {
    Neutralino.app.exit();
}

const envs = {
    XATA_API_KEY: "xau_R8NvUEAUsm0NfkXEoeg1Wgrap9aSg1fw0",
    DB_URL: "https://krzysztof-mularski-s-workspace-1ou6nq.us-east-1.xata.sh/db/bazap:main/tables/measurements",
};

const modal = document.getElementById("modal");
const div0 = document.getElementById("chart1");
const div1 = document.getElementById("chart2");
const divs = [div0, div1];

const toggleModal = () => {
    modal.classList.toggle("grid");
    modal.classList.toggle("hidden");
};

const openWykres = (divNumber) => {
    divs[0].hidden = true;
    divs[1].hidden = true;
    divs[divNumber].hidden = false;
    toggleModal();
};

const setEnvVars = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const content = await Neutralino.filesystem.readFile(
                "./resources/js/.env-local"
            );
            content.split("\r\n").forEach((s) => {
                const [key, value] = s.split("=");
                envs[key] = value;
            });
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

const getLocalData = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const content = await Neutralino.filesystem.readFile(
                "./pythonBenchmark/CDbenchmark.txt"
            );
            const currentDrive = getCdDriveType();
            console.log(content.split("\r\n"));
            const arr = content
                .split("\r\n")
                .filter((line) => line !== "")
                .map((line) => line.split(";"))
                .map(([czas, seriaId, dataPom, typDysku]) => ({
                    id: seriaId,
                    measuredTime: parseFloat(czas),
                    date: parseInt(dataPom),
                    driveType: typDysku,
                }));

            resolve(arr);
        } catch (err) {
            console.log(err);
            reject();
        }
    });
};

const fetchAllRecords = async (size, sort, filter) => {
    if (!navigator.onLine) {
        return await getLocalData();
    }
    const body = {
        page: {
            size: size,
        },
        sort: sort,
        filter: filter,
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

        arr = arr.map(({ id, measured_time, date, driveType }) => {
            return {
                id,
                measuredTime: measured_time,
                date: date,
                driveType: driveType,
            };
        });
        return arr.reverse();
    } catch (err) {
        console.log(err);
    }
    return null;
};

// const getAllRecords = async () => {
//     openWykres(0);
//     const pomiary = document.getElementById("pomiary");
//     const body = {
//         page: {
//             size: 15,
//         },
//         sort: {
//             date: "desc",
//         },
//     };
//     const options = {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${envs.XATA_API_KEY}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//     };

//     try {
//         let response = await fetch(`${envs.DB_URL}/query`, options);
//         response = await response.json();
//         let arr = response.records;

//         arr = arr.map(
//             ({ measured_time, date }, id) =>
//                 `<p>${id}. ${measured_time} (${date})</p>`
//         );
//         pomiary.innerHTML = arr.join(" ");
//     } catch (err) {
//         console.log(err);
//     }
// };

const insertRecord = async (time, seriaId, date, driveType) => {
    time = parseFloat(time);
    const body = {
        measured_time: time,
        date,
        seriaId,
        driveType,
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

async function onePomiar() {
    return new Promise(async (resolve, reject) => {
        try {
            const pomiar = await Neutralino.os.spawnProcess(
                "cd pythonBenchmark && python ./main.py"
            );
            pomiarId = pomiar.id;
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}

let liczba_iteracji = 10;

async function enterPomiarsLoop() {
    return new Promise(async (resolve, reject) => {
        try {
            seriaId = Date.now();
            liczba_iteracji = 10;
            await onePomiar();
            // for (let i = 0; i < liczba_iteracji; i++) {
            // await onePomiar();
            // await sleep(10000);
            // }
            resolve();
        } catch (err) {
            console.log(err);
            reject();
        }
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const getCdDriveType = async () => {
    let typDysku = await Neutralino.filesystem.readFile(
        "./pythonBenchmark/CurrentDrive.txt",
        {}
    );
    typDysku = typDysku.trim();

    return typDysku;
    // return "TSSTcorp CDDVDW SH-216DB";
    // return "nie ma takiego";
};

async function ogarnijWynikiPomiaru(czas) {
    let dataPom = Date.now();
    let typDysku = await getCdDriveType();
    let toSave = `${czas};${seriaId};${dataPom};${typDysku}\n`;
    await Neutralino.filesystem.appendFile(
        "./pythonBenchmark/CDbenchmark.txt",
        toSave
    );
    await insertRecord(czas, seriaId, dataPom, typDysku);
}
function onPomiar() {
    enterPomiarsLoop();
}

Neutralino.init();
setEnvVars();

const container = document.getElementById("intro-container");
const intro = document.getElementById("intro");
const intro2 = document.getElementById("intro2");
const containerWidth = container.offsetWidth;
const width = intro.offsetWidth;
let offset = 0;
setInterval(() => {
    if (offset < -(width + 96)) {
        offset += width;
    }
    intro.style = `translate: ${offset}px`;
    intro2.style = `translate: ${offset}px`;

    offset -= 16;
}, 400);

Neutralino.events.on("windowClose", onWindowClose);

Neutralino.events.on("spawnedProcess", async (evt) => {
    if (pomiarId == evt.detail.id) {
        switch (evt.detail.action) {
            case "stdOut":
                let log = evt.detail.data;
                log = log.replace("\n", "");
                log = log.replace("\r", "");
                log = log.replace(" ", "");
                ogarnijWynikiPomiaru(log);
                console.log(log);
                break;
            case "stdErr":
                console.error(evt.detail.data);
                break;
            case "exit":
                console.log(`Pomiar się zakończył z kodem: ${evt.detail.data}`);
                liczba_iteracji -= 1;
                if (liczba_iteracji > 0) {
                    await onePomiar();
                }
                break;
        }
    }
});
