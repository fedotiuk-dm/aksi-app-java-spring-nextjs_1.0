AuthInitializer.tsx:24 🔍 AuthInitializer: Перевіряємо токен в localStorage: Знайдено
AuthInitializer.tsx:41 🔓 AuthInitializer: Декодовано JWT payload: {role: 'ADMIN', sub: 'admin', iat: 1749852310, exp: 1749938710}
AuthInitializer.tsx:63 ✅ AuthInitializer: Відновлюємо користувача: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:43 🔐 Зберігаємо користувача в store: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:54 ✅ Користувач збережений в store, isLoggedIn: true
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
AuthGuard.tsx:43 ⏳ AuthGuard: Очікуємо ініціалізації...
AuthGuard.tsx:43 ⏳ AuthGuard: Очікуємо ініціалізації...
AuthGuard.tsx:33 🔄 AuthGuard: Ініціалізація завершена
AuthGuard.tsx:47 🔍 AuthGuard: Перевіряємо доступ: {pathname: '/order-wizard', isLoggedIn: true, isInitialized: true}
AuthGuard.tsx:53 🔍 AuthGuard: Типи маршрутів: {isProtectedRoute: true, isPublicRoute: false}
AuthGuard.tsx:64 ✅ AuthGuard: Доступ дозволено
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
OrderWizardContainer.tsx:63 Запуск wizard...
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
orval-fetcher.ts:71 🔐 Використовуємо токен з localStorage
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/start {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/start {status: 200, duration: '14ms', data: {…}}
OrderWizardContainer.tsx:73 ✅ Wizard запущено: {sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', timestamp: '2025-06-14T16:29:28.19104024', success: true, message: 'Order wizard started successfully'}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
Stage1Container.tsx:53 🔄 Ініціалізація Stage1 workflow з sessionId: a0d3b586-5789-4b54-b250-6d37ab546069
Stage1Container.tsx:56 ✅ Stage1 workflow ініціалізовано з sessionId
Stage1Container.tsx:53 🔄 Ініціалізація Stage1 workflow з sessionId: a0d3b586-5789-4b54-b250-6d37ab546069
Stage1Container.tsx:56 ✅ Stage1 workflow ініціалізовано з sessionId
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {status: 200, duration: '35ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '36ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/a0d3b586-5789-4b54-b250-6d37ab546069/search-by-phone {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/a0d3b586-5789-4b54-b250-6d37ab546069/search-by-phone {status: 200, duration: '32ms', data: {…}}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '88ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/a0d3b586-5789-4b54-b250-6d37ab546069/search {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/a0d3b586-5789-4b54-b250-6d37ab546069/search {status: 200, duration: '29ms', data: {…}}
ClientSearchStep.tsx:39 🔄 ClientSearchStep: вибір клієнта 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
ClientSearchStep.tsx:41 🔄 ClientSearchStep: викликаємо onClientSelected callback
Stage1Container.tsx:65 🔄 Вибір клієнта: 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
use-stage1-workflow.hook.ts:97 🔄 selectClient викликано: {clientId: '1dcd34af-871d-48b8-8215-5fc7cfb8e63a', substep: 'client-search', sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069'}
use-stage1-workflow.hook.ts:101 ✅ selectedClientId збережено в UI стані
use-stage1-workflow.hook.ts:105 🔄 Викликаємо clientSelected API...
use-stage1-workflow.hook.ts:106 🔄 sessionId для API виклику: a0d3b586-5789-4b54-b250-6d37ab546069
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/client-selected {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/client-selected {status: 200, duration: '27ms', data: {…}}
use-stage1-workflow.hook.ts:108 🔄 Результат clientSelected API: {sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'ORDER_INITIALIZATION', timestamp: '2025-06-14T16:29:34.687692443', success: true, message: 'Client selected successfully'}
use-stage1-workflow.hook.ts:109 ✅ Client selected API успішно викликано, state machine має перейти до ORDER_INITIALIZATION
use-stage1-workflow.hook.ts:119 🔄 Оновлюємо UI стан...
use-stage1-workflow.hook.ts:123 ✅ UI стан оновлено, перехід до basic-order-info
Stage1Container.tsx:69 ✅ Клієнт успішно обраний, перехід до basic-order-info
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/state
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/branches
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '164ms', data: 'aa66d854-b116-49f0-8625-54dc887a4943'}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data {status: 200, duration: '168ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '170ms', data: 'INIT'}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/branches {status: 200, duration: '171ms', data: Array(5)}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '205ms', data: '8acae69a-ac40-4cea-bf4e-9b27886e0d27'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '205ms', data: 'cc9dc341-7405-4bbe-b590-c5a4b09828d6'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '120ms', data: '3309a645-55d3-4e1f-8df3-8985fbafc0c5'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '87ms', data: 'a281b554-735d-4f5a-b115-6be4274a8a26'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '53ms', data: '903b074e-f064-4adb-9496-4bf75bb0c7f6'}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/select-branch {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/select-branch {status: 200, duration: '46ms', data: ''}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/generate-receipt-number {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/generate-receipt-number {status: 200, duration: '14ms', data: 'AKSI-AKSI1-20250614-162937-275'}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {status: 200, duration: '9ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '117ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: PUT /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: PUT /v1/order-wizard/stage1/basic-order/session/a0d3b586-5789-4b54-b250-6d37ab546069/data {status: 200, duration: '60ms', data: ''}
Stage1Container.tsx:107 🔄 Завершення Stage1, sessionId: a0d3b586-5789-4b54-b250-6d37ab546069
Stage1Container.tsx:108 🔄 Обраний клієнт: 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
Stage1Container.tsx:109 🔄 Поточний підетап: basic-order-info
Stage1Container.tsx:116 🔄 Викликаємо completeStage1 API...
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/complete-stage1 {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/complete-stage1 {status: 200, duration: '13ms', data: {…}}
Stage1Container.tsx:118 ✅ Stage1 успішно завершено
OrderWizardContainer.tsx:133 Завершення етапу 1...
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/complete-stage1 {headers: AxiosHeaders, data: undefined, params: undefined}
frame_ant.js:2


           POST http://localhost:8080/api/order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/complete-stage1 400 (Bad Request)
r.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:271
orderWizardCompleteStage1 @ aksiApi.ts:312
mutationFn @ aksiApi.ts:337
fn @ mutation.ts:174
run @ retryer.ts:153
start @ retryer.ts:218
execute @ mutation.ts:213
await in execute
mutate @ mutationObserver.ts:125
handleCompleteStage1 @ OrderWizardContainer.tsx:136
handleOrderInfoCompleted @ Stage1Container.tsx:120
await in handleOrderInfoCompleted
handleCompleteOrderInfo @ BasicOrderInfoStep.tsx:148
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
orval-fetcher.ts:194 ❌ API Error: POST /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/complete-stage1 {status: 400, data: {…}, message: 'Request failed with status code 400'}
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
(anonymous) @ orval-fetcher.ts:194
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:271
orderWizardCompleteStage1 @ aksiApi.ts:312
mutationFn @ aksiApi.ts:337
fn @ mutation.ts:174
run @ retryer.ts:153
start @ retryer.ts:218
execute @ mutation.ts:213
await in execute
mutate @ mutationObserver.ts:125
handleCompleteStage1 @ OrderWizardContainer.tsx:136
handleOrderInfoCompleted @ Stage1Container.tsx:120
await in handleOrderInfoCompleted
handleCompleteOrderInfo @ BasicOrderInfoStep.tsx:148
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
OrderWizardContainer.tsx:146 ❌ Помилка завершення етапу 1: Error: Failed to process transition
    at orval-fetcher.ts:278:34
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
handleCompleteStage1 @ OrderWizardContainer.tsx:146
await in handleCompleteStage1
handleOrderInfoCompleted @ Stage1Container.tsx:120
await in handleOrderInfoCompleted
handleCompleteOrderInfo @ BasicOrderInfoStep.tsx:148
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '118ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/info {status: 200, duration: '9ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/a0d3b586-5789-4b54-b250-6d37ab546069/state {status: 200, duration: '113ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'a0d3b586-5789-4b54-b250-6d37ab546069', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
