import {test} from 'node:test';
import assert from 'node:assert/strict';
import {demoDeals,finalPrice,eligible,active,validateDeals,validateProfile,emptyProfile,matches} from '../lib/deals.ts';
test('estimated delivery fees change the cheapest fulfilment',()=>{const d=demoDeals[0];assert.equal(finalPrice(d.offers[0],true),14);assert.equal(finalPrice(d.offers[3],true),10.9)});
test('minimum basket and membership enforced at boundaries',()=>{const o=demoDeals[0].offers;assert.equal(eligible(o[2],14.99,false),false);assert.equal(eligible(o[2],15,false),true);assert.equal(eligible(o[1],100,false),false);assert.equal(eligible(o[1],100,true),true)});
test('validity includes start but excludes expiry',()=>{const o=demoDeals[0].offers[0];assert.equal(active(o,Date.parse(o.starts)-1),false);assert.equal(active(o,Date.parse(o.starts)),true);assert.equal(active(o,Date.parse(o.expires)),false)});
test('search normalizes case but requires every search word',()=>{assert.equal(matches(demoDeals[0],'CHAGEE jasmine'),true);assert.equal(matches(demoDeals[0],'jasmine coffee'),false)});
test('import rejects unsafe URLs, dates, duplicate IDs and negative charges',()=>{for(const patch of [{url:'javascript:alert(1)'},{delivery:-1},{expires:'invalid'}]){const d=structuredClone(demoDeals[0]);Object.assign(d.offers[0],patch);assert.throws(()=>validateDeals([d]))}assert.throws(()=>validateDeals([demoDeals[0],demoDeals[0]]));assert.equal(validateDeals([demoDeals[0]])[0].id,demoDeals[0].id)});
test('profile validator rejects malformed records',()=>{assert.deepEqual(validateProfile(emptyProfile),emptyProfile);assert.throws(()=>validateProfile({...emptyProfile,read:[{}]}));assert.throws(()=>validateProfile({...emptyProfile,preferences:{...emptyProfile.preferences,budget:-1}}))});
