# AGENTS.md — portfolio-giovannidegattis

<!-- VIBES_CORE_START -->
## Regole Macchina & Ambiente Vibes (Self-Contained Core)
> Sincronizzato automaticamente da `/home/ggg/vibes/AGENTS.md`. Non modificare manualmente questo blocco.

### 1. Storage & Media (Regola Rigida)
- **Host**: Server remoto headless (Ubuntu Linux). Accesso utente via chat.
- **IMMAGINI E KEYFRAME: MAI SU R2**. Mostrale SEMPRE inline in chat via Markdown: `![anteprima](/percorso/assoluto/immagine.png)`.
- **FILE NON-IMMAGINE (Video MP4, Audio, ZIP grandi, PDF)**: Caricali su Cloudflare R2 tramite `/home/ggg/vibes/scripts/upload_to_r2.py` e restituisci il link pubblico (`https://pub-1eccb9d654364b5d9e7545e3ebad5469.r2.dev/<key>`). Niente ZIP per batch piccoli (≤ 3–5 file): restituisci i singoli link diretti.

### 2. Generazione AI (Google Flow & Higgsfield)
- **Default Primario: Google Flow**: Chiamate via proxy HTTP locale `1235` (`http://127.0.0.1:1235`). Modelli: Immagini = `nano-pro`, Video = `omni-flash`, Interpolazione = `veo-lite`. MAI eseguire comandi CLI raw `gflow` né aprire browser Chrome in shell.
- **Progetto canonico per tutte le automazioni**: `gflow-cli video` (`ef628878-e9bd-47af-82ac-b8584688e948`). Passa sempre questo `project_id` al proxy; non creare un nuovo progetto quando manca un ID. Usa un altro progetto solo se l'utente lo richiede esplicitamente.
- **Fallback: Higgsfield**: Solo se Google Flow è bloccato (quota/timeout). Richiede guida consulenziale all'utente su tier (Seedance 2.0 Fast per bozze, Standard per iterazioni, 2.5 per master finali; risoluzione 480p/720p per test, 1080p per master).

### 3. Memoria Persistente (Honcho)
- **Servizio**: API `http://127.0.0.1:8001`, Workspace `vibes`, Peer Utente `ggg`.
- **Trigger Spontaneo**: Quando l'utente menziona conversazioni passate, decisioni o dettagli pregressi non nel prompt immediato, interroga subito Honcho tramite i suoi tool MCP (`chat`, `search`, `get_representation`) prima di cercare nei file o dichiarare di non ricordare.

### 4. Igiene di Sistema & Runtime
- **Zero Polling / Sleep**: MAI eseguire `sleep` o loop bloccanti. Lancia il task in background e termina il turno.
- **Container On-Demand**: Avvia container pesanti solo al momento del bisogno e spegnili subito a fine operazione. I container TAKTIK (`taktik-android`, `taktik-android-web`) solo per operazioni residue esplicitamente autorizzate: TAKTIK non è più il workflow di pubblicazione predefinito.
- **Zero Coordinate Tap**: Nell'automazione mobile/social, mai usare coordinate fisse (`d.click(x, y)`) o script UI ad-hoc. Usa il workflow di pubblicazione correntemente approvato; TAKTIK è deprecato e va usato solo se esplicitamente riattivato e validato.
### 5. Agenti Paseo Antigravity (YOLO predefinito)
- **Usa il launcher governato per nuovi agenti Antigravity**: `python3 /home/ggg/vibes/scripts/paseo_governed_run.py --cwd <progetto> --provider refined-antigravity-acp/gemini-3.8-flash "<task>"` oppure `run_paseo_agent` via bridge MCP. Il launcher consegna AGENTS root/local e imposta `--mode yolo`.
- **Non affidarti al `paseo run` diretto per Antigravity**: l'hook `vibes-governance` carica le regole nella sessione, ma questo provider non ha dimostrato di trasmetterle al modello. Per riuso di agenti, verifica istruzioni e `Mode=yolo` con `paseo inspect <id> --json`. YOLO non autorizza modifiche distruttive, deploy, configurazioni critiche, costi o dati privati senza consenso.

<!-- VIBES_CORE_END -->

---

## Contesto & Obiettivo Locale
Personal portfolio of Giovanni De Gattis, a communication designer working across visual identity, digital products, and systems. The site brings together selected projects, case studies, and interactive experiments, showing work that connects design and technology.

### Portfolio Design & Media Rules
- **Aspect Ratio**: All photos and image previews inside project pages (`pagesContent.ts` / project detail views) **MUST ALWAYS** use a **4:3** aspect ratio (`aspect-ratio: 4 / 3`).
- **Image Processing**: Ensure source images are converted to WebP with proper EXIF orientation applied (`ImageOps.exif_transpose`), cropped or framed to 4:3 (e.g., 2000×1500), and optimized (WebP q=90).
- **Consistency**:
  - Home Grid Cards: Use each selected poster/video's real aspect ratio in a restrained masonry layout so the cards interlock without aggressive cropping. Keep the rounded card shape; do not force all cards to 1:1.
  - Project Detail Hero Posters: 4:3 squircle (`aspect-ratio: 4 / 3`).
  - Project Body Images: 4:3 (`aspect-ratio: 4 / 3`).

---

## Fonti Canoniche di Dominio (Documentazione Linkata)
- [CLAUDE](CLAUDE.md)
- [STATUS](docs/STATUS.md)
- [01-casanova](docs/projects/01-casanova.md)
- [02-chalet-grande-cerise](docs/projects/02-chalet-grande-cerise.md)
- [02b-vda-case-vacanze](docs/projects/02b-vda-case-vacanze.md)
- [03-polito-sailing-team](docs/projects/03-polito-sailing-team.md)
- [04-netway](docs/projects/04-netway.md)
- [05-away](docs/projects/05-away.md)
- [06-tracce-magazine](docs/projects/06-tracce-magazine.md)
- [07-antonella-sirianni](docs/projects/07-antonella-sirianni.md)
- [08-been-on](docs/projects/08-been-on.md)
- [09-milano-finest](docs/projects/09-milano-finest.md)
- [10-vivaldi-calendario](docs/projects/10-vivaldi-calendario.md)
- [11-twist-it](docs/projects/11-twist-it.md)
- [README](public/images/framer/README.md)

---

## Moduli di Capacità Abilitati
- [video-pipeline](file:///home/ggg/vibes/modules/video-pipeline/MODULE.md)
- [carousel-engine](file:///home/ggg/vibes/modules/carousel-engine/MODULE.md)
- [social-publisher](file:///home/ggg/vibes/modules/social-publisher/MODULE.md)
---

## Note Operative
1. **Regole Macchina**: Anteprima immagini/keyframe sempre inline in chat (`![...]`), MAI su R2. Video/audio finali su Cloudflare R2.
2. **Generazione**: Google Flow via proxy HTTP porta 1235. Fallback Higgsfield solo previa approvazione esplicita.
3. **Runtime**: Zero sleep/polling bloccanti; rilasciare risorse al termine del task.
4. **Tracciabilità Documentale (Zero Dark Docs)**: Qualsiasi documento nuovo o preservato deve essere linkato in questo file o nei moduli correlati.
