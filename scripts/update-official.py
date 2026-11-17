"""Write and read back official offers. Request JSON is read only from stdin."""
import sys,json,urllib.request
if sys.stdin.isatty():
 import termios
 options=termios.tcgetattr(sys.stdin);options[3]&=~termios.ECHO
 termios.tcsetattr(sys.stdin,termios.TCSANOW,options)
print('Ready for private update JSON on stdin (input is hidden).',flush=True)
x=json.loads(sys.stdin.readline())
origin=x['site_url'].rstrip('/')
if origin!='https://dealhunter.greyapex8.chatgpt.site':raise ValueError('Unexpected Site origin')
headers={'OAI-Sites-Authorization':'Bearer '+x['token'],'Content-Type':'application/json'}
request=urllib.request.Request(origin+'/api/official',data=json.dumps(x['payload']).encode(),headers=headers,method='POST')
with urllib.request.urlopen(request,timeout=45) as r:result=json.load(r)
with urllib.request.urlopen(urllib.request.Request(origin+'/api/official',headers=headers),timeout=30) as r:saved=json.load(r)
ids={p['id'] for p in saved['promotions']}
if not all(p['id'] in ids for p in x['payload']['promotions']):raise RuntimeError('Readback did not contain all written offers')
print(json.dumps({'write':result,'readback_ids':sorted(ids),'source_checks':saved['checks']}))
