const boardForm = document.querySelector("#boardForm");
const boardPosts = document.querySelector("#boardPosts");
const prayerForm = document.querySelector("#prayerForm");
const prayerList = document.querySelector("#prayerList");

const boardStorageKey = "mission-board-posts";
const prayerStorageKey = "nations-prayer-requests";

const defaultPosts = [
  {
    category: "기도제목",
    title: "현지 어린이 사역을 위해 기도해주세요",
    message: "교육 공간과 교사 훈련이 잘 준비되도록 함께 기도합니다.",
  },
  {
    category: "참여 신청",
    title: "여름 단기선교 설명회 신청",
    message: "일정과 준비물 안내를 받고 싶습니다.",
  },
];

const defaultPrayerRequests = [
  {
    missionary: "협력 선교사",
    field: "해외 선교 현장",
    month: "2026-05",
    prayer:
      "현지 리더들이 말씀 안에서 굳게 서고, 가정과 사역 가운데 지치지 않도록 함께 기도합니다.",
  },
];

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function getSavedItems(key, fallback) {
  const savedItems = localStorage.getItem(key);
  return savedItems ? JSON.parse(savedItems) : fallback;
}

function saveItems(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

function formatMonth(value) {
  if (!value) return "";
  const [year, month] = value.split("-");
  return `${year}년 ${Number(month)}월`;
}

function renderPosts() {
  const posts = getSavedItems(boardStorageKey, defaultPosts);
  boardPosts.innerHTML = posts
    .map(
      (post) => `
        <article>
          <span>${escapeHtml(post.category)}</span>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.message)}</p>
        </article>
      `
    )
    .join("");
}

function renderPrayerRequests() {
  const requests = getSavedItems(prayerStorageKey, defaultPrayerRequests);
  prayerList.innerHTML = requests
    .map(
      (request) => `
        <article class="prayer-card">
          <div>
            <span>${escapeHtml(formatMonth(request.month))}</span>
            <h3>${escapeHtml(request.missionary)}</h3>
            <p class="prayer-field">${escapeHtml(request.field)}</p>
          </div>
          <p>${escapeHtml(request.prayer)}</p>
        </article>
      `
    )
    .join("");
}

boardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(boardForm);
  const name = formData.get("name").trim();
  const category = formData.get("category");
  const message = formData.get("message").trim();

  if (!name || !message) return;

  const posts = getSavedItems(boardStorageKey, defaultPosts);
  posts.unshift({
    category,
    title: `${name}님의 ${category}`,
    message,
  });
  saveItems(boardStorageKey, posts.slice(0, 6));
  boardForm.reset();
  renderPosts();
});

prayerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(prayerForm);
  const missionary = formData.get("missionary").trim();
  const field = formData.get("field").trim();
  const month = formData.get("month");
  const prayer = formData.get("prayer").trim();

  if (!missionary || !field || !month || !prayer) return;

  const requests = getSavedItems(prayerStorageKey, defaultPrayerRequests);
  requests.unshift({ missionary, field, month, prayer });
  saveItems(prayerStorageKey, requests.slice(0, 12));
  prayerForm.reset();
  renderPrayerRequests();
});

renderPosts();
renderPrayerRequests();
