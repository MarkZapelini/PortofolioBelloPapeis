const bannerData = [
  {
    title: "Conheça nosso portfólio de descartáveis",
    description:
      "Papel interfolha, toalha, higiênico institucional, guardanapos, bobinas, sabonete líquido e dispensers para compras recorrentes.",
    cta: "Ver portfólio",
    href: "#portfolio",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/4580417605815.main.jpg",
  },
  {
    title: "Saiba mais sobre o estoque seguro",
    description:
      "Mantenha seus descartáveis disponíveis para o próximo pedido com reposição organizada e menor risco de ruptura.",
    cta: "Entender reposição",
    href: "#vantagens",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/5_pieces_of_paper_towel.JPG",
  },
  {
    title: "Sua linha institucional aqui",
    description:
      "Escolha os produtos certos para sua operação e centralize compras em um só parceiro comercial.",
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
    description: "Alta absorção e rendimento para banheiros corporativos, clínicas e áreas de alto giro.",
    price: "R$ 129,90",
    unit: "por fardo",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/2020-07-18_19_31_27_Fully_stocked_paper_towel_and_bathroom_tissue_shelves_within_the_Giant_supermarket_at_Franklin_Farm_Village_Shopping_Center_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/960px-thumbnail.jpg",
  },
  {
    name: "Papel Toalha",
    type: "Papel",
    description: "Linha para cozinhas industriais, limpeza profissional e operações de food service.",
    price: "R$ 89,90",
    unit: "por caixa",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/90/4580417605815.main.jpg",
  },
  {
    name: "Papel Higiênico Institucional",
    type: "Papel",
    description: "Formato econômico para empresas, comércios, shoppings e condomínios.",
    price: "R$ 154,90",
    unit: "por fardo",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2020-03-19_06_01_28_Partly_bare_shelves_due_to_panic_buying_in_the_Giant_at_the_Franklin_Farm_Village_Shopping_Center_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia_during_the_COVID-19_corona_virus_pandemic.jpg/960px-thumbnail.jpg",
  },
  {
    name: "Guardanapos",
    type: "Descartável",
    description: "Linhas para restaurantes, bares, cafeterias e operações com atendimento de mesa.",
    price: "R$ 42,90",
    unit: "por pacote",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/13_Liquide_-_Liquid_01.jpg/960px-13_Liquide_-_Liquid_01.jpg",
  },
  {
    name: "Bobinas de Papel",
    type: "Papel",
    description: "Bobinas para atendimento, cozinha, embrulho e uso operacional contínuo.",
    price: "R$ 98,90",
    unit: "por caixa",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d8/5_pieces_of_paper_towel.JPG",
  },
];

const featuredProducts = [
  categories[0],
  categories[1],
  categories[2],
  categories[4],
];

const bannerGrid = document.getElementById("banner-grid");
const portfolioGrid = document.getElementById("portfolio-grid");
const featuredGrid = document.getElementById("featured-grid");
const categoryFilter = document.getElementById("category-filter");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

function createBannerCard(item) {
  return `
    <article class="banner-card">
      <img src="${item.image}" alt="${item.title}">
      <div class="banner-card__overlay"></div>
      <div class="banner-card__content">
        <span class="eyebrow eyebrow--dark">BelloSul papéis</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="hero__actions">
          <a class="button button--primary" href="${item.href}">${item.cta}</a>
        </div>
      </div>
    </article>
  `;
}

function createProductCard(item) {
  return `
    <article class="product-card" data-type="${item.type}">
      <div class="product-card__image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${item.type}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="product-card__meta">
          <div class="product-card__price">
            <strong>${item.price}</strong>
            <span>${item.unit}</span>
          </div>
          <a class="button button--secondary product-card__link" href="#contato">Saiba mais</a>
        </div>
      </div>
    </article>
  `;
}

function renderBanners() {
  bannerGrid.innerHTML = bannerData.map(createBannerCard).join("");
}

function renderFeatured() {
  featuredGrid.innerHTML = featuredProducts.map(createProductCard).join("");
}

function renderPortfolio(filter = "Todos") {
  const items = filter === "Todos" ? categories : categories.filter((item) => item.type === filter);
  portfolioGrid.innerHTML = items.map(createProductCard).join("");
}

function renderFilters() {
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

function setupMenu() {
  if (!menuToggle || !menu) return;

  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("is-open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
    });
  });
}

renderBanners();
renderFeatured();
renderFilters();
renderPortfolio();
setupMenu();
