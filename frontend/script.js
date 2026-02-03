document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("predict-form");
  const result = document.getElementById("result");

  const kpiPrice = document.getElementById("kpi-price");
  const kpiDistance = document.getElementById("kpi-distance");
  const kpiArea = document.getElementById("kpi-area");

  let priceDonut = null;
  let areaChart = null;

  const SEATTLE_AREAS = {
    downtown: { lat: 47.6097, lon: -122.3331, avg: 900000 },
    capitol_hill: { lat: 47.6253, lon: -122.3222, avg: 780000 },
    ballard: { lat: 47.6687, lon: -122.3865, avg: 820000 },
    fremont: { lat: 47.6505, lon: -122.3509, avg: 800000 },
    queen_anne: { lat: 47.6375, lon: -122.3561, avg: 880000 },
    bellevue: { lat: 47.6101, lon: -122.2015, avg: 950000 },
    redmond: { lat: 47.6730, lon: -122.1215, avg: 910000 }
  };

  const SEATTLE_AVG_PRICE = 750000;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const area = document.getElementById("area").value;
    const sqft = Number(document.getElementById("sqft").value);
    const bedrooms = Number(document.getElementById("bedrooms").value);

    if (!SEATTLE_AREAS[area]) {
      result.textContent = "❌ Please select a Seattle neighborhood.";
      return;
    }

    const payload = {
      lat: SEATTLE_AREAS[area].lat,
      long: SEATTLE_AREAS[area].lon,
      sqft_living: sqft,
      bedrooms: bedrooms
    };

    result.textContent = "Predicting price...";

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        result.textContent = `❌ ${data.detail}`;
        return;
      }

      result.textContent =
        `Estimated Property Value (Sale Price): $${data.estimated_price.toLocaleString()}\n` +
        `Distance to City Center: ${data.distance_to_city_center_km} km`;

      updateKPIs(data, area);
      renderPriceDonut(data.estimated_price);
      renderAreaComparison(area, data.estimated_price);

    } catch {
      result.textContent = "❌ Backend not reachable.";
    }
  });

  function updateKPIs(data, area) {
    kpiPrice.textContent = `$${data.estimated_price.toLocaleString()}`;
    kpiDistance.textContent = `${data.distance_to_city_center_km} km`;
    kpiArea.textContent = area.replace("_", " ").toUpperCase();
  }

  function renderPriceDonut(price) {
    if (priceDonut) priceDonut.destroy();

    priceDonut = new Chart(
      document.getElementById("priceDonut"),
      {
        type: "doughnut",
        data: {
          labels: ["Your Property", "Seattle Avg"],
          datasets: [{
            data: [price, Math.max(SEATTLE_AVG_PRICE - price, 0)],
            backgroundColor: ["#2563eb", "#e5e7eb"]
          }]
        },
      options: {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { position: "bottom" }
  }
}
  
      }
    );
  }

  function renderAreaComparison(selected, price) {
    if (areaChart) areaChart.destroy();

    const labels = Object.keys(SEATTLE_AREAS).map(a =>
      a.replace("_", " ").toUpperCase()
    );

    const values = Object.keys(SEATTLE_AREAS).map(a =>
      a === selected ? price : SEATTLE_AREAS[a].avg
    );

    const colors = Object.keys(SEATTLE_AREAS).map(a =>
      a === selected ? "#2563eb" : "#cbd5e1"
    );

    areaChart = new Chart(
      document.getElementById("areaCompareChart"),
      {
        type: "bar",
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: colors }]
        },
        options: {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  plugins: { legend: { display: false } },
  scales: { x: { beginAtZero: true } }
}

      }
    );
  }

});
