var enable_debug = true;

Array.prototype.contains = function (obj) {
  var i = this.length;
  while (i--) {
    if (this[i] == obj) {
      return true;
    }
  }
  return false;
}

function find_tags(b) {
  var h = document.getElementsByTagName('*'), c;
  for (c in h) if (-1 < (' ' + h[c].className + ' ').indexOf(' ' + b + ' ')) return h[c]
}

function debug(msg) {
  var console = (window.console = window.console || {});
  if (enable_debug === true) {
    console.log(msg);
  }
}

function find_meta(c) {
  var b = document.getElementsByTagName('meta');
  for (var i = 0; i < b.length; i++) if (b[i].getAttribute('property') == c) return b[i].getAttribute('content');
  return !1
}

function open_tab(newData) {
  debug(newData);
  var url = "";
  for (var prop in newData) {
    if (newData.hasOwnProperty(prop)) {
      if (!newData[prop]) {
        continue;
      }
      if (url != "") {
        url += "&"
      }
      url += prop + "=" + encodeURIComponent(newData[prop])
    }
  }
  url = "https://recordseek.com/share/?" + url;
  app.newTab(url);
}

function gx_short(type) {
  return type ? String(type).split('http://gedcomx.org/')[1] || String(type) : '';
}

function gx_find_person(data, id) {
  if (!id) return null;
  id = String(id).replace(/^#/, '');
  for (var i = 0; i < data.persons.length; i++) {
    if (data.persons[i].id === id) return data.persons[i];
  }
  return null;
}

function gx_name_part(person, partType) {
  try {
    var parts = person.names[0].nameForms[0].parts;
    for (var i = 0; i < parts.length; i++) {
      if (gx_short(parts[i].type) === partType) return parts[i].value;
    }
  } catch (e) {
  }
  return '';
}

function gx_fact(person, factType, field) {
  var facts = (person && person.facts) || [];
  for (var i = 0; i < facts.length; i++) {
    if (gx_short(facts[i].type) === factType && facts[i][field] && facts[i][field].original) {
      return facts[i][field].original;
    }
  }
  return '';
}

// The record's own event (FamilySearch marks it primary) -> search event type.
var GX_EVENT_TYPES = {
  Birth: 'birthLike', Christening: 'birthLike', Baptism: 'birthLike',
  Death: 'deathLike', Burial: 'deathLike', Cremation: 'deathLike',
  Marriage: 'marriageLike', MarriageBanns: 'marriageLike', MarriageLicense: 'marriageLike', MarriageContract: 'marriageLike',
  Census: 'residence', Residence: 'residence'
};

// Event type, year range and place from the main person's primary fact.
function gx_primary_event(out, person) {
  var facts = (person && person.facts) || [];
  for (var i = 0; i < facts.length; i++) {
    var f = facts[i], type = GX_EVENT_TYPES[gx_short(f.type)];
    if (f.primary === true && type) {
      var years = ((f.date && f.date.original) || '').match(/\b\d{4}\b/g) || [];
      out.eventType = type;
      out.eventDateFrom = years[0] || '';
      out.eventDateTo = years[years.length - 1] || '';
      out.eventPlace = (f.place && f.place.original) || '';
      return;
    }
  }
}

function gx_set_relative(out, prefix, person) {
  if (!person) return;
  out[prefix + 'GivenName'] = gx_name_part(person, 'Given');
  out[prefix + 'Surname'] = gx_name_part(person, 'Surname');
}

// An ark/URL without protocol, www or query, for comparing identifiers.
function gx_normalize_url(url) {
  return typeof url === 'string' ? url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/[?#].*$/, '') : '';
}

// The main person: principal=true, else the person whose persistent id is the
// record the document describes (FamilySearch), else persons[0].
function gx_main_person(data) {
  var persons = (data && data.persons) || [], i, j;
  for (i = 0; i < persons.length; i++) {
    if (persons[i].principal === true) return persons[i];
  }
  var desc = data && typeof data.description === 'string' ? data.description.replace(/^#/, '') : '';
  var sources = (data && data.sourceDescriptions) || [], about = '';
  for (i = 0; desc && i < sources.length; i++) {
    if (sources[i].id === desc) about = gx_normalize_url(sources[i].about);
  }
  for (i = 0; about && i < persons.length; i++) {
    var ids = (persons[i].identifiers && persons[i].identifiers['http://gedcomx.org/Persistent']) || [];
    for (j = 0; j < ids.length; j++) {
      if (gx_normalize_url(ids[j]) === about) return persons[i];
    }
  }
  return persons[0];
}

// The record's own source: the document's description, else the first titled
// source the main person cites, else the first source description.
function gx_main_source(data, main) {
  var sources = (data && data.sourceDescriptions) || [];
  var refs = [data && data.description];
  var cited = (main && main.sources) || [];
  for (var i = 0; i < cited.length; i++) refs.push(cited[i] && cited[i].description);
  for (i = 0; i < refs.length; i++) {
    if (typeof refs[i] !== 'string') continue;
    var id = refs[i].replace(/^#/, '');
    for (var j = 0; j < sources.length; j++) {
      if (sources[j].id === id && sources[j].titles && sources[j].titles.length) return sources[j];
    }
  }
  return sources[0];
}

// Map the primary person (principal=true, else persons[0]) and close relatives.
function gx_person_params(data) {
  var out = {};
  var main = gx_main_person(data), i;
  if (!main) return out;
  out.givenName = gx_name_part(main, 'Given');
  out.surname = gx_name_part(main, 'Surname');
  out.gender = main.gender ? gx_short(main.gender.type) : '';
  out.birthDate = gx_fact(main, 'Birth', 'date');
  out.birthPlace = gx_fact(main, 'Birth', 'place');
  out.deathDate = gx_fact(main, 'Death', 'date');
  out.deathPlace = gx_fact(main, 'Death', 'place');
  gx_primary_event(out, main);
  var rels = data.relationships || [];
  var mainRef = '#' + main.id;
  for (i = 0; i < rels.length; i++) {
    var r = rels[i];
    var p1 = r.person1 && r.person1.resource, p2 = r.person2 && r.person2.resource;
    var type = gx_short(r.type);
    if (type === 'ParentChild' && p2 === mainRef) {
      var parent = gx_find_person(data, p1);
      if (parent) {
        var g = parent.gender ? gx_short(parent.gender.type) : '';
        if (g === 'Male' && !out.fatherGivenName && !out.fatherSurname) gx_set_relative(out, 'father', parent);
        else if (g === 'Female' && !out.motherGivenName && !out.motherSurname) gx_set_relative(out, 'mother', parent);
      }
    } else if (type === 'Couple' && (p1 === mainRef || p2 === mainRef) && !out.spouseGivenName && !out.spouseSurname) {
      gx_set_relative(out, 'spouse', gx_find_person(data, p1 === mainRef ? p2 : p1));
    }
  }
  return out;
}

function RecordSeek() {
  var k = 'https:' == document.location.protocol ? 'https://' : 'http://', b = '';
  find_tags('citation') && (b = find_tags('citation').getElementsByTagName('p'), 0 < b.length && (b = b[0].textContent || b[0].innerText));
  var c = document.getElementsByTagName('h1'), d = '';
  0 < c.length && (d = c[0].textContent || c[0].innerText);
  c = document.title;
  d && d.length > document.title.length && (c = d);
  var e = '' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);
  '' == e && find_meta('description') ? e = find_meta('description') : '' == e && find_meta('og:description') && (e = find_meta('og:description'));

  c = document.title;
  d && d.length > document.title.length && (c = d);

  var newData = {
    '_': (new Date).getTime(),
    'url': window.location.href,
    'h1': d,
    'citation': b,
    'title': c,
    'notes': ('' + (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text)).replace(/(\r\n|\n|\r)/gm, " "),
    'e': app.browser.name,
    'ev': app.getVersion()
  };

  // Open the share page exactly once. A scraper that throws or never answers
  // must not leave the click doing nothing, so a timer opens it without data.
  var opened = false;
  function open_once() {
    if (opened) return;
    opened = true;
    open_tab(newData);
  }
  setTimeout(open_once, 3000);

  var emitter;
  try {
    emitter = genscrape();
  } catch (err) {
    open_once();
    return;
  }
  emitter.on('data', function (data) {
    try {
      debug(data);
      var main = gx_main_person(data);
      var source = gx_main_source(data, main);
      // Read each field on its own: FamilySearch records have no citation.
      try { newData['title'] = source.titles[0].value; } catch (e) {}
      try { newData['citation'] = source.citations[0].value; } catch (e) {}
      try { newData['url'] = source.about; } catch (e) {}
      newData['tags'] = [];
      var person = gx_person_params(data);
      var facts = (main && main.facts) || [];
      for (var i = 0; i < facts.length; i++) {
        var fact_type = gx_short(facts[i].type);
        if (fact_type && newData['tags'].indexOf(fact_type) == -1) {
          newData['tags'].push(fact_type);
        }
      }
      newData['tags'] = newData['tags'].join();
      for (var key in person) {
        if (person.hasOwnProperty(key) && person[key]) {
          newData[key] = person[key];
        }
      }
    } catch (err) {
    }
    debug('genscrapeData');
    open_once();
  }).on('noMatch', function () {
    debug('noMatch');
    open_once();
  }).on('noData', function () {
    debug('noData');
    open_once();
  }).on('error', function () {
    debug('error');
    open_once();
  });
}

function url_matching_actions() {
  if (document.URL.indexOf("recordseek.com") >= 0) {
    document.body.setAttribute('extension', app.browser.name);
    document.body.setAttribute('version', app.getVersion());
  }

  /*
    if (document.URL.indexOf("recordseek.com/share/") >= 0) {
      alert('check the cookie');
      app.setCookie('FS_ACCESS_TOKEN_1','',0)
      app.setCookie('recordseek-auth','',0)
    }
    if (document.URL.indexOf("ident.familysearch.org/cis-web/oauth2/v3/authorization") >= 0) {
      app.setCookie('fssessionid','',0)
    }
  */
}

// Works for Safari AND Chrome, loading order stuff.
if (document && document.body && document.URL && (document.readyState === "complete"
    || document.readyState === "loaded"
    || document.readyState === "interactive")) {
  url_matching_actions();
} else {
  window.addEventListener('DOMContentLoaded', function () {
    if (document) {
      url_matching_actions();
    }
  }, true);
}
