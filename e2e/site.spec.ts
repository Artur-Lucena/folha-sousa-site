import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const ROUTES = ['/', '/agendar', '/perguntas-frequentes', '/politicas-de-privacidade', '/termo-de-consulta-juridica', '/termos-de-uso'];

/** Rola a página inteira para disparar os reveals sob scroll. */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight / 2));
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  // Maior duração de reveal no site: 1,2 s.
  await page.waitForTimeout(1300);
}

/** Próximo dia útil (segunda a sexta) a partir de amanhã, no horário de Maceió. */
function nextWeekday(): string {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Maceio' }).format(new Date());
  const date = new Date(`${today}T12:00:00Z`);
  do date.setUTCDate(date.getUTCDate() + 1);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6);
  return date.toISOString().slice(0, 10);
}

test.describe('acessibilidade (axe, WCAG 2.1 A/AA)', () => {
  for (const route of ROUTES) {
    test(`sem violações sérias em ${route}`, async ({ page }) => {
      await page.goto(route);
      await revealAll(page);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const serious = violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => ({ id: v.id, impact: v.impact, alvos: v.nodes.map((n) => n.target.join(' ')) }));
      expect(serious).toEqual([]);
    });
  }
});

test.describe('rotas e metadados', () => {
  for (const route of ROUTES) {
    test(`${route} responde com título e canonical próprios`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/Fôlha & Sousa Advogados/);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canonical).toBe(`https://folhaesousa.adv.br${route === '/' ? '' : route}`);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('404 tem status, título próprio e não é indexada', async ({ page }) => {
    const response = await page.goto('/pagina-que-nao-existe');
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Página não encontrada/);
    await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached();
    await expect(page.locator('meta[name="robots"][content*="index, follow"]:not([content*="noindex"])')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });
});

test.describe('página inicial', () => {
  test('hero mostra o título com as palavras separadas', async ({ page }) => {
    await page.goto('/');
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Precisa de orientação jurídica segura?');
  });

  test('links das áreas e unidades levam ao agendamento pré-preenchido', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href^="/agendar?area="]')).toHaveCount(6);
    await page.locator('a[href="/agendar?unidade=paulo-afonso"]').click();
    await expect(page).toHaveURL(/\/agendar\?unidade=paulo-afonso$/);
    await expect(page.getByLabel('Formato')).toHaveValue('Presencial em Paulo Afonso');
  });

  test('menu móvel abre, navega e fecha com Esc', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'menu móvel só aparece no celular');
    await page.goto('/');
    const toggle = page.locator('.mobile-menu summary');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-nav')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });
});

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('todo o conteúdo animado fica visível', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const hidden = await page.locator('[data-reveal]').evaluateAll((elements) =>
      elements.filter((element) => getComputedStyle(element).opacity !== '1').length);
    expect(hidden).toBe(0);
    await expect(page.locator('#escritorio h2')).toBeVisible();
  });

  test('agendamento oferece o WhatsApp direto', async ({ page }) => {
    await page.goto('/agendar');
    await expect(page.getByRole('link', { name: /falar diretamente com a equipe pelo WhatsApp/ })).toBeVisible();
  });
});

test.describe('agendamento', () => {
  test('envio vazio mostra erros e foca o primeiro campo inválido', async ({ page }) => {
    await page.goto('/agendar');
    await page.getByRole('button', { name: /Continuar no WhatsApp/ }).click();
    await expect(page.getByRole('status')).toHaveText('Revise os campos destacados para continuar.');
    await expect(page.getByLabel('Área de interesse')).toBeFocused();
    await expect(page.getByLabel('Área de interesse')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#email-error')).toBeVisible();
  });

  test('pedido válido abre o WhatsApp com a mensagem completa', async ({ page }) => {
    let whatsappUrl = '';
    await page.route('https://wa.me/**', async (route) => {
      whatsappUrl = route.request().url();
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<p>WhatsApp (simulado)</p>' });
    });

    await page.goto('/agendar?area=tributario&profissional=savio');
    await expect(page.getByLabel('Área de interesse')).toHaveValue('Direito Tributário');
    await page.getByLabel('Tipo de consulta').selectOption('Consulta com análise documental');
    await expect(page.locator('#consultation-price strong')).toHaveText('R$ 500,00');
    const date = nextWeekday();
    await page.getByLabel('Data preferida').fill(date);
    await page.getByLabel('Nome completo').fill('Pessoa de Teste');
    await page.getByLabel('Telefone / WhatsApp').fill('(82) 90000-0000');
    await page.getByLabel('E-mail').fill('teste@exemplo.com.br');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /Continuar no WhatsApp/ }).click();

    await expect.poll(() => whatsappUrl).toContain('https://wa.me/5582994104373');
    const text = new URL(whatsappUrl).searchParams.get('text') ?? '';
    expect(text).toContain('Área: Direito Tributário');
    expect(text).toContain('Consulta: Consulta com análise documental — R$ 500,00');
    expect(text).toContain('Profissional: Domingos Sávio de Sousa');
    expect(text).toContain(`Data preferida: ${date.split('-').reverse().join('/')}`);
    expect(text).toContain('E-mail: teste@exemplo.com.br');
  });
});

test.describe('perguntas frequentes', () => {
  test('sanfona abre uma resposta por vez', async ({ page }) => {
    await page.goto('/perguntas-frequentes');
    const first = page.locator('#faq-button-0');
    const second = page.locator('#faq-button-1');
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#faq-panel-1')).toBeVisible();
    await expect(page.locator('#faq-panel-0')).toHaveCount(0);
  });

  test('dados estruturados FAQPage estão presentes', async ({ page }) => {
    await page.goto('/perguntas-frequentes');
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(json ?? '{}');
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity.length).toBeGreaterThan(5);
  });
});

test.describe('segurança e ícones', () => {
  for (const route of ['/', ...ROUTES.slice(1), '/pagina-que-nao-existe', '/robots.txt']) {
    test(`cabeçalhos de segurança em ${route}`, async ({ request }) => {
      const response = await request.get(route);
      const headers = response.headers();
      expect(headers['x-frame-options']).toBe('DENY');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
      expect(headers['strict-transport-security']).toBe('max-age=31536000');
      expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
      expect(headers['content-security-policy']).toContain("object-src 'none'");
    });
  }

  test('nenhuma violação de CSP ao navegar e agendar', async ({ page }) => {
    const violations: string[] = [];
    page.on('console', (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text())) violations.push(message.text());
    });
    for (const route of ROUTES) {
      await page.goto(route);
      await revealAll(page);
    }
    await page.goto('/perguntas-frequentes');
    await page.locator('#faq-button-2').click();
    expect(violations).toEqual([]);
  });

  test('ícones e manifest publicados', async ({ page, request }) => {
    await page.goto('/');
    const icon = await page.locator('link[rel="icon"]').getAttribute('href');
    const apple = await page.locator('link[rel="apple-touch-icon"]').getAttribute('href');
    expect(icon).toMatch(/^\/icon\.svg/);
    expect(apple).toMatch(/^\/apple-icon\.png/);
    for (const url of [icon!, apple!, '/icons/icon-192.png', '/icons/icon-512.png']) {
      expect((await request.get(url)).status()).toBe(200);
    }
    const manifest = await (await request.get('/manifest.webmanifest')).json();
    expect(manifest.name).toBe('Fôlha & Sousa Advogados');
    expect(manifest.icons.map((i: { sizes: string }) => i.sizes)).toEqual(['192x192', '512x512', 'any']);
  });
});
