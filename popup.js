let currentData = [];

document.addEventListener("DOMContentLoaded", () => {
  const keywordInput = document.getElementById("keywordInput");
  const suggestionBox = document.getElementById("suggestions");

  document.getElementById("searchBtn").addEventListener("click", () => {
    const keyword = keywordInput.value.trim();
    if (!keyword) return;
    fetchSEO(keyword);
  });

  keywordInput.addEventListener("input", () => {
    const val = keywordInput.value.toLowerCase();
    const base = ["freelancing", "seo", "marketing", "ecommerce", "ads"];
    const filtered = base.filter(k => k.includes(val)).slice(0, 5);
    suggestionBox.innerHTML = filtered.map(k => `<li>${k}</li>`).join("");
    suggestionBox.style.display = filtered.length ? "block" : "none";
  });

  suggestionBox.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      keywordInput.value = e.target.textContent;
      suggestionBox.style.display = "none";
    }
  });

  document.getElementById("minCPC").addEventListener("input", filterData);

  document.getElementById("exportCSVBtn").addEventListener("click", () => {
    if (!currentData.length) return;
    const headers = Object.keys(currentData[0]);
    const csv = [headers.join(","), ...currentData.map(row => headers.map(h => row[h]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "seo_data.csv";
    a.click();
  });
});

function fetchSEO(keyword) {
  chrome.runtime.sendMessage({ action: "fetchSEO", keyword }, (response) => {
    if (!response || response.error) {
      document.getElementById("resultSection").innerHTML = "❌ Failed to fetch data.";
      return;
    }
    currentData = response;
    filterData();
  });
}

function filterData() {
  const minCPC = parseFloat(document.getElementById("minCPC").value) || 0;
  const filtered = currentData.filter(d => d.cpc >= minCPC);
  renderCards(filtered);
}

function renderCards(data) {
  const container = document.getElementById("resultSection");
  if (!data.length) {
    container.innerHTML = "<p>No results match filter.</p>";
    return;
  }

  container.innerHTML = data.map(k => `
    <div class="card">
      <h3>🔍 ${k.keyword}</h3>
      <p><strong>Volume:</strong> ${k.volume} ${k.volume > 30000 ? "🟢 High" : "🟡 Low"}</p>
      <p><strong>CPC:</strong> $${k.cpc} ${k.cpc > 3 ? "🔴 Expensive" : "🟢 Affordable"}</p>
      <p><strong>Difficulty:</strong> ${k.difficulty} ${k.difficulty < 40 ? "🟢 Easy" : k.difficulty < 70 ? "🟡 Moderate" : "🔴 Hard"}</p>
      <p><strong>Traffic:</strong> ${k.traffic}</p>
      <p><strong>Competition:</strong> ${k.competition}</p>
      <p><strong>Long-tail:</strong> ${k.long_tail}</p>
      <p><strong>Trend:</strong> ${k.trend}</p>
      <p><strong>Competitors:</strong> ${k.competitors}</p>
    </div>
  `).join("");
}
