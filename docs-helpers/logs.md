
           GET http://localhost:8080/api/v1/order-wizard/stage1/client-search/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state 404 (Not Found)
r.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetClientSearchState @ aksiApi.ts:12015
queryFn @ aksiApi.ts:12102
fetchFn @ query.ts:457
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
orval-fetcher.ts:203 ❌ API Error: GET /v1/order-wizard/stage1/client-search/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state {status: 404, data: '', message: 'Request failed with status code 404'}
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
(anonymous) @ orval-fetcher.ts:203
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetClientSearchState @ aksiApi.ts:12015
queryFn @ aksiApi.ts:12102
fetchFn @ query.ts:457
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
use-client-search-api.hook.ts:88 ❌ API Error: GET /v1/order-wizard/stage1/client-search/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state Error: Request failed with status code 404
    at orval-fetcher.ts:282:34
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
useClientSearchAPI.useStage1GetClientSearchState[searchStateQuery] @ use-client-search-api.hook.ts:88
(anonymous) @ retryer.ts:176
Promise.catch
run @ retryer.ts:160
(anonymous) @ retryer.ts:199
Stage1ClientSelection.tsx:82 🔄 Синхронізація sessionId: {orderWizardSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', clientSearchSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', basicOrderInfoSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc'}
orval-fetcher.ts:162 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state {headers: AxiosHeaders, data: undefined, params: undefined}
Stage1ClientSelection.tsx:82 🔄 Синхронізація sessionId: {orderWizardSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', clientSearchSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', basicOrderInfoSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc'}
frame_ant.js:2


           GET http://localhost:8080/api/v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state 404 (Not Found)
r.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetBasicOrderState @ aksiApi.ts:12323
queryFn @ aksiApi.ts:12410
fetchFn @ query.ts:457
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:576
#executeFetch @ queryObserver.ts:333
(anonymous) @ queryObserver.ts:396
setInterval
#updateRefetchInterval @ queryObserver.ts:391
#updateTimers @ queryObserver.ts:403
onQueryUpdate @ queryObserver.ts:716
(anonymous) @ query.ts:655
(anonymous) @ query.ts:654
batch @ notifyManager.ts:54
#dispatch @ query.ts:653
onError @ query.ts:501
reject @ retryer.ts:116
(anonymous) @ retryer.ts:180
orval-fetcher.ts:203 ❌ API Error: GET /v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state {status: 404, data: '', message: 'Request failed with status code 404'}
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
(anonymous) @ orval-fetcher.ts:203
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetBasicOrderState @ aksiApi.ts:12323
queryFn @ aksiApi.ts:12410
fetchFn @ query.ts:457
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:576
#executeFetch @ queryObserver.ts:333
(anonymous) @ queryObserver.ts:396
setInterval
#updateRefetchInterval @ queryObserver.ts:391
#updateTimers @ queryObserver.ts:403
onQueryUpdate @ queryObserver.ts:716
(anonymous) @ query.ts:655
(anonymous) @ query.ts:654
batch @ notifyManager.ts:54
#dispatch @ query.ts:653
onError @ query.ts:501
reject @ retryer.ts:116
(anonymous) @ retryer.ts:180
orval-fetcher.ts:162 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state {headers: AxiosHeaders, data: undefined, params: undefined}
frame_ant.js:2


           GET http://localhost:8080/api/v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state 404 (Not Found)
r.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetBasicOrderState @ aksiApi.ts:12323
queryFn @ aksiApi.ts:12410
fetchFn @ query.ts:457
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
Promise.then
(anonymous) @ retryer.ts:195
Promise.catch
run @ retryer.ts:160
start @ retryer.ts:218
fetch @ query.ts:576
#executeFetch @ queryObserver.ts:333
(anonymous) @ queryObserver.ts:396
orval-fetcher.ts:203 ❌ API Error: GET /v1/order-wizard/stage1/basic-order/session/b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc/state {status: 404, data: '', message: 'Request failed with status code 404'}
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
(anonymous) @ orval-fetcher.ts:203
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:275
stage1GetBasicOrderState @ aksiApi.ts:12323
queryFn @ aksiApi.ts:12410
fetchFn @ query.ts:457
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
Promise.then
(anonymous) @ retryer.ts:195
Promise.catch
run @ retryer.ts:160
start @ retryer.ts:218
fetch @ query.ts:576
#executeFetch @ queryObserver.ts:333
(anonymous) @ queryObserver.ts:396
Stage1ClientSelection.tsx:82 🔄 Синхронізація sessionId: {orderWizardSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', clientSearchSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc', basicOrderInfoSessionId: 'b5b583cd-9d41-43f6-8bba-e0b3f2d0d0cc'}
