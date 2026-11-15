<p align="center"><img src="../extension/logo128x128.png" width="96" alt="Sound Booster logo"></p>
<h1 align="center">Amplificador de Som (Sound Booster)</h1>
<p align="center"><a href="../README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.es.md">Español</a> · <a href="README.fr.md">Français</a> · <b>Português (BR)</b> · <a href="README.ru.md">Русский</a> · <a href="README.hi.md">हिन्दी</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ar.md">العربية</a></p>

<p align="center"><a href="https://chromewebstore.google.com/detail/ses-y%C3%BCkseltici/lglddafallgokgookachmcfafhkcobld"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome%20Web%20Store-Install-4285F4?logo=googlechrome&logoColor=white"></a> <a href="../LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/License-MIT-green.svg"></a> <img alt="Manifest V3" src="https://img.shields.io/badge/Manifest-V3-blue"> <a href="https://www.patreon.com/cw/dogukancengiz"><img alt="Patreon" src="https://img.shields.io/badge/Support-Patreon-FF424D?logo=patreon&logoColor=white"></a></p>
<p align="center"><a href="https://www.dogukancengiz.com/"><img alt="Website" src="https://img.shields.io/badge/Website-dogukancengiz.com-0A66C2?logo=googlechrome&logoColor=white"></a> <a href="https://github.com/dogukan-cengiz"><img alt="GitHub" src="https://img.shields.io/badge/GitHub-dogukan--cengiz-181717?logo=github&logoColor=white"></a> <a href="https://x.com/mdogukancengiz"><img alt="X" src="https://img.shields.io/badge/X-mdogukancengiz-000000?logo=x&logoColor=white"></a> <a href="https://www.instagram.com/mdogukan.cengiz"><img alt="Instagram" src="https://img.shields.io/badge/Instagram-mdogukan.cengiz-E4405F?logo=instagram&logoColor=white"></a> <a href="https://www.youtube.com/@dogukan-cengiz"><img alt="YouTube" src="https://img.shields.io/badge/YouTube-dogukan--cengiz-FF0000?logo=youtube&logoColor=white"></a> <a href="https://www.reddit.com/user/dogukan_cengiz/"><img alt="Reddit" src="https://img.shields.io/badge/Reddit-dogukan__cengiz-FF4500?logo=reddit&logoColor=white"></a> <a href="https://huggingface.co/dogukan-cengiz"><img alt="Hugging Face" src="https://img.shields.io/badge/Hugging%20Face-dogukan--cengiz-FFD21E?logo=huggingface&logoColor=white"></a> <a href="https://dogukancengiz.itch.io/"><img alt="itch.io" src="https://img.shields.io/badge/itch.io-dogukancengiz-FA5C5C?logo=itchdotio&logoColor=white"></a></p>

<p align="center"><img src="../store-assets/Images/Banner-GB.png" alt="Sound Booster banner" width="100%"></p>

Aumente o volume das abas do navegador em até **1000%**, com graves, agudos, balanço e predefinições. Gratuito e de código aberto.

## Recursos

- 🔊 Aumento de volume de até **1000%** em qualquer aba
- 🎚️ Controles de graves, agudos e balanço esquerda/direita
- 🎛️ Predefinições com um clique: Plano, Música, Filme, Voz, Jogo
- 🛡️ Limitador integrado para reduzir distorção em ganho alto
- 🌗 Tema claro e escuro
- 🌍 9 idiomas de interface: English, Türkçe, Español, Français, Português, Русский, हिन्दी, 中文, العربية
- 🎵 Mostra a aba em reprodução, com botão de redefinir
- 🆓 Sem anúncios, sem conta, sem rastreamento

## Capturas de tela

<p align="center"><img src="../store-assets/Images/pt_BR/1-PT.png" width="32%" alt="Sound Booster 1"> <img src="../store-assets/Images/pt_BR/2-PT.png" width="32%" alt="Sound Booster 2"> <img src="../store-assets/Images/pt_BR/3-PT.png" width="32%" alt="Sound Booster 3"></p>

## Instalação

### Pela Chrome Web Store (recomendado)

Instale com um clique: **[Amplificador de Som na Chrome Web Store](https://chromewebstore.google.com/detail/ses-y%C3%BCkseltici/lglddafallgokgookachmcfafhkcobld)**.

### A partir do código-fonte (modo desenvolvedor)

1. Baixe ou clone este repositório.
2. Abra `chrome://extensions` no Chrome (ou em qualquer navegador Chromium).
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta `extension/`.

## Como usar

Abra a aba que reproduz áudio, clique no ícone do Sound Booster, ative **Mestre** e arraste o controle de volume. Ajuste graves, agudos e balanço, ou escolha uma predefinição. As configurações são mantidas por aba.

## Template gratuito: use como quiser

O Sound Booster é um **template gratuito**. Você pode fazer um fork, trocar a marca, publicar sua própria versão e até reutilizar as **capturas de tela, imagens e o logo da Chrome Web Store**, de graça e sem pedir permissão. Um link para este projeto é bem-vindo, mas não obrigatório.

Para personalizar: edite o nome em `extension/_locales/*/messages.json`, o link do autor em `extension/popup.html` e `extension/popup.js`, e troque os ícones.

## Apoio e doações ❤️

Este projeto é gratuito e continuará sendo. Se ele ajudou você, apoie o desenvolvimento:

- [Apoiar no Patreon](https://www.patreon.com/cw/dogukancengiz)
- [itch.io](https://dogukancengiz.itch.io/)

Dar uma estrela ⭐ no repositório, compartilhar ou deixar uma avaliação na Chrome Web Store também ajuda muito!

## Privacidade e permissões

O áudio é processado localmente no seu navegador com a Web Audio API. A extensão não coleta, armazena nem envia dados pessoais e não possui análises. O popup carrega a fonte *Quicksand* do Google Fonts.

**Por que essas permissões?**

- `tabCapture` – captura o áudio da aba atual para amplificá-lo
- `offscreen` – executa o processamento de áudio em um documento fora da tela (Manifest V3)
- `activeTab`, `tabs` – identificam a aba atual e mostram seu título e ícone
- `storage` – lembra suas configurações
- `<all_urls>` – permite que funcione em qualquer site

## Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/ses-y%C3%BCkseltici/lglddafallgokgookachmcfafhkcobld)
- [Website](https://www.dogukancengiz.com/)
- [GitHub](https://github.com/dogukan-cengiz)
- [X (Twitter)](https://x.com/mdogukancengiz)
- [Instagram](https://www.instagram.com/mdogukan.cengiz)
- [YouTube](https://www.youtube.com/@dogukan-cengiz)
- [Patreon](https://www.patreon.com/cw/dogukancengiz)
- [Reddit](https://www.reddit.com/user/dogukan_cengiz/)
- [Hugging Face](https://huggingface.co/dogukan-cengiz)
- [itch.io](https://dogukancengiz.itch.io/)

## Licença

Publicado sob a [Licença MIT](../LICENSE). © 2026 M. Doğukan Cengiz.
