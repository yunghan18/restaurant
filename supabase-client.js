const config = window.SUPABASE_CONFIG;
const status = document.getElementById("supabase-status");

if (!config?.url || !config?.publishableKey) {
  status.textContent = "Supabase 設定缺失";
  status.dataset.state = "error";
  throw new Error("Missing Supabase URL or publishable key.");
}

window.submitQuestionnaireResponse = async (answer) => {
  const response = await fetch(`${config.url}/rest/v1/questionnaire_responses`, {
    method: "POST",
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${config.publishableKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(answer),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Questionnaire request failed (${response.status}): ${details}`);
  }
};

fetch(`${config.url}/auth/v1/health`, {
  headers: { apikey: config.publishableKey },
})
  .then((response) => {
    if (!response.ok) throw new Error(`Supabase Auth returned HTTP ${response.status}`);
    status.textContent = "Supabase 設定載入完成";
    status.dataset.state = "connected";
  })
  .catch((error) => {
    status.textContent = "Supabase 連線失敗";
    status.dataset.state = "error";
    console.error("Supabase connection check failed:", error);
  });

// This publishable key is intended for browser use. Never put a secret/service-role key here.
