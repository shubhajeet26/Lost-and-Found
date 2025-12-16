// app.js
import { auth, provider, signInWithPopup, signOut, onAuthStateChanged, db, collection, getDocs, query, where } from './firebase.js';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const searchBtn = document.getElementById('searchBtn');
const searchTxt = document.getElementById('searchTxt');
const resultsDiv = document.getElementById('results');

// Auth Handlers
if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      alert("Login error: " + e.message);
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
  });
}

onAuthStateChanged(auth, user => {
  if (user) {
    if (userInfo) userInfo.textContent = `Signed in: ${user.displayName || user.email}`;
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  } else {
    if (userInfo) userInfo.textContent = '';
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
});

// Helper: Similarity Score
function similarityScore(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase(); b = b.toLowerCase();
  const aTokens = [...new Set(a.split(/\W+/).filter(Boolean))];
  const bTokens = [...new Set(b.split(/\W+/).filter(Boolean))];
  let matches = 0;
  aTokens.forEach(t => { if (bTokens.includes(t)) matches++; });
  return matches;
}

// Search Logic
async function fetchFoundItems() {
  const col = collection(db, "items");
  const q = query(col, where("type", "==", "found"));
  const snap = await getDocs(q);
  const items = [];
  snap.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
}

if (searchBtn) {
  searchBtn.addEventListener('click', async () => {
    const q = searchTxt.value.trim();
    if (!q) return alert("Describe what you lost.");
    resultsDiv.innerHTML = "Searching...";
    try {
      const foundItems = await fetchFoundItems();
      const scored = foundItems.map(it => {
        const text = `${it.item_name} ${it.description} ${it.category} ${it.location}`;
        return { ...it, score: similarityScore(q, text) };
      }).filter(x => x.score > 0);
      
      scored.sort((a,b) => b.score - a.score);
      renderMatches(scored);
    } catch (e) {
      resultsDiv.textContent = "Error: " + e.message;
    }
  });
}

function renderMatches(list) {
  resultsDiv.innerHTML = "";
  if (!list.length) {
    resultsDiv.textContent = "No matches found.";
    return;
  }
  list.forEach(it => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${it.imageURL || 'https://via.placeholder.com/220x140'}" />
      <h4>${it.item_name}</h4>
      <p>${it.description || ''}</p>
      <p><b>Location:</b> ${it.location || ''}</p>
    `;
    resultsDiv.appendChild(div);
  });
}