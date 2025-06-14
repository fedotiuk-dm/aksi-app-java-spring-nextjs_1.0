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
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
AuthGuard.tsx:47 🔍 AuthGuard: Перевіряємо доступ: {pathname: '/order-wizard', isLoggedIn: true, isInitialized: true}
AuthGuard.tsx:53 🔍 AuthGuard: Типи маршрутів: {isProtectedRoute: true, isPublicRoute: false}
AuthGuard.tsx:64 ✅ AuthGuard: Доступ дозволено
OrderWizardContainer.tsx:63 Запуск wizard...
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentState: null, currentStage: 0, canGoBack: false, …}
orval-fetcher.ts:71 🔐 Використовуємо токен з localStorage
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/start {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/start {status: 200, duration: '13ms', data: {…}}
OrderWizardContainer.tsx:73 ✅ Wizard запущено: {sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', timestamp: '2025-06-14T17:32:32.227712167', success: true, message: 'Order wizard started successfully'}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
Stage1Container.tsx:53 🔄 Ініціалізація Stage1 workflow з sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
Stage1Container.tsx:56 ✅ Stage1 workflow ініціалізовано з sessionId
Stage1Container.tsx:53 🔄 Ініціалізація Stage1 workflow з sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
Stage1Container.tsx:56 ✅ Stage1 workflow ініціалізовано з sessionId
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {status: 200, duration: '21ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/info {status: 200, duration: '22ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/search {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/search {status: 200, duration: '27ms', data: {…}}
ClientSearchStep.tsx:39 🔄 ClientSearchStep: вибір клієнта 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
ClientSearchStep.tsx:41 🔄 ClientSearchStep: викликаємо onClientSelected callback
Stage1Container.tsx:65 🔄 Вибір клієнта: 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
use-stage1-workflow.hook.ts:97 🔄 selectClient викликано: {clientId: '1dcd34af-871d-48b8-8215-5fc7cfb8e63a', substep: 'client-search', sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0'}
use-stage1-workflow.hook.ts:101 ✅ selectedClientId збережено в UI стані
use-stage1-workflow.hook.ts:105 🔄 Викликаємо clientSelected API...
use-stage1-workflow.hook.ts:106 🔄 sessionId для API виклику: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/client-selected {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/client-selected {status: 200, duration: '12ms', data: {…}}
use-stage1-workflow.hook.ts:108 🔄 Результат clientSelected API: {sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ORDER_INITIALIZATION', timestamp: '2025-06-14T17:32:35.177513106', success: true, message: 'Client selected successfully'}
use-stage1-workflow.hook.ts:109 ✅ Client selected API успішно викликано, state machine має перейти до ORDER_INITIALIZATION
use-stage1-workflow.hook.ts:119 🔄 Оновлюємо UI стан...
use-stage1-workflow.hook.ts:123 ✅ UI стан оновлено, перехід до basic-order-info
Stage1Container.tsx:69 ✅ Клієнт успішно обраний, перехід до basic-order-info
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/branches
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '109ms', data: '59196f8a-1ea9-44a5-9188-8a8302a8ac8e'}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data {status: 200, duration: '111ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {status: 200, duration: '114ms', data: 'INIT'}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/branches {status: 200, duration: '115ms', data: Array(5)}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '144ms', data: 'fc9f9e31-f55e-4206-a0fb-c00d6d4bc26c'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '145ms', data: '837721ea-874e-4eef-af10-9f5e1a7ba238'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '102ms', data: 'b36d3a97-9537-498b-8889-c543a4362651'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '74ms', data: '1c92b1e5-a4e4-4291-a4d2-c7c5c15f153f'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/initialize {status: 200, duration: '45ms', data: '8f8854c9-2e76-4272-aaaa-4331e6c99103'}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/select-branch {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/select-branch {status: 200, duration: '34ms', data: ''}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/generate-receipt-number {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/generate-receipt-number {status: 200, duration: '10ms', data: 'AKSI-AKSI1-20250614-173237-689'}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {status: 200, duration: '111ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: PUT /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: PUT /v1/order-wizard/stage1/basic-order/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/data {status: 200, duration: '44ms', data: ''}
Stage1Container.tsx:107 🔄 Підготовка до завершення Stage1, sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
Stage1Container.tsx:108 🔄 Обраний клієнт: 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
Stage1Container.tsx:109 🔄 Поточний підетап: basic-order-info
Stage1Container.tsx:115 ✅ Stage1 workflow завершено, повідомляємо OrderWizardContainer
OrderWizardContainer.tsx:133 🔄 Завершення етапу 1 через API...
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'CLIENT_SELECTION', currentStage: 1, canGoBack: false, …}
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/complete-stage1 {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/complete-stage1 {status: 200, duration: '13ms', data: {…}}
OrderWizardContainer.tsx:140 ✅ API complete-stage1 успішно викликано
OrderWizardContainer.tsx:146 ✅ Етап 1 завершено, перехід до етапу 2
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
ItemManagerStep.tsx:196 🔄 Запуск візарда предметів...
ItemManagerStep.tsx:200 ❌ Stage2 ще не готовий для роботи. Поточний стан: initializing
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
handleAddItem @ ItemManagerStep.tsx:200
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 288ms
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/info {status: 200, duration: '7ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/ffc32b5e-d050-4950-89b7-3c2c9cbda8d0/state {status: 200, duration: '65ms', data: {…}}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
OrderWizardContainer.tsx:42 🔍 OrderWizardContainer state: {hasSession: true, sessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', currentState: 'ITEM_MANAGEMENT', currentStage: 2, canGoBack: false, …}
ItemManagerStep.tsx:185 🔄 Скидання стану Stage2 для нового sessionId: ffc32b5e-d050-4950-89b7-3c2c9cbda8d0
ItemManagerStep.tsx:100 🔍 initializeStage2 викликано з параметрами: {mainWizardSessionId: 'ffc32b5e-d050-4950-89b7-3c2c9cbda8d0', isInitialized: false, isInitializing: false, currentUIState: 'initializing', initializationAttempted: false, …}
ItemManagerStep.tsx:117 🚫 Ініціалізація пропущена через умови
