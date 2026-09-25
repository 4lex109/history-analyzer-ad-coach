# Changelog

Alle wichtigen Änderungen an **History Analyzer - AD Coach - by KnuSpersTV** werden in dieser Datei dokumentiert.

Das Changelog folgt einer absteigenden Versionsreihenfolge. Die Versionen sind für die Veröffentlichung als GitHub-Releases vorgesehen.

## [Unreleased]

- Platz für die nächsten Änderungen

## 3.2.5 – 25.09.2026

**Aktuelle stabile Version**

- Fehler im SVG-Seitenverhältnis des Diagramms behoben
- vollständige Diagrammhöhe wiederhergestellt
- X-Achse und Beschriftung bleiben vollständig sichtbar
- responsive Darstellung der Match-Entwicklung beibehalten
- Tooltip-Funktion für Diagramm-Messpunkte beibehalten
- alle Matches werden ohne horizontales Scrollen angezeigt

## 3.2.4 – 25.09.2026

- Tooltip für Diagramm-Messpunkte hinzugefügt
- genauer Wert der ausgewählten Kennzahl beim Überfahren eines Messpunkts sichtbar
- zugehöriges Match und Kennzahl im Tooltip angezeigt
- größere unsichtbare Trefferfläche für Messpunkte ergänzt
- Bedienung der Messpunkte per Tastaturfokus unterstützt

## 3.2.3 – 25.09.2026

- Diagramm vollständig responsive gemacht
- alle Matches werden gleichzeitig innerhalb der verfügbaren Breite angezeigt
- horizontales Scrollen im Diagramm entfernt
- X-Achse allgemein mit „Match“ beschriftet
- Datenpunkte, Linien und Markierung des aktuellen Matches beibehalten

## 3.2.2 – 25.09.2026

- X-Achse für viele Matches überarbeitet
- alle Match-Datenpunkte bleiben im Diagramm enthalten
- jedem Match einen eigenen Datenpunkt und Abstand gegeben
- horizontales Scrollen für große Match-Anzahlen ermöglicht
- lange Matchnamen von der X-Achse entfernt
- allgemeine Achsenbeschriftung „Match“ ergänzt

## 3.2.1 – 25.09.2026

- Problem behoben, bei dem sich das Kennzahl-Dropdown beim Öffnen sofort wieder schloss
- unnötige Neudarstellungen durch eigene Analyzer-Mutationen verhindert
- X-Achsen-Beschriftungen mit kompakten Match-Kürzeln verbessert
- Matchlegende unter dem Diagramm ergänzt
- aktuelles Match weiterhin farblich hervorgehoben

## 3.2.0 – 25.09.2026

- Entwicklungsübersicht mit lokalem SVG-Diagramm hinzugefügt
- Bereich „Match-Entwicklung und Vergleich“ erweitert
- verschiedene Kennzahlen auswählbar:
  - Ø Aufnahme
  - offizieller 3-Dart-Average
  - Aufnahmen über 95
  - Aufnahmen bis 45
  - T19-Anteil
  - T20-Anteil
  - Checkoutquote
  - Leggewinnquote
- aktuelles Match im Diagramm farblich hervorgehoben
- Diagramm benötigt mindestens zwei Matches
- keine externen Bibliotheken und keine Netzwerkzugriffe für das Diagramm
- bestehende Parser-, Analyse- und Speicherlogik unverändert

## 3.1.3 – 25.09.2026

- Datenqualitätsanzeige vollständig entfernt
- versionierte lokale Speicherung eingeführt
- bestehende Array-Speicherstände und ältere JSON-Backups bleiben lesbar
- neue Backups enthalten eine `schemaVersion`
- sichere Fehlerbehandlung beibehalten
- DE-/GB-Sprachbuttons neben „JSON exportieren“ platziert
- Sprachbuttons im minimierten Zustand verborgen

## 3.1.2 – 25.09.2026

- Fehlerbehandlung und Datenqualitätsanzeige ergänzt
- DE-/GB-Sprachbuttons aus dem Header entfernt
- Sprachbuttons direkt neben „JSON exportieren“ platziert
- Sprachbuttons im minimierten Zustand verborgen

## 3.1.1 – 25.09.2026

- Coach-Bereich mit separater deutscher und englischer Ausgabe
- Trainingsvorschläge mit separater deutscher und englischer Ausgabe
- robuste Sprachumschaltung für dynamisch gerenderte Analyseinhalte
- bestehende lokale Speicherung von Sprache und Matches beibehalten
- JSON-Backup für gespeicherte Matches beibehalten

## 3.1.0 – 25.09.2026

- Übersetzung über ein isoliertes HTML-Fragment robuster gemacht
- Analysebeschreibungen, Warnmeldungen und Statusmeldungen erweitert übersetzt
- statische und dynamische Inhalte zuverlässiger zwischen Deutsch und Englisch umschaltbar

## 3.0.9 – 25.09.2026

- zusätzliche Übersetzungen für Analysebereiche, Tabellen, Hinweise und Fehlermeldungen ergänzt
- englische Darstellung der Coach- und Trainingsinhalte erweitert
- Übersetzungsabdeckung der Benutzeroberfläche verbessert

## 3.0.8 – 25.09.2026

- Projektname **History Analyzer - AD Coach - by KnuSpersTV** eingeführt
- umfangreichere Übersetzung der gerenderten Analyzer-Inhalte ergänzt
- Übersetzungen für Analysebereiche, Matchverwaltung und Backups erweitert
- deutsche und englische Beschriftungen konsolidiert

## 3.0.7 – 25.09.2026

- statische Bedienelemente übersetzbar gemacht
- Übersetzung von Titel, Buttons, Auswahlfeldern und Ansichtsoptionen ergänzt
- Sprachumschaltung auf die wichtigsten UI-Elemente erweitert
- CSS-gezeichnete DE-/GB-Flaggen aus 3.0.6 beibehalten

## 3.0.6 – 25.09.2026

- DE- und GB-Sprachbuttons mit CSS-gezeichneten Flaggen eingeführt
- Unicode-Flaggen durch stabilere CSS-Darstellung ersetzt
- Sprachbuttons und bestehende Analyzer-Funktionen beibehalten

## 3.0.5 – 25.09.2026

- sichtbare DE- und GB-Beschriftungen an den Sprachbuttons ergänzt
- Sprachbuttons für die spätere Übersetzungsfunktion vorbereitet
- stabile Analyzer-Basis aus 3.0.4 beibehalten

## 3.0.4 – 25.09.2026

- stabile Rescue-Version des Historien-Analyzers bereitgestellt
- Sprachbutton-Struktur für die spätere DE-/GB-Umschaltung vorbereitet
- Analyse der sichtbaren Autodarts Visit History beibehalten
- weiterhin genau ein globaler MutationObserver verwendet
