// ==UserScript==
// @name         History Analyzer - AD Coach - by KnuSpersTV
// @namespace    autodarts-performance-coach
// @version      3.1.1
// @description  History Analyzer - AD Coach - by KnuSpersTV mit robuster DE/GB-Übersetzung für die sichtbare Autodarts Visit History.
// @match        https://play.autodarts.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';

  const PANEL_ID = 'adpc-history-analyzer';
  const LANGUAGE_KEY = 'adpc_language_v1';
  let currentLanguage = 'de';
  try { currentLanguage = localStorage.getItem(LANGUAGE_KEY) === 'en' ? 'en' : 'de'; } catch (_) {}

  const STATIC_TRANSLATIONS = {
    de: {
      title: 'History Analyzer - AD Coach - by KnuSpersTV',
      topTitle: 'Zum Anfang',
      topAria: 'Zum Anfang springen',
      minimize: 'Minimieren',
      restore: 'Analyzer wiederherstellen',
      close: 'Schließen',
      player: 'Spieler',
      view: 'Ansicht',
      table: 'Tabelle',
      board: 'Dartboard',
      both: 'Beide',
      fieldDisplay: 'Feldanzeige',
      count: 'Anzahl',
      percent: 'Prozent',
      scope: 'Analyseumfang',
      current: 'Aktuelles Match',
      all: 'Aktuelles + gespeicherte',
      analyze: 'Analysieren',
      save: 'Jetzt speichern',
      clearSaved: 'Gespeicherte löschen',
      exportJson: 'JSON exportieren',
      reading: 'Lese Visit History …'
    },
    en: {
      title: 'History Analyzer - AD Coach - by KnuSpersTV',
      topTitle: 'Top',
      topAria: 'Jump to top',
      minimize: 'Minimize',
      restore: 'Restore analyzer',
      close: 'Close',
      player: 'Player',
      view: 'View',
      table: 'Table',
      board: 'Dartboard',
      both: 'Both',
      fieldDisplay: 'Field display',
      count: 'Count',
      percent: 'Percent',
      scope: 'Analysis scope',
      current: 'Current match',
      all: 'Current + saved',
      analyze: 'Analyze',
      save: 'Save now',
      clearSaved: 'Delete saved',
      exportJson: 'Export JSON',
      reading: 'Reading visit history …'
    }
  };

  function uiText(key) {
    return STATIC_TRANSLATIONS[currentLanguage]?.[key] || STATIC_TRANSLATIONS.de[key] || key;
  }


  // Translate only the HTML string produced by the analyzer. This avoids a
  // DOM-wide text walker and never observes or modifies Autodarts' page DOM.
  const RENDER_TRANSLATIONS = [
    ['Häufigste erfolgreiche Checkout-Restpunkte', 'Most common successful checkout scores'],
    ['Häufigste Restpunkte bei Fehlversuchen', 'Most common scores in failed attempts'],
    ['Checkoutquote nach Restscore-Bereich', 'Checkout rate by score range'],
    ['Match-Entwicklung und Vergleich', 'Match development and comparison'],
    ['Entwicklung: früher vs. zuletzt', 'Development: earlier vs. recent'],
    ['Gegnerischer Restscore vor deiner Aufnahme', 'Opponent score before your visit'],
    ['Feldverteilung und Dartboard', 'Field distribution and dartboard'],
    ['Scoring nach Aufnahmebereich', 'Scoring by visit range'],
    ['Dart- und Scoring-Kennzahlen', 'Dart and scoring metrics'],
    ['Aufnahme-Konstanz', 'Visit consistency'],
    ['Matchverwaltung und Backups', 'Match management and backups'],
    ['Top 3 Doppelfelder', 'Top 3 doubles'],
    ['Leg-Übersicht', 'Leg overview'],
    ['Trainingsvorschläge', 'Training suggestions'],
    ['Aufnahmeverlauf', 'Visit history'],
    ['Eigene Legdarts', 'Own leg darts'],
    ['Checkout-Analyse', 'Checkout analysis'],
    ['Scoring-Fokus', 'Scoring focus'],
    ['Aufnahmeverteilung', 'Visit distribution'],
    ['BUST-Analyse', 'BUST analysis'],
    ['Gespeicherte Matches', 'Saved matches'],
    ['Ermittelter Fokus', 'Detected focus'],
    ['Gesamtes Match', 'Whole match'],
    ['Alle Legs', 'All legs'],
    ['Feldverteilung', 'Field distribution'],
    ['Doppelfeld', 'Double'],
    ['Doppelfelder', 'Doubles'],
    ['Trefferanteil', 'Hit share'],
    ['Anteil an allen Darts', 'Share of all darts'],
    ['Treffer', 'Hits'],
    ['Aufnahmen', 'Visits'],
    ['Aufnahmebereich', 'Visit range'],
    ['Aufnahme', 'Visit'],
    ['Rest vorher', 'Score before'],
    ['Rest danach', 'Score after'],
    ['Finishbarkeit vorher', 'Finishability before'],
    ['Eigener Restscore', 'Own score'],
    ['Gegnerischer Restscore', 'Opponent score'],
    ['Restscore vor Aufnahme', 'Score before visit'],
    ['Restscore vor Fehlversuch', 'Score before failed attempt'],
    ['Restscore vor erfolgreichem Checkout', 'Score before successful checkout'],
    ['Erfolgreiche Checkouts', 'Successful checkouts'],
    ['Fehlversuche', 'Failed attempts'],
    ['Versuche', 'Attempts'],
    ['Erfolgreich', 'Successful'],
    ['Checkoutquote', 'Checkout rate'],
    ['Leggewinnquote', 'Leg win rate'],
    ['Eigene Leggewinne', 'Own leg wins'],
    ['Legdartquote', 'Leg-dart rate'],
    ['Gewonnen', 'Won'],
    ['Nicht gewonnen', 'Not won'],
    ['Leg gewonnen', 'Leg won'],
    ['Weiter', 'Continue'],
    ['Kein 3-Dart-Finish', 'No 3-dart finish'],
    ['Beide Spieler finishbar', 'Both players finishable'],
    ['Nur eigener Restscore finishbar', 'Only own score finishable'],
    ['Nur Gegner finishbar', 'Only opponent finishable'],
    ['Keiner finishbar', 'Neither finishable'],
    ['Direkter Druckvergleich', 'Direct pressure comparison'],
    ['Direkter Vergleich zweier Matches', 'Direct comparison of two matches'],
    ['Kennzahl', 'Metric'],
    ['Zeitraum', 'Period'],
    ['Früher', 'Earlier'],
    ['Zuletzt', 'Recent'],
    ['Gespeichert', 'Saved'],
    ['Gegner', 'Opponent'],
    ['Aktionen', 'Actions'],
    ['Match', 'Match'],
    ['Legs', 'Legs'],
    ['Darts', 'Darts'],
    ['Höchste', 'Highest'],
    ['Ø Aufnahme', 'Visit average'],
    ['Auswertung', 'Evaluation'],
    ['Ergebnis', 'Result'],
    ['Situation', 'Situation'],
    ['Status', 'Status'],
    ['Single-Ring', 'Single ring'],
    ['Triple-Ring', 'Triple ring'],
    ['Double-Ring', 'Double ring'],
    ['Außen: D · Mitte: T · innen: S', 'Outer: D · middle: T · inner: S'],
    ['Basis: Triple-Treffer', 'Basis: triple hits'],
    ['Treffer auf 19/20', 'hits on 19/20'],
    ['Triple-Treffer', 'Triple hits'],
    ['aller Darts auf 19', 'of all darts at 19'],
    ['aller Darts auf 20', 'of all darts at 20'],
    ['Rang', 'Rank'],
    ['Punkte offiziell', 'Official points'],
    ['Rohwert', 'Raw score'],
    ['MISS-Anteil', 'MISS share'],
    ['BUST-Quote', 'BUST rate'],
    ['Median Aufnahme', 'Visit median'],
    ['Streuung der Aufnahmen', 'Visit spread'],
    ['Stärkste Serie >95', 'Strongest >95 streak'],
    ['Schwächste Serie ≤45', 'Weakest ≤45 streak'],
    ['Längste Serie über 95', 'Longest streak above 95'],
    ['Längste Serie bis 45', 'Longest streak up to 45'],
    ['Darts im erfolgreichen Checkout', 'Darts in successful checkout'],
    ['Erkannte Misses', 'Detected misses'],
    ['Noch keine Doppeltreffer', 'No double hits yet'],
    ['Noch keine erfolgreichen Checkouts.', 'No successful checkouts yet.'],
    ['Noch keine erfolgreichen Checkout-Restpunkte.', 'No successful checkout scores yet.'],
    ['Noch keine Checkout-Fehlversuche', 'No failed checkout attempts yet'],
    ['Noch keine Aufnahmen vorhanden.', 'No visits available yet.'],
    ['Keine gespeicherten Matches vorhanden.', 'No saved matches available.'],
    ['Chronologischer Verlauf deiner erkannten Aufnahmen.', 'Chronological history of your detected visits.'],
    ['Gezählte wird', 'Counted'],
    ['Die Tabelle enthält automatisch gespeicherte Matches.', 'The table contains automatically saved matches.'],
    ['Die Vorschläge werden aus deinen beobachteten Aufnahmen, Finish-Situationen und Feldverteilungen abgeleitet.', 'The suggestions are derived from your observed visits, finishing situations, and field distribution.'],
    ['Die Bereiche beziehen sich auf den offiziellen Aufnahmewert inklusive MISS- und BUST-Aufnahmen im Nenner.', 'The ranges use the official visit score and include MISS and BUST visits in the denominator.'],
    ['Im Board stehen je Segment die Werte für Single, Triple und Double; im Bull stehen Außen-Bull und Bull.', 'The board shows Single, Triple, and Double values for each segment; the Bull shows outer bull and bull.'],
    ['Die Hinweise beschreiben Muster in den vorliegenden Daten und ersetzen keine Trefferquote: Dafür müsste zusätzlich bekannt sein, welche Felder jeweils anvisiert wurden.', 'These notes describe patterns in the available data and are not hit rates because the intended targets are unknown.'],
    ['Die zweite Tabelle vergleicht, ob du selbst, dein Gegner, beide oder keiner von euch vor der Aufnahme finishbar war.', 'The second table compares whether you, your opponent, both, or neither could finish before the visit.'],
    ['Gezählt wird eine Aufnahme, wenn dein eigener Restscore davor mit 1, 2 oder 3 Darts finishbar war.', 'A visit is counted when your own score before it was finishable in 1, 2, or 3 darts.'],
    ['Der Bereich „Restscore 2–170“ enthält nur Aufnahmen, bei denen dein eigener Restscore unmittelbar davor zwischen 2 und 170 lag.', 'The “score 2–170” range only includes visits where your own score immediately before the visit was between 2 and 170.'],
    ['MISS- und BUST-Aufnahmen bleiben mit ihrem offiziellen Wert von 0 enthalten.', 'MISS and BUST visits remain included with their official value of 0.'],
    ['Backups enthalten die lokal gespeicherten Matches einschließlich eigener Namen.', 'Backups contain locally saved matches including custom names.'],
    ['Verglichen werden die ältere Hälfte und die zuletzt gespeicherten Matches', 'The older half is compared with the most recently saved matches'],
    ['Noch keine gespeicherten Visit-History-Daten gefunden.', 'No saved visit-history data found yet.'],
    ['Öffne ein Match, gehe auf „Breakdown“ und warte, bis die Legs geladen sind.', 'Open a match, go to “Breakdown,” and wait until the legs have loaded.'],
    ['Automatisch gespeichert', 'Automatically saved'],
    ['lokal gespeichert', 'saved locally'],
    ['JSON exportieren', 'Export JSON'],
    ['Backup exportieren', 'Export backup'],
    ['Backup importieren', 'Import backup'],
    ['Umbenennen', 'Rename'],
    ['Löschen', 'Delete'],
    ['Prozent = Anteil an allen ', 'Percent = share of all '],
    [' geworfenen Darts. Misses bleiben im Nenner. Klicke auf einen Spaltenkopf, um die Tabelle zu sortieren.', ' darts thrown. Misses remain in the denominator. Click a column header to sort the table.'],
    ['Anteil = Treffer auf das jeweilige Doppel geteilt durch alle geworfenen Darts. Das ist keine Trefferquote, weil die Anzahl der gezielten Würfe nicht bekannt ist.', 'Share = hits on the respective double divided by all darts thrown. This is not a hit rate because the number of intended throws is unknown.'],
    ['Die Bereiche beziehen sich auf den offiziellen Aufnahmewert inklusive MISS- und BUST-Aufnahmen im Nenner.', 'The ranges use the official visit score and include MISS and BUST visits in the denominator.'],
    ['Die Restscore-Bereiche zeigen, in welchem Scorebereich deine Checkoutversuche stattfanden. Sie sind unabhängig von der theoretischen Finishdistanz und zählen nur Restscores von 2 bis 170.', 'The score ranges show which score range your checkout attempts occurred in. They are independent of the theoretical finish distance and only count scores from 2 to 170.'],
    ['Ein Versuch wird gezählt, wenn der eigene Restscore vor der Aufnahme mit 1, 2 oder 3 Darts finishbar war. Die Analyse wertet nur tatsächlich gespielte Aufnahmen aus; anvisierte Felder sind nicht bekannt.', 'An attempt is counted when your own score before the visit was finishable in 1, 2, or 3 darts. The analysis evaluates only visits actually played; intended targets are not known.'],
    ['Die Tabelle enthält automatisch gespeicherte Matches. T19-/T20-Anteil = jeweilige Triple-Treffer geteilt durch alle Darts des Matches.', 'The table contains automatically saved matches. T19/T20 share = respective triple hits divided by all darts in the match.'],
    ['Die zweite Tabelle vergleicht, ob du selbst, dein Gegner, beide oder keiner von euch vor der Aufnahme finishbar war.', 'The second table compares whether you, your opponent, both, or neither could finish before the visit.'],
    ['Als BUST wird eine Aufnahme gewertet, bei der Autodarts den offiziellen Aufnahmewert auf 0 setzt und der Restscore unverändert bleibt. Die verworfenen Rohpunkte zeigen nur die Summe der aus den sichtbaren Dartnotationen berechneten Punkte.', 'A BUST is a visit where Autodarts sets the official visit score to 0 and the remaining score stays unchanged. The discarded raw points show only the sum calculated from the visible dart notations.'],
    ['Der Median beschreibt die mittlere Aufnahme, ohne dass einzelne sehr hohe oder sehr niedrige Aufnahmen den Wert stark verschieben. Die Streuung ist die Standardabweichung der offiziellen Aufnahmewerte. Serien beziehen sich auf direkt aufeinanderfolgende eigene Aufnahmen.', 'The median describes the middle visit without individual very high or low visits shifting the value too much. Spread is the standard deviation of official visit scores. Streaks refer to consecutive own visits.'],
    ['Chronologischer Verlauf deiner erkannten Aufnahmen. „Finishbarkeit“ bezieht sich auf den Restscore vor der Aufnahme; gezielte Felder sind aus der Visit History nicht bekannt.', 'Chronological history of your detected visits. “Finishability” refers to the score before the visit; intended targets are not available from the visit history.'],
    ['Eine Aufnahme zählt zu dem Leg, in dem sie gespielt wurde. Grün markiert gewonnene Legs.', 'A visit belongs to the leg in which it was played. Green marks won legs.'],
    ['Die Vorschläge werden aus deinen beobachteten Aufnahmen, Finish-Situationen und Feldverteilungen abgeleitet.', 'The suggestions are derived from your observed visits, finishing situations, and field distribution.'],
    ['Die Hinweise beschreiben Muster in den vorliegenden Daten und ersetzen keine Trefferquote: Dafür müsste zusätzlich bekannt sein, welche Felder jeweils anvisiert wurden.', 'These notes describe patterns in the available data and are not hit rates because the intended targets are unknown.'],
    ['Im Board stehen je Segment die Werte für Single, Triple und Double; im Bull stehen Außen-Bull und Bull.', 'The board shows Single, Triple, and Double values for each segment; the Bull shows outer bull and bull.'],
    ['Der Bereich „Restscore 2–170“ enthält nur Aufnahmen, bei denen dein eigener Restscore unmittelbar davor zwischen 2 und 170 lag. Die Werte basieren auf den offiziellen Aufnahmewerten; der 3-Dart-Average wird anhand der tatsächlich geworfenen Darts hochgerechnet. MISS- und BUST-Aufnahmen bleiben mit ihrem offiziellen Wert von 0 enthalten.', 'The “score 2–170” range only includes visits where your own score immediately before the visit was between 2 and 170. Values are based on official visit scores; the 3-dart average is extrapolated from the darts actually thrown. MISS and BUST visits remain included with their official value of 0.'],
    ['Backups enthalten die lokal gespeicherten Matches einschließlich eigener Namen.', 'Backups contain locally saved matches including custom names.'],
    ['Für einen direkten Matchvergleich werden mindestens zwei passende Matches benötigt.', 'At least two matching games are needed for a direct comparison.'],
    ['Für einen Trendvergleich werden mindestens zwei gespeicherte Matches benötigt.', 'At least two saved games are needed for a trend comparison.'],
    ['Verglichen werden die ältere Hälfte und die zuletzt gespeicherten Matches', 'The older half is compared with the most recently saved matches'],
    ['Noch keine BUST-Aufnahmen in den vorliegenden Daten.', 'No BUST visits in the available data yet.'],
    ['Noch keine erfolgreichen Checkouts in den vorliegenden Daten.', 'No successful checkouts in the available data yet.'],
    ['Noch keine Checkout-Fehlversuche in den vorliegenden Daten.', 'No failed checkout attempts in the available data yet.'],
    ['T19-/T20-Anteil', 'T19/T20 share'],
    ['Finishdistanz vor Aufnahme', 'Finish distance before visit'],
    ['Finishdistanz', 'Finish distance'],
    ['Anteil an erfolgreichen Checkouts', 'Share of successful checkouts'],
    ['Anteil an Fehlversuchen', 'Share of failed attempts'],
    ['Anteil an allen BUSTs', 'Share of all BUSTs'],
    ['verworfene Rohpunkte', 'discarded raw points'],
    ['Verworfene Rohpunkte gesamt', 'Total discarded raw points'],
    ['Ø verworfene Rohpunkte', 'Average discarded raw points'],
    ['Restscore vor BUST', 'Score before BUST'],
    ['Häufigste Restpunkte vor BUSTs', 'Most common scores before BUSTs'],
    ['Dartboard mit Feldanteilen', 'Dartboard with field shares'],
    ['Nach ', 'Sort by '],
    [' sortieren', ''],
    ['Noch keine BUST-Aufnahmen', 'No BUST visits yet'],
    ['Keine gültigen Matches in der Backup-Datei gefunden.', 'No valid matches found in the backup file.'],
    ['Backup konnte nicht gelesen werden.', 'Could not read backup.'],
    ['Match gelöscht.', 'Match deleted.'],
    ['Lokale Match-Historie geleert.', 'Local match history cleared.'],
    ['Die lokale Match-Historie konnte nicht geleert werden.', 'Could not clear local match history.'],
    ['Keine geladene Visit History zum Speichern gefunden.', 'No loaded visit history found to save.'],
    ['Speichern fehlgeschlagen. Browser-Speicher ist eventuell blockiert.', 'Save failed. Browser storage may be blocked.'],
    ['Seite gewechselt. Lade gespeicherte Analyse …', 'Page changed. Loading saved analysis …']
  ];

  const ADDITIONAL_RENDER_TRANSLATIONS = [
    ['Dart- und Scoring-Kennzahlen', 'Dart and scoring metrics'],
    ['3-Dart-Average offiziell', 'Official 3-dart average'],
    ['Ø Aufnahme offiziell', 'Official visit average'],
    ['Ø Rohpunkte pro Dart', 'Raw points per dart'],
    ['Verworfene Rohpunkte gesamt', 'Total discarded raw points'],
    ['Ø verworfene Rohpunkte', 'Average discarded raw points'],
    ['Anteil an allen geworfenen Darts', 'Share of all darts thrown'],
    ['Anteil an erfolgreichen Checkouts', 'Share of successful checkouts'],
    ['Anteil an Fehlversuchen', 'Share of failed attempts'],
    ['Anteil an allen BUSTs', 'Share of all BUSTs'],
    ['Häufigste Restpunkte vor BUSTs', 'Most common scores before BUSTs'],
    ['Restscore vor erfolgreichem Checkout', 'Score before successful checkout'],
    ['Restscore vor Fehlversuch', 'Score before failed attempt'],
    ['Restscore vor BUST', 'Score before BUST'],
    ['Restscore vor Aufnahme', 'Score before visit'],
    ['Restscore 2–170 vor der Aufnahme', 'Score 2–170 before the visit'],
    ['Finishdistanz vor Aufnahme', 'Finish distance before visit'],
    ['Direkter Vergleich zweier Matches', 'Direct comparison of two matches'],
    ['Direkter Druckvergleich', 'Direct pressure comparison'],
    ['Checkoutquote nach Restscore-Bereich', 'Checkout rate by score range'],
    ['Match-Entwicklung und Vergleich', 'Match development and comparison'],
    ['Aufnahme-Konstanz', 'Visit consistency'],
    ['Aufnahmeverteilung', 'Visit distribution'],
    ['Aufnahmeverlauf', 'Visit history'],
    ['Aufnahmenbereich', 'Visit range'],
    ['Feldverteilung und Dartboard', 'Field distribution and dartboard'],
    ['Matchverwaltung und Backups', 'Match management and backups'],
    ['Doppelfeld', 'Double'],
    ['Doppelfelder', 'Doubles'],
    ['Triple-Treffer', 'Triple hits'],
    ['Trefferanteil', 'Hit share'],
    ['Leggewinnquote', 'Leg win rate'],
    ['Eigene Leggewinne', 'Own leg wins'],
    ['Eigene Legdarts', 'Own leg darts'],
    ['Eigener Restscore', 'Own score'],
    ['Gegnerischer Restscore', 'Opponent score'],
    ['Finishbarkeit vorher', 'Finishability before'],
    ['Noch keine BUST-Aufnahmen in den vorliegenden Daten.', 'No BUST visits in the available data yet.'],
    ['Noch keine erfolgreichen Checkouts in den vorliegenden Daten.', 'No successful checkouts in the available data yet.'],
    ['Noch keine Checkout-Fehlversuche in den vorliegenden Daten.', 'No failed checkout attempts in the available data yet.'],
    ['Noch keine erfolgreichen Checkout-Restpunkte.', 'No successful checkout scores yet.'],
    ['Keine gespeicherten Matches vorhanden.', 'No saved matches available.'],
    ['Keine gespeicherten Matches', 'No saved matches'],
    ['Keine Aufnahmen vorhanden.', 'No visits available.'],
    ['Noch keine Aufnahmen vorhanden.', 'No visits available yet.'],
    ['Noch keine Doppeltreffer', 'No double hits yet'],
    ['Für einen direkten Matchvergleich werden mindestens zwei passende Matches benötigt.', 'At least two matching games are needed for a direct comparison.'],
    ['Für einen Trendvergleich werden mindestens zwei gespeicherte Matches benötigt.', 'At least two saved games are needed for a trend comparison.'],
    ['Die Tabelle enthält automatisch gespeicherte Matches. T19-/T20-Anteil = jeweilige Triple-Treffer geteilt durch alle Darts des Matches.', 'The table contains automatically saved matches. T19/T20 share = respective triple hits divided by all darts in the match.'],
    ['Die Bereiche beziehen sich auf den offiziellen Aufnahmewert inklusive MISS- und BUST-Aufnahmen im Nenner.', 'The ranges use the official visit score and include MISS and BUST visits in the denominator.'],
    ['Die Restscore-Bereiche zeigen, in welchem Scorebereich deine Checkoutversuche stattfanden. Sie sind unabhängig von der theoretischen Finishdistanz und zählen nur Restscores von 2 bis 170.', 'The score ranges show which score range your checkout attempts occurred in. They are independent of the theoretical finish distance and only count scores from 2 to 170.'],
    ['Ein Versuch wird gezählt, wenn der eigene Restscore vor der Aufnahme mit 1, 2 oder 3 Darts finishbar war. Die Analyse wertet nur tatsächlich gespielte Aufnahmen aus; anvisierte Felder sind nicht bekannt.', 'An attempt is counted when your own score before the visit was finishable in 1, 2, or 3 darts. The analysis evaluates only visits actually played; intended targets are not known.'],
    ['Die Hinweise beschreiben Muster in den vorliegenden Daten und ersetzen keine Trefferquote: Dafür müsste zusätzlich bekannt sein, welche Felder jeweils anvisiert wurden.', 'These notes describe patterns in the available data and are not hit rates because the intended targets are unknown.'],
    ['Im Board stehen je Segment die Werte für Single, Triple und Double; im Bull stehen Außen-Bull und Bull.', 'The board shows Single, Triple, and Double values for each segment; the Bull shows outer bull and bull.'],
    ['Eine Aufnahme zählt zu dem Leg, in dem sie gespielt wurde. Grün markiert gewonnene Legs.', 'A visit belongs to the leg in which it was played. Green marks won legs.'],
    ['Die Vorschläge werden aus deinen beobachteten Aufnahmen, Finish-Situationen und Feldverteilungen abgeleitet.', 'The suggestions are derived from your observed visits, finishing situations, and field distribution.'],
    ['Als BUST wird eine Aufnahme gewertet, bei der Autodarts den offiziellen Aufnahmewert auf 0 setzt und der Restscore unverändert bleibt. Die verworfenen Rohpunkte zeigen nur die Summe der aus den sichtbaren Dartnotationen berechneten Punkte.', 'A BUST is a visit where Autodarts sets the official visit score to 0 and the remaining score stays unchanged. The discarded raw points show only the sum calculated from the visible dart notations.'],
    ['Der Median beschreibt die mittlere Aufnahme, ohne dass einzelne sehr hohe oder sehr niedrige Aufnahmen den Wert stark verschieben. Die Streuung ist die Standardabweichung der offiziellen Aufnahmewerte. Serien beziehen sich auf direkt aufeinanderfolgende eigene Aufnahmen.', 'The median describes the middle visit without individual very high or low visits shifting the value too much. Spread is the standard deviation of official visit scores. Streaks refer to consecutive own visits.'],
    ['Chronologischer Verlauf deiner erkannten Aufnahmen. „Finishbarkeit“ bezieht sich auf den Restscore vor der Aufnahme; gezielte Felder sind aus der Visit History nicht bekannt.', 'Chronological history of your detected visits. “Finishability” refers to the score before the visit; intended targets are not available from the visit history.'],
    ['Der Bereich „Restscore 2–170“ enthält nur Aufnahmen, bei denen dein eigener Restscore unmittelbar davor zwischen 2 und 170 lag. Die Werte basieren auf den offiziellen Aufnahmewerten; der 3-Dart-Average wird anhand der tatsächlich geworfenen Darts hochgerechnet. MISS- und BUST-Aufnahmen bleiben mit ihrem offiziellen Wert von 0 enthalten.', 'The “score 2–170” range only includes visits where your own score immediately before the visit was between 2 and 170. Values are based on official visit scores; the 3-dart average is extrapolated from the darts actually thrown. MISS and BUST visits remain included with their official value of 0.'],
    ['Backups enthalten die lokal gespeicherten Matches einschließlich eigener Namen.', 'Backups contain locally saved matches including custom names.'],
    ['Dartboard mit Feldanteilen', 'Dartboard with field shares'],
    ['Nach ', 'Sort by '],
    [' sortieren', ''],
    ['Seite gewechselt. Lade gespeicherte Analyse …', 'Page changed. Loading saved analysis …'],
    ['Noch keine gespeicherten Visit-History-Daten gefunden. Öffne ein Match, gehe auf „Breakdown“ und warte, bis die Legs geladen sind.', 'No saved visit-history data found yet. Open a match, go to “Breakdown,” and wait until the legs have loaded.'],
    ['Keine geladene Visit History zum Speichern gefunden.', 'No loaded visit history found to save.'],
    ['Speichern fehlgeschlagen. Browser-Speicher ist eventuell blockiert.', 'Save failed. Browser storage may be blocked.'],
    ['Lokale Match-Historie geleert.', 'Local match history cleared.'],
    ['Die lokale Match-Historie konnte nicht geleert werden.', 'Could not clear local match history.'],
    ['Backup konnte nicht gelesen werden.', 'Could not read backup.'],
    ['Keine gültigen Matches in der Backup-Datei gefunden.', 'No valid matches found in the backup file.'],
    ['Match gelöscht.', 'Match deleted.'],
    ['Automatisch gespeichert', 'Automatically saved'],
    ['lokal gespeichert', 'saved locally'],
    ['Gespeichert', 'Saved'],
    ['Umbenennen', 'Rename'],
    ['Löschen', 'Delete'],
    ['Backup exportieren', 'Export backup'],
    ['Backup importieren', 'Import backup']
  ];

  RENDER_TRANSLATIONS.push(...ADDITIONAL_RENDER_TRANSLATIONS);
  const SORTED_RENDER_TRANSLATIONS = RENDER_TRANSLATIONS
    .filter(([de, en]) => de && de !== en)
    .sort((a, b) => b[0].length - a[0].length);

  function translateRenderedText(text) {
    let value = String(text ?? '');
    for (const [de, en] of SORTED_RENDER_TRANSLATIONS) value = value.split(de).join(en);
    value = value.replace(/(\d+)-Dart-Finish/g, '$1-dart finish');
    value = value.replace(/^(\d+) Triples$/, '$1 triples');
    value = value.replace(/^(\d+) Treffer$/, '$1 hits');
    value = value.replace(/^Leg (\d+)$/, 'Leg $1');
    value = value.replace(/^Dein ermittelter Scoring-Fokus liegt eher auf der (19|20)\. Die T(19|20) wurde (\d+)-mal getroffen\.$/, 'Your detected scoring focus is more toward $1. T$2 was hit $3 times.');
    value = value.replace(/^Deine Daten zeigen keinen klaren 19er- oder 20er-Fokus\. Beide Felder werden ähnlich genutzt\.$/, 'Your data shows no clear 19 or 20 focus. Both fields are used similarly.');
    value = value.replace(/^Der Anteil schwacher Aufnahmen bis 45 ist mit (.+) erhöht\. Hier liegt ein möglicher Trainingsschwerpunkt\.$/, 'The share of weak visits up to 45 is elevated at $1. This may be a useful training focus.');
    value = value.replace(/^Der Anteil schwacher Aufnahmen bis 45 liegt bei (.+)\.$/, 'The share of weak visits up to 45 is $1.');
    value = value.replace(/^Du erzielst (\d+) Aufnahmen über 95 \((.+)\)\.$/, 'You scored $1 visits above 95 ($2).');
    value = value.replace(/^Aufnahmen über 95 sind bisher mit (\d+) \((.+)\) noch eher selten\.$/, 'Visits above 95 are still relatively rare: $1 ($2).');
    value = value.replace(/^Am häufigsten triffst du (D\d+) \((\d+)-mal; (.+) aller Darts\)\.$/, 'You hit $1 most often ($2 times; $3 of all darts).');
    value = value.replace(/^Scoring: Spiele 20 Aufnahmen mit Fokus auf (.+)\. Zähle dabei nur die offiziellen Aufnahmewerte\.$/, 'Scoring: Play 20 visits focusing on $1. Count only official visit scores.');
    value = value.replace(/^Konstanz: Spiele 20 Aufnahmen und setze dir das Ziel, mindestens 15 davon über 45 Punkte zu spielen\.$/, 'Consistency: Play 20 visits and aim to score above 45 in at least 15 of them.');
    value = value.replace(/^Scoring: Spiele 20 Aufnahmen mit dem Ziel, mindestens 10 davon über 95 Punkte zu erzielen\.$/, 'Scoring: Play 20 visits and aim for at least 10 scores above 95.');
    value = value.replace(/^Checkouts: Trainiere 15 Situationen für (.+)\. Deine bisherige Legdartquote in dieser Kategorie liegt bei (.+)\.$/, 'Checkouts: Train 15 situations for $1. Your current leg-dart rate in this category is $2.');
    value = value.replace(/^Checkout-Fokus: Wiederhole besonders den Restscore (\d+); dort wurden (\d+) Fehlversuch(e)? erkannt\.$/, 'Checkout focus: Repeat score $1 in particular; $2 failed attempt$3 were detected there.');
    value = value.replace(/^BUST-Kontrolle: Trainiere vor dem Wurf kurz den sicheren Restweg\. In den Daten wurden (\d+) BUST(s)? erkannt\.$/, 'BUST control: Briefly rehearse the safe route before throwing. The data contains $1 BUST$2.');
    value = value.replace(/^Trefferbild: Baue eine kurze Präzisionsserie mit 30 Darts ein; (\d+) MISS(es)? wurden erkannt\.$/, 'Accuracy: Add a short 30-dart precision series; $1 MISS$2 were detected.');
    value = value.replace(/^Doppelroutine: Spiele je 10 Darts auf (.+)\. Das sind deine drei am häufigsten getroffenen Doppelfelder\.$/, 'Doubles routine: Play 10 darts at each of $1. These are your three most frequently hit doubles.');
    value = value.replace(/^Darts: (\d+) · davon Treffer: (\d+) · erkannte Misses: (\d+) · Punkte offiziell: (\d+) · Rohwert: (\d+)$/, 'Darts: $1 · hits: $2 · detected misses: $3 · official points: $4 · raw score: $5');
    return value;
  }

  function translateRenderedHtml(html) {
    if (currentLanguage !== 'en') return html;
    const template = document.createElement('template');
    template.innerHTML = String(html);
    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(node => { node.nodeValue = translateRenderedText(node.nodeValue); });
    template.content.querySelectorAll('[title],[aria-label]').forEach(element => {
      if (element.title) element.title = translateRenderedText(element.title);
      if (element.getAttribute('aria-label')) element.setAttribute('aria-label', translateRenderedText(element.getAttribute('aria-label')));
    });
    return template.innerHTML;
  }

  /* Legacy text replacements retained below for compatibility with the 3.0.x
     code path; the detached-fragment pass above handles all visible text. */
  function translateRenderedHtmlLegacy(text) {
    return String(text).replace(/>([^<>]*)</g, (match, text) => {
      let value = text;
      const leading = value.match(/^\s*/)?.[0] || '';
      const trailing = value.match(/\s*$/)?.[0] || '';
      let core = value.slice(leading.length, value.length - trailing.length || value.length);
      for (const [de, en] of SORTED_RENDER_TRANSLATIONS) core = core.split(de).join(en);
      core = core.replace(/(\d+)-Dart-Finish/g, '$1-dart finish');
      core = core.replace(/^(\d+) Triples$/, '$1 triples');
      core = core.replace(/^(\d+) Treffer$/, '$1 hits');
      core = core.replace(/^Leg (\d+)$/, 'Leg $1');
      core = core.replace(/^Dein ermittelter Scoring-Fokus liegt eher auf der (19|20)\. Die T(19|20) wurde (\d+)-mal getroffen\.$/, 'Your detected scoring focus is more toward $1. T$2 was hit $3 times.');
      core = core.replace(/^Deine Daten zeigen keinen klaren 19er- oder 20er-Fokus\. Beide Felder werden ähnlich genutzt\.$/, 'Your data shows no clear 19 or 20 focus. Both fields are used similarly.');
      core = core.replace(/^Der Anteil schwacher Aufnahmen bis 45 ist mit (.+) erhöht\. Hier liegt ein möglicher Trainingsschwerpunkt\.$/, 'The share of weak visits up to 45 is elevated at $1. This may be a useful training focus.');
      core = core.replace(/^Der Anteil schwacher Aufnahmen bis 45 liegt bei (.+)\.$/, 'The share of weak visits up to 45 is $1.');
      core = core.replace(/^Du erzielst (\d+) Aufnahmen über 95 \((.+)\)\.$/, 'You scored $1 visits above 95 ($2).');
      core = core.replace(/^Aufnahmen über 95 sind bisher mit (\d+) \((.+)\) noch eher selten\.$/, 'Visits above 95 are still relatively rare: $1 ($2).');
      core = core.replace(/^Am häufigsten triffst du (D\d+) \((\d+)-mal; (.+) aller Darts\)\.$/, 'You hit $1 most often ($2 times; $3 of all darts).');
      core = core.replace(/^Scoring: Spiele 20 Aufnahmen mit Fokus auf (.+)\. Zähle dabei nur die offiziellen Aufnahmewerte\.$/, 'Scoring: Play 20 visits focusing on $1. Count only official visit scores.');
      core = core.replace(/^Konstanz: Spiele 20 Aufnahmen und setze dir das Ziel, mindestens 15 davon über 45 Punkte zu spielen\.$/, 'Consistency: Play 20 visits and aim to score above 45 in at least 15 of them.');
      core = core.replace(/^Scoring: Spiele 20 Aufnahmen mit dem Ziel, mindestens 10 davon über 95 Punkte zu erzielen\.$/, 'Scoring: Play 20 visits and aim for at least 10 scores above 95.');
      core = core.replace(/^Checkouts: Trainiere 15 Situationen für (.+)\. Deine bisherige Legdartquote in dieser Kategorie liegt bei (.+)\.$/, 'Checkouts: Train 15 situations for $1. Your current leg-dart rate in this category is $2.');
      core = core.replace(/^Checkout-Fokus: Wiederhole besonders den Restscore (\d+); dort wurden (\d+) Fehlversuch(e)? erkannt\.$/, 'Checkout focus: Repeat score $1 in particular; $2 failed attempt$3 were detected there.');
      core = core.replace(/^BUST-Kontrolle: Trainiere vor dem Wurf kurz den sicheren Restweg\. In den Daten wurden (\d+) BUST(s)? erkannt\.$/, 'BUST control: Briefly rehearse the safe route before throwing. The data contains $1 BUST$2.');
      core = core.replace(/^Trefferbild: Baue eine kurze Präzisionsserie mit 30 Darts ein; (\d+) MISS(es)? wurden erkannt\.$/, 'Accuracy: Add a short 30-dart precision series; $1 MISS$2 were detected.');
      core = core.replace(/^Doppelroutine: Spiele je 10 Darts auf (.+)\. Das sind deine drei am häufigsten getroffenen Doppelfelder\.$/, 'Doubles routine: Play 10 darts at each of $1. These are your three most frequently hit doubles.');
      core = core.replace(/^Darts: (\d+) · davon Treffer: (\d+) · erkannte Misses: (\d+) · Punkte offiziell: (\d+) · Rohwert: (\d+)$/, 'Darts: $1 · hits: $2 · detected misses: $3 · official points: $4 · raw score: $5');
      return `>${leading}${core}${trailing}<`;
    });
  }

  // Emergency duplicate guard. The rest of this file intentionally remains
  // identical to the previously confirmed stable 3.0.2 implementation.
  if (window.__ADPC_RESCUE_ANALYZER_ACTIVE__) return;
  if (document.getElementById(PANEL_ID)) return;
  window.__ADPC_RESCUE_ANALYZER_ACTIVE__ = true;
  const STORAGE_KEY = 'adpc_saved_matches_v1';
  const PREFERRED_PLAYER_KEY = 'adpc_preferred_player_v1';
  const PANEL_POSITION_KEY = 'adpc_panel_position_v1';
  const LEG_HEADING = /^Leg\s+(\d+)(?:\s+|\s*[-–:]\s*)(?:Visit History|Aufnahmeverlauf|Aufnahmenverlauf|Aufschlüsselung)$/i;
  const playerNames = new Set();
  let panel;
  let output;
  let playerSelect;
  let panelDrag = null;
  let fieldSort = { key: 'field', direction: 'asc' };
  let comparisonSelection = { a: '', b: '' };
  let modeSelect;
  let viewSelect;
  let scopeSelect;
  let savedStatus;
  let lastAnalysis = null;
  let lastMatch = null;
  let parseTimer;
  let isMinimized = false;
  let lastRoute = location.href;
  let lastAutoSaveFingerprint = "";
  // Die bisherigen Standardzustände bleiben erhalten: Leg-Übersicht,
  // Gegnerdruck und Match-Entwicklung starten geschlossen; die übrigen
  // Analysebereiche starten offen.
  const sectionOpen = {
    scoringFocus: true,
    thresholds: true,
    fields: true,
    topDoubles: true,
    scoringBands: true,
    legs: false,
    coach: true,
    training: true,
    trend: true,
    pressure: false,
    ownLegdarts: true,
    checkout: true,
    busts: false,
    dartStats: true,
    consistency: false,
    visits: false,
    management: false,
    development: false
  };

  const FINISH_DARTS = new Set([
    ...Array.from({ length: 20 }, (_, i) => (i + 1) * 2),
    50
  ]);
  const ALL_DART_VALUES = [
    ...Array.from({ length: 20 }, (_, i) => i + 1),
    ...Array.from({ length: 20 }, (_, i) => (i + 1) * 2),
    ...Array.from({ length: 20 }, (_, i) => (i + 1) * 3),
    25, 50
  ];
  const FINISHABILITY = buildFinishability();

  function buildFinishability() {
    const one = new Set(FINISH_DARTS);
    const two = new Set();
    const three = new Set();
    for (const a of ALL_DART_VALUES) {
      for (const b of FINISH_DARTS) two.add(a + b);
    }
    for (const a of ALL_DART_VALUES) {
      for (const b of ALL_DART_VALUES) {
        for (const c of FINISH_DARTS) three.add(a + b + c);
      }
    }
    return { one, two, three };
  }

  function finishDarts(score) {
    if (!Number.isFinite(score) || score <= 0) return null;
    if (FINISHABILITY.one.has(score)) return 1;
    if (FINISHABILITY.two.has(score)) return 2;
    if (FINISHABILITY.three.has(score)) return 3;
    return null;
  }

  function normalizeLine(value) {
    return String(value ?? '').replace(/\u00a0/g, ' ').trim();
  }

  function isNumberLine(line) {
    return /^-?\d+$/.test(line);
  }

  function parseDart(token) {
    const value = normalizeLine(token).replace(/[.,]$/, '');
    if (/^(?:MISS|FEHLWURF|FEHLER)$/i.test(value)) return { notation: 'MISS', kind: 'miss', segment: null, multiplier: 0, points: 0 };
    if (/^BULL$/i.test(value)) return { notation: 'Bull', kind: 'bull', segment: 25, multiplier: 2, points: 50 };
    if (value === '25') return { notation: '25', kind: 'outer-bull', segment: 25, multiplier: 1, points: 25 };
    const match = value.match(/^([SDT])(\d{1,2})$/i);
    if (!match) return null;
    const multiplier = { S: 1, D: 2, T: 3 }[match[1].toUpperCase()];
    const segment = Number(match[2]);
    if (segment < 1 || segment > 20) return null;
    return {
      notation: `${match[1].toUpperCase()}${segment}`,
      kind: 'number',
      segment,
      multiplier,
      points: segment * multiplier
    };
  }

  function parseDartLine(line) {
    const tokens = normalizeLine(line).split(/\s+/).filter(Boolean);
    const darts = tokens.map(parseDart);
    return darts.length > 0 && darts.every(Boolean) ? darts : null;
  }

  function isPlayerCandidate(line, nextLine) {
    if (!line || nextLine !== '501') return false;
    if (isNumberLine(line) || parseDartLine(line)) return false;
    if (/^(X01|501|First to|SI-DO|Statistics|Heatmaps|Breakdown|Aufschlüsselung|Aufnahmeverlauf|Aufnahmenverlauf|Whole Match|All Legs|Leg\s+\d+|Visit History)$/i.test(line)) return false;
    return line.length <= 80;
  }

  function parseLeg(lines, legNumber) {
    const candidates = [];
    for (let i = 0; i < lines.length - 1; i++) {
      if (isPlayerCandidate(lines[i], lines[i + 1])) candidates.push({ name: lines[i], scoreIndex: i + 1 });
    }
    if (candidates.length < 2) return null;

    const players = [candidates[0].name, candidates[1].name];
    playerNames.add(players[0]);
    playerNames.add(players[1]);
    const startIndex = candidates[1].scoreIndex + 1;
    const visits = [];
    const currentScores = { 0: 501, 1: 501 };
    let row = 0;

    for (let i = startIndex; i + 2 < lines.length;) {
      const officialLine = normalizeLine(lines[i]);
      const dartLine = normalizeLine(lines[i + 1]);
      const remainingLine = normalizeLine(lines[i + 2]);
      if (!isNumberLine(officialLine)) break;
      const darts = parseDartLine(dartLine);
      if (!darts || !isNumberLine(remainingLine)) break;

      const playerIndex = row % 2;
      const officialScore = Number(officialLine);
      const remaining = Number(remainingLine);
      const ownBefore = currentScores[playerIndex];
      const opponentBefore = currentScores[1 - playerIndex];
      const rawScore = darts.reduce((sum, dart) => sum + dart.points, 0);
      const bust = officialScore === 0 && rawScore > 0 && remaining === ownBefore;

      visits.push({
        leg: legNumber,
        visit: row + 1,
        player: players[playerIndex],
        playerIndex,
        officialScore,
        rawScore,
        remaining,
        ownBefore,
        opponentBefore,
        bust,
        darts
      });
      currentScores[playerIndex] = remaining;
      row++;
      i += 3;
    }
    return { leg: legNumber, players, visits };
  }

  function getPageText() {
    const raw = document.body?.innerText || document.body?.textContent || '';
    return raw
      .split(/\r?\n/)
      .map(normalizeLine)
      .filter(line => line && line !== 'History Analyzer - AD Coach - by KnuSpersTV');
  }

  function parseMatch() {
    playerNames.clear();
    const lines = getPageText();
    const legs = [];
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(LEG_HEADING);
      if (!match) continue;
      const legNumber = Number(match[1]);
      const end = lines.findIndex((line, index) => index > i && LEG_HEADING.test(line));
      const section = lines.slice(i + 1, end === -1 ? lines.length : end);
      const leg = parseLeg(section, legNumber);
      if (leg && leg.visits.length) legs.push(leg);
    }
    return {
      matchId: location.pathname.split('/').pop() || null,
      url: location.href,
      players: Array.from(playerNames),
      legs
    };
  }

  function visitSeries(visits, predicate) {
    const series = [];
    let current = [];
    for (const visit of visits) {
      if (predicate(visit)) {
        current.push(visit);
      } else if (current.length) {
        series.push(current);
        current = [];
      }
    }
    if (current.length) series.push(current);
    return series;
  }

  function checkoutRange(score) {
    if (!Number.isFinite(score) || score < 2 || score > 170) return null;
    if (score <= 40) return '2-40';
    if (score <= 80) return '41-80';
    if (score <= 120) return '81-120';
    return '121-170';
  }

  function finishCategoryKey(category) {
    return category === 1 ? 'one' : category === 2 ? 'two' : category === 3 ? 'three' : 'none';
  }

  function finishCategoryLabel(key) {
    return { one: '1-Dart-Finish', two: '2-Dart-Finish', three: '3-Dart-Finish', none: 'Kein 3-Dart-Finish' }[key] || '–';
  }

  function analyze(match, player) {
    const visits = match.legs.flatMap(leg => leg.visits).filter(visit => visit.player === player);
    const darts = visits.flatMap(visit => visit.darts);
    const fields = {};
    for (let n = 1; n <= 20; n++) fields[n] = { single: 0, double: 0, triple: 0 };
    fields.outerBull = { single: 0, double: 0, triple: 0, total: 0 };
    fields.bull = { single: 0, double: 0, triple: 0, total: 0 };

    for (const dart of darts) {
      if (dart.kind === 'number') {
        const key = String(dart.segment);
        fields[key][{ 1: 'single', 2: 'double', 3: 'triple' }[dart.multiplier]]++;
      } else if (dart.kind === 'outer-bull') {
        fields.outerBull.total++;
      } else if (dart.kind === 'bull') {
        fields.bull.total++;
      }
    }

    const missCount = darts.filter(dart => dart.kind === 'miss').length;
    const officialTotal = visits.reduce((sum, visit) => sum + visit.officialScore, 0);
    const rawTotal = visits.reduce((sum, visit) => sum + visit.rawScore, 0);
    const thresholds = {
      over57: visits.filter(v => v.officialScore > 57).length,
      over76: visits.filter(v => v.officialScore > 76).length,
      over95: visits.filter(v => v.officialScore > 95).length,
      over133: visits.filter(v => v.officialScore > 133).length,
      atMost29: visits.filter(v => v.officialScore <= 29).length,
      atMost45: visits.filter(v => v.officialScore <= 45).length
    };

    const pressure = {
      one: { opportunities: 0, wins: 0 },
      two: { opportunities: 0, wins: 0 },
      three: { opportunities: 0, wins: 0 },
      none: { opportunities: 0, wins: 0 }
    };
    const ownLegdarts = {
      one: { opportunities: 0, wins: 0 },
      two: { opportunities: 0, wins: 0 },
      three: { opportunities: 0, wins: 0 }
    };
    const checkout = {
      attempts: 0,
      successes: 0,
      byCategory: {
        one: { attempts: 0, successes: 0 },
        two: { attempts: 0, successes: 0 },
        three: { attempts: 0, successes: 0 }
      },
      successfulRestScores: {},
      failedRestScores: {},
      byRange: {
        '2-40': { attempts: 0, successes: 0 },
        '41-80': { attempts: 0, successes: 0 },
        '81-120': { attempts: 0, successes: 0 },
        '121-170': { attempts: 0, successes: 0 }
      }
    };
    const pressureComparison = {
      both: { visits: 0, wins: 0 },
      ownOnly: { visits: 0, wins: 0 },
      opponentOnly: { visits: 0, wins: 0 },
      neither: { visits: 0, wins: 0 }
    };

    for (const visit of visits) {
      const opponentCategory = finishDarts(visit.opponentBefore);
      const pressureKey = opponentCategory === 1 ? 'one' : opponentCategory === 2 ? 'two' : opponentCategory === 3 ? 'three' : 'none';
      const wonLeg = visit.remaining === 0;
      pressure[pressureKey].opportunities++;
      if (wonLeg) pressure[pressureKey].wins++;

      const ownCategory = finishDarts(visit.ownBefore);
      const opponentFinishable = Boolean(opponentCategory);
      const ownFinishable = Boolean(ownCategory);
      const pressureComparisonKey = ownFinishable && opponentFinishable ? 'both' : ownFinishable ? 'ownOnly' : opponentFinishable ? 'opponentOnly' : 'neither';
      pressureComparison[pressureComparisonKey].visits++;
      if (wonLeg) pressureComparison[pressureComparisonKey].wins++;
      if (ownCategory) {
        const ownKey = ownCategory === 1 ? 'one' : ownCategory === 2 ? 'two' : 'three';
        ownLegdarts[ownKey].opportunities++;
        if (wonLeg) ownLegdarts[ownKey].wins++;

        // Ein Checkout-Versuch wird nur gezählt, wenn der Restscore mit
        // maximal drei Darts finishbar ist und im üblichen Checkoutbereich liegt.
        if (visit.ownBefore >= 2 && visit.ownBefore <= 170) {
          checkout.attempts++;
          checkout.byCategory[ownKey].attempts++;
          const rangeKey = checkoutRange(visit.ownBefore);
          if (rangeKey) checkout.byRange[rangeKey].attempts++;
          if (wonLeg) {
            checkout.successes++;
            checkout.byCategory[ownKey].successes++;
            if (rangeKey) checkout.byRange[rangeKey].successes++;
            const scoreKey = String(visit.ownBefore);
            checkout.successfulRestScores[scoreKey] = (checkout.successfulRestScores[scoreKey] || 0) + 1;
          } else {
            const scoreKey = String(visit.ownBefore);
            checkout.failedRestScores[scoreKey] = (checkout.failedRestScores[scoreKey] || 0) + 1;
          }
        }
      }
    }

    const target19 = fields[19].single + fields[19].double + fields[19].triple;
    const target20 = fields[20].single + fields[20].double + fields[20].triple;
    const triple19 = fields[19].triple;
    const triple20 = fields[20].triple;
    const points19 = fields[19].single * 19 + fields[19].double * 38 + fields[19].triple * 57;
    const points20 = fields[20].single * 20 + fields[20].double * 40 + fields[20].triple * 60;
    const focusBase = triple19 + triple20 > 0 ? 'triples' : 'all';
    const focus19 = focusBase === 'triples' ? triple19 : target19;
    const focus20 = focusBase === 'triples' ? triple20 : target20;
    const focusLabel = focus19 > focus20 * 1.15 ? '19er-Fokus' : focus20 > focus19 * 1.15 ? '20er-Fokus' : 'ausgeglichen';

    const topDoubles = Array.from({ length: 20 }, (_, index) => {
      const number = index + 1;
      return { field: `D${number}`, number, count: fields[number].double, share: pct(fields[number].double, darts.length) };
    }).sort((a, b) => b.count - a.count || a.number - b.number).slice(0, 3);

    const scoringBands = [
      { key: '0-29', label: '0–29', min: 0, max: 29 },
      { key: '30-59', label: '30–59', min: 30, max: 59 },
      { key: '60-89', label: '60–89', min: 60, max: 89 },
      { key: '90-119', label: '90–119', min: 90, max: 119 },
      { key: '120+', label: '120+', min: 120, max: Infinity }
    ].map(band => ({
      ...band,
      visits: visits.filter(visit => visit.officialScore >= band.min && visit.officialScore <= band.max).length
    }));

    const checkoutRangeVisits = visits.filter(visit => visit.ownBefore >= 2 && visit.ownBefore <= 170);
    const checkoutRangeDarts = checkoutRangeVisits.reduce((sum, visit) => sum + visit.darts.length, 0);
    const checkoutRangeOfficialTotal = checkoutRangeVisits.reduce((sum, visit) => sum + visit.officialScore, 0);
    const scoringStats = {
      totalDarts: darts.length,
      scoredDarts: darts.filter(dart => dart.points > 0).length,
      misses: missCount,
      busts: visits.filter(visit => visit.bust).length,
      rawPointsPerDart: darts.length ? rawTotal / darts.length : 0,
      officialThreeDartAverage: darts.length ? officialTotal / darts.length * 3 : 0,
      scoringVisitAverage: visits.length ? officialTotal / visits.length : 0,
      checkoutRangeVisits: checkoutRangeVisits.length,
      checkoutRangeDarts,
      checkoutRangeAverage: checkoutRangeVisits.length ? checkoutRangeOfficialTotal / checkoutRangeVisits.length : 0,
      checkoutRangeThreeDartAverage: checkoutRangeDarts ? checkoutRangeOfficialTotal / checkoutRangeDarts * 3 : 0
    };

    const bustVisits = visits.filter(visit => visit.bust);
    const bustByCategory = {
      one: { attempts: 0, busts: 0 },
      two: { attempts: 0, busts: 0 },
      three: { attempts: 0, busts: 0 }
    };
    for (const visit of visits) {
      const category = finishDarts(visit.ownBefore);
      if (!category || visit.ownBefore < 2 || visit.ownBefore > 170) continue;
      const key = category === 1 ? 'one' : category === 2 ? 'two' : 'three';
      bustByCategory[key].attempts++;
      if (visit.bust) bustByCategory[key].busts++;
    }
    const bustRestScores = {};
    for (const visit of bustVisits) {
      const scoreKey = String(visit.ownBefore);
      bustRestScores[scoreKey] = (bustRestScores[scoreKey] || 0) + 1;
    }
    const bustStats = {
      count: bustVisits.length,
      rate: pct(bustVisits.length, visits.length),
      averageRawPoints: bustVisits.length
        ? bustVisits.reduce((sum, visit) => sum + visit.rawScore, 0) / bustVisits.length
        : 0,
      rawPoints: bustVisits.reduce((sum, visit) => sum + visit.rawScore, 0),
      byCategory: bustByCategory,
      restScores: bustRestScores
    };

    const officialScores = visits.map(visit => visit.officialScore).sort((a, b) => a - b);
    const middle = Math.floor(officialScores.length / 2);
    const medianVisit = !officialScores.length
      ? 0
      : officialScores.length % 2
        ? officialScores[middle]
        : (officialScores[middle - 1] + officialScores[middle]) / 2;
    const variance = visits.length
      ? visits.reduce((sum, visit) => sum + (visit.officialScore - (officialTotal / visits.length)) ** 2, 0) / visits.length
      : 0;
    const strongSeries = visitSeries(visits, visit => visit.officialScore > 95);
    const weakSeries = visitSeries(visits, visit => visit.officialScore <= 45);
    const bestSeries = strongSeries
      .slice()
      .sort((a, b) => b.length - a.length || b.reduce((sum, visit) => sum + visit.officialScore, 0) - a.reduce((sum, visit) => sum + visit.officialScore, 0))[0] || [];
    const weakestSeries = weakSeries
      .slice()
      .sort((a, b) => b.length - a.length || a.reduce((sum, visit) => sum + visit.officialScore, 0) - b.reduce((sum, visit) => sum + visit.officialScore, 0))[0] || [];
    const consistencyStats = {
      medianVisit,
      standardDeviation: Math.sqrt(variance),
      strongSeriesCount: strongSeries.length,
      weakSeriesCount: weakSeries.length,
      bestSeries: {
        length: bestSeries.length,
        total: bestSeries.reduce((sum, visit) => sum + visit.officialScore, 0),
        average: bestSeries.length ? bestSeries.reduce((sum, visit) => sum + visit.officialScore, 0) / bestSeries.length : 0
      },
      weakestSeries: {
        length: weakestSeries.length,
        total: weakestSeries.reduce((sum, visit) => sum + visit.officialScore, 0),
        average: weakestSeries.length ? weakestSeries.reduce((sum, visit) => sum + visit.officialScore, 0) / weakestSeries.length : 0
      }
    };

    const weakCount = thresholds.atMost45;
    const strongCount = thresholds.over95;
    const weakShare = visits.length ? weakCount / visits.length : 0;
    const strongShare = visits.length ? strongCount / visits.length : 0;
    const coach = [];
    if (focusLabel === '19er-Fokus') coach.push(`Dein ermittelter Scoring-Fokus liegt eher auf der 19. Die T19 wurde ${triple19}-mal getroffen.`);
    else if (focusLabel === '20er-Fokus') coach.push(`Dein ermittelter Scoring-Fokus liegt eher auf der 20. Die T20 wurde ${triple20}-mal getroffen.`);
    else coach.push('Deine Daten zeigen keinen klaren 19er- oder 20er-Fokus. Beide Felder werden ähnlich genutzt.');
    if (weakShare >= 0.4) coach.push(`Der Anteil schwacher Aufnahmen bis 45 ist mit ${pct(weakCount, visits.length)} erhöht. Hier liegt ein möglicher Trainingsschwerpunkt.`);
    else coach.push(`Der Anteil schwacher Aufnahmen bis 45 liegt bei ${pct(weakCount, visits.length)}.`);
    if (strongShare >= 0.15) coach.push(`Du erzielst ${strongCount} Aufnahmen über 95 (${pct(strongCount, visits.length)}).`);
    else coach.push(`Aufnahmen über 95 sind bisher mit ${strongCount} (${pct(strongCount, visits.length)}) noch eher selten.`);
    if (topDoubles[0]?.count) coach.push(`Am häufigsten triffst du ${topDoubles[0].field} (${topDoubles[0].count}-mal; ${topDoubles[0].share} aller Darts).`);

    return {
      match,
      player,
      visits,
      darts,
      fields,
      missCount,
      officialTotal,
      rawTotal,
      average: visits.length ? officialTotal / visits.length : 0,
      highestVisit: visits.length ? Math.max(...visits.map(v => v.officialScore)) : 0,
      thresholds,
      pressure,
      pressureComparison,
      ownLegdarts,
      checkout,
      topDoubles,
      scoringBands,
      scoringStats,
      bustStats,
      consistencyStats,
      coach,
      scoringFocus: {
        target19,
        target20,
        triple19,
        triple20,
        points19,
        points20,
        basis: focusBase,
        label: focusLabel
      }
    };
  }

  function pct(value, total) {
    return total ? `${(value / total * 100).toFixed(1)} %` : '–';
  }

  function displayMetric(value, total, mode) {
    return mode === 'percent' ? pct(value, total) : String(value);
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  }

  function tableRows(analysis, mode) {
    const totalDarts = analysis.darts.length;
    const rows = [];
    for (let n = 1; n <= 20; n++) {
      const f = analysis.fields[n];
      rows.push({
        field: String(n),
        fieldOrder: n,
        single: f.single,
        double: f.double,
        triple: f.triple,
        total: f.single + f.double + f.triple
      });
    }
    rows.push({ field: 'Outer Bull (25)', fieldOrder: 25, single: null, double: null, triple: null, total: analysis.fields.outerBull.total });
    rows.push({ field: 'Bull (50)', fieldOrder: 50, single: null, double: null, triple: null, total: analysis.fields.bull.total });
    rows.push({ field: 'MISS', fieldOrder: 999, single: null, double: null, triple: null, total: analysis.missCount });

    const sortValue = item => {
      if (fieldSort.key === 'field') return item.fieldOrder;
      return Number.isFinite(item[fieldSort.key]) ? item[fieldSort.key] : -1;
    };
    rows.sort((a, b) => {
      const difference = sortValue(a) - sortValue(b);
      if (difference !== 0) return fieldSort.direction === 'asc' ? difference : -difference;
      return a.fieldOrder - b.fieldOrder;
    });

    return rows.map(item => {
      const metric = key => item[key] === null ? '–' : displayMetric(item[key], totalDarts, mode);
      return `<tr><td>${escapeHtml(item.field)}</td><td>${metric('single')}</td><td>${metric('double')}</td><td>${metric('triple')}</td><td>${metric('total')}</td></tr>`;
    }).join('');
  }

  function fieldSortIndicator(key) {
    if (fieldSort.key !== key) return '↕';
    return fieldSort.direction === 'asc' ? '↑' : '↓';
  }

  function fieldTableHeader() {
    const headers = [
      ['field', 'Feld'],
      ['single', 'Single'],
      ['double', 'Double'],
      ['triple', 'Triple'],
      ['total', 'Gesamt']
    ];
    return headers.map(([key, label]) => `<th><button type="button" class="adpc-sort-button" data-field-sort="${key}" title="Nach ${label} sortieren">${label} <span aria-hidden="true">${fieldSortIndicator(key)}</span></button></th>`).join('');
  }

  function polar(radius, angle) {
    const radians = (angle - 90) * Math.PI / 180;
    return { x: 300 + radius * Math.cos(radians), y: 300 + radius * Math.sin(radians) };
  }

  function sectorPath(inner, outer, startAngle, endAngle) {
    const a = polar(outer, startAngle);
    const b = polar(outer, endAngle);
    const c = polar(inner, endAngle);
    const d = polar(inner, startAngle);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${outer} ${outer} 0 ${large} 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)} L ${c.x.toFixed(2)} ${c.y.toFixed(2)} A ${inner} ${inner} 0 ${large} 0 ${d.x.toFixed(2)} ${d.y.toFixed(2)} Z`;
  }

  function boardValue(value, totalDarts, mode) {
    return mode === 'percent' ? pct(value, totalDarts).replace(' ', '') : String(value);
  }

  function boardSvg(analysis, mode) {
    const order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const totalDarts = analysis.darts.length;
    const parts = [`<svg class="adpc-board" viewBox="0 0 600 600" role="img" aria-label="Dartboard mit Feldanteilen">`];
    parts.push('<circle cx="300" cy="300" r="276" fill="#0c1019" stroke="#56627b" stroke-width="3"/>');
    order.forEach((number, index) => {
      const start = index * 18 - 9;
      const end = index * 18 + 9;
      const f = analysis.fields[number];
      const dark = index % 2 === 0;
      const colors = dark ? ['#1d2635', '#b83b4b', '#1d2635', '#b83b4b'] : ['#e7edf4', '#2f8c83', '#e7edf4', '#2f8c83'];
      const rings = [
        [165, 245, colors[0]],
        [145, 165, colors[1]],
        [50, 145, colors[2]],
        [245, 265, colors[3]]
      ];
      rings.forEach(([inner, outer, fill]) => parts.push(`<path d="${sectorPath(inner, outer, start, end)}" fill="${fill}" stroke="#111722" stroke-width="1"/>`));
      const middle = index * 18;
      const singleText = polar(202, middle);
      const tripleText = polar(155, middle);
      const doubleText = polar(255, middle);
      const numberText = polar(285, middle);
      const textFill = dark ? '#f5f7fa' : '#111722';
      parts.push(`<text x="${singleText.x.toFixed(1)}" y="${singleText.y.toFixed(1)}" fill="${textFill}" class="adpc-board-value">${boardValue(f.single, totalDarts, mode)}</text>`);
      parts.push(`<text x="${tripleText.x.toFixed(1)}" y="${tripleText.y.toFixed(1)}" fill="${dark ? '#fff' : '#111722'}" class="adpc-board-value">${boardValue(f.triple, totalDarts, mode)}</text>`);
      parts.push(`<text x="${doubleText.x.toFixed(1)}" y="${doubleText.y.toFixed(1)}" fill="${dark ? '#fff' : '#111722'}" class="adpc-board-value">${boardValue(f.double, totalDarts, mode)}</text>`);
      parts.push(`<text x="${numberText.x.toFixed(1)}" y="${numberText.y.toFixed(1)}" fill="#f5f7fa" class="adpc-board-number">${number}</text>`);
    });
    const outerBull = analysis.fields.outerBull.total;
    const bull = analysis.fields.bull.total;
    parts.push('<circle cx="300" cy="300" r="50" fill="#2f8c83" stroke="#111722" stroke-width="1"/>');
    parts.push('<circle cx="300" cy="300" r="28" fill="#b83b4b" stroke="#111722" stroke-width="1"/>');
    parts.push(`<text x="300" y="294" fill="#fff" class="adpc-board-bull">${boardValue(outerBull, totalDarts, mode)}</text>`);
    parts.push(`<text x="300" y="312" fill="#fff" class="adpc-board-bull-small">${boardValue(bull, totalDarts, mode)}</text>`);
    parts.push('</svg>');
    return parts.join('');
  }

  function topDoublesSection(analysis) {
    const rows = analysis.topDoubles.map((item, index) => `<tr><td>${index + 1}</td><td>${item.field}</td><td>${item.count}</td><td>${item.share}</td></tr>`).join('');
    return `<div class="adpc-note">Anteil = Treffer auf das jeweilige Doppel geteilt durch alle geworfenen Darts. Das ist keine Trefferquote, weil die Anzahl der gezielten Würfe nicht bekannt ist.</div><table><thead><tr><th>Rang</th><th>Doppelfeld</th><th>Treffer</th><th>Anteil an allen Darts</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Noch keine Doppeltreffer</td></tr>'}</tbody></table>`;
  }

  function coachSection(analysis) {
    const english = currentLanguage === 'en';
    const items = [];
    const focus = analysis.scoringFocus;
    if (english) {
      if (focus.label === '19er-Fokus') items.push(`Your detected scoring focus leans toward 19. T19 was hit ${focus.triple19} times.`);
      else if (focus.label === '20er-Fokus') items.push(`Your detected scoring focus leans toward 20. T20 was hit ${focus.triple20} times.`);
      else items.push('Your data shows no clear 19 or 20 focus. Both fields are used similarly.');

      const weakShare = analysis.visits.length ? analysis.thresholds.atMost45 / analysis.visits.length : 0;
      if (weakShare >= 0.4) items.push(`The share of weak visits up to 45 is elevated at ${pct(analysis.thresholds.atMost45, analysis.visits.length)}. This may be a useful training focus.`);
      else items.push(`The share of weak visits up to 45 is ${pct(analysis.thresholds.atMost45, analysis.visits.length)}.`);

      const strongShare = analysis.visits.length ? analysis.thresholds.over95 / analysis.visits.length : 0;
      if (strongShare >= 0.15) items.push(`You scored ${analysis.thresholds.over95} visits above 95 (${pct(analysis.thresholds.over95, analysis.visits.length)}).`);
      else items.push(`Visits above 95 are still relatively rare: ${analysis.thresholds.over95} (${pct(analysis.thresholds.over95, analysis.visits.length)}).`);

      if (analysis.topDoubles[0]?.count) {
        const item = analysis.topDoubles[0];
        items.push(`You hit ${item.field} most often (${item.count} times; ${item.share} of all darts).`);
      }
      return `<div class="adpc-coach"><ul>${items.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul><div class="adpc-note">These notes describe patterns in the available data and are not hit rates because the intended targets are unknown.</div></div>`;
    }

    items.push(...analysis.coach);
    return `<div class="adpc-coach"><ul>${items.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ul><div class="adpc-note">Die Hinweise beschreiben Muster in den vorliegenden Daten und ersetzen keine Trefferquote: Dafür müsste zusätzlich bekannt sein, welche Felder jeweils anvisiert wurden.</div></div>`;
  }

  function pressureTable(analysis) {
    return Object.entries({ one: '1-Dart-Finish', two: '2-Dart-Finish', three: '3-Dart-Finish', none: 'Kein 3-Dart-Finish' }).map(([key, label]) => {
      const item = analysis.pressure[key];
      return `<tr><td>${label}</td><td>${item.opportunities}</td><td>${item.wins}</td><td>${pct(item.wins, item.opportunities)}</td></tr>`;
    }).join('');
  }

  function ownLegdartTable(analysis) {
    return Object.entries({ one: '1-Dart-Finish', two: '2-Dart-Finish', three: '3-Dart-Finish' }).map(([key, label]) => {
      const item = analysis.ownLegdarts[key];
      return `<tr><td>${label}</td><td>${item.opportunities}</td><td>${item.wins}</td><td>${pct(item.wins, item.opportunities)}</td></tr>`;
    }).join('');
  }

  function scoringBandsSection(analysis) {
    const rows = analysis.scoringBands.map(band => `<tr><td>${band.label}</td><td>${band.visits}</td><td>${pct(band.visits, analysis.visits.length)}</td></tr>`).join('');
    return `<div class="adpc-note">Die Bereiche beziehen sich auf den offiziellen Aufnahmewert inklusive MISS- und BUST-Aufnahmen im Nenner.</div><table><thead><tr><th>Aufnahmebereich</th><th>Aufnahmen</th><th>Anteil</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function pressureComparisonTable(analysis) {
    const labels = { both: 'Beide Spieler finishbar', ownOnly: 'Nur eigener Restscore finishbar', opponentOnly: 'Nur Gegner finishbar', neither: 'Keiner finishbar' };
    return Object.entries(labels).map(([key, label]) => {
      const item = analysis.pressureComparison[key];
      return `<tr><td>${label}</td><td>${item.visits}</td><td>${item.wins}</td><td>${pct(item.wins, item.visits)}</td></tr>`;
    }).join('');
  }

  function checkoutSection(analysis) {
    const categories = [
      ['one', '1-Dart-Finish'],
      ['two', '2-Dart-Finish'],
      ['three', '3-Dart-Finish']
    ];
    const rows = categories.map(([key, label]) => {
      const item = analysis.checkout.byCategory[key];
      const failed = item.attempts - item.successes;
      return `<tr><td>${label}</td><td>${item.attempts}</td><td>${item.successes}</td><td>${failed}</td><td>${pct(item.successes, item.attempts)}</td></tr>`;
    }).join('');
    const successfulScores = Object.entries(analysis.checkout.successfulRestScores)
      .map(([score, count]) => ({ score: Number(score), count }))
      .sort((a, b) => b.count - a.count || b.score - a.score)
      .slice(0, 8);
    const failedScores = Object.entries(analysis.checkout.failedRestScores)
      .map(([score, count]) => ({ score: Number(score), count }))
      .sort((a, b) => b.count - a.count || b.score - a.score)
      .slice(0, 8);
    const scoreRows = successfulScores.map(item => `<tr><td>${item.score}</td><td>${item.count}</td><td>${pct(item.count, analysis.checkout.successes)}</td></tr>`).join('');
    const failedScoreRows = failedScores.map(item => `<tr><td>${item.score}</td><td>${item.count}</td><td>${pct(item.count, analysis.checkout.attempts - analysis.checkout.successes)}</td></tr>`).join('');
    const scoreContent = scoreRows
      ? `<div class="adpc-development-scroll"><table><thead><tr><th>Restscore vor erfolgreichem Checkout</th><th>Erfolgreiche Checkouts</th><th>Anteil an erfolgreichen Checkouts</th></tr></thead><tbody>${scoreRows}</tbody></table></div>`
      : '<div class="adpc-warning">Noch keine erfolgreichen Checkouts in den vorliegenden Daten.</div>';
    const failedScoreContent = failedScoreRows
      ? `<div class="adpc-development-scroll"><table><thead><tr><th>Restscore vor Fehlversuch</th><th>Fehlversuche</th><th>Anteil an Fehlversuchen</th></tr></thead><tbody>${failedScoreRows}</tbody></table></div>`
      : '<div class="adpc-warning">Noch keine Checkout-Fehlversuche in den vorliegenden Daten.</div>';
    const failedAttempts = analysis.checkout.attempts - analysis.checkout.successes;
    const rangeLabels = {
      '2-40': '2–40',
      '41-80': '41–80',
      '81-120': '81–120',
      '121-170': '121–170'
    };
    const rangeRows = Object.entries(rangeLabels).map(([key, label]) => {
      const item = analysis.checkout.byRange[key];
      const failed = item.attempts - item.successes;
      return `<tr><td>${label}</td><td>${item.attempts}</td><td>${item.successes}</td><td>${failed}</td><td>${pct(item.successes, item.attempts)}</td></tr>`;
    }).join('');

    return `
      <div class="adpc-checkout-summary">
        <div><b>Versuche</b><strong>${analysis.checkout.attempts}</strong></div>
        <div><b>Erfolgreich</b><strong>${analysis.checkout.successes}</strong></div>
        <div><b>Fehlversuche</b><strong>${failedAttempts}</strong></div>
        <div><b>Checkoutquote</b><strong>${pct(analysis.checkout.successes, analysis.checkout.attempts)}</strong></div>
      </div>
      <table><thead><tr><th>Finishdistanz</th><th>Versuche</th><th>Erfolgreich</th><th>Fehlversuche</th><th>Quote</th></tr></thead><tbody>${rows}</tbody></table>
      <h5>Checkoutquote nach Restscore-Bereich</h5>
      <table><thead><tr><th>Restscore vor Aufnahme</th><th>Versuche</th><th>Erfolgreich</th><th>Fehlversuche</th><th>Quote</th></tr></thead><tbody>${rangeRows}</tbody></table>
      <div class="adpc-note">Die Restscore-Bereiche zeigen, in welchem Scorebereich deine Checkoutversuche stattfanden. Sie sind unabhängig von der theoretischen Finishdistanz und zählen nur Restscores von 2 bis 170.</div>
      <h5>Häufigste erfolgreiche Checkout-Restpunkte</h5>
      ${scoreContent}
      <h5>Häufigste Restpunkte bei Fehlversuchen</h5>
      ${failedScoreContent}
      <div class="adpc-note">Ein Versuch wird gezählt, wenn der eigene Restscore vor der Aufnahme mit 1, 2 oder 3 Darts finishbar war. Die Analyse wertet nur tatsächlich gespielte Aufnahmen aus; anvisierte Felder sind nicht bekannt.</div>`;
  }

  function loadSavedMatches() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const value = raw ? JSON.parse(raw) : [];
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function writeSavedMatches(matches) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
      return true;
    } catch (_) {
      return false;
    }
  }

  function updateSavedStatus(message) {
    if (!savedStatus) return;
    const count = loadSavedMatches().length;
    savedStatus.textContent = translateRenderedHtml(message || `${count} Match${count === 1 ? '' : 'es'} lokal gespeichert`);
  }

  function matchFingerprint(match) {
    return JSON.stringify({
      matchId: match.matchId,
      players: match.players,
      legs: match.legs
    });
  }

  function flashSaved() {
    if (!panel || !isMinimized) return;
    panel.classList.remove('adpc-save-flash');
    void panel.offsetWidth;
    panel.classList.add('adpc-save-flash');
    setTimeout(() => panel?.classList.remove('adpc-save-flash'), 1100);
  }

  function saveMatch(match, automatic = false) {
    if (!match.players.length || !match.legs.length) {
      if (!automatic) updateSavedStatus('Keine geladene Visit History zum Speichern gefunden.');
      return false;
    }

    const fingerprint = matchFingerprint(match);
    if (automatic && fingerprint === lastAutoSaveFingerprint) return true;

    const existing = loadSavedMatches().find(item => item.matchId === match.matchId);
    const matches = loadSavedMatches().filter(item => item.matchId !== match.matchId);
    matches.push({
      ...match,
      customName: existing?.customName || match.customName || '',
      savedAt: existing?.savedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (!writeSavedMatches(matches)) {
      if (!automatic) updateSavedStatus('Speichern fehlgeschlagen. Browser-Speicher ist eventuell blockiert.');
      return false;
    }

    lastAutoSaveFingerprint = fingerprint;
    flashSaved();
    updateSavedStatus(automatic
      ? `Automatisch gespeichert: ${matches.length} Match${matches.length === 1 ? '' : 'es'} lokal`
      : `Gespeichert: ${matches.length} Match${matches.length === 1 ? '' : 'es'} lokal`);
    return true;
  }

  function saveCurrentMatch() {
    saveMatch(parseMatch(), false);
  }

  function clearSavedMatches() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      updateSavedStatus('Lokale Match-Historie geleert.');
    } catch (_) {
      updateSavedStatus('Die lokale Match-Historie konnte nicht geleert werden.');
    }
  }

  function combineMatches(matches) {
    const legs = matches.flatMap(item => item.legs || []);
    const players = Array.from(new Set(matches.flatMap(item => item.players || [])));
    return {
      matchId: 'multiple-matches',
      url: 'local://autodarts-performance-coach/saved-matches',
      players,
      legs
    };
  }

  function getAnalysisMatch(currentMatch) {
    if (currentMatch?.matchId === 'multiple-matches') return currentMatch;
    if (!scopeSelect || scopeSelect.value !== 'all') return currentMatch;
    const saved = loadSavedMatches();
    const withoutCurrent = saved.filter(item => item.matchId !== currentMatch.matchId);
    return combineMatches([...withoutCurrent, currentMatch]);
  }

  function getMatchesForScope(currentMatch) {
    if (currentMatch?.matchId === 'multiple-matches') return loadSavedMatches();
    if (!scopeSelect || scopeSelect.value !== 'all') return [currentMatch];
    const saved = loadSavedMatches().filter(item => item.matchId !== currentMatch.matchId);
    return [...saved, currentMatch];
  }

  function formatSavedDate(value) {
    if (!value) return '–';
    try {
      return new Intl.DateTimeFormat('de-DE', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value));
    } catch (_) {
      return '–';
    }
  }

  function matchLabel(match, index = 0) {
    return match.customName || (match.matchId === 'multiple-matches' ? 'Mehrere Matches' : `Match ${index + 1}`);
  }

  function storedMatchesForManagement() {
    return loadSavedMatches().filter(match => match.matchId && match.matchId !== 'multiple-matches');
  }

  function exportSavedMatches() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), matches: loadSavedMatches() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autodarts-match-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importSavedMatches(file) {
    try {
      const parsed = JSON.parse(await file.text());
      const imported = Array.isArray(parsed) ? parsed : Array.isArray(parsed.matches) ? parsed.matches : [];
      const valid = imported.filter(match => match && match.matchId && Array.isArray(match.legs) && Array.isArray(match.players));
      if (!valid.length) return updateSavedStatus('Keine gültigen Matches in der Backup-Datei gefunden.');
      const byId = new Map(loadSavedMatches().map(match => [match.matchId, match]));
      for (const match of valid) byId.set(match.matchId, { ...byId.get(match.matchId), ...match });
      writeSavedMatches(Array.from(byId.values()));
      updateSavedStatus(`${valid.length} Match${valid.length === 1 ? '' : 'es'} importiert.`);
      runAnalysis();
    } catch (_) {
      updateSavedStatus('Backup konnte nicht gelesen werden.');
    }
  }

  function renameSavedMatch(matchId) {
    const matches = loadSavedMatches();
    const match = matches.find(item => item.matchId === matchId);
    if (!match) return;
    const name = window.prompt('Name für dieses Match:', match.customName || '');
    if (name === null) return;
    match.customName = name.trim();
    writeSavedMatches(matches);
    runAnalysis();
  }

  function deleteSavedMatch(matchId) {
    const matches = loadSavedMatches();
    const match = matches.find(item => item.matchId === matchId);
    if (!match) return;
    const label = match.customName || match.matchId;
    if (!window.confirm(`Match „${label}“ wirklich löschen?`)) return;
    writeSavedMatches(matches.filter(item => item.matchId !== matchId));
    updateSavedStatus('Match gelöscht.');
    runAnalysis();
  }

  function matchManagementSection() {
    const matches = storedMatchesForManagement();
    const rows = matches.map((match, index) => `<tr><td>${escapeHtml(matchLabel(match, index))}</td><td>${escapeHtml((match.players || []).join(' / '))}</td><td>${match.legs?.length || 0}</td><td><button type="button" data-saved-action="rename" data-match-id="${escapeHtml(match.matchId)}">Umbenennen</button> <button type="button" data-saved-action="delete" data-match-id="${escapeHtml(match.matchId)}">Löschen</button></td></tr>`).join('');
    return `<div class="adpc-management-actions"><button type="button" data-saved-action="export">Backup exportieren</button><button type="button" data-saved-action="import">Backup importieren</button><input type="file" accept="application/json,.json" data-saved-import hidden></div><div class="adpc-note">Backups enthalten die lokal gespeicherten Matches einschließlich eigener Namen.</div><div class="adpc-development-scroll"><table><thead><tr><th>Match</th><th>Spieler</th><th>Legs</th><th>Aktionen</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Keine gespeicherten Matches vorhanden.</td></tr>'}</tbody></table></div>`;
  }

  function developmentTable(currentMatch, player) {
    const matches = getMatchesForScope(currentMatch);
    const rows = matches.map((match, index) => {
      const item = analyze(match, player);
      if (!item.visits.length) return '';
      const t19 = item.fields[19].triple;
      const t20 = item.fields[20].triple;
      const weak = item.visits.filter(visit => visit.officialScore <= 45).length;
      const strong = item.visits.filter(visit => visit.officialScore > 95).length;
      const isCurrent = match.matchId === currentMatch.matchId;
      const opponent = (match.players || []).filter(name => name !== player).join(' / ') || '–';
      const saved = match.savedAt || match.updatedAt;
      return `<tr${isCurrent ? ' class="adpc-current-row"' : ''}><td>${isCurrent ? 'Aktuell' : escapeHtml(matchLabel(match, index))}</td><td>${formatSavedDate(saved)}</td><td>${escapeHtml(opponent)}</td><td>${match.legs.length}</td><td>${item.visits.length}</td><td>${item.average.toFixed(1)}</td><td>${item.highestVisit}</td><td>${pct(t19, item.darts.length)}</td><td>${pct(t20, item.darts.length)}</td><td>${strong}</td><td>${weak}</td></tr>`;
    }).filter(Boolean).join('');
    if (!rows) return '';
    return `<div class="adpc-note">Die Tabelle enthält automatisch gespeicherte Matches. T19-/T20-Anteil = jeweilige Triple-Treffer geteilt durch alle Darts des Matches.</div><div class="adpc-development-scroll"><table><thead><tr><th>Match</th><th>Gespeichert</th><th>Gegner</th><th>Legs</th><th>Aufnahmen</th><th>Ø Aufnahme</th><th>Höchste</th><th>T19-Anteil</th><th>T20-Anteil</th><th>&gt;95</th><th>≤45</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function aggregateMatchStats(matches, player) {
    const items = matches.map(match => analyze(match, player)).filter(item => item.visits.length);
    if (!items.length) return null;
    const visits = items.reduce((sum, item) => sum + item.visits.length, 0);
    const official = items.reduce((sum, item) => sum + item.officialTotal, 0);
    const darts = items.reduce((sum, item) => sum + item.darts.length, 0);
    const t19 = items.reduce((sum, item) => sum + item.fields[19].triple, 0);
    const t20 = items.reduce((sum, item) => sum + item.fields[20].triple, 0);
    const weak = items.reduce((sum, item) => sum + item.thresholds.atMost45, 0);
    const strong = items.reduce((sum, item) => sum + item.thresholds.over95, 0);
    const highest = Math.max(...items.map(item => item.highestVisit));
    return {
      matches: items.length,
      visits,
      darts,
      average: visits ? official / visits : 0,
      t19Share: pct(t19, darts),
      t20Share: pct(t20, darts),
      weakShare: pct(weak, visits),
      strongShare: pct(strong, visits),
      highest
    };
  }

  function matchComparisonSection(currentMatch, player) {
    const matches = getMatchesForScope(currentMatch).filter(match => match.matchId !== 'multiple-matches' && analyze(match, player).visits.length);
    if (matches.length < 2) return '<div class="adpc-warning">Für einen direkten Matchvergleich werden mindestens zwei passende Matches benötigt.</div>';
    const keyOf = match => match.matchId || match.url;
    const firstKey = keyOf(matches[0]);
    const lastKey = keyOf(matches[matches.length - 1]);
    const aKey = comparisonSelection.a && matches.some(match => keyOf(match) === comparisonSelection.a) ? comparisonSelection.a : firstKey;
    const bKey = comparisonSelection.b && matches.some(match => keyOf(match) === comparisonSelection.b) ? comparisonSelection.b : lastKey;
    comparisonSelection = { a: aKey, b: bKey };
    const options = selected => matches.map((match, index) => `<option value="${escapeHtml(keyOf(match))}"${keyOf(match) === selected ? ' selected' : ''}>${escapeHtml(matchLabel(match, index))}</option>`).join('');
    const left = matches.find(match => keyOf(match) === aKey) || matches[0];
    const right = matches.find(match => keyOf(match) === bKey) || matches[matches.length - 1];
    const leftStats = analyze(left, player);
    const rightStats = analyze(right, player);
    const metricRows = [
      ['Legs', leftStats.match.legs.length, rightStats.match.legs.length],
      ['Aufnahmen', leftStats.visits.length, rightStats.visits.length],
      ['Ø Aufnahme', leftStats.average.toFixed(1), rightStats.average.toFixed(1)],
      ['3-Dart-Average', leftStats.scoringStats.officialThreeDartAverage.toFixed(1), rightStats.scoringStats.officialThreeDartAverage.toFixed(1)],
      ['Checkoutquote', pct(leftStats.checkout.successes, leftStats.checkout.attempts), pct(rightStats.checkout.successes, rightStats.checkout.attempts)],
      ['BUSTs', leftStats.bustStats.count, rightStats.bustStats.count],
      ['MISS-Anteil', pct(leftStats.missCount, leftStats.darts.length), pct(rightStats.missCount, rightStats.darts.length)],
      ['T19-Anteil', pct(leftStats.fields[19].triple, leftStats.darts.length), pct(rightStats.fields[19].triple, rightStats.darts.length)],
      ['T20-Anteil', pct(leftStats.fields[20].triple, leftStats.darts.length), pct(rightStats.fields[20].triple, rightStats.darts.length)]
    ].map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('');
    return `<h5>Direkter Vergleich zweier Matches</h5><div class="adpc-compare-controls"><label>Match A <select data-compare-select="a">${options(aKey)}</select></label><label>Match B <select data-compare-select="b">${options(bKey)}</select></label></div><table><thead><tr><th>Kennzahl</th><th>${escapeHtml(matchLabel(left))}</th><th>${escapeHtml(matchLabel(right))}</th></tr></thead><tbody>${metricRows}</tbody></table>`;
  }

  function trendSection(currentMatch, player) {
    const matches = getMatchesForScope(currentMatch).filter(match => match.matchId !== 'multiple-matches');
    if (matches.length < 2) {
      return '<div class="adpc-warning">Für einen Trendvergleich werden mindestens zwei gespeicherte Matches benötigt.</div>';
    }
    const ordered = [...matches];
    const split = Math.max(1, Math.floor(ordered.length / 2));
    const earlier = ordered.slice(0, split);
    const recent = ordered.slice(split);
    const oldStats = aggregateMatchStats(earlier, player);
    const recentStats = aggregateMatchStats(recent, player);
    if (!oldStats || !recentStats) return '';
    const delta = (recentStats.average - oldStats.average).toFixed(1);
    const deltaLabel = Number(delta) > 0 ? `+${delta}` : delta;
    return `<div class="adpc-note">Verglichen werden die ältere Hälfte und die zuletzt gespeicherten Matches (${oldStats.matches} vs. ${recentStats.matches}).</div><table><thead><tr><th>Zeitraum</th><th>Matches</th><th>Ø Aufnahme</th><th>T19-Anteil</th><th>T20-Anteil</th><th>&gt;95</th><th>≤45</th><th>Höchste</th></tr></thead><tbody><tr><td>Früher</td><td>${oldStats.matches}</td><td>${oldStats.average.toFixed(1)}</td><td>${oldStats.t19Share}</td><td>${oldStats.t20Share}</td><td>${oldStats.strongShare}</td><td>${oldStats.weakShare}</td><td>${oldStats.highest}</td></tr><tr class="adpc-current-row"><td>Zuletzt</td><td>${recentStats.matches}</td><td>${recentStats.average.toFixed(1)} (${deltaLabel})</td><td>${recentStats.t19Share}</td><td>${recentStats.t20Share}</td><td>${recentStats.strongShare}</td><td>${recentStats.weakShare}</td><td>${recentStats.highest}</td></tr></tbody></table>`;
  }

  function trainingSection(analysis) {
    const english = currentLanguage === 'en';
    const suggestions = [];
    const focus = analysis.scoringFocus.label;
    const target = focus === '19er-Fokus' ? '19' : focus === '20er-Fokus' ? '20' : '19 and 20';

    if (english) {
      suggestions.push(`Scoring: Play 20 visits focusing on ${target}. Count only official visit scores.`);
      if (analysis.thresholds.atMost45 / Math.max(1, analysis.visits.length) >= 0.4) {
        suggestions.push('Consistency: Play 20 visits and aim to score above 45 in at least 15 of them.');
      } else {
        suggestions.push('Scoring: Play 20 visits and aim for at least 10 scores above 95.');
      }

      const weakLegdart = Object.entries(analysis.ownLegdarts)
        .filter(([, value]) => value.opportunities >= 3)
        .sort((a, b) => (a[1].wins / a[1].opportunities) - (b[1].wins / b[1].opportunities))[0];
      if (weakLegdart) {
        const labels = { one: '1-dart finishes', two: '2-dart finishes', three: '3-dart finishes' };
        suggestions.push(`Checkouts: Train 15 situations for ${labels[weakLegdart[0]]}. Your current leg-dart rate in this category is ${pct(weakLegdart[1].wins, weakLegdart[1].opportunities)}.`);
      } else {
        suggestions.push('Checkouts: Train 15 random checkouts from 40 to 100 and record successful finishes.');
      }

      const top = analysis.topDoubles.filter(item => item.count > 0).slice(0, 3).map(item => item.field).join(', ');
      if (top) suggestions.push(`Doubles routine: Play 10 darts at each of ${top}. These are your three most frequently hit doubles.`);
      const failedCheckout = Object.entries(analysis.checkout.failedRestScores).sort((a, b) => b[1] - a[1])[0];
      if (failedCheckout) suggestions.push(`Checkout focus: Repeat score ${failedCheckout[0]} in particular; ${failedCheckout[1]} failed attempt${failedCheckout[1] === 1 ? '' : 's'} were detected there.`);
      if (analysis.bustStats.count) suggestions.push(`BUST control: Briefly rehearse the safe route before throwing. The data contains ${analysis.bustStats.count} BUST${analysis.bustStats.count === 1 ? '' : 's'}.`);
      if (analysis.missCount) suggestions.push(`Accuracy: Add a short 30-dart precision series; ${analysis.missCount} MISS${analysis.missCount === 1 ? '' : 'es'} were detected.`);
      return `<div class="adpc-training"><ol>${suggestions.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ol><div class="adpc-note">The suggestions are derived from your observed visits, finishing situations, and field distribution.</div></div>`;
    }

    suggestions.push(`Scoring: Spiele 20 Aufnahmen mit Fokus auf ${focus === '19er-Fokus' ? '19' : focus === '20er-Fokus' ? '20' : '19 und 20'}. Zähle dabei nur die offiziellen Aufnahmewerte.`);
    if (analysis.thresholds.atMost45 / Math.max(1, analysis.visits.length) >= 0.4) {
      suggestions.push('Konstanz: Spiele 20 Aufnahmen und setze dir das Ziel, mindestens 15 davon über 45 Punkte zu spielen.');
    } else {
      suggestions.push('Scoring: Spiele 20 Aufnahmen mit dem Ziel, mindestens 10 davon über 95 Punkte zu erzielen.');
    }

    const weakLegdart = Object.entries(analysis.ownLegdarts)
      .filter(([, value]) => value.opportunities >= 3)
      .sort((a, b) => (a[1].wins / a[1].opportunities) - (b[1].wins / b[1].opportunities))[0];
    if (weakLegdart) {
      const labels = { one: '1-Dart-Finishes', two: '2-Dart-Finishes', three: '3-Dart-Finishes' };
      suggestions.push(`Checkouts: Trainiere 15 Situationen für ${labels[weakLegdart[0]]}. Deine bisherige Legdartquote in dieser Kategorie liegt bei ${pct(weakLegdart[1].wins, weakLegdart[1].opportunities)}.`);
    } else {
      suggestions.push('Checkouts: Trainiere 15 zufällige Checkouts aus dem Bereich 40 bis 100 und notiere erfolgreiche Abschlüsse.');
    }

    const top = analysis.topDoubles.filter(item => item.count > 0).slice(0, 3).map(item => item.field).join(', ');
    if (top) suggestions.push(`Doppelroutine: Spiele je 10 Darts auf ${top}. Das sind deine drei am häufigsten getroffenen Doppelfelder.`);
    const failedCheckout = Object.entries(analysis.checkout.failedRestScores).sort((a, b) => b[1] - a[1])[0];
    if (failedCheckout) suggestions.push(`Checkout-Fokus: Wiederhole besonders den Restscore ${failedCheckout[0]}; dort wurden ${failedCheckout[1]} Fehlversuch${failedCheckout[1] === 1 ? '' : 'e'} erkannt.`);
    if (analysis.bustStats.count) suggestions.push(`BUST-Kontrolle: Trainiere vor dem Wurf kurz den sicheren Restweg. In den Daten wurden ${analysis.bustStats.count} BUST${analysis.bustStats.count === 1 ? '' : 's'} erkannt.`);
    if (analysis.missCount) suggestions.push(`Trefferbild: Baue eine kurze Präzisionsserie mit 30 Darts ein; ${analysis.missCount} MISS${analysis.missCount === 1 ? '' : 'es'} wurden erkannt.`);
    return `<div class="adpc-training"><ol>${suggestions.map(text => `<li>${escapeHtml(text)}</li>`).join('')}</ol><div class="adpc-note">Die Vorschläge werden aus deinen beobachteten Aufnahmen, Finish-Situationen und Feldverteilungen abgeleitet.</div></div>`;
  }

  function legOverview(analysis) {
    const rows = analysis.match.legs.map(leg => {
      const visits = (leg.visits || []).filter(visit => visit.player === analysis.player);
      if (!visits.length) return '';
      const darts = visits.reduce((sum, visit) => sum + visit.darts.length, 0);
      const official = visits.reduce((sum, visit) => sum + visit.officialScore, 0);
      const highest = Math.max(...visits.map(visit => visit.officialScore));
      const over95 = visits.filter(visit => visit.officialScore > 95).length;
      const atMost45 = visits.filter(visit => visit.officialScore <= 45).length;
      const won = visits.some(visit => visit.remaining === 0);
      return `<tr class="${won ? 'adpc-win-row' : ''}"><td>Leg ${leg.leg}</td><td>${won ? 'Gewonnen' : 'Nicht gewonnen'}</td><td>${visits.length}</td><td>${darts}</td><td>${visits.length ? (official / visits.length).toFixed(1) : '–'}</td><td>${highest}</td><td>${over95}</td><td>${atMost45}</td></tr>`;
    }).filter(Boolean).join('');
    if (!rows) return '';
    return `<div class="adpc-note">Eine Aufnahme zählt zu dem Leg, in dem sie gespielt wurde. Grün markiert gewonnene Legs.</div><div class="adpc-development-scroll"><table><thead><tr><th>Leg</th><th>Ergebnis</th><th>Aufnahmen</th><th>Darts</th><th>Ø Aufnahme</th><th>Höchste</th><th>&gt;95</th><th>≤45</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function collapsibleSection(key, title, content, defaultOpen = true) {
    const open = sectionOpen[key] ?? defaultOpen;
    return `<details class="adpc-collapsible-section" data-adpc-section="${escapeHtml(key)}"${open ? ' open' : ''}><summary>${escapeHtml(title)}</summary><div class="adpc-collapsible-content">${content}</div></details>`;
  }

  function scoringStatsSection(analysis) {
    const stats = analysis.scoringStats;
    const hitShare = pct(stats.scoredDarts, stats.totalDarts);
    const missShare = pct(stats.misses, stats.totalDarts);
    const bustShare = pct(stats.busts, analysis.visits.length);
    const checkoutRangeAverage = stats.checkoutRangeVisits
      ? stats.checkoutRangeAverage.toFixed(1)
      : '–';
    const checkoutRangeThreeDartAverage = stats.checkoutRangeVisits
      ? stats.checkoutRangeThreeDartAverage.toFixed(1)
      : '–';
    return `<div class="adpc-stats-grid">
        <div><b>Ø Rohpunkte pro Dart</b><strong>${stats.rawPointsPerDart.toFixed(2)}</strong></div>
        <div><b>3-Dart-Average offiziell</b><strong>${stats.officialThreeDartAverage.toFixed(1)}</strong></div>
        <div><b>Ø Aufnahme offiziell</b><strong>${stats.scoringVisitAverage.toFixed(1)}</strong></div>
        <div><b>Trefferanteil</b><strong>${hitShare}</strong></div>
        <div><b>MISS-Anteil</b><strong>${missShare}</strong></div>
        <div><b>BUST-Quote</b><strong>${bustShare}</strong></div>
      </div>
      <table><thead><tr><th>Auswertung</th><th>Aufnahmen</th><th>Darts</th><th>Ø Aufnahme</th><th>3-Dart-Average</th></tr></thead><tbody>
        <tr><td>Gesamte Analyse</td><td>${analysis.visits.length}</td><td>${stats.totalDarts}</td><td>${stats.scoringVisitAverage.toFixed(1)}</td><td>${stats.officialThreeDartAverage.toFixed(1)}</td></tr>
        <tr class="adpc-current-row"><td>Restscore 2–170 vor der Aufnahme</td><td>${stats.checkoutRangeVisits}</td><td>${stats.checkoutRangeDarts}</td><td>${checkoutRangeAverage}</td><td>${checkoutRangeThreeDartAverage}</td></tr>
      </tbody></table>
      <div class="adpc-note">Der Bereich „Restscore 2–170“ enthält nur Aufnahmen, bei denen dein eigener Restscore unmittelbar davor zwischen 2 und 170 lag. Die Werte basieren auf den offiziellen Aufnahmewerten; der 3-Dart-Average wird anhand der tatsächlich geworfenen Darts hochgerechnet. MISS- und BUST-Aufnahmen bleiben mit ihrem offiziellen Wert von 0 enthalten.</div>`;
  }

  function bustSection(analysis) {
    const stats = analysis.bustStats;
    const categories = [
      ['one', '1-Dart-Finish'],
      ['two', '2-Dart-Finish'],
      ['three', '3-Dart-Finish']
    ];
    const categoryRows = categories.map(([key, label]) => {
      const item = stats.byCategory[key];
      return `<tr><td>${label}</td><td>${item.attempts}</td><td>${item.busts}</td><td>${pct(item.busts, item.attempts)}</td></tr>`;
    }).join('');
    const restRows = Object.entries(stats.restScores)
      .map(([score, count]) => ({ score: Number(score), count }))
      .sort((a, b) => b.count - a.count || b.score - a.score)
      .slice(0, 8)
      .map(item => `<tr><td>${item.score}</td><td>${item.count}</td><td>${pct(item.count, stats.count)}</td></tr>`)
      .join('');
    const restContent = restRows
      ? `<div class="adpc-development-scroll"><table><thead><tr><th>Restscore vor BUST</th><th>BUSTs</th><th>Anteil an allen BUSTs</th></tr></thead><tbody>${restRows}</tbody></table></div>`
      : '<div class="adpc-warning">Noch keine BUST-Aufnahmen in den vorliegenden Daten.</div>';
    return `<div class="adpc-stats-grid">
        <div><b>BUSTs</b><strong>${stats.count}</strong></div>
        <div><b>BUST-Quote</b><strong>${stats.rate}</strong></div>
        <div><b>Ø verworfene Rohpunkte</b><strong>${stats.averageRawPoints.toFixed(1)}</strong></div>
        <div><b>Verworfene Rohpunkte gesamt</b><strong>${stats.rawPoints}</strong></div>
      </div>
      <table><thead><tr><th>Finishdistanz vor Aufnahme</th><th>Versuche</th><th>BUSTs</th><th>BUST-Quote</th></tr></thead><tbody>${categoryRows}</tbody></table>
      <h5>Häufigste Restpunkte vor BUSTs</h5>
      ${restContent}
      <div class="adpc-note">Als BUST wird eine Aufnahme gewertet, bei der Autodarts den offiziellen Aufnahmewert auf 0 setzt und der Restscore unverändert bleibt. Die verworfenen Rohpunkte zeigen nur die Summe der aus den sichtbaren Dartnotationen berechneten Punkte.</div>`;
  }

  function consistencySection(analysis) {
    const stats = analysis.consistencyStats;
    const best = stats.bestSeries;
    const weakest = stats.weakestSeries;
    const bestLabel = best.length
      ? `${best.length} Aufnahmen · Ø ${best.average.toFixed(1)} · ${best.total} Punkte`
      : 'Keine Aufnahmen über 95';
    const weakestLabel = weakest.length
      ? `${weakest.length} Aufnahmen · Ø ${weakest.average.toFixed(1)} · ${weakest.total} Punkte`
      : 'Keine Aufnahmen bis 45';
    return `<div class="adpc-stats-grid">
        <div><b>Median Aufnahme</b><strong>${stats.medianVisit.toFixed(1)}</strong></div>
        <div><b>Streuung der Aufnahmen</b><strong>±${stats.standardDeviation.toFixed(1)}</strong></div>
        <div><b>Stärkste Serie &gt;95</b><strong>${stats.bestSeries.length}</strong></div>
        <div><b>Schwächste Serie ≤45</b><strong>${stats.weakestSeries.length}</strong></div>
      </div>
      <table><thead><tr><th>Auswertung</th><th>Ergebnis</th></tr></thead><tbody>
        <tr><td>Längste Serie über 95</td><td>${bestLabel}</td></tr>
        <tr><td>Längste Serie bis 45</td><td>${weakestLabel}</td></tr>
      </tbody></table>
      <div class="adpc-note">Der Median beschreibt die mittlere Aufnahme, ohne dass einzelne sehr hohe oder sehr niedrige Aufnahmen den Wert stark verschieben. Die Streuung ist die Standardabweichung der offiziellen Aufnahmewerte. Serien beziehen sich auf direkt aufeinanderfolgende eigene Aufnahmen.</div>`;
  }

  function visitHistorySection(analysis) {
    const rows = analysis.visits.map(visit => {
      const category = finishDarts(visit.ownBefore);
      const finishLabel = category ? `${category}-Dart-Finish` : '–';
      const status = visit.remaining === 0 ? 'Leg gewonnen' : visit.bust ? 'BUST' : 'Weiter';
      const rowClass = visit.remaining === 0 ? 'adpc-win-row' : visit.bust ? 'adpc-bust-row' : '';
      const darts = visit.darts.map(dart => escapeHtml(dart.notation)).join(' · ');
      return `<tr class="${rowClass}"><td>Leg ${visit.leg}</td><td>${visit.visit}</td><td>${escapeHtml(darts)}</td><td>${visit.ownBefore}</td><td>${visit.officialScore}</td><td>${visit.remaining}</td><td>${escapeHtml(finishLabel)}</td><td>${status}</td></tr>`;
    }).join('');
    return `<div class="adpc-note">Chronologischer Verlauf deiner erkannten Aufnahmen. „Finishbarkeit“ bezieht sich auf den Restscore vor der Aufnahme; gezielte Felder sind aus der Visit History nicht bekannt.</div><div class="adpc-development-scroll"><table><thead><tr><th>Leg</th><th>Aufnahme</th><th>Darts</th><th>Rest vorher</th><th>Aufnahme</th><th>Rest danach</th><th>Finishbarkeit vorher</th><th>Status</th></tr></thead><tbody>${rows || '<tr><td colspan="8">Noch keine Aufnahmen vorhanden.</td></tr>'}</tbody></table></div>`;
  }

  function render(analysis) {
    if (!output) return;
    const mode = modeSelect?.value || 'count';
    const view = viewSelect?.value || 'table';
    const numberedHits = Object.values(analysis.fields).slice(0, 20).reduce((sum, f) => sum + f.single + f.double + f.triple, 0) + analysis.fields.outerBull.total + analysis.fields.bull.total;
    const table = `<div class="adpc-note">Prozent = Anteil an allen ${analysis.darts.length} geworfenen Darts. Misses bleiben im Nenner. Klicke auf einen Spaltenkopf, um die Tabelle zu sortieren.</div><div class="adpc-development-scroll"><table><thead><tr>${fieldTableHeader()}</tr></thead><tbody>${tableRows(analysis, mode)}</tbody></table></div>`;
    const board = `<div class="adpc-board-legend"><span class="adpc-legend-s">Single-Ring</span><span class="adpc-legend-t">Triple-Ring</span><span class="adpc-legend-d">Double-Ring</span><span>Außen: D · Mitte: T · innen: S</span></div>${boardSvg(analysis, mode)}<div class="adpc-note">Im Board stehen je Segment die Werte für Single, Triple und Double; im Bull stehen Außen-Bull und Bull.</div>`;
    const fieldSection = view === 'table' ? table : view === 'board' ? board : `<div class="adpc-two-columns"><section>${table}</section><section>${board}</section></div>`;
    const focusContent = `<div class="adpc-focus-summary">
        <div><b>Ermittelter Fokus</b><strong>${analysis.scoringFocus.label}</strong><small>Basis: ${analysis.scoringFocus.basis === 'triples' ? 'Triple-Treffer' : 'Treffer auf 19/20'}</small></div>
        <div><b>T19</b><strong>${analysis.scoringFocus.triple19} Triples</strong><small>${pct(analysis.scoringFocus.target19, analysis.darts.length)} aller Darts auf 19</small></div>
        <div><b>T20</b><strong>${analysis.scoringFocus.triple20} Triples</strong><small>${pct(analysis.scoringFocus.target20, analysis.darts.length)} aller Darts auf 20</small></div>
      </div>`;
    const thresholdContent = `<div class="adpc-thresholds">
        <span>&gt;57: <b>${analysis.thresholds.over57}</b></span>
        <span>&gt;76: <b>${analysis.thresholds.over76}</b></span>
        <span>&gt;95: <b>${analysis.thresholds.over95}</b></span>
        <span>&gt;133: <b>${analysis.thresholds.over133}</b></span>
        <span>≤29: <b>${analysis.thresholds.atMost29}</b></span>
        <span>≤45: <b>${analysis.thresholds.atMost45}</b></span>
      </div>`;
    const pressureContent = `<table><thead><tr><th>Situation</th><th>Aufnahmen</th><th>Eigene Leggewinne</th><th>Leggewinnquote</th></tr></thead><tbody>${pressureTable(analysis)}</tbody></table><h5>Direkter Druckvergleich</h5><table><thead><tr><th>Situation</th><th>Aufnahmen</th><th>Eigene Leggewinne</th><th>Quote</th></tr></thead><tbody>${pressureComparisonTable(analysis)}</tbody></table><div class="adpc-note">Die zweite Tabelle vergleicht, ob du selbst, dein Gegner, beide oder keiner von euch vor der Aufnahme finishbar war.</div>`;
    const ownLegdartContent = `<table><thead><tr><th>Eigener Restscore</th><th>Aufnahmen</th><th>Eigene Leggewinne</th><th>Legdartquote</th></tr></thead><tbody>${ownLegdartTable(analysis)}</tbody></table><div class="adpc-note">Gezählt wird eine Aufnahme, wenn dein eigener Restscore davor mit 1, 2 oder 3 Darts finishbar war.</div>`;

    output.innerHTML = translateRenderedHtml(`
      <div class="adpc-cards">
        <div><b>Legs</b><strong>${analysis.match.legs.length}</strong></div>
        <div><b>Aufnahmen</b><strong>${analysis.visits.length}</strong></div>
        <div><b>Ø Aufnahme</b><strong>${analysis.average.toFixed(1)}</strong></div>
        <div><b>Höchste</b><strong>${analysis.highestVisit}</strong></div>
      </div>
      ${collapsibleSection('scoringFocus', 'Scoring-Fokus', focusContent)}
      ${collapsibleSection('thresholds', 'Aufnahmeverteilung', thresholdContent)}
      ${collapsibleSection('fields', 'Feldverteilung und Dartboard', fieldSection)}
      ${collapsibleSection('topDoubles', 'Top 3 Doppelfelder', topDoublesSection(analysis))}
      ${collapsibleSection('scoringBands', 'Scoring nach Aufnahmebereich', scoringBandsSection(analysis))}
      ${collapsibleSection('legs', 'Leg-Übersicht', legOverview(analysis), false)}
      ${collapsibleSection('coach', 'Coach', coachSection(analysis))}
      ${collapsibleSection('training', 'Trainingsvorschläge', trainingSection(analysis))}
      ${collapsibleSection('trend', 'Entwicklung: früher vs. zuletzt', trendSection(analysis.match, analysis.player))}
      ${collapsibleSection('pressure', 'Gegnerischer Restscore vor deiner Aufnahme', pressureContent, false)}
      ${collapsibleSection('ownLegdarts', 'Eigene Legdarts', ownLegdartContent)}
      ${collapsibleSection('checkout', 'Checkout-Analyse', checkoutSection(analysis))}
      ${collapsibleSection('dartStats', 'Dart- und Scoring-Kennzahlen', scoringStatsSection(analysis))}
      ${collapsibleSection('busts', 'BUST-Analyse', bustSection(analysis))}
      ${collapsibleSection('consistency', 'Aufnahme-Konstanz', consistencySection(analysis))}
      ${collapsibleSection('visits', 'Aufnahmeverlauf', visitHistorySection(analysis), false)}
      ${collapsibleSection('management', 'Matchverwaltung und Backups', matchManagementSection(), false)}
      ${collapsibleSection('development', 'Match-Entwicklung und Vergleich', developmentTable(analysis.match, analysis.player) + matchComparisonSection(analysis.match, analysis.player), false)}
      <div class="adpc-note">Darts: ${analysis.darts.length} · davon Treffer: ${numberedHits} · erkannte Misses: ${analysis.missCount} · Punkte offiziell: ${analysis.officialTotal} · Rohwert: ${analysis.rawTotal}</div>
    `);
    output.querySelectorAll('[data-adpc-section]').forEach(details => {
      details.addEventListener('toggle', () => {
        sectionOpen[details.dataset.adpcSection] = details.open;
      });
    });
    output.querySelectorAll('[data-field-sort]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation();
        const key = button.dataset.fieldSort;
        if (fieldSort.key === key) {
          fieldSort.direction = fieldSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          fieldSort = { key, direction: 'asc' };
        }
        render(lastAnalysis);
      });
    });
    output.querySelectorAll('[data-compare-select]').forEach(select => {
      select.addEventListener('change', () => {
        comparisonSelection[select.dataset.compareSelect] = select.value;
        render(lastAnalysis);
      });
    });
    output.querySelectorAll('[data-saved-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.savedAction;
        if (action === 'rename') renameSavedMatch(button.dataset.matchId);
        if (action === 'delete') deleteSavedMatch(button.dataset.matchId);
        if (action === 'export') exportSavedMatches();
        if (action === 'import') output.querySelector('[data-saved-import]')?.click();
      });
    });
    const importInput = output.querySelector('[data-saved-import]');
    importInput?.addEventListener('change', async () => {
      const file = importInput.files?.[0];
      if (file) await importSavedMatches(file);
      importInput.value = '';
    });
  }

  function exportAnalysis() {
    if (!lastAnalysis) return;
    const blob = new Blob([JSON.stringify(lastAnalysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autodarts-analyse-${lastAnalysis.match.matchId || 'match'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function playerKey(name) {
    return String(name || '').trim().toLocaleLowerCase('de-DE');
  }

  function isBotName(name) {
    return /\bbot\b/i.test(String(name || ''));
  }

  function uniquePlayers(matches) {
    const result = [];
    const seen = new Set();
    for (const match of matches) {
      for (const name of match.players || []) {
        const key = playerKey(name);
        if (key && !seen.has(key)) {
          seen.add(key);
          result.push(name);
        }
      }
    }
    return result;
  }

  function choosePrimaryPlayer(currentMatch) {
    const saved = loadSavedMatches();
    const preferred = localStorage.getItem(PREFERRED_PLAYER_KEY) || '';
    const currentPlayers = currentMatch?.players || [];
    const savedPlayers = uniquePlayers(saved);

    // Der gemeinsame Spieler über alle gespeicherten Matches ist der stärkste Hinweis.
    let common = [];
    if (saved.length) {
      const first = saved[0].players || [];
      common = first.filter(name => saved.every(match =>
        (match.players || []).some(other => playerKey(other) === playerKey(name))
      ));
    }

    const nonBots = list => list.filter(name => !isBotName(name));
    const preferredKey = playerKey(preferred);
    const allCandidates = nonBots(common);
    const preferredCommon = allCandidates.find(name => playerKey(name) === preferredKey);
    if (preferredCommon) return preferredCommon;

    const preferredCurrent = currentPlayers.find(name => playerKey(name) === preferredKey);
    if (preferredCurrent) return preferredCurrent;

    if (allCandidates.length) return allCandidates[0];

    const preferredSaved = savedPlayers.find(name => playerKey(name) === preferredKey);
    if (preferredSaved) return preferredSaved;

    const currentNonBot = nonBots(currentPlayers);
    if (currentNonBot.length) return currentNonBot[0];

    const savedNonBot = nonBots(savedPlayers);
    return savedNonBot[0] || currentPlayers[0] || savedPlayers[0] || '';
  }

  function updatePlayerOptions(players, primaryPlayer = '') {
    if (!playerSelect) return;
    const unique = uniquePlayers([{ players }]);
    playerSelect.innerHTML = unique.map(player => `<option value="${escapeHtml(player)}">${escapeHtml(player)}</option>`).join('');
    if (primaryPlayer && unique.some(player => playerKey(player) === playerKey(primaryPlayer))) {
      const matching = unique.find(player => playerKey(player) === playerKey(primaryPlayer));
      playerSelect.value = matching;
    }
  }

  function runAnalysis() {
    const liveMatch = parseMatch();
    const hasLiveMatch = liveMatch.players.length > 0 && liveMatch.legs.length > 0;
    if (hasLiveMatch) {
      lastMatch = liveMatch;
      // Sobald mindestens ein Leg mit Visit History vorhanden ist, wird das Match
      // automatisch lokal gespeichert. Später nachgeladene Legs aktualisieren den Datensatz.
      saveMatch(liveMatch, true);
    }

    const saved = loadSavedMatches();
    const sourceMatch = hasLiveMatch
      ? liveMatch
      : saved.length
        ? combineMatches(saved)
        : liveMatch;
    const availablePlayers = sourceMatch.players || [];
    const primaryPlayer = choosePrimaryPlayer(sourceMatch);
    updatePlayerOptions(availablePlayers, primaryPlayer);
    updateSavedStatus();

    if (!availablePlayers.length || !sourceMatch.legs.length) {
      if (output) output.innerHTML = translateRenderedHtml('<div class="adpc-warning">Noch keine gespeicherten Visit-History-Daten gefunden. Öffne ein Match, gehe auf „Breakdown“ und warte, bis die Legs geladen sind.</div>');
      return;
    }

    const selected = primaryPlayer || playerSelect.value || availablePlayers[0];
    if (playerSelect) playerSelect.value = selected;
    const analysisMatch = getAnalysisMatch(sourceMatch);
    lastAnalysis = analyze(analysisMatch, selected);
    render(lastAnalysis);
  }

  function clampPanelPosition(left, top) {
    if (!panel) return { left, top };
    const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
    return {
      left: Math.min(Math.max(0, left), maxLeft),
      top: Math.min(Math.max(0, top), maxTop)
    };
  }

  function restorePanelPosition() {
    if (!panel) return;
    try {
      const raw = localStorage.getItem(PANEL_POSITION_KEY);
      const position = raw ? JSON.parse(raw) : null;
      if (!position || !Number.isFinite(position.left) || !Number.isFinite(position.top)) return;
      const clamped = clampPanelPosition(position.left, position.top);
      panel.style.left = `${clamped.left}px`;
      panel.style.top = `${clamped.top}px`;
      panel.style.right = 'auto';
    } catch (_) {}
  }

  function savePanelPosition() {
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    try {
      localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify({
        left: Math.round(rect.left),
        top: Math.round(rect.top)
      }));
    } catch (_) {}
  }

  function startPanelDrag(event) {
    if (!panel || event.button !== 0 || event.target.closest('button')) return;
    const rect = panel.getBoundingClientRect();
    panelDrag = {
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      moved: false
    };
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function movePanelDrag(event) {
    if (!panelDrag || !panel) return;
    const deltaX = event.clientX - panelDrag.startX;
    const deltaY = event.clientY - panelDrag.startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 2) panelDrag.moved = true;
    const position = clampPanelPosition(panelDrag.startLeft + deltaX, panelDrag.startTop + deltaY);
    panel.style.left = `${position.left}px`;
    panel.style.top = `${position.top}px`;
    panel.style.right = 'auto';
  }

  function endPanelDrag() {
    if (!panelDrag) return;
    savePanelPosition();
    panelDrag = null;
  }

  function handlePanelResize() {
    if (!panel || panel.style.left === '') return;
    const rect = panel.getBoundingClientRect();
    const position = clampPanelPosition(rect.left, rect.top);
    panel.style.left = `${position.left}px`;
    panel.style.top = `${position.top}px`;
  }

  function createPanel() {
    if (panel || !document.body) return;
    panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="adpc-head"><b data-adpc-static="title">${uiText('title')}</b><div class="adpc-head-actions"><button id="adpc-lang-de" data-language="de" title="Deutsch" aria-label="Deutsch">DE <span class="adpc-flag adpc-flag-de" aria-hidden="true"></span></button><button id="adpc-lang-en" data-language="en" title="English" aria-label="English">GB <span class="adpc-flag adpc-flag-gb" aria-hidden="true"></span></button><button id="adpc-top" title="${uiText('topTitle')}" aria-label="${uiText('topAria')}">↑</button><button id="adpc-minimize" title="${uiText('minimize')}">−</button><button id="adpc-close" title="${uiText('close')}">×</button></div></div>
      <div class="adpc-body">
        <div class="adpc-controls">
          <label><span data-adpc-static="player">${uiText('player')}</span> <select id="adpc-player"></select></label>
          <label><span data-adpc-static="view">${uiText('view')}</span> <select id="adpc-view"><option value="table" data-adpc-static="table">${uiText('table')}</option><option value="board" data-adpc-static="board">${uiText('board')}</option><option value="both" selected data-adpc-static="both">${uiText('both')}</option></select></label>
          <label><span data-adpc-static="fieldDisplay">${uiText('fieldDisplay')}</span> <select id="adpc-mode"><option value="count" data-adpc-static="count">${uiText('count')}</option><option value="percent" selected data-adpc-static="percent">${uiText('percent')}</option></select></label>
          <label><span data-adpc-static="scope">${uiText('scope')}</span> <select id="adpc-scope"><option value="current" data-adpc-static="current">${uiText('current')}</option><option value="all" selected data-adpc-static="all">${uiText('all')}</option></select></label>
          <button id="adpc-refresh" data-adpc-static="analyze">${uiText('analyze')}</button>
          <button id="adpc-save" data-adpc-static="save">${uiText('save')}</button>
          <button id="adpc-clear-saved" data-adpc-static="clearSaved">${uiText('clearSaved')}</button>
          <button id="adpc-export" data-adpc-static="exportJson">${uiText('exportJson')}</button>
        </div>
        <div id="adpc-saved-status" class="adpc-saved-status">Noch keine gespeicherten Matches</div>
        <div id="adpc-output"><div class="adpc-warning">${uiText('reading')}</div></div>
      </div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      #${PANEL_ID}{position:fixed;right:14px;top:14px;width:min(960px,calc(100vw - 28px));max-height:calc(100vh - 28px);overflow:auto;z-index:2147483647;background:#151923;color:#e9edf5;border:1px solid #39435a;border-radius:10px;box-shadow:0 10px 35px rgba(0,0,0,.5);font:13px/1.4 Arial,sans-serif;padding:12px}
      #${PANEL_ID} .adpc-head{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;align-items:center;font-size:15px;margin:-12px -12px 10px;padding:12px;background:#151923;border-bottom:1px solid #39435a;cursor:move;user-select:none;touch-action:none}
      #${PANEL_ID} .adpc-head-actions{display:flex;gap:5px;cursor:default}
      #${PANEL_ID} .adpc-head-actions button{min-width:28px;font-size:16px;line-height:1}
      #${PANEL_ID} .adpc-head-actions .adpc-language-active{background:#3b4b68;border-color:#55b6a7}
      #${PANEL_ID} .adpc-flag{display:inline-block;width:18px;height:12px;margin-left:3px;vertical-align:-1px;border:1px solid rgba(255,255,255,.55);border-radius:1px;box-shadow:0 0 0 1px rgba(0,0,0,.2);overflow:hidden}
      #${PANEL_ID} .adpc-flag-de{background:linear-gradient(to bottom,#000 0 33.33%,#d00 33.33% 66.66%,#ffce00 66.66% 100%)}
      #${PANEL_ID} .adpc-flag-gb{background-color:#012169;background-image:linear-gradient(90deg,transparent 38%,#fff 38% 62%,transparent 62%),linear-gradient(0deg,transparent 35%,#fff 35% 65%,transparent 65%),linear-gradient(90deg,transparent 45%,#c8102e 45% 55%,transparent 55%),linear-gradient(0deg,transparent 42%,#c8102e 42% 58%,transparent 58%),linear-gradient(32deg,transparent 42%,#fff 42% 48%,#c8102e 48% 52%,#fff 52% 58%,transparent 58%),linear-gradient(-32deg,transparent 42%,#fff 42% 48%,#c8102e 48% 52%,#fff 52% 58%,transparent 58%)}
      #${PANEL_ID} #adpc-top:hover{color:#55b6a7;border-color:#55b6a7}
      #${PANEL_ID}.adpc-minimized{width:auto;min-width:260px}
      #${PANEL_ID}.adpc-minimized .adpc-body{display:none}
      #${PANEL_ID}.adpc-save-flash{animation:adpc-save-flash 1.1s ease-out}
      @keyframes adpc-save-flash{0%,100%{border-color:#39435a;box-shadow:0 10px 35px rgba(0,0,0,.5)}20%,65%{border-color:#39d98a;box-shadow:0 0 0 4px rgba(57,217,138,.42),0 0 28px rgba(57,217,138,.8)}}
      #${PANEL_ID} button,#${PANEL_ID} select{background:#29344a;color:#fff;border:1px solid #4c5b78;border-radius:6px;padding:5px 8px;font-size:12px}
      #${PANEL_ID} button{cursor:pointer} #${PANEL_ID} label{display:flex;gap:4px;align-items:center}
      #${PANEL_ID} .adpc-controls{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-bottom:6px}
      #${PANEL_ID} .adpc-saved-status{color:#9eabc0;font-size:11px;margin:2px 0 10px}
      #${PANEL_ID} h4{margin:24px 0 9px;padding:9px 10px 8px;border-left:4px solid #55b6a7;border-bottom:1px solid #39435a;color:#f2f5fa;font-size:17px;line-height:1.2;letter-spacing:.01em;background:linear-gradient(90deg,rgba(85,182,167,.12),transparent 70%)}
      #${PANEL_ID} h5{margin:18px 0 8px;color:#dfe6f2;font-size:14px}
      #${PANEL_ID} .adpc-collapsible-section{margin:24px 0 9px;border-left:4px solid #55b6a7;border-bottom:1px solid #39435a;background:linear-gradient(90deg,rgba(85,182,167,.12),transparent 70%)}
      #${PANEL_ID} .adpc-collapsible-section summary{padding:9px 10px 8px;color:#f2f5fa;font-size:17px;font-weight:700;line-height:1.2;cursor:pointer;list-style-position:inside}
      #${PANEL_ID} .adpc-collapsible-section summary:hover{background:rgba(85,182,167,.12)}
      #${PANEL_ID} .adpc-collapsible-content{padding:0 10px 10px}
      #${PANEL_ID} table{border-collapse:collapse;width:100%;font-size:12px}
      #${PANEL_ID} th,#${PANEL_ID} td{border-bottom:1px solid #30394d;padding:4px 6px;text-align:right} #${PANEL_ID} th:first-child,#${PANEL_ID} td:first-child{text-align:left}
      #${PANEL_ID} .adpc-sort-button{background:transparent;border:0;border-radius:4px;color:#e9edf5;padding:2px 3px;font:inherit;font-weight:700;cursor:pointer;white-space:nowrap}
      #${PANEL_ID} .adpc-sort-button:hover,#${PANEL_ID} .adpc-sort-button:focus-visible{background:#29344a;color:#55b6a7;outline:1px solid #55b6a7}
      #${PANEL_ID} .adpc-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:6px} #${PANEL_ID} .adpc-cards div{background:#20283a;border-radius:7px;padding:7px;text-align:center}
      #${PANEL_ID} .adpc-cards b{display:block;color:#9eabc0;font-size:11px} #${PANEL_ID} .adpc-cards strong{display:block;font-size:20px;margin-top:3px}
      #${PANEL_ID} .adpc-thresholds{display:flex;flex-wrap:wrap;gap:6px} #${PANEL_ID} .adpc-thresholds span{background:#20283a;border-radius:6px;padding:6px 8px}
      #${PANEL_ID} .adpc-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
      #${PANEL_ID} .adpc-stats-grid div{background:#20283a;border-radius:7px;padding:8px;text-align:center}
      #${PANEL_ID} .adpc-stats-grid b{display:block;color:#9eabc0;font-size:11px}
      #${PANEL_ID} .adpc-stats-grid strong{display:block;font-size:18px;margin-top:3px}
      #${PANEL_ID} .adpc-focus-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}
      #${PANEL_ID} .adpc-focus-summary div{background:#20283a;border-radius:7px;padding:8px;text-align:center}
      #${PANEL_ID} .adpc-focus-summary b,#${PANEL_ID} .adpc-focus-summary small{display:block;color:#9eabc0;font-size:11px}
      #${PANEL_ID} .adpc-focus-summary strong{display:block;font-size:16px;margin:3px 0}
      #${PANEL_ID} .adpc-checkout-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px}
      #${PANEL_ID} .adpc-checkout-summary div{background:#20283a;border-radius:7px;padding:8px;text-align:center}
      #${PANEL_ID} .adpc-checkout-summary b{display:block;color:#9eabc0;font-size:11px}
      #${PANEL_ID} .adpc-checkout-summary strong{display:block;font-size:20px;margin-top:3px}
      #${PANEL_ID} .adpc-note{color:#929eb3;font-size:11px;margin-top:6px} #${PANEL_ID} .adpc-warning{color:#ffd38a;background:#342c1d;padding:8px;border-radius:6px}
      #${PANEL_ID} .adpc-management-actions,#${PANEL_ID} .adpc-compare-controls{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin-bottom:8px}
      #${PANEL_ID} .adpc-compare-controls label{display:flex;gap:4px;align-items:center}
      #${PANEL_ID} .adpc-coach{background:#20283a;border-left:3px solid #55b6a7;border-radius:6px;padding:8px 10px}
      #${PANEL_ID} .adpc-coach ul{margin:0;padding-left:18px} #${PANEL_ID} .adpc-coach li{margin:4px 0}
      #${PANEL_ID} .adpc-training{background:#20283a;border-left:3px solid #e2a84b;border-radius:6px;padding:8px 10px}
      #${PANEL_ID} .adpc-training ol{margin:0;padding-left:22px} #${PANEL_ID} .adpc-training li{margin:5px 0}
      #${PANEL_ID} .adpc-development-scroll{overflow-x:auto}
      #${PANEL_ID} .adpc-current-row{background:#24334a}
      #${PANEL_ID} .adpc-win-row{background:rgba(57,217,138,.14)}
      #${PANEL_ID} .adpc-bust-row{background:rgba(184,59,75,.16)}
      #${PANEL_ID} .adpc-two-columns{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}
      #${PANEL_ID} .adpc-board{display:block;width:100%;max-width:460px;margin:0 auto;background:#0c1019;border-radius:50%}
      #${PANEL_ID} .adpc-board-value{font:700 10px Arial,sans-serif;text-anchor:middle;dominant-baseline:middle}
      #${PANEL_ID} .adpc-board-number{font:700 16px Arial,sans-serif;text-anchor:middle;dominant-baseline:middle}
      #${PANEL_ID} .adpc-board-bull{font:700 11px Arial,sans-serif;text-anchor:middle;dominant-baseline:middle}
      #${PANEL_ID} .adpc-board-bull-small{font:700 9px Arial,sans-serif;text-anchor:middle;dominant-baseline:middle}
      #${PANEL_ID} .adpc-board-legend{display:flex;flex-wrap:wrap;gap:6px;color:#9eabc0;font-size:11px;margin-bottom:6px}
      #${PANEL_ID} .adpc-board-legend span{padding:3px 6px;background:#20283a;border-radius:5px}
      #${PANEL_ID} .adpc-legend-s{border-left:3px solid #e7edf4} #${PANEL_ID} .adpc-legend-t{border-left:3px solid #2f8c83} #${PANEL_ID} .adpc-legend-d{border-left:3px solid #b83b4b}
      @media(max-width:760px){#${PANEL_ID}{top:7px;right:7px;width:calc(100vw - 14px);padding:9px}#${PANEL_ID} .adpc-head{margin:-9px -9px 10px;padding:9px}.adpc-cards{grid-template-columns:repeat(2,1fr)}#${PANEL_ID} .adpc-focus-summary{grid-template-columns:1fr}#${PANEL_ID} .adpc-checkout-summary{grid-template-columns:repeat(2,1fr)}#${PANEL_ID} .adpc-stats-grid{grid-template-columns:repeat(2,1fr)}#${PANEL_ID} .adpc-two-columns{grid-template-columns:1fr}}
    `;
    panel.appendChild(style);
    document.body.appendChild(panel);
    restorePanelPosition();
    const panelHead = panel.querySelector('.adpc-head');
    panelHead.addEventListener('pointerdown', startPanelDrag);
    panelHead.addEventListener('pointermove', movePanelDrag);
    panelHead.addEventListener('pointerup', endPanelDrag);
    panelHead.addEventListener('pointercancel', endPanelDrag);
    window.addEventListener('resize', handlePanelResize);
    output = panel.querySelector('#adpc-output');
    playerSelect = panel.querySelector('#adpc-player');
    playerSelect.addEventListener('change', () => {
      try { localStorage.setItem(PREFERRED_PLAYER_KEY, playerSelect.value); } catch (_) {}
      if (lastAnalysis) {
        lastAnalysis = analyze(lastAnalysis.match, playerSelect.value);
        render(lastAnalysis);
      }
    });
    modeSelect = panel.querySelector('#adpc-mode');
    viewSelect = panel.querySelector('#adpc-view');
    scopeSelect = panel.querySelector('#adpc-scope');
    savedStatus = panel.querySelector('#adpc-saved-status');
    const updateStaticLanguage = () => {
      panel.querySelectorAll('[data-adpc-static]').forEach(element => {
        const key = element.dataset.adpcStatic;
        if (key && Object.prototype.hasOwnProperty.call(STATIC_TRANSLATIONS.de, key)) {
          element.textContent = uiText(key);
        }
      });
      const topButton = panel.querySelector('#adpc-top');
      const minimizeButton = panel.querySelector('#adpc-minimize');
      const closeButton = panel.querySelector('#adpc-close');
      if (topButton) {
        topButton.title = uiText('topTitle');
        topButton.setAttribute('aria-label', uiText('topAria'));
      }
      if (minimizeButton) minimizeButton.title = isMinimized ? uiText('restore') : uiText('minimize');
      if (closeButton) closeButton.title = uiText('close');
      panel.querySelectorAll('[data-language]').forEach(button => {
        button.classList.toggle('adpc-language-active', button.dataset.language === currentLanguage);
      });
    };
    const setLanguage = language => {
      currentLanguage = language === 'en' ? 'en' : 'de';
      try { localStorage.setItem(LANGUAGE_KEY, currentLanguage); } catch (_) {}
      updateStaticLanguage();
      if (lastAnalysis) render(lastAnalysis);
    };
    panel.querySelector('#adpc-lang-de').addEventListener('click', () => setLanguage('de'));
    panel.querySelector('#adpc-lang-en').addEventListener('click', () => setLanguage('en'));
    updateStaticLanguage();
    panel.querySelector('#adpc-top').addEventListener('click', () => {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
    });
    panel.querySelector('#adpc-minimize').addEventListener('click', toggleMinimize);
    panel.querySelector('#adpc-refresh').addEventListener('click', runAnalysis);
    panel.querySelector('#adpc-save').addEventListener('click', saveCurrentMatch);
    panel.querySelector('#adpc-clear-saved').addEventListener('click', clearSavedMatches);
    panel.querySelector('#adpc-export').addEventListener('click', exportAnalysis);
    panel.querySelector('#adpc-close').addEventListener('click', () => panel.remove());
    modeSelect.addEventListener('change', () => { if (lastAnalysis) render(lastAnalysis); });
    viewSelect.addEventListener('change', () => { if (lastAnalysis) render(lastAnalysis); });
    scopeSelect.addEventListener('change', runAnalysis);
    updateSavedStatus();
    setTimeout(runAnalysis, 900);
    setTimeout(runAnalysis, 2500);
    setTimeout(runAnalysis, 6000);
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    if (!panel) return;
    panel.classList.toggle('adpc-minimized', isMinimized);
    const button = panel.querySelector('#adpc-minimize');
    if (button) {
      button.textContent = isMinimized ? '□' : '−';
      button.title = isMinimized ? uiText('restore') : uiText('minimize');
    }
  }

  function handleRouteChange() {
    const current = location.href;
    if (current === lastRoute) return;
    lastRoute = current;
    lastAnalysis = null;
    if (output) output.innerHTML = translateRenderedHtml('<div class="adpc-warning">Seite gewechselt. Lade gespeicherte Analyse …</div>');
    setTimeout(runAnalysis, 300);
    setTimeout(runAnalysis, 1200);
    setTimeout(runAnalysis, 3000);
  }

  function patchHistoryMethod(method) {
    const original = history[method];
    if (typeof original !== 'function' || original.__adpcPatched) return;
    function patchedHistoryMethod() {
      const result = original.apply(this, arguments);
      setTimeout(handleRouteChange, 0);
      return result;
    }
    patchedHistoryMethod.__adpcPatched = true;
    history[method] = patchedHistoryMethod;
  }

  function scheduleAnalysis() {
    clearTimeout(parseTimer);
    parseTimer = setTimeout(() => { if (panel && document.body.contains(panel)) runAnalysis(); }, 700);
  }

  const observer = new MutationObserver(scheduleAnalysis);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');
  window.addEventListener('popstate', handleRouteChange);
  window.addEventListener('hashchange', handleRouteChange);
  createPanel();
})();
