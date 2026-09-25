History Analyzer - AD Coach - by KnuSpersTV

Installation:
1. ZIP-Datei entpacken.
2. Die Datei history-analyzer-ad-coach-3.1.1.user.js öffnen.
3. Tampermonkey zeigt die Installationsseite an.
4. Auf Installieren klicken.

Wichtig:
Vorher ältere Versionen des History Analyzers in Tampermonkey deaktivieren oder löschen.


History Analyzer - AD Coach - by KnuSpersTV

Ein lokaler Tampermonkey-Analyzer für vergangene Autodarts-Matches.

Der Analyzer wertet die sichtbare Visit History eines Autodarts-Matches aus und stellt daraus unter anderem Scoring-, Checkout-, BUST-, Konsistenz-, Leg- und Trainingsinformationen zusammen.

Aktuelle Testversion: 3.1.1

Funktionsumfang:

    Analyse vergangener Autodarts-Matches
    Auswertung der sichtbaren Visit History
    Analyse einzelner Spieler
    Zusammenfassung aktueller und lokal gespeicherter Matches
    Scoring-Fokus auf 19 und 20
    Feldverteilung und Dartboard
    Aufnahmeverteilung
    Leg-Übersicht
    Checkout-Analyse
    BUST-Analyse
    Aufnahme-Konstanz
    Aufnahmeverlauf
    Coach-Hinweise
    Trainingsvorschläge
    Matchverwaltung und JSON-Backups
    deutsche und englische Benutzeroberfläche
    lokale Speicherung im Browser


Voraussetzungen

    Google Chrome oder ein Chromium-basierter Browser
    Tampermonkey
    Zugriff auf https://play.autodarts.com/


    Installation in Chrome

    Tampermonkey im Chrome Web Store installieren und aktivieren.


    Die bereitgestellte Datei history-analyzer-ad-coach-3.1.1.user.js öffnen.


    Tampermonkey zeigt eine Installationsseite an.


    Auf Installieren klicken.


    Falls bereits eine ältere Analyzer-Version installiert ist, diese vorher deaktivieren oder löschen.


    Autodarts vollständig neu laden. Bei Problemen einen Hard Reload mit Strg + Umschalt + R durchführen.


Wichtig: Es sollte immer nur eine Version dieses Analyzers gleichzeitig aktiv sein. Mehrere aktive Versionen können doppelte Panels oder unerwartetes Verhalten verursachen.


Erste Verwendung

    Autodarts öffnen.


    Ein vergangenes Match über die Match-Historie öffnen.


    Die Matchdetailseite aufrufen.


    In Autodarts den Bereich Breakdown beziehungsweise Aufschlüsselung öffnen.


    Warten, bis die Visit History beziehungsweise der Aufnahmenverlauf vollständig geladen ist.


    Der Analyzer erscheint oben rechts.


    Falls noch keine Daten erkannt wurden, einige Sekunden warten und auf Analysieren beziehungsweise Analyze klicken.


    Mit DE oder GB die Sprache auswählen.



Bedeutung der Prozentwerte

Der Analyzer wertet nur tatsächlich erkannte Würfe aus. Welche Felder ursprünglich anvisiert wurden, ist aus der sichtbaren Visit History nicht bekannt.

Daher bedeuten die Prozentwerte grundsätzlich den Anteil an allen geworfenen Darts. MISS bleibt im Nenner enthalten. Die Werte sind keine klassische Trefferquote auf ein gezieltes Feld.


Gespeicherte Matches und Datenschutz

Die Matches werden lokal im Browser gespeichert. Die aktuelle Version verwendet keine externe Match-API und überträgt die Analyse nicht an einen Server.

Gespeicherte Daten können im Bereich Matchverwaltung und Backups:

eingesehen

umbenannt

gelöscht

als JSON exportiert

aus einer JSON-Datei importiert werden

Beim Löschen der Browserdaten oder beim Wechsel des Browserprofils können lokal gespeicherte Matches verloren gehen. Deshalb regelmäßig ein JSON-Backup exportieren.
