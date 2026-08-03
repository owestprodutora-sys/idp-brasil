/**
 * Camada central de Analytics do IDP Brasil.
 *
 * O GA4 (gtag.js) é inicializado via snippet oficial do Google em
 * index.html. Este módulo é responsável por inicializar o Meta Pixel
 * (fbq) e por expor funções de rastreamento reutilizáveis para as
 * páginas/componentes da aplicação, usando o window.gtag já existente.
 *
 * Nenhum componente deve manipular `window.gtag` ou `window.fbq`
 * diretamente — todas as chamadas de rastreamento devem passar pelas
 * funções exportadas aqui.
 */

const META_PIXEL_ID = "524177028061136";

type GtagFunction = (...args: unknown[]) => void;

type FbqFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push?: FbqFunction;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

let isInitialized = false;

function loadScriptOnce(src: string, id: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  script.id = id;
  document.head.appendChild(script);
}

// A inicialização do GA4 (script gtag.js + gtag('js', ...) / gtag('config', ...))
// agora é feita pelo snippet oficial do Google carregado diretamente em
// index.html, garantindo que o 'config' esteja disponível de forma síncrona
// assim que o script termina de carregar. window.gtag já existe globalmente
// quando este módulo é executado.

function initMetaPixel() {
  if (window.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue.push(args);
    }
  }) as FbqFunction;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;

  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  loadScriptOnce("https://connect.facebook.net/en_US/fbevents.js", "meta-pixel-script");

  fbq("init", META_PIXEL_ID);
}

/**
 * Inicializa GA4 e Meta Pixel. Deve ser chamada uma única vez, no
 * carregamento da aplicação (ver src/App.tsx). Idempotente: chamadas
 * repetidas são ignoradas com segurança (inclusive em React StrictMode).
 */
export function initAnalytics() {
  if (isInitialized) return;
  isInitialized = true;

  initMetaPixel();
}

function safeGtag(...args: unknown[]) {
  // Como gtag('config', ...) roda de forma síncrona dentro de initGA4
  // (chamada por initAnalytics antes de qualquer trackXxx ser possível),
  // não há janela de corrida a proteger aqui — basta garantir que o
  // gtag já foi definido.
  if (typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

function safeFbq(...args: unknown[]) {
  if (typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

/**
 * PageView — deve ser disparado em toda navegação da SPA (troca de
 * rota), incluindo o carregamento inicial.
 */
export function trackPageView(path: string) {
  safeGtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
  safeFbq("track", "PageView");
}

/**
 * ViewContent — início de interesse do usuário: clique no CTA
 * principal do Hero ou no CTA final da página.
 */
export function trackViewContent(contentName: string) {
  safeGtag("event", "view_content", { content_name: contentName });
  safeFbq("track", "ViewContent", { content_name: contentName });
}

/**
 * Lead — dispara SOMENTE na chegada à página de agradecimento
 * (ThankYou), que representa um lead válido (formulário enviado com
 * sucesso e salvo no banco). Não deve ser chamada em nenhum outro
 * ponto do fluxo (ex.: no submit do formulário), para evitar
 * duplicação do evento generate_lead.
 */
export function trackLead(source: "thank_you_page") {
  safeGtag("event", "generate_lead", { lead_source: source });
  safeFbq("track", "Lead", { lead_source: source });
}

/**
 * Contact — clique no botão flutuante do WhatsApp.
 */
export function trackContact(contentName: string) {
  safeGtag("event", "contact", { content_name: contentName });
  safeFbq("track", "Contact", { content_name: contentName });
}
