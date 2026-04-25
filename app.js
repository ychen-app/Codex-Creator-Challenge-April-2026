const dropDeadline = new Date(Date.now() + 47 * 60 * 60 * 1000 + 52 * 60 * 1000);

const roles = [
  {
    id: "parcel-design",
    company: "Parcel Labs",
    logo: "PL",
    title: "Product Design Intern",
    compensation: "$28-32/hr",
    location: "San Francisco hybrid",
    duration: "12 weeks",
    whyMatch: "Why you match: your Figma + research profile overlaps with their core workflow redesign.",
    description:
      "Own dispatch workflow polish for a logistics startup and ship product changes during the same quarter you join.",
    skills: ["Figma", "User Research", "Prototype systems"],
    urgency: "4 interview slots left",
  },
  {
    id: "mapnest-engineering",
    company: "MapNest",
    logo: "MN",
    title: "Software Engineering Intern",
    compensation: "$32-35/hr",
    location: "Remote",
    duration: "10 weeks",
    whyMatch: "Why you match: React experience and product-minded engineering are both explicitly requested.",
    description:
      "Build internal tools and product surfaces that help small businesses launch storefronts faster.",
    skills: ["React", "APIs", "Product engineering"],
    urgency: "3 interview slots left",
  },
  {
    id: "meridian-data",
    company: "Meridian Health",
    logo: "MH",
    title: "Data Analyst Intern",
    compensation: "$26-30/hr",
    location: "Sacramento hybrid",
    duration: "12 weeks",
    whyMatch: "Why you match: analytics + SQL demand lines up with the profile signals you selected.",
    description:
      "Support operating dashboards, weekly KPI reviews, and cross-functional analytics for an active healthcare team.",
    skills: ["SQL", "Python", "Analytics"],
    urgency: "5 interview slots left",
  },
];

const initialCandidates = [
  {
    id: "ava",
    name: "Natalie Chen",
    school: "UC Davis",
    fit: "98% match",
    interest: "Interested in your software role",
    skills: ["Python", "SQL", "Analytics"],
    expectation: "$26-30/hr",
    scheduled: false,
  },
  {
    id: "mateo",
    name: "Mateo Ruiz",
    school: "UC Davis",
    fit: "94% match",
    interest: "Interested in your design role",
    skills: ["Figma", "Research", "Prototyping"],
    expectation: "$26-30/hr",
    scheduled: false,
  },
  {
    id: "nina",
    name: "Monique Johnson",
    school: "UC Davis",
    fit: "94% match",
    interest: "Interested in your data role",
    skills: ["Analytics", "Dashboards", "SQL"],
    expectation: "$26-30/hr",
    scheduled: false,
  },
];

const calendarSlots = [
  { time: "Tue 1:00 PM", status: "Open now", available: true },
  { time: "Tue 1:15 PM", status: "Open now", available: true },
  { time: "Tue 1:30 PM", status: "Not Available", available: false },
  { time: "Wed 10:00 AM", status: "Not Available", available: false },
  { time: "Wed 10:15 AM", status: "Not Available", available: false },
  { time: "Thu 2:00 PM", status: "Not Available", available: false },
];

const state = {
  activeScreen: "drop",
  roleIndex: 0,
  joinedCount: 124,
  baseSignals: 18,
  matchesMade: 6,
  interviewsBooked: 4,
  slotsRemaining: 6,
  savedRoles: [],
  signals: [],
  candidates: [...initialCandidates],
  acceptedCandidates: [],
  profile: {
    name: "You",
    school: "UC Davis",
    skills: ["Figma", "React", "Analytics"],
    pay: "$26-30/hr",
  },
};

const elements = {
  countdown: document.getElementById("countdown"),
  heroCountdown: document.getElementById("heroCountdown"),
  dropCountdown: document.getElementById("dropCountdown"),
  joinedCount: document.getElementById("joinedCount"),
  signalCount: document.getElementById("signalCount"),
  interviewCount: document.getElementById("interviewCount"),
  scheduledCount: document.getElementById("scheduledCount"),
  heroOpenRoles: document.getElementById("heroOpenRoles"),
  dropRolesCount: document.getElementById("dropRolesCount"),
  screenLabel: document.getElementById("screenLabel"),
  profileSummary: document.getElementById("profileSummary"),
  roleCard: document.getElementById("roleCard"),
  signalHistory: document.getElementById("signalHistory"),
  signalsSent: document.getElementById("signalsSent"),
  slotsRemaining: document.getElementById("slotsRemaining"),
  candidateQueue: document.getElementById("candidateQueue"),
  interviewList: document.getElementById("interviewList"),
  matchHeadline: document.getElementById("matchHeadline"),
  calendarSlots: document.getElementById("calendarSlots"),
  marketHeadline: document.getElementById("marketHeadline"),
};

const screenButtons = [...document.querySelectorAll("[data-screen-target]")];
document.getElementById("passRole").addEventListener("click", () => handleRoleDecision("pass"));
document.getElementById("saveRole").addEventListener("click", () => handleRoleDecision("save"));
document
  .getElementById("interestRole")
  .addEventListener("click", () => handleRoleDecision("interested"));

bindScreenButtons();
renderCalendarSlots();
renderAll();
setInterval(updateCountdown, 1000);

function bindScreenButtons() {
  screenButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveScreen(button.dataset.screenTarget));
  });
}

function setActiveScreen(screen) {
  state.activeScreen = screen;

  screenButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screenTarget === screen);
  });

  document.querySelectorAll(".app-screen").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.screen === screen);
  });

  const labels = {
    drop: "Home",
    employer: "Interest Queue [Employer Only View]",
    match: "Matched Interview",
    market: "My Market Value",
  };

  elements.screenLabel.textContent = labels[screen];
}

function renderAll() {
  updateCountdown();
  renderDropStats();
  renderProfileSummary();
  renderRoleCard();
  renderSignalHistory();
  renderCandidateQueue();
  renderInterviewList();
  renderMatchState();
  renderMarketValue();
  setActiveScreen(state.activeScreen);
}

function updateCountdown() {
  const remaining = dropDeadline.getTime() - Date.now();

  if (remaining <= 0) {
    ["countdown", "heroCountdown", "dropCountdown"].forEach((key) => {
      elements[key].textContent = "Event closed";
    });
    return;
  }

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  const formatted = `${hours}h ${minutes}m ${seconds}s`;

  elements.countdown.textContent = formatted;
  elements.heroCountdown.textContent = formatted;
  elements.dropCountdown.textContent = formatted;
}

function renderDropStats() {
  elements.joinedCount.textContent = String(state.joinedCount);
  elements.signalCount.textContent = String(state.baseSignals + state.signals.length);
  elements.interviewCount.textContent = String(state.matchesMade);
  elements.scheduledCount.textContent = String(state.interviewsBooked);
  elements.heroOpenRoles.textContent = "142";
  elements.dropRolesCount.textContent = "142 internships available";
  elements.signalsSent.textContent = String(state.signals.length);
  elements.slotsRemaining.textContent = String(state.slotsRemaining);
}

function renderProfileSummary() {
  elements.profileSummary.innerHTML = `
    <div class="summary-group">
      <strong>${state.profile.name}</strong>
      <p>${state.profile.school}</p>
    </div>
    <div class="summary-group">
      <strong>Skills</strong>
      <div class="summary-tags">
        ${state.profile.skills.map((skill) => `<span>${skill}</span>`).join("")}
      </div>
    </div>
    <div class="summary-group">
      <strong>Target pay band</strong>
      <p>${state.profile.pay}</p>
    </div>
  `;
}

function currentRole() {
  return roles[state.roleIndex % roles.length];
}

function renderRoleCard() {
  const role = currentRole();

  elements.roleCard.innerHTML = `
    <div class="company-row">
      <span class="company-logo">${role.logo}</span>
      <div>
        <strong>${role.company}</strong>
        <p>${role.location}</p>
      </div>
    </div>
    <h3>${role.title}</h3>
    <div class="match-line">${role.whyMatch}</div>
    <div class="meta-row">
      <span>💰 ${role.compensation}</span>
      <span>📍 ${role.location}</span>
      <span>⏳ ${role.duration}</span>
    </div>
    <p>${role.description}</p>
    <div class="role-footer">
      <div>
        <span class="mini-label">Skill requirements</span>
        <strong>${role.skills.join(", ")}</strong>
      </div>
      <div>
        <span class="mini-label">Urgency</span>
        <strong>${role.urgency}</strong>
      </div>
    </div>
  `;
}

function handleRoleDecision(decision) {
  const role = currentRole();

  if (decision === "save") {
    if (!state.savedRoles.some((item) => item.id === role.id)) {
      state.savedRoles.unshift({
        id: role.id,
        type: "saved",
        title: role.title,
        company: role.company,
        meta: ["Saved", role.compensation, role.duration],
      });
    }
  }

  if (decision === "interested") {
    state.signals = [
      {
        id: role.id,
        type: "signal",
        title: role.title,
        company: role.company,
        meta: ["Interested", role.compensation, role.duration],
      },
      ...state.signals.filter((item) => item.id !== role.id),
    ];

    const youCandidate = {
      id: "you",
      name: "You",
      school: "UC Davis",
      fit: "96% match",
      interest: `Interested in your ${role.title.toLowerCase()}`,
      skills: state.profile.skills,
      expectation: state.profile.pay,
      scheduled: false,
    };

    state.candidates = [youCandidate, ...state.candidates.filter((candidate) => candidate.id !== "you")];
  }

  state.roleIndex = (state.roleIndex + 1) % roles.length;
  renderAll();
}

function renderSignalHistory() {
  const items = [...state.signals, ...state.savedRoles].slice(0, 5);

  if (!items.length) {
    elements.signalHistory.innerHTML = `
      <div class="empty-state">
        Send interest or save a role to create visible event momentum.
      </div>
    `;
    return;
  }

  elements.signalHistory.innerHTML = items
    .map(
      (item) => `
        <article class="history-card ${item.type === "saved" ? "saved" : ""}">
          <strong>${item.title}</strong>
          <p>${item.company}</p>
          <div class="history-meta">
            ${item.meta.map((meta) => `<span>${meta}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCandidateQueue() {
  if (!state.candidates.length) {
    elements.candidateQueue.innerHTML = `
      <div class="empty-state">
        No more high-intent candidates in this queue right now.
      </div>
    `;
    return;
  }

  elements.candidateQueue.innerHTML = state.candidates
    .map(
      (candidate) => `
        <article class="queue-card">
          <div class="queue-top">
            <div>
              <strong>${candidate.name}</strong>
              <p>${candidate.school}</p>
            </div>
            <span>${candidate.fit}</span>
          </div>
          <p>${candidate.interest}</p>
          <div class="queue-meta">
            ${candidate.skills.map((skill) => `<span>${skill}</span>`).join("")}
            <span>${candidate.expectation}</span>
          </div>
          <div class="queue-actions">
            <button class="queue-action accept" type="button" data-candidate-action="accept" data-candidate-id="${candidate.id}">
              Accept for interview
            </button>
            <button class="queue-action reject" type="button" data-candidate-action="reject" data-candidate-id="${candidate.id}">
              Pass
            </button>
            <button class="queue-action schedule" type="button" data-candidate-action="schedule" data-candidate-id="${candidate.id}">
              Schedule
            </button>
          </div>
        </article>
      `,
    )
    .join("");

  elements.candidateQueue.querySelectorAll("[data-candidate-action]").forEach((button) => {
    button.addEventListener("click", () => {
      handleCandidateAction(button.dataset.candidateAction, button.dataset.candidateId);
    });
  });
}

function handleCandidateAction(action, candidateId) {
  const candidate = state.candidates.find((item) => item.id === candidateId);
  if (!candidate) return;

  if ((action === "accept" || action === "schedule") && state.slotsRemaining <= 0) {
    return;
  }

  if (action === "reject") {
    state.candidates = state.candidates.filter((item) => item.id !== candidateId);
    renderAll();
    return;
  }

  state.candidates = state.candidates.filter((item) => item.id !== candidateId);
  state.acceptedCandidates.unshift({
    ...candidate,
    scheduled: action === "schedule",
  });
  state.slotsRemaining -= 1;
  state.matchesMade += 1;

  if (action === "schedule") {
    state.interviewsBooked += 1;
  }

  renderAll();
}

function renderInterviewList() {
  if (!state.acceptedCandidates.length) {
    elements.interviewList.innerHTML = `
      <div class="empty-state">
        Accepted candidates will appear here ready for scheduling.
      </div>
    `;
    return;
  }

  elements.interviewList.innerHTML = state.acceptedCandidates
    .map(
      (candidate) => `
        <article class="history-card accepted">
          <strong>${candidate.name}</strong>
          <p>${candidate.school}</p>
          <div class="history-meta">
            <span>${candidate.scheduled ? "Interview scheduled" : "Interview unlocked"}</span>
            <span>${candidate.expectation}</span>
            <span>${candidate.fit}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderMatchState() {
  const candidate = state.acceptedCandidates[0];
  const label = candidate ? candidate.name : "Parcel Labs";
  elements.matchHeadline.textContent = `You matched with ${label}`;
}

function renderCalendarSlots() {
  elements.calendarSlots.innerHTML = calendarSlots
    .map(
      (slot) => `
        <div class="calendar-slot ${slot.available ? "active" : ""}">
          <strong>${slot.time}</strong>
          <span>${slot.status}</span>
        </div>
      `,
    )
    .join("");
}

function renderMarketValue() {
  const interestedCompanies = Math.max(6, state.signals.length + state.acceptedCandidates.length + 4);
  elements.marketHeadline.textContent = `You had ${interestedCompanies} companies interested in you this event`;
}
