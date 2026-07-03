const URL = "https://teachablemachine.withgoogle.com/models/6Vgctrh9W/";

let model;
let webcam;
let labelContainer;
let maxPredictions;

async function iniciarIA() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();

    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update();
    await predecir();
    window.requestAnimationFrame(loop);
}

async function predecir() {
    const prediction = await model.predict(webcam.canvas);

    let mejorClase = "";
    let mejorPorcentaje = 0;

    for (let i = 0; i < maxPredictions; i++) {
        const clase = prediction[i].className;
        const porcentaje = prediction[i].probability * 100;

        if (porcentaje > mejorPorcentaje) {
            mejorPorcentaje = porcentaje;
            mejorClase = clase;
        }

        labelContainer.childNodes[i].innerHTML = clase + ": " + porcentaje.toFixed(2) + "%";
    }

    document.getElementById("prediccion-final").innerHTML =
        "Predicción final: " + mejorClase + " (" + mejorPorcentaje.toFixed(2) + "%)";
}
}
