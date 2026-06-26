# Ideia de Recurso: Fluxo de Personalização de Experiência (Onboarding) e Temas (Claro/Escuro) para Polar Beats

Este documento serve como especificação técnica para guiar a implementação futura desse fluxo interativo de boas-vindas e personalização de tema no site da Polar Beats.

---

## 🎨 O Conceito (Inspirado no Magnific)

Ao acessar o site pela primeira vez (ou ao clicar em um botão de "Personalizar" na navegação), o usuário verá uma tela/modal de onboarding estilizada com:
1. **Barra de Progresso:** Um indicador visual elegante no topo.
2. **Nome do Usuário:** Pergunta *"Qual é o seu nome?"* para personalizar a saudação na página (ex: *"Bem-vindo, Sebastian!"*).
3. **Seleção de Modo:** Botões interativos para escolher entre **Dark (Escuro)**, **Light (Claro)** ou **System (Sistema)**.
4. **Botão de Continuar:** Transição suave para a página principal personalizada.

---

## 🛠️ Detalhes de Implementação

### 1. Layout e HTML (Modal de Onboarding)
* Criar uma div modal `#personalization-overlay` com animações suaves de entrada.
* **Campos:**
  * `<input type="text" id="user-name-input" placeholder="Seu nome...">`
  * Três botões de seleção de tema:
    * `Dark` (Padrão atual do site)
    * `Light` (Nova folha de estilos/variáveis com cores claras premium)
    * `System` (Detecta preferência do SO via `@media (prefers-color-scheme)`)
  * Botão `<button id="onboarding-continue-btn">Continuar</button>`.

### 2. Lógica de Estado e Temas (JavaScript)
* Salvar as preferências no `localStorage` do navegador para que a personalização persista em futuras visitas.
* Atualizar o corpo do site com classes de tema (ex: `document.body.classList.add('light-theme')`).
* Atualizar saudações de textos dinamicamente.
* **Exemplo de Código Base:**
  ```javascript
  // Salvar no localStorage
  function saveUserPreferences(name, theme) {
    localStorage.setItem('pb_user_name', name);
    localStorage.setItem('pb_theme', theme);
    applyTheme(theme);
  }

  // Aplicar o tema correspondente
  function applyTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light');
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
  }
  ```

### 3. Estilização do Tema Claro (CSS)
* O site Polar Beats é primordialmente Dark Premium. Para criar a versão **Light**, precisaremos definir variáveis CSS no `:root` e sobrescrevê-las na classe `.theme-light`.
* **Variáveis de Paleta:**
  * Fondo: De `#040810` para `#f8fafc` ou `#f1f5f9` (cinza azulado claro premium).
  * Texto: De `#f8fafc` para `#0f172a` (azul escuro/grafite).
  * Bordas: De cores transparentes para tons suaves de cinza.
  * Efeitos Aura LED: Manter os brilhos porém com fundos claros, ajustando os gradientes radiais.
