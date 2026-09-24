# Portfolio Simple — stato verificato

Aggiornato il 23 settembre 2026. Questa fotografia descrive la working tree locale, non una pubblicazione online. Le modifiche preesistenti non sono state committate né approvate tramite questa revisione.

## Struttura attiva

- Stack: Next.js 16.3.0, React 19.2.4, TypeScript e Tailwind CSS 4.
- Home: `src/app/page.tsx`; 11 card definite in `src/data/cards.ts`.
- Schede progetto: `src/app/projects/[slug]/page.tsx`; 11 slug in `PROJECTS_DATA` dentro `src/data/pagesContent.ts`.
- Altre pagine: `/about`, `/forest`, 36 snippet elencati in `SNIPPET_SLUGS` e l'API `/api/github-contributions`.
- `src/data/pagesData.json` è presente (circa 2,6 MB), ma non risulta importato dal codice in `src/`.

## Progetti visibili nella home

Casanova, Chalet Grande Cerise, VDA Case Vacanze, PoliTO Sailing Team, Netway, Away, Tracce Magazine, Antonella Sirianni, been ON, Milano Finest e Vivaldi Calendario. Ogni card ha una scheda progetto corrispondente.

`docs/projects/11-twist-it.md` documenta Twist It, ma la working tree attuale non contiene la sua card né la sua scheda in `PROJECTS_DATA`; `/projects/twist-it` restituisce 404. L'esclusione è uno stato osservato, non una decisione editoriale confermata in questa revisione.

## Verifiche eseguite

- `npm run lint`, `npm run typecheck` e `git diff --check`: superati il 23 settembre 2026.
- Server locale su `127.0.0.1:3000`: home, About, Forest, tutte le 11 schede progetto e uno snippet campione hanno risposto 200; Twist It ha risposto 404.
- I percorsi media referenziati da `src/data/cards.ts` e `src/data/pagesContent.ts` risultano presenti sotto `public/`.
- `npm run build`: avviato ma senza risultato conclusivo dopo oltre due minuti; la build di produzione resta da verificare. Durante la prova era attivo anche `next dev` sulla stessa checkout.
- Git: 64 voci modificate, cancellate o non tracciate erano già presenti prima di questo aggiornamento documentale. Conservare tali modifiche durante i prossimi interventi.

## Punti aperti per la review

1. **Formato card home:** la scelta confermata è mantenere rapporti misti e far incastrare le card. La home usa tre colonne masonry con distribuzione per altezza e spazi ridotti. I rapporti in `src/data/cards.ts` seguono i poster e i video selezionati: Casanova, VDA Case Vacanze e PoliTO Sailing Team sono circa 4:3; Away è 16:9. Netway resta 16:9, Tracce circa 3:4, Antonella Sirianni 1:1. La regola precedente delle card tutte quadrate è stata aggiornata in `AGENTS.md`.
2. **been ON:** la tavola tecnica sorgente `public/images/projects/been-on/02_garment_techpack.webp` misura 1024×471 px. La pagina la usa due volte: prima per il fronte e retro della maglia, poi per i dettagli delle maniche. Entrambe le viste sono in riquadri 4:3 con bande nere laterali. Il file sorgente non è stato modificato; se la regola 4:3 va applicata anche ai file sorgente, serviranno derivate dedicate.
3. **Twist It:** chiarire se il documento debba restare una bozza non pubblica o se il progetto debba tornare nella selezione pubblica.
4. **Build e asset:** completare una build di produzione in una sessione controllata; valutare il peso di `public/images` (circa 340 MB), inclusi file sorgente nella cartella `raw` che sono accessibili come asset pubblici.

## Fonti locali

`AGENTS.md`, `package.json`, `src/data/cards.ts`, `src/data/pagesContent.ts`, `src/app/`, `docs/projects/` e gli esiti dei controlli sopra. Questo documento va aggiornato quando cambiano selezione pubblica, asset o verifiche runtime.
