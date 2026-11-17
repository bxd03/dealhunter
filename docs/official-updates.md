# DealHunter official promotion updater

Update the published Site appgprj_6afbd35fc6508191b336ecbc92e3fd56. This workflow is authorized to maintain shared official promotion records only. It must not modify user accounts, place orders, send messages, or change sharing.

## Source scope

Use web search and open official pages on these domains only:

- McDonald's Malaysia: https://www.mcdonalds.com.my/en/promotion/ and individual /en/promotion/ pages, including older offers whose stated dates are still current.
- Tealive: https://www.tealive.com.my/loyalty-app and official promotion/FAQ pages on tealive.com.my.
- ZUS Coffee: https://zuscoffee.com/faq/ and official promotion pages on zuscoffee.com.

Source IDs are mcd, tealive and zus. Follow only public information, not account-specific vouchers or inaccessible app screens. Read full relevant conditions. Prefer a small verified set over filling gaps. Search for newly published official offers as well as checking existing ones. Do not treat an old article remaining online as proof that its offer is current.

Use original short paraphrases; do not copy long source passages. Keep total summary/conditions under 150 words per source page. Do not guess item prices, end dates, nationwide eligibility or delivery fees. For a recurring offer record its weekday and time window in availability. Unknown dates must be null. Expiry is exclusive: an offer ending on 31 December Malaysia time uses 1 January at 00:00:00+08:00. Include only current or upcoming offers; exclude plainly expired offers and unrelated events/merchandise.

## Access and write

1. Call Sites get_site for the exact ID above. Confirm it is still owner-private: custom access, only the owner is allowed, no additional users or groups. If no longer owner-private or service token is unavailable, do not write; report the blocker. Do not change sharing or mint/rotate credentials.
2. Obtain current_live_url and siwc_bypass_bearer_token from that response in memory only. Do not print or save the token. Send it only to this Site using OAI-Sites-Authorization: Bearer <token>.
3. GET /api/official for existing offers, source checks and prior stable IDs. For each of the three sources, either verify its relevant pages or record failed with a concise reason. A successful source check is a complete replacement of that source's tracked offers. Keep all still-verified offers in that source's promotions array; omit confirmed expired/withdrawn offers. A failed source retains its prior stored offers but does not renew their last-checked timestamp.
4. POST /api/official JSON with promotions and checks arrays. The Site is protected by owner-private dispatch; no browser session or visitor identity is needed. Do not send an Origin header on this service call. The server validates domains and assigns checkedAt timestamps.
5. GET /api/official again to verify persisted IDs and source check results. Report failed sources plainly, without claiming they were refreshed. Do not republish for routine data changes.

POST shape:

```
{"promotions":[{"id":"stable-short-id","sourceId":"tealive","title":"Short offer title","summary":"Short factual paraphrase","conditions":"Eligibility, minimum purchase, exclusions and requirements","url":"https://www.tealive.com.my/loyalty-app","benefit":"Second cup RM1.10; first drink costs extra","starts":null,"expires":null,"availability":"Thursdays, 3–6 PM Malaysia time; confirm outlet eligibility"}],"checks":[{"sourceId":"tealive","status":"checked","message":"Verified current published offer and conditions"},{"sourceId":"mcd","status":"failed","message":"Official source could not be verified"},{"sourceId":"zus","status":"failed","message":"Official source could not be verified"}]}
```

Use checked only when public source content was actually verified on that run, not from old memory. Offers need a successful check for their source. Use stable IDs per offer. The server supplies brand and checkedAt, removes omitted entries for successful sources, and hides explicit expiries. The UI flags saved offers not verified for more than 48 hours.

## Supported execution

The script scripts/update-official.py accepts a one-line JSON object with site_url, token and payload through stdin only. It disables TTY echo, writes then verifies readback, and outputs no credential. Fetch this script and these instructions from the connected GitHub repository bxd03/dealhunter or the Site source repository if the local checkout is absent. Call the script in a TTY, wait for Ready, then send the JSON through stdin. Never put tokens in command arguments, logs, files, GitHub or schedule prompts. Fresh cloud runs must obtain current Site access themselves; no authoring-session token is stored.

## Schedule

Requested daily background checking: 08:00 Asia/Kuala_Lumpur. The task checks published information, saves usable offers and source failures, and verifies the result. It does not guarantee every newly published offer, app-personalized discounts, merchant stock or every item price. Temporary source/search failures can happen; retain truthful freshness indicators.
