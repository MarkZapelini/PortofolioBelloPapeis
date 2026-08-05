const bannerData = [
  {
    title: "Portfólio com leitura premium e decisão rápida",
    description:
      "Linhas institucionais apresentadas com mais clareza visual, hierarquia elegante e foco em uma experiência comercial de alto padrão.",
    cta: "Ver portfólio",
    href: "#portfolio",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/4580417605815.main.jpg",
  },
  {
    title: "Reposição com previsibilidade para operações recorrentes",
    description:
      "Uma vitrine pensada para transmitir confiança desde o primeiro scroll, com comunicação objetiva e senso real de abastecimento seguro.",
    cta: "Entender reposição",
    href: "#vantagens",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/5_pieces_of_paper_towel.JPG",
  },
  {
    title: "Curadoria institucional para operações que não podem parar",
    description:
      "Catálogo mais refinado, com foco em produtos de papel que sustentam padrão visual e rotina operacional ao mesmo tempo.",
    cta: "Falar com especialista",
    href: "#contato",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2020-07-18_19_31_27_Fully_stocked_paper_towel_and_bathroom_tissue_shelves_within_the_Giant_supermarket_at_Franklin_Farm_Village_Shopping_Center_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/960px-thumbnail.jpg",
  },
];

const categories = [
  {
    name: "Papel Interfolha",
    type: "Papel",
    status: "Alta demanda",
    description: "Alta absorção e rendimento para banheiros corporativos, clínicas e áreas de alto giro.",
    price: "R$ 129,90",
    unit: "por fardo",
    badges: ["Alta absorção", "Linha premium"],
    highlights: ["Institucional", "Reposição rápida"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2020-07-18_19_31_27_Fully_stocked_paper_towel_and_bathroom_tissue_shelves_within_the_Giant_supermarket_at_Franklin_Farm_Village_Shopping_Center_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/960px-thumbnail.jpg",
  },
  {
    name: "Papel Toalha",
    type: "Papel",
    status: "Pronta entrega",
    description: "Linha para cozinhas industriais, limpeza profissional e operações de food service.",
    price: "R$ 89,90",
    unit: "por caixa",
    badges: ["Food service", "Alto rendimento"],
    highlights: ["Operação diária", "Compra recorrente"],
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/4580417605815.main.jpg",
  },
  {
    name: "Papel Higiênico Institucional",
    type: "Papel",
    status: "Curadoria premium",
    description: "Formato econômico para empresas, comércios, shoppings e condomínios.",
    price: "R$ 154,90",
    unit: "por fardo",
    badges: ["Alto giro", "Custo eficiente"],
    highlights: ["Empresas", "Condomínios"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2020-03-19_06_01_28_Partly_bare_shelves_due_to_panic_buying_in_the_Giant_at_the_Franklin_Farm_Village_Shopping_Center_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia_during_the_COVID-19_corona_virus_pandemic.jpg/960px-thumbnail.jpg",
  },
  {
    name: "Guardanapos",
    type: "Descartável",
    status: "Linha versátil",
    description: "Linhas para restaurantes, bares, cafeterias e operações com atendimento de mesa.",
    price: "R$ 42,90",
    unit: "por pacote",
    badges: ["Atendimento de mesa", "Boa apresentação"],
    highlights: ["Restaurantes", "Cafeterias"],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/13_Liquide_-_Liquid_01.jpg/960px-13_Liquide_-_Liquid_01.jpg",
  },
  {
    name: "Bobinas de Papel",
    type: "Papel",
    status: "Reposição ágil",
    description: "Bobinas para atendimento, cozinha, embrulho e uso operacional contínuo.",
    price: "R$ 98,90",
    unit: "por caixa",
    badges: ["Uso contínuo", "Entrega recorrente"],
    highlights: ["Cozinha", "Embalagem"],
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/5_pieces_of_paper_towel.JPG",
  },
];

const featuredProducts = [categories[0], categories[1], categories[2], categories[4]];

const bannerGrid = document.getElementById("banner-grid");
const portfolioGrid = document.getElementById("portfolio-grid");
const featuredGrid = document.getElementById("featured-grid");
const categoryFilter = document.getElementById("category-filter");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const header = document.querySelector("[data-header]");
const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const progressBar = document.querySelector("[data-scroll-progress]");
const backToTopButton = document.querySelector("[data-back-to-top]");
const spotlight = document.querySelector("[data-spotlight]");
const heroSection = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

let revealObserver;
let sectionObserver;

function createPills(items, className) {
  return `
    <div class="${className}">
      ${items.map((item) => `<span>${item}</span>`).join("")}
    </div>
  `;
}

function createBannerCard(item, index) {
  const direction = index % 2 === 0 ? "left" : "right";

  return `
    <article class="banner-card" data-reveal="${direction}">
      <img
        src="${item.image}"
        alt="${item.title}"
        loading="lazy"
        decoding="async"
      >
      <div class="banner-card__overlay"></div>
      <div class="banner-card__content">
        <span class="eyebrow eyebrow--dark">BelloSul papéis</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="hero__actions">
          <a class="button button--primary" href="${item.href}" data-magnetic>${item.cta}</a>
        </div>
      </div>
    </article>
  `;
}

function createProductCard(item, index) {
  const revealDirection = index % 2 === 0 ? "up" : "right";

  return `
    <article class="product-card" data-type="${item.type}" data-tilt data-reveal="${revealDirection}">
      <div class="product-card__image">
        <span class="product-card__status">${item.status}</span>
        <img
          src="${item.image}"
          alt="${item.name}"
          loading="lazy"
          decoding="async"
        >
      </div>
      <div class="product-card__body">
        <div class="product-card__head">
          <span class="product-card__category">${item.type}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${createPills(item.badges, "product-card__badges")}
        ${createPills(item.highlights, "product-card__tech")}
        <div class="product-card__meta">
          <div class="product-card__price">
            <strong>${item.price}</strong>
            <span>${item.unit}</span>
          </div>
          <a class="button button--secondary product-card__link" href="#contato" data-magnetic>
            Saiba mais
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderBanners() {
  if (!bannerGrid) return;
  bannerGrid.innerHTML = bannerData.map(createBannerCard).join("");
}

function renderFeatured() {
  if (!featuredGrid) return;
  featuredGrid.innerHTML = featuredProducts.map(createProductCard).join("");
}

function renderPortfolio(filter = "Todos") {
  if (!portfolioGrid) return;

  const items = filter === "Todos" ? categories : categories.filter((item) => item.type === filter);
  portfolioGrid.innerHTML = items.map(createProductCard).join("");
  enhanceDynamicUI(portfolioGrid);
}

function renderFilters() {
  if (!categoryFilter) return;

  const filters = ["Todos", ...new Set(categories.map((item) => item.type))];
  categoryFilter.innerHTML = filters
    .map(
      (item, index) => `
        <button type="button" class="${index === 0 ? "is-active" : ""}" data-filter="${item}">
          ${item}
        </button>
      `,
    )
    .join("");

  categoryFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    categoryFilter.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderPortfolio(button.dataset.filter);
  });
}

function openMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.add("is-open");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function syncMenuState() {
  if (!menu || !menuToggle) return;

  if (window.innerWidth > 860) {
    closeMenu();
    return;
  }

  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menu.classList.toggle("is-open", expanded);
}

function setupMenu() {
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    if (expanded) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(event.target) || menuToggle.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", syncMenuState, { passive: true });
  window.addEventListener("orientationchange", syncMenuState);
  syncMenuState();
}

function updateScrollState() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? `${(scrollTop / scrollHeight) * 100}%` : "0%";

  document.documentElement.style.setProperty("--scroll-progress", progress);

  if (header) {
    header.classList.toggle("is-scrolled", scrollTop > 24);
  }

  if (backToTopButton) {
    backToTopButton.classList.toggle("is-visible", scrollTop > 520);
  }

  if (progressBar) {
    progressBar.style.width = progress;
  }
}

function setupScrollUI() {
  updateScrollState();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
    },
    { passive: true },
  );

  backToTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });
}

function setupScrollSpy() {
  if (!navLinks.length) return;

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visibleSection?.target?.id) return;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-35% 0px -45% 0px",
      threshold: [0.25, 0.45, 0.65],
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function setupRevealObserver() {
  if (reducedMotion) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.15,
      },
    );
  }

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    if (element.dataset.revealBound) return;
    element.dataset.revealBound = "true";
    revealObserver.observe(element);
  });
}

function makeMagnetic(element) {
  if (reducedMotion || !canHover || !element || element.dataset.magneticBound) return;
  element.dataset.magneticBound = "true";

  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    element.style.setProperty("--mx", `${offsetX}px`);
    element.style.setProperty("--my", `${offsetY}px`);
  });

  element.addEventListener("pointerleave", () => {
    element.style.setProperty("--mx", "0px");
    element.style.setProperty("--my", "0px");
  });
}

function setupMagneticButtons(root = document) {
  root.querySelectorAll("[data-magnetic]").forEach(makeMagnetic);
}

function attachTilt(card) {
  if (reducedMotion || !canHover || !card || card.dataset.tiltBound) return;
  card.dataset.tiltBound = "true";

  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
    const rotateX = (((event.clientY - rect.top) / rect.height) - 0.5) * -8;
    card.style.setProperty("--rx", `${rotateX}deg`);
    card.style.setProperty("--ry", `${rotateY}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
}

function setupTilts(root = document) {
  root.querySelectorAll("[data-tilt]").forEach(attachTilt);
}

function setupSpotlight() {
  if (!spotlight || reducedMotion || !canHover) return;

  window.addEventListener(
    "pointermove",
    (event) => {
      const x = `${(event.clientX / window.innerWidth) * 100}%`;
      const y = `${(event.clientY / window.innerHeight) * 100}%`;

      spotlight.style.setProperty("--spotlight-x", x);
      spotlight.style.setProperty("--spotlight-y", y);
    },
    { passive: true },
  );
}

function setupHeroParallax() {
  if (!heroSection || reducedMotion || !canHover) return;

  const layers = heroSection.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  heroSection.addEventListener("pointermove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((layer) => {
      layer.style.transform = `translate3d(${offsetX * 14}px, ${offsetY * 18}px, 0)`;
    });
  });

  heroSection.addEventListener("pointerleave", () => {
    layers.forEach((layer) => {
      layer.style.transform = "translate3d(0, 0, 0)";
    });
  });
}

function enhanceDynamicUI(root = document) {
  setupMagneticButtons(root);
  setupTilts(root);
  setupRevealObserver();
}

function initialize() {
  renderBanners();
  renderFeatured();
  renderFilters();
  renderPortfolio();
  setupMenu();
  setupScrollUI();
  setupScrollSpy();
  setupSpotlight();
  setupHeroParallax();
  enhanceDynamicUI(document);
}

initialize();
