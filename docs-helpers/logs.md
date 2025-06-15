AuthInitializer.tsx:24 🔍 AuthInitializer: Перевіряємо токен в localStorage: Знайдено
AuthInitializer.tsx:41 🔓 AuthInitializer: Декодовано JWT payload: {role: 'ADMIN', sub: 'admin', iat: 1749939794, exp: 1750026194}
AuthInitializer.tsx:63 ✅ AuthInitializer: Відновлюємо користувача: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:43 🔐 Зберігаємо користувача в store: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:54 ✅ Користувач збережений в store, isLoggedIn: true
AuthGuard.tsx:43 ⏳ AuthGuard: Очікуємо ініціалізації...
AuthGuard.tsx:43 ⏳ AuthGuard: Очікуємо ініціалізації...
AuthGuard.tsx:33 🔄 AuthGuard: Ініціалізація завершена
AuthGuard.tsx:47 🔍 AuthGuard: Перевіряємо доступ: {pathname: '/order-wizard', isLoggedIn: true, isInitialized: true}
AuthGuard.tsx:53 🔍 AuthGuard: Типи маршрутів: {isProtectedRoute: true, isPublicRoute: false}
AuthGuard.tsx:64 ✅ AuthGuard: Доступ дозволено
orval-fetcher.ts:71 🔐 Використовуємо токен з localStorage
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/start {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/start {status: 200, duration: '15ms', data: {…}}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/initialize {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/initialize {status: 200, duration: '36ms', data: '5b320034-c862-4965-93ee-931d3b8ed4f2'}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/initialize {status: 200, duration: '74ms', data: '46415b91-051b-49ef-b184-44358542fb65'}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/4badc69b-51a7-4699-99b1-b471e62e30d8/search {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/4badc69b-51a7-4699-99b1-b471e62e30d8/search {status: 200, duration: '29ms', data: {…}}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/4badc69b-51a7-4699-99b1-b471e62e30d8/select-client {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:142 🚀 API Request: PUT /v1/order-wizard/stage1/new-client/session/4badc69b-51a7-4699-99b1-b471e62e30d8/data {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/4badc69b-51a7-4699-99b1-b471e62e30d8/select-client {status: 200, duration: '14ms', data: ''}
orval-fetcher.ts:194 ❌ API Error: PUT /v1/order-wizard/stage1/new-client/session/4badc69b-51a7-4699-99b1-b471e62e30d8/data {status: 404, data: '', message: 'Request failed with status code 404'}
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
(anonymous) @ orval-fetcher.ts:194
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:271
stage1UpdateClientData @ aksiApi.ts:151
mutationFn @ aksiApi.ts:178
fn @ mutation.ts:174
run @ retryer.ts:153
start @ retryer.ts:218
execute @ mutation.ts:213
await in execute
mutate @ mutationObserver.ts:125
useAutosave.useEffect @ autosave.ts:159
safeApiCall @ autosave.ts:73
useAutosave.useEffect @ autosave.ts:157
