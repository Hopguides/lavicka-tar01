/* TAR01 — Izjemni predmeti (vrtilka / horizontalni carousel)
 * Pokončni tablet 13" (1200×1920). Video = ležeč 16:9, predmet centriran.
 * VSEBINA SAMO iz 50-predmetne transkripcije (Davor Poljanšek).
 * 23 predmetov z videi (ujema se z mapo ./video/). Datoteke so že web-safe.
 *
 * Schema (kompatibilna s thumbs.sh):
 *   { n:NN, title:"", group:"", video:"NN_xxx.mp4", img:"", desc:"" }
 *   img = thumbs.sh ga zapiše sam (pusti ""). title/desc dopolni iz transkripcije.
 */
window.TAR01 = {
  station: "TAR01",
  heading: "Izjemni predmeti",
  subheading: "Najpomembnejša dela in predmeti zbirke",
  idleSeconds: 60,
  items: [
    { n:1,  title:"Brizga za klistir",         group:"Medicinski instrumenti",   video:"1_Brizga_klistir.mp4",      img:"", desc:"" },
    { n:2,  title:"Naprava za puščanje krvi",  group:"Medicinski instrumenti",   video:"2_puscanje_krvi.mp4",       img:"", desc:"" },
    { n:3,  title:"Mikroskop",                 group:"Eksperimentalne znanosti", video:"3_mikroskop.mp4",           img:"", desc:"" },
    { n:4,  title:"Rimska pinceta",            group:"Medicinski instrumenti",   video:"4_rimska_pinceta.mp4",      img:"", desc:"" },
    { n:5,  title:"Balzamarij",                group:"Lekarniške posode",        video:"5_balzamarij.mp4",          img:"", desc:"" },
    { n:6,  title:"Albarello",                 group:"Lekarniške posode",        video:"6_arbarelo.mp4",            img:"", desc:"" },
    { n:7,  title:"Merske uteži",              group:"Lekarniška oprema",        video:"7_merske_utezi.mp4",        img:"", desc:"" },
    { n:8,  title:"Biblija",                   group:"Humanistika",              video:"8_biblija.mp4",             img:"", desc:"" },
    { n:9,  title:"Gutenbergova biblija",      group:"Humanistika",              video:"9_biblija_gutenberg.mp4",   img:"", desc:"" },
    { n:10, title:"Posoda za sirup",           group:"Lekarniške posode",        video:"10_posoda_sirup.mp4",       img:"", desc:"" },
    { n:11, title:"Posoda za mazila",          group:"Lekarniške posode",        video:"11_posoda_mazila.mp4",      img:"", desc:"" },
    { n:12, title:"Posoda za praške",          group:"Lekarniške posode",        video:"12_posoda_praske.mp4",      img:"", desc:"" },
    { n:13, title:"Steklena posoda za sirup",  group:"Lekarniške posode",        video:"13_steklena_sirup.mp4",     img:"", desc:"" },
    { n:14, title:"Posoda iz belega stekla",   group:"Lekarniške posode",        video:"14_posoda_belo_steklo.mp4", img:"", desc:"" },
    { n:15, title:"Habsburška posoda",         group:"Lekarniške posode",        video:"15_posoda_habsburg.mp4",    img:"", desc:"" },
    { n:16, title:"Kobaltno modra posoda",     group:"Lekarniške posode",        video:"16_cobalt_posoda_modra.mp4",img:"", desc:"" },
    { n:17, title:"Posode za droge",           group:"Lekarniške posode",        video:"17_posode_za_droge.mp4",    img:"", desc:"" },
    { n:19, title:"Empirska tehtnica",         group:"Lekarniška oprema",        video:"19_empirska_tehtnica.mp4",  img:"", desc:"" },
    { n:20, title:"Astrološki globus",         group:"Eksperimentalne znanosti", video:"20_astroloski_globus.mp4",  img:"", desc:"" },
    { n:21, title:"Geografski globus",         group:"Eksperimentalne znanosti", video:"21_geografski_globus.mp4",  img:"", desc:"" },
    { n:23, title:"Homeopatska lekarna",       group:"Medicina in farmacija",    video:"23_homeopatija.mp4",        img:"", desc:"" },
    { n:24, title:"Potujoča lekarna",          group:"Medicina in farmacija",    video:"24_potujoca_lekarna.mp4",   img:"", desc:"" },
    { n:26, title:"Uteži",                     group:"Lekarniška oprema",        video:"26_utezi.mp4",              img:"", desc:"" }
  ]
};
