let linearChart;
let barChart;

const chartOptions = {
    plugins: {
        legend: {
            labels: {
                font: {
                    family: "'Press Start 2P', cursive",
                },
            },
        },
    },
    scales: {
        x: {
            ticks: {
                font: {
                    size: 10,
                    family: "'Press Start 2P', cursive",
                },
            },
        },
        y: {
            ticks: {
                font: {
                    size: 10,
                    family: "'Press Start 2P', cursive",
                },
            },
        },
    },
};

const generateLinearChart = async () => {
    openWykres(0);
    const speedCanvas = document.getElementById("speedChart");
    if (linearChart !== undefined) linearChart.destroy();
    speedCanvas.hidden = false;

    let pomiarData = await fetchAllRecords(15, { date: "desc" }, {});

    console.log(pomiarData);
    let chartData = {
        labels: pomiarData.map((pomiar) => [
            new Date(pomiar.date).toLocaleString(),
            pomiar.driveType,
        ]),
        datasets: [
            {
                label: "Czas wysuwania i wsuwania (mikrosekundy)",
                data: pomiarData.map((pomiar) => pomiar.measuredTime),
                borderColor: "rgba(9, 169, 26, 0.8)",
            },
        ],
    };
    linearChart = new Chart(speedCanvas, {
        type: "line",
        data: chartData,
        options: chartOptions,
    });
};
const generateBarChart = async () => {
    openWykres(1);
    const speedCanvas = document.getElementById("speedChart2");
    console.log(barChart);
    if (barChart !== undefined) {
        console.log("usuwam");
        barChart.destroy();
    }

    speedCanvas.hidden = false;

    let lastMyPomiar = await fetchAllRecords(
        1,
        { date: "desc" },
        { driveType: await getCdDriveType() }
    );

    let myPomiarId = lastMyPomiar[0] !== undefined ? lastMyPomiar[0].id : "0";
    console.log(myPomiarId);

    let topFive = await fetchAllRecords(
        5,
        { measured_time: "desc" },
        { $not: { id: myPomiarId } }
    );
    let bottomFive = await fetchAllRecords(
        5,
        { measured_time: "asc" },
        { $not: { id: myPomiarId } }
    );

    console.log(topFive, bottomFive);
    let dataset = [].concat(bottomFive, lastMyPomiar, topFive);
    dataset.sort((a, b) => b.measuredTime - a.measuredTime);

    console.log(dataset);

    let chartData = {
        labels: dataset.map((pomiar) => [
            new Date(pomiar.date).toLocaleString(),
            pomiar.driveType,
        ]),
        datasets: [
            {
                label: "Czas wysuwania i wsuwania (mikrosekundy)",
                data: dataset.map((pomiar) => pomiar.measuredTime),
                backgroundColor: dataset.map((pomiar) =>
                    pomiar.id === myPomiarId
                        ? "rgba(9, 169, 26, 0.8)"
                        : "rgba(227, 31, 73, 1)"
                ),
                borderColor: dataset.map((pomiar) =>
                    pomiar.id === myPomiarId
                        ? "rgba(9, 169, 26, 0.8)"
                        : "rgba(227, 31, 73, 1)"
                ),
            },
        ],
    };
    barChart = new Chart(speedCanvas, {
        type: "bar",
        data: chartData,
        options: chartOptions,
    });
};
