const urlInput = document.getElementById("url-input");
const manualForm = document.getElementById("manual-form");
const saveTabBtn = document.getElementById("save-tab-btn");
const clearBtn = document.getElementById("clear-btn");
const exportBtn = document.getElementById("export-btn");
const listEl = document.getElementById("links-list");

const storage = chrome.storage.sync;
const KEY = "savedLinks";

init();

async function init() {
  const { [KEY]: saved = [] } = await storage.get(KEY);
  renderList(saved);
}

manualForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = urlInput.value.trim();
  if (!url) return;

  let links = await getLinks();
  if (links.includes(url)) {
    flashInput("URL already saved!");
    return;
  }
  links.push(url);
  await storage.set({ [KEY]: links });

  urlInput.value = "";
  renderList(links);
});

saveTabBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url?.startsWith("http")) return;

  let links = await getLinks();
  if (links.includes(tab.url)) return;
  links.push(tab.url);
  await storage.set({ [KEY]: links });

  renderList(links);
});

clearBtn.addEventListener("click", async () => {
  if (!confirm("Delete all saved links?")) return;
  await storage.set({ [KEY]: [] });
  renderList([]);
});

exportBtn.addEventListener("click", async () => {
  const links = await getLinks();
  if (!links.length) return;

  await navigator.clipboard.writeText(links.join("\n"));
  exportBtn.textContent = "Copied!";
  setTimeout(() => (exportBtn.textContent = "Export"), 1500);
});

function renderList(links) {
  listEl.innerHTML = "";
  if (!links.length) {
    listEl.innerHTML =
      '<p style="opacity:.6;padding:0 1rem">No links saved yet.</p>';
    return;
  }

  links.forEach((link, idx) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const del = document.createElement("button");

    a.href = link;
    a.textContent = link;
    a.target = "_blank";
    del.textContent = "✕";
    del.title = "Delete";

    del.addEventListener("click", async () => {
      links.splice(idx, 1);
      await storage.set({ [KEY]: links });
      renderList(links);
    });

    li.append(a, del);
    listEl.appendChild(li);
  });
}

async function getLinks() {
  const { [KEY]: links = [] } = await storage.get(KEY);
  return links;
}

function flashInput(msg) {
  urlInput.placeholder = msg;
  urlInput.classList.add("erorr");
  setTimeout(() => {
    urlInput.placeholder = "https://example.com";
    urlInput.classList.remove("erorr");
  }, 1200);
}
