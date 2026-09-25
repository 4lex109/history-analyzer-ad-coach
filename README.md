# History Analyzer - AD Coach - by KnuSpersTV

Ein lokaler Tampermonkey-Analyzer für vergangene Autodarts-Matches.

Der Analyzer wertet ausschließlich die im Browser sichtbare **Visit History** von Autodarts aus und stellt daraus Scoring-, Checkout-, BUST-, Konsistenz-, Leg- und Trainingsinformationen zusammen.

**Aktuelle stabile Version: 3.2.5**

## Funktionsumfang

- Analyse der sichtbaren Autodarts Visit History
- automatische Erkennung des Spielers
- Analyse aktueller und lokal gespeicherter Matches
- Entwicklungsübersicht mit responsivem Diagramm
- Auswahl verschiedener Diagramm-Kennzahlen:
  - Ø Aufnahme
  - offizieller 3-Dart-Average
  - Aufnahmen über 95
  - Aufnahmen bis 45
  - T19-Anteil
  - T20-Anteil
  - Checkoutquote
  - Leggewinnquote
- Tooltip mit genauem Wert beim Überfahren eines Diagramm-Messpunkts
- aktuelles Match im Diagramm farblich hervorgehoben
- Scoring-Fokus auf 19 und 20
- Feldverteilung und Dartboard
- Aufnahmeverteilung
- Scoring nach Aufnahmebereich
- Leg-Übersicht
- Checkout-Analyse
- BUST-Analyse
- Aufnahme-Konstanz
- Aufnahmeverlauf
- Coach-Hinweise
- Trainingsvorschläge
- Matchverwaltung und JSON-Backups
- deutsche und englische Benutzeroberfläche
- lokale Speicherung im Browser

## Voraussetzungen

- Google Chrome oder ein Chromium-basierter Browser
- Tampermonkey
- Zugriff auf `https://play.autodarts.com/`

## Installation

1. Tampermonkey installieren und aktivieren.
2. Die Datei `history-analyzer-ad-coach-3.2.5.user.js` öffnen.
3. Tampermonkey zeigt die Installationsseite an.
4. Auf **Installieren** klicken.
5. Ältere Versionen des History Analyzers in Tampermonkey deaktivieren oder löschen.
6. Autodarts vollständig neu laden. Bei Problemen einen Hard Reload mit `Strg + Umschalt + R` durchführen.

**Wichtig:** Es sollte immer nur eine Version dieses Analyzers gleichzeitig aktiv sein. Mehrere aktive Versionen können doppelte Panels oder unerwartetes Verhalten verursachen.

## Erste Verwendung

1. Autodarts öffnen.
2. Ein vergangenes Match über die Match-Historie öffnen.
3. Die Matchdetailseite aufrufen.
4. In Autodarts den Bereich **Breakdown** beziehungsweise **Aufschlüsselung** öffnen.
5. Warten, bis die Visit History beziehungsweise der Aufnahmenverlauf vollständig geladen ist.
6. Der Analyzer erscheint oben rechts.
7. Falls noch keine Daten erkannt wurden, einige Sekunden warten und auf **Analysieren** beziehungsweise **Analyze** klicken.
8. Mit **DE** oder **GB** die Sprache auswählen.
9. Für die Entwicklungsübersicht mindestens zwei gespeicherte Matches laden oder speichern.
10. Im Bereich **Match-Entwicklung und Vergleich** die gewünschte Kennzahl auswählen.

## Diagramm

Das Entwicklungsdiagramm zeigt die ausgewählte Kennzahl für alle verfügbaren Matches gleichzeitig. Es passt sich automatisch an die verfügbare Breite des Analyzer-Fensters an und benötigt kein horizontales Scrollen.

Beim Überfahren eines Messpunkts mit dem Mauszeiger werden das Match, die ausgewählte Kennzahl und der genaue Wert angezeigt. Die Messpunkte können außerdem per Tastaturfokus erreicht werden.

## Bedeutung der Prozentwerte

Der Analyzer wertet nur tatsächlich erkannte Würfe aus. Welche Felder ursprünglich anvisiert wurden, ist aus der sichtbaren Visit History nicht bekannt.

Daher bedeuten die Prozentwerte grundsätzlich den Anteil an allen geworfenen Darts. MISS bleibt im Nenner enthalten. Die Werte sind keine klassische Trefferquote auf ein gezieltes Feld.

## Gespeicherte Matches und Datenschutz

Die Matches werden lokal im Browser gespeichert. Der Analyzer verwendet keine externe Match-API, keine Netzwerk-Hooks und überträgt die Analyse nicht an einen Server.

Gespeicherte Daten können im Bereich **Matchverwaltung und Backups**:

- eingesehen
- umbenannt
- gelöscht
- als JSON exportiert
- aus einer JSON-Datei importiert werden

Beim Löschen der Browserdaten oder beim Wechsel des Browserprofils können lokal gespeicherte Matches verloren gehen. Deshalb regelmäßig ein JSON-Backup exportieren.

## GitHub-Release

Für jede stabile Version wird ein GitHub-Release mit einem Versions-Tag angelegt, zum Beispiel:

```text
v3.2.5
```

Das Release sollte mindestens diese Datei als Asset enthalten:

```text
history-analyzer-ad-coach-3.2.5.user.js
```

`README.md` und `CHANGELOG.md` gehören in den Hauptbereich des Repositorys. Die Datei `RELEASE_NOTES_v3.2.5.md` kann als Vorlage für die Beschreibung des GitHub-Releases verwendet werden.

## Automatische Updates

Für automatische Updates kann die Userscript-Kopfzeile später eine feste direkte Download-Adresse zur Datei im GitHub-Repository enthalten. Dafür werden die Tampermonkey-Metadaten `@downloadURL` und `@updateURL` verwendet.

Vor dem Eintragen dieser URLs muss die endgültige GitHub-Adresse feststehen. Die Datei sollte dauerhaft unter demselben Namen und Pfad erreichbar sein.

## Fehlerbehebung

### Analyzer erscheint nicht

- Prüfen, ob Tampermonkey aktiv ist.
- Prüfen, ob genau eine Analyzer-Version aktiv ist.
- Matchdetailseite neu laden.
- Breakdown beziehungsweise Aufschlüsselung öffnen.
- Warten, bis der Aufnahmenverlauf sichtbar ist.
- **Analysieren** anklicken.
- Einen Hard Reload mit `Strg + Umschalt + R` durchführen.

### Diagramm erscheint nicht

- Mindestens zwei Matches müssen verfügbar sein.
- Prüfen, ob Matches gespeichert wurden.
- Im Analyzer den Analyseumfang **Aktuelles + gespeicherte** auswählen.
- Den Bereich **Match-Entwicklung und Vergleich** öffnen.
- Anschließend erneut auf **Analysieren** klicken.

### Autodarts lädt langsam oder stürzt ab

- Alle älteren Analyzer-Versionen deaktivieren.
- Nur die aktuell getestete Version aktiv lassen.
- Andere Userscripts für Autodarts testweise deaktivieren.
- Autodarts mit `Strg + Umschalt + R` neu laden.
- Bei wiederholten Problemen zunächst auf die zuletzt bestätigte stabile Version zurückgehen.

### Analyse zeigt keine Daten

- Prüfen, ob tatsächlich die Matchdetailseite geöffnet ist.
- Breakdown beziehungsweise Aufschlüsselung öffnen.
- Warten, bis mindestens ein Leg mit Aufnahmen geladen ist.
- Prüfen, ob die Autodarts-Oberfläche vollständig geladen ist.
- Anschließend **Analysieren** anklicken.

## Gute Informationen für Fehlerberichte

Bei einem Fehler sollten Community-Mitglieder möglichst diese Informationen angeben:

- Browser und Browser-Version
- Tampermonkey-Version
- Analyzer-Version
- Sprache der Autodarts-Oberfläche
- ob es ein aktuelles oder vergangenes Match war
- ob Breakdown beziehungsweise Aufschlüsselung geöffnet war
- Screenshot des Problems
- ob mehrere Userscripts gleichzeitig aktiv waren
- ob der Fehler nach einem Hard Reload weiterhin auftritt

Keine Zugangsdaten, Tokens oder privaten Matchdaten öffentlich posten.

## Projektstatus

Version 3.2.5 ist die aktuell getestete stabile Version. Die Analyse basiert auf der sichtbaren Visit History und kann nur Daten auswerten, die Autodarts im Browser tatsächlich anzeigt. Änderungen an der Autodarts-Oberfläche können eine Anpassung des Parsers erforderlich machen.

Weitere Änderungen sind im [CHANGELOG.md](CHANGELOG.md) dokumentiert.
