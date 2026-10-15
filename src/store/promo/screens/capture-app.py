import json, subprocess, sys, urllib.parse as u
# Captures app screens for the store screenshots. Needs `pnpm dev` running in recordseek-app
# and a temporary packages/web/public/_shot.html that seeds sessionStorage (fs_access_token,
# rs_session) from its query and then opens /?<capture>#/<route>. Delete that file afterwards.
# Usage: python3 capture-app.py <out-dir>
OUT = sys.argv[1]
C = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
cap = u.urlencode({
  'url': 'https://www.findagrave.com/memorial/48213907/john-henry-smith',
  'title': 'John Henry Smith (1842-1911) - Find a Grave Memorial',
  'notes': 'Buried in Green Lawn Cemetery, Columbus, Franklin County, Ohio. Civil War veteran, 46th Ohio Infantry.',
  'givenName': 'John Henry', 'surname': 'Smith', 'gender': 'Male',
  'birthDate': '12 Mar 1842', 'birthPlace': 'Franklin County, Ohio',
  'deathDate': '3 Nov 1911', 'deathPlace': 'Columbus, Ohio',
  'fatherGivenName': 'William', 'fatherSurname': 'Smith',
  'motherGivenName': 'Elizabeth', 'motherSurname': 'Carter',
  'spouseGivenName': 'Mary', 'spouseSurname': 'Wilson',
}, quote_via=u.quote)
draft = {'url': 'https://www.findagrave.com/memorial/48213907/john-henry-smith',
         'title': 'John Henry Smith (1842-1911) - Find a Grave Memorial',
         'citation': 'Find a Grave, database and images (https://www.findagrave.com/memorial/48213907/john-henry-smith), memorial page for John Henry Smith (12 Mar 1842–3 Nov 1911), Find a Grave Memorial ID 48213907.',
         'notes': 'Buried in Green Lawn Cemetery, Columbus, Franklin County, Ohio.'}
attach_session = {'attach': {'pid': 'KWJ7-M2P', 'name': 'John Henry Smith', 'url': 'https://www.familysearch.org/tree/person/details/KWJ7-M2P', 'justification': 'Find a Grave memorial matches his birth and death dates, burial in Columbus, and wife Mary.'},
                  'tags': {'name': True, 'gender': False, 'birth': True, 'christening': False, 'death': True, 'burial': True},
                  'draft': draft}
shots = {
  'main': dict(route=''),
  'source': dict(route='fs-source', token=1),
  'search': dict(route='fs-search', token=1),
  'attach': dict(route='fs-attach', token=1, session=attach_session),
  'citation': dict(route='citation'),
}
for name, o in shots.items():
    q = {'capture': cap, 'route': o['route']}
    if o.get('token'): q['token'] = '1'
    if o.get('session'): q['session'] = json.dumps(o['session'])
    url = 'http://localhost:9000/_shot.html (temporary: create it in packages/web/public, delete after)?' + u.urlencode(q)
    subprocess.run([C, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
                    '--virtual-time-budget=6000', '--window-size=1000,640', f'--screenshot={OUT}/app-{name}.png', url],
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(name)
