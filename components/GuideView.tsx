import React from 'react';

const GuideSection: React.FC<{ title: string; children: React.ReactNode; id: string }> = ({ title, children, id }) => (
    <section id={id} className="mb-12 scroll-mt-24">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 border-b-2 border-blue-500 pb-2 mb-6">{title}</h2>
        <div className="space-y-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
     <div className="mt-8">
        <h3 className="text-2xl font-semibold mt-6 mb-3 text-slate-700 dark:text-slate-200">{title}</h3>
        <div className="space-y-3 text-base border-l-4 border-slate-200 dark:border-slate-700 pl-6">{children}</div>
    </div>
);

const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`inline-block h-6 w-6 mr-2 align-middle ${className}`}>
        {children}
    </span>
);

const Kbd: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-base font-semibold text-slate-800 dark:text-slate-200">{children}</code>
);


const GuideView: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-xl shadow-lg animate-fade-in max-w-5xl mx-auto">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-slate-800 dark:text-slate-100">Guida all'Uso</h1>
                <p className="text-xl mt-4 text-slate-500 dark:text-slate-400">
                    Benvenuto nel Registro Consegne Digitale. Questa guida ti aiuterà a scoprire tutte le funzionalità.
                </p>
            </header>

            <GuideSection title="1. Accesso e Sicurezza" id="login">
                <p>
                    L'accesso all'applicazione è protetto da password per garantire la sicurezza dei dati.
                </p>
                <SubSection title="Procedura di Accesso">
                     <p>Per iniziare, seleziona il tuo nome dal menu a tendina nella pagina di login e inserisci la tua password.</p>
                    <p><strong>Password di Default:</strong> Al primo utilizzo o dopo un reset da parte di un amministratore, la password per ogni utente è <Kbd>1</Kbd>.</p>
                </SubSection>
                <SubSection title="Gestione della Password">
                    <p><strong>Cambio Password:</strong> Una volta effettuato l'accesso, è fortemente consigliato cambiare la password. Clicca sul tuo nome in alto a destra e seleziona "Cambia Password" per impostarne una personale e sicura.</p>
                    <p><strong>Recupero Password (Admin):</strong> Se un amministratore dimentica la propria password, può usare la funzione "Password dimenticata?" nella schermata di login. Sarà richiesto un <Kbd>Codice di Recupero di Sistema</Kbd> per poter resettare la password di un altro account amministratore. Questo codice è una misura di sicurezza aggiuntiva.</p>
                </SubSection>
            </GuideSection>

            <GuideSection title="2. Pannello di Controllo (Header)" id="header">
                <p>
                    La barra in alto (Header) contiene tutti gli strumenti di navigazione e gestione. È sempre visibile e ti permette di accedere a ogni funzione rapidamente.
                </p>
                <SubSection title="Menu di Navigazione Principale">
                    <p><strong>Mappa Letti:</strong> La vista principale e predefinita. Mostra la disposizione grafica dei letti del reparto e lo stato di occupazione.</p>
                    <p><strong>Attività:</strong> Un riepilogo centralizzato di tutti gli esami e le consegne ancora da effettuare, raggruppati per paziente. Ottimo per avere una visione d'insieme delle cose da fare.</p>
                    <p><strong>Archivio:</strong> Elenca tutti i pazienti che sono stati dimessi. Da qui puoi consultarne la scheda clinica passata.</p>
                    <p><strong>Cronologia:</strong> Il "diario di bordo" dell'applicazione. Ogni singola modifica viene salvata come un backup. Questa vista permette di visualizzare la cronologia e, se necessario, ripristinare uno stato precedente.</p>
                    <p><strong>Gestione Utenti:</strong> (Visibile solo agli Amministratori) Permette di resettare le password degli altri utenti al valore di default.</p>
                </SubSection>
                 <SubSection title="Pulsanti Funzione (a destra)">
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></Icon> <strong>Guida:</strong> Apre questa schermata di aiuto.</p>
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg></Icon> <strong>Tema:</strong> Passa dalla modalità chiara a quella scura e viceversa, per adattarsi alle tue preferenze visive.</p>
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg></Icon> <strong>Annulla Modifica:</strong> Annulla l'ultima operazione di salvataggio, ripristinando lo stato immediatamente precedente. Utile in caso di errore.</p>
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" /></svg></Icon> <strong>Stampa:</strong> Apre un menu con diverse opzioni di stampa per generare report cartacei.</p>
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg></Icon> <strong>Importa:</strong> Permette di caricare un file di backup (.json) per unire i dati con quelli presenti.</p>
                     <p><Icon><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg></Icon> <strong>Esporta/Condividi:</strong> Permette di scaricare un backup completo dei dati o di inviarlo via email.</p>
                     <p><Icon className="text-red-500"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></Icon> <strong>Resetta:</strong> (Azione drastica) Pulisce la dashboard da tutti i pazienti attivi e le note. Richiede una conferma.</p>
                </SubSection>
                 <SubSection title="Barra Statistiche Occupazione">
                    <p>Subito sotto l'header, questa barra fornisce una panoramica in tempo reale del reparto:</p>
                    <ul className="list-disc pl-6">
                        <li><strong>Occupazione per sezioni:</strong> Uomini, Donne, Lungodegenza.</li>
                        <li><strong>Totale Occupati:</strong> Il numero totale di posti letto occupati sul totale disponibile.</li>
                        <li><strong>Suddivisione per Gravità:</strong> Mostra quanti pazienti sono classificati come Critici (rosso), Moderati (giallo) e Stabili (verde), con conteggio e percentuale.</li>
                    </ul>
                </SubSection>
            </GuideSection>

            <GuideSection title="3. La Mappa Letti e le sue Funzioni" id="dashboard">
                <p>
                    Questa è la vista operativa principale. Ogni elemento è interattivo e pensato per essere il più intuitivo possibile.
                </p>
                <SubSection title="Note Urgenti e Promemoria">
                    <p><strong>Note Urgenti (banner giallo):</strong> In cima alla pagina, mostra comunicazioni importanti per tutto il reparto. Per aggiungere una nota, usa il box "Aggiungi Nota Urgente di Reparto" in fondo alla pagina. Per eliminarla, passa il mouse sulla nota e clicca sulla <Kbd>&times;</Kbd>.</p>
                    <p><strong>Esami di Oggi (banner blu):</strong> Appare solo se ci sono esami programmati per la data odierna, fornendo un rapido promemoria.</p>
                </SubSection>
                 <SubSection title="Gestione dei Letti">
                    <p><strong>Letto Occupato:</strong> Mostra i dati principali del paziente (Cognome, Nome, Diagnosi, data di ricovero). Il bordo colorato indica la gravità. Una <Icon><svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg></Icon> campanella gialla segnala la presenza di esami o consegne in sospeso. <strong>Clicca sulla card per aprire la scheda dettagliata del paziente.</strong></p>
                    <p><strong>Letto Libero:</strong> Mostra il numero del letto e un pulsante <Kbd>+ Aggiungi Paziente</Kbd>. Clicca qui per avviare la procedura di inserimento di un nuovo paziente in quel letto specifico.</p>
                </SubSection>
            </GuideSection>

            <GuideSection title="4. Gestione Completa del Paziente" id="patient-management">
                 <SubSection title="Inserimento Nuovo Paziente">
                    <p>Cliccando su un letto libero, si apre il modulo di inserimento. Compila i campi anagrafici e clinici. Per l'anamnesi, puoi usare i comodi pulsanti <Kbd>+ Patologia</Kbd> per aggiungere rapidamente le comorbidità più comuni. Una volta salvato, il paziente apparirà sulla mappa letti.</p>
                </SubSection>
                 <SubSection title="Scheda Dettaglio Paziente">
                    <p>Accedendo alla scheda di un paziente, avrai una visione completa e potrai gestire ogni aspetto clinico.</p>
                     <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Modifica Gravità:</strong> Clicca direttamente sull'intestazione (dove ci sono nome e cognome) per cambiare rapidamente il codice di gravità del paziente.</li>
                        <li><strong>Modifica Dati Anagrafici/Clinici:</strong> Clicca il pulsante <Kbd>Modifica Dati</Kbd> per riaprire lo stesso modulo dell'inserimento e aggiornare diagnosi, anamnesi, note, ecc.</li>
                        <li><strong>Gestione Consegne:</strong> Nel tab "Clinica", puoi spuntare le consegne completate o aggiungerne di nuove, anche programmandole per una data e ora future.</li>
                        <li><strong>Gestione Esami/Consulenze:</strong> Nel tab "Esami", puoi aggiungere nuovi esami, specificando categoria, descrizione e date. Clicca su un esame esistente per modificarne lo stato (es. da 'Da Richiedere' a 'Prenotato') o le date. Per eliminare, clicca la <Kbd>&times;</Kbd> che appare al passaggio del mouse.</li>
                    </ul>
                </SubSection>
                <SubSection title="Dimissione del Paziente">
                    <p>Dalla scheda dettaglio, clicca sul pulsante rosso <Kbd>Dimetti</Kbd>. Si aprirà una finestra di conferma dove dovrai specificare l'esito della dimissione (a domicilio, trasferimento, ecc.). Una volta confermato, il paziente verrà rimosso dalla mappa letti e spostato nell'Archivio.</p>
                </SubSection>
            </GuideSection>

            <GuideSection title="5. Stampa, Backup e Funzioni Avanzate" id="advanced">
                <SubSection title="Stampa dei Report">
                    <p>Il pulsante <Kbd>Stampa</Kbd> offre tre layout ottimizzati per diverse esigenze:</p>
                    <ul className="list-disc pl-6">
                        <li><strong>Report Minimale:</strong> Una tabella A4 compatta con i dati essenziali di tutti i pazienti. Ideale per una visione d'insieme rapida.</li>
                        <li><strong>Report Consegne e Attività:</strong> Un report più dettagliato, focalizzato sulle consegne e sugli esami in sospeso per ogni paziente. Utile per il passaggio di consegne.</li>
                        <li><strong>Griglia di Lavoro:</strong> Un foglio A4 orizzontale con una griglia che include spazi vuoti, pensata per essere stampata e usata per prendere appunti durante il giro visite.</li>
                    </ul>
                </SubSection>
                 <SubSection title="Backup e Ripristino">
                    <p>L'applicazione è progettata per non perdere mai dati.</p>
                     <ul className="list-disc pl-6">
                        <li><strong>Salvataggio Automatico:</strong> Ogni singola modifica (aggiunta di un paziente, spunta su una consegna, ecc.) viene salvata immediatamente e crea un punto di ripristino nella Cronologia.</li>
                        <li><strong>Esportazione/Importazione:</strong> Usa i pulsanti <Kbd>Esporta</Kbd> e <Kbd>Importa</Kbd> per salvare/caricare un file di backup completo. L'importazione è intelligente: unisce i dati, dando priorità alle informazioni più recenti in caso di conflitti.</li>
                        <li><strong>Annulla e Ripristino da Cronologia:</strong> Il pulsante <Kbd>Annulla</Kbd> è per errori immediati. Per tornare a uno stato più vecchio (es. di ieri), vai in <Kbd>Cronologia</Kbd>, trova il punto desiderato e clicca <Kbd>Ripristina</Kbd>.</li>
                    </ul>
                </SubSection>
            </GuideSection>

        </div>
    );
};

export default GuideView;
