document.getElementById("crop-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    ph: document.getElementById("ph").value,
    temperature: document.getElementById("temperature").value,
    rainfall: document.getElementById("rainfall").value,
    soil_type: document.getElementById("soil_type").value,
    season: document.getElementById("season").value,
    market_demand: document.getElementById("market_demand").value,
    fertilizer: document.getElementById("fertilizer").value,
    pest_issue: document.getElementById("pest_issue").value,
    irrigation: document.getElementById("irrigation").value,
  };

  try {
    const res = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });

    const result = await res.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    // Show crop name
    document.getElementById("result-text").textContent = result.crop;

    // Parse guide JSON
    let guide;
    try {
      guide = JSON.parse(result.guide_json_string);
    } catch (err) {
      console.error("Guide parsing error:", err);
      document.getElementById("guide-container").innerHTML =
        "<p>⚠️ Could not load guide details.</p>";
      document.getElementById("result-container").classList.remove("hidden");
      return;
    }

    // Fill guide nicely
    document.getElementById("guide-container").innerHTML = `
      <h3>${guide.title || "Farming Guide"}</h3>
      <div class="guide-grid">
        <div class="guide-item">
          <h4>🗓️ Timeline</h4>
          ${typeof guide.timeline === "object"
        ? `<ul>
                  ${Object.entries(guide.timeline)
          .map(([k, v]) => `<li><b>${k}:</b> ${v}</li>`)
          .join("")}
                 </ul>`
        : `<p>${guide.timeline || "No data"}</p>`
      }
        </div>

        <div class="guide-item">
          <h4>🌱 How to Plant</h4>
          <p>${guide.how_to_plant || "No data"}</p>
        </div>

        <div class="guide-item">
          <h4>💊 Fertilizer Plan</h4>
          <p>${guide.fertilizer || "No data"}</p>
        </div>

        <div class="guide-item">
          <h4>🌧️ Ideal Rainfall</h4>
          <p>${guide.ideal_rainfall || "No data"}</p>
        </div>

        <div class="guide-item">
          <h4>📦 Post-Harvest Plan</h4>
          <p>${guide.post_harvest || "No data"}</p>
        </div>
      </div>
    `;

    // Show results
    document.getElementById("result-container").classList.remove("hidden");
  } catch (err) {
    alert("Error: " + err.message);
  }
});
