/**
 * Camada central de Analytics do IDP Brasil.
 *
 * Responsável por inicializar o Google Analytics 4 (gtag.js) e o Meta
 * Pixel (fbq), e por expor funções de rastreamento reutilizáveis para
 * as páginas/componentes da aplicação.
 *
 * Nenhum componente deve manipular `window.gtag` ou `window.fbq`
 * diretamente — todas as chamadas de rastreamento devem passar pelas
 * funções exportadas aqui.
 */

const GA4_MEASUREMENT_ID = "G-0T4B0J0QD4";
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

function initGA4() {
  // Padrão oficial do Google gtag.js: window.dataLayer + a função gtag
  // são definidos, e a sequência gtag('js', ...) / gtag('config', ...)
  // é disparada de forma SÍNCRONA, sem esperar o script terminar de
  // carregar (nada de window.onload). É esse par que o gtag.js procura
  // assim que termina de carregar para processar a fila do dataLayer e
  // enviar o hit inicial para google-analytics.com/g/collect — se o
  // 'config' não estiver lá nesse momento (por ter sido adiado para o
  // onload), o carregamento do script conclui sem nenhum hit ser
  // enviado, mesmo com os comandos corretos aparecendo no dataLayer.
  window.dataLayer = window.dataLayer || [];
  const dataLayer = window.dataLayer;

  const gtag: GtagFunction = (...args: unknown[]) => {
    dataLayer.push(args);
  };
  window.gtag = gtag;

  loadScriptOnce(
    `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`,
    "ga4-gtag-script",
  );

  gtag("js", new Date());
  // send_page_view desativado: o PageView é disparado manualmente pelo
  // rastreamento de rota da SPA (ver trackPageView em src/App.tsx),
  // evitando duplicidade de eventos.
  gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
}

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

  initGA4();
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
 * Lead — envio bem-sucedido do formulário de pré-análise, ou chegada
 * na página de agradecimento (ThankYou).
 */
export function trackLead(source: "form_submit" | "thank_you_page") {
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
