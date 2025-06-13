AuthInitializer.tsx:23 🔍 AuthInitializer: Перевіряємо токен в localStorage: Знайдено
AuthInitializer.tsx:40 🔓 AuthInitializer: Декодовано JWT payload: {role: 'ADMIN', sub: 'admin', iat: 1749775117, exp: 1749861517}
AuthInitializer.tsx:62 ✅ AuthInitializer: Відновлюємо користувача: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:43 🔐 Зберігаємо користувача в store: {id: 'admin', username: 'admin', name: 'Користувач', email: '', role: 'ADMIN', …}
index.ts:54 ✅ Користувач збережений в store, isLoggedIn: true
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
AuthGuard.tsx:42 ⏳ AuthGuard: Очікуємо ініціалізації...
AuthGuard.tsx:42 ⏳ AuthGuard: Очікуємо ініціалізації...
orval-fetcher.ts:71 🔐 Використовуємо токен з localStorage
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/health {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/health {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:190 🚫 Request canceled: GET /order-wizard/health
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/health {status: 200, duration: '46ms', data: {…}}
AuthGuard.tsx:32 🔄 AuthGuard: Ініціалізація завершена
AuthGuard.tsx:46 🔍 AuthGuard: Перевіряємо доступ: {pathname: '/order-wizard', isLoggedIn: true, isInitialized: true}
AuthGuard.tsx:52 🔍 AuthGuard: Типи маршрутів: {isProtectedRoute: true, isPublicRoute: false}
AuthGuard.tsx:63 ✅ AuthGuard: Доступ дозволено
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
use-main.hook.ts:169 🚀 Запуск нового Order Wizard...
use-main.hook.ts:176 🧹 Очищення пам'яті перед запуском...
use-clear-wizard-memory.hook.ts:27 🧹 Очищення всієї пам'яті Order Wizard...
use-clear-wizard-memory.hook.ts:47 ✅ localStorage очищено
use-clear-wizard-memory.hook.ts:69 ✅ React Query кеш очищено
use-clear-wizard-memory.hook.ts:79 ✅ Zustand стори скинуто
use-clear-wizard-memory.hook.ts:92 ✅ sessionStorage очищено
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/clear-all-sessions {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/clear-all-sessions {status: 200, duration: '8ms', data: {…}}
use-clear-wizard-memory.hook.ts:100 ✅ Backend сесії очищено через Orval
use-clear-wizard-memory.hook.ts:110 ✅ Стори скинуто повторно після очищення backend
use-clear-wizard-memory.hook.ts:115 🎉 Пам'ять Order Wizard повністю очищена!
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
use-main.hook.ts:182 ✅ Пам'ять очищена, чекаємо 1 секунду для стабілізації...
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
use-main.hook.ts:186 ✅ Затримка завершена, запускаємо новий візард...
orval-fetcher.ts:142 🚀 API Request: POST /order-wizard/start {headers: AxiosHeaders, data: undefined, params: undefined}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: false, sessionId: null, currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
orval-fetcher.ts:166 ✅ API Response: POST /order-wizard/start {status: 200, duration: '21ms', data: {…}}
use-main.hook.ts:147 ✅ Order Wizard запущено успішно: {sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentState: 'CLIENT_SELECTION', timestamp: '2025-06-13T10:37:23.179365474', success: true, message: 'Order wizard started successfully'}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: undefined
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-client-search.hook.ts:61 🔍 Автоматична активація режиму пошуку клієнтів
use-client-search.hook.ts:61 🔍 Автоматична активація режиму пошуку клієнтів
use-client-search.hook.ts:61 🔍 Автоматична активація режиму пошуку клієнтів
use-client-search.hook.ts:61 🔍 Автоматична активація режиму пошуку клієнтів
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/session/8fb055c9-9270-48cd-9e00-de9175c10b76/info {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/stages/1/status {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /order-wizard/stages/status {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/data {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/branches {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/data
orval-fetcher.ts:190 🚫 Request canceled: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/branches
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: undefined, currentStateValue: undefined, currentStateUndefined: true, …}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/stages/1/status {status: 200, duration: '191ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/stages/status {status: 200, duration: '193ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state {status: 200, duration: '193ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/state {status: 200, duration: '194ms', data: 'INIT'}
orval-fetcher.ts:166 ✅ API Response: GET /order-wizard/session/8fb055c9-9270-48cd-9e00-de9175c10b76/info {status: 200, duration: '195ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/data {status: 200, duration: '196ms', data: {…}}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/branches {status: 200, duration: '197ms', data: Array(5)}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form:
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId:
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 674e65d9-344f-4d80-841c-8c806381b428 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 9cd93af6-a582-4e62-9e0c-598dabc9a328 з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 4192954f-e4ef-4e4b-a1ed-1bd42ba8e44d з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:275   порівнюємо branch.id: bace55d4-861a-458c-a45b-0312b4b4f5db з effectiveSelectedBranchId:
use-basic-order-info.hook.ts:284   foundBranch: undefined
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
use-client-search.hook.ts:210 🔍 Автоматичний пошук: Fed
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/search {headers: AxiosHeaders, data: {…}, params: undefined}
use-client-search.hook.ts:210 🔍 Автоматичний пошук: Fed
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/search {headers: AxiosHeaders, data: {…}, params: undefined}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/search {status: 200, duration: '153ms', data: {…}}
use-client-search.hook.ts:85 ✅ Пошук клієнтів успішний
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/search {status: 200, duration: '167ms', data: {…}}
use-client-search.hook.ts:85 ✅ Пошук клієнтів успішний
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
Stage1ClientSelection.tsx:57 Клієнт обраний: 1dcd34af-871d-48b8-8215-5fc7cfb8e63a
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/selected-client {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/select-client {headers: AxiosHeaders, data: undefined, params: {…}}
frame_ant.js:2


           GET http://localhost:8080/api/v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/selected-client 404 (Not Found)
r.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
Promise.then
_request @ Axios.js:163
request @ Axios.js:40
wrap @ bind.js:5
customInstance @ orval-fetcher.ts:271
stage1GetSelectedClient @ aksiApi.ts:1755
queryFn @ aksiApi.ts:1776
fetchFn @ query.ts:457
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:576
#executeFetch @ queryObserver.ts:333
setOptions @ queryObserver.ts:194


orval-fetcher.ts:203 ℹ️ No client selected yet: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/selected-client (404)
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/select-client {status: 200, duration: '14ms', data: ''}
use-client-search.hook.ts:111 ✅ Клієнт вибраний успішно
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
OrderWizardContainer.tsx:41 🔍 OrderWizardContainer state: {hasSession: true, sessionId: '8fb055c9-9270-48cd-9e00-de9175c10b76', currentStateSuccess: true, currentStateValue: 'CLIENT_SELECTION', currentStateUndefined: false, …}
orval-fetcher.ts:142 🚀 API Request: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/selected-client {headers: AxiosHeaders, data: undefined, params: undefined}
orval-fetcher.ts:166 ✅ API Response: GET /v1/order-wizard/stage1/client-search/session/8fb055c9-9270-48cd-9e00-de9175c10b76/selected-client {status: 200, duration: '9ms', data: {…}}
BranchSelectionPanel.tsx:40 🏢 Вибираємо філію: 574de09b-b15a-403b-85c7-baba720a3ddd
BranchSelectionPanel.tsx:42 ✅ Філія вибрана успішно
Stage1ClientSelection.tsx:68 Філія обрана: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:284   foundBranch: {id: '574de09b-b15a-403b-85c7-baba720a3ddd', name: 'Головне відділення', address: 'Вінниця, вул. Замостянська, 33', phone: '+380632913911', code: 'AKSI1', …}
use-basic-order-info.hook.ts:268 🔍 Debug computed selectedBranch:
use-basic-order-info.hook.ts:269   apiSelectedBranchId: undefined
use-basic-order-info.hook.ts:270   selectedBranchId from form: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:271   effectiveSelectedBranchId: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:272   branchesQuery.data: (5) [{…}, {…}, {…}, {…}, {…}]
use-basic-order-info.hook.ts:275   порівнюємо branch.id: 574de09b-b15a-403b-85c7-baba720a3ddd з effectiveSelectedBranchId: 574de09b-b15a-403b-85c7-baba720a3ddd
use-basic-order-info.hook.ts:284   foundBranch: {id: '574de09b-b15a-403b-85c7-baba720a3ddd', name: 'Головне відділення', address: 'Вінниця, вул. Замостянська, 33', phone: '+380632913911', code: 'AKSI1', …}
orval-fetcher.ts:142 🚀 API Request: POST /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/select-branch {headers: AxiosHeaders, data: undefined, params: {…}}
orval-fetcher.ts:166 ✅ API Response: POST /v1/order-wizard/stage1/basic-order/session/8fb055c9-9270-48cd-9e00-de9175c10b76/select-branch {status: 200, duration: '11ms', data: ''}
use-basic-order-info.hook.ts:114 ✅ Філія вибрана
BasicOrderInfoForm.tsx:144 🔍 Debug генерація номера квитанції:
BasicOrderInfoForm.tsx:145   selectedBranch: undefined
BasicOrderInfoForm.tsx:146   selectedBranchId:
BasicOrderInfoForm.tsx:147   branches: (5) [{…}, {…}, {…}, {…}, {…}]
BasicOrderInfoForm.tsx:150 ❌ Філія не обрана
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
handleGenerateReceiptNumber @ BasicOrderInfoForm.tsx:150
executeDispatch @ react-dom-client.development.js:16501
runWithFiberInDEV @ react-dom-client.development.js:844
processDispatchQueue @ react-dom-client.development.js:16551
(anonymous) @ react-dom-client.development.js:17149
batchedUpdates$1 @ react-dom-client.development.js:3262
dispatchEventForPluginEventSystem @ react-dom-client.development.js:16705
dispatchEvent @ react-dom-client.development.js:20815
dispatchDiscreteEvent @ react-dom-client.development.js:20783
turbopack-hot-reloader-common.ts:41 [Fast Refresh] rebuilding
report-hmr-latency.ts:26 [Fast Refresh] done in 303ms
