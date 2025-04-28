index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
ItemManagerStep.tsx:24 handleAddItem clicked
ItemManagerStep.tsx:25 Navigating to ITEM_WIZARD with substep BASIC_INFO
ItemWizardStep.tsx:60 Rendering substep content for: BASIC_INFO
ItemWizardStep.tsx:60 Rendering substep content for: BASIC_INFO
ItemWizardStep.tsx:37 ItemWizardStep: currentStep = ITEM_WIZARD
ItemWizardStep.tsx:38 ItemWizardStep: currentSubStep = BASIC_INFO
ItemWizardStep.tsx:37 ItemWizardStep: currentStep = ITEM_WIZARD
ItemWizardStep.tsx:38 ItemWizardStep: currentSubStep = BASIC_INFO
index.ts:88 JWT токен додано в заголовок запиту
ItemManagerStep.tsx:32 Current state after navigation: ITEM_WIZARD BASIC_INFO
index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
ItemWizardStep.tsx:60 Rendering substep content for: ITEM_PROPERTIES
ItemWizardStep.tsx:60 Rendering substep content for: ITEM_PROPERTIES
ItemWizardStep.tsx:37 ItemWizardStep: currentStep = ITEM_WIZARD
ItemWizardStep.tsx:38 ItemWizardStep: currentSubStep = ITEM_PROPERTIES
ItemWizardStep.tsx:60 Rendering substep content for: DEFECTS_STAINS
ItemWizardStep.tsx:60 Rendering substep content for: DEFECTS_STAINS
ItemWizardStep.tsx:37 ItemWizardStep: currentStep = ITEM_WIZARD
ItemWizardStep.tsx:38 ItemWizardStep: currentSubStep = DEFECTS_STAINS
index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
ItemWizardStep.tsx:60 Rendering substep content for: PRICE_CALCULATOR
ItemWizardStep.tsx:60 Rendering substep content for: PRICE_CALCULATOR
ItemWizardStep.tsx:37 ItemWizardStep: currentStep = ITEM_WIZARD
ItemWizardStep.tsx:38 ItemWizardStep: currentSubStep = PRICE_CALCULATOR
index.ts:88 JWT токен додано в заголовок запиту
index.ts:88 JWT токен додано в заголовок запиту
frame_ant.js:2 
            
            
           GET http://localhost:8080/api/price-calculation/modifiers/category/%D0%9F%D1%80%D0%B0%D0%BD%D0%BD%D1%8F%20%D0%B1%D1%96%D0%BB%D0%B8%D0%B7%D0%BD%D0%B8 500 (Internal Server Error)
e.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
_request @ Axios.js:187
request @ Axios.js:40
wrap @ bind.js:5
sendRequest @ request.ts:225
(anonymous) @ request.ts:303
await in (anonymous)
(anonymous) @ CancelablePromise.ts:84
CancelablePromise @ CancelablePromise.ts:45
request @ request.ts:295
getModifiersForCategory @ PriceCalculatorService.ts:92
useItemPricing.useModifiersForItem.useQuery @ item-pricing.ts:314
fetchFn @ query.ts:434
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248

recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
commitPassiveMountOnFiber @ react-dom-client.development.js:13931
<PriceCalculatorSubstep>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
renderSubStepContent @ ItemWizardStep.tsx:86
ItemWizardStep @ ItemWizardStep.tsx:103
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
frame_ant.js:2 
            
            
           GET http://localhost:8080/api/price-calculation/base-price?categoryCode=%D0%9F%D1%80%D0%B0%D0%BD%D0%BD%D1%8F%20%D0%B1%D1%96%D0%BB%D0%B8%D0%B7%D0%BD%D0%B8&itemName=%D0%9F%D0%BE%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D0%B0%20%D0%B1%D1%96%D0%BB%D0%B8%D0%B7%D0%BD%D0%B0 404 (Not Found)
e.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
_request @ Axios.js:187
request @ Axios.js:40
wrap @ bind.js:5
sendRequest @ request.ts:225
(anonymous) @ request.ts:303
await in (anonymous)
(anonymous) @ CancelablePromise.ts:84
CancelablePromise @ CancelablePromise.ts:45
request @ request.ts:295
getBasePrice @ PriceCalculatorService.ts:24
useItemPricing.useBasePrice.useQuery @ item-pricing.ts:206
fetchFn @ query.ts:434
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248

processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
item-pricing.ts:211 Помилка при отриманні базової ціни: ApiError: Not Found
    at catchErrorCodes (request.ts:266:15)
    at request.ts:315:17
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
useItemPricing.useBasePrice.useQuery @ item-pricing.ts:211
await in useItemPricing.useBasePrice.useQuery
fetchFn @ query.ts:434
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248
react-stack-bottom-frame @ react-dom-client.development.js:23054

recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
<PriceCalculatorSubstep>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
renderSubStepContent @ ItemWizardStep.tsx:86
ItemWizardStep @ ItemWizardStep.tsx:103
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
item-pricing.ts:321 Помилка при отриманні модифікаторів: ApiError: Internal Server Error
    at catchErrorCodes (request.ts:266:15)
    at request.ts:315:17
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
useItemPricing.useModifiersForItem.useQuery @ item-pricing.ts:321
await in useItemPricing.useModifiersForItem.useQuery
fetchFn @ query.ts:434
run @ retryer.ts:153
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248
react-stack-bottom-frame @ react-dom-client.development.js:23054
runWithFiberInDEV @ react-dom-client.development.js:844
commitHookEffectListMount @ react-dom-client.development.js:11977

commitPassiveMountOnFiber @ react-dom-client.development.js:13921
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
<PriceCalculatorSubstep>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
renderSubStepContent @ ItemWizardStep.tsx:86
ItemWizardStep @ ItemWizardStep.tsx:103
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
index.ts:88 JWT токен додано в заголовок запиту
frame_ant.js:2 
            
            
           GET http://localhost:8080/api/price-calculation/base-price?categoryCode=%D0%9F%D1%80%D0%B0%D0%BD%D0%BD%D1%8F%20%D0%B1%D1%96%D0%BB%D0%B8%D0%B7%D0%BD%D0%B8&itemName=%D0%9F%D0%BE%D1%81%D1%82%D1%96%D0%BB%D1%8C%D0%BD%D0%B0%20%D0%B1%D1%96%D0%BB%D0%B8%D0%B7%D0%BD%D0%B0 404 (Not Found)
e.send @ frame_ant.js:2
dispatchXhrRequest @ xhr.js:195
xhr @ xhr.js:15
dispatchRequest @ dispatchRequest.js:51
_request @ Axios.js:187
request @ Axios.js:40
wrap @ bind.js:5
sendRequest @ request.ts:225
(anonymous) @ request.ts:303
await in (anonymous)
(anonymous) @ CancelablePromise.ts:84
CancelablePromise @ CancelablePromise.ts:45
request @ request.ts:295
getBasePrice @ PriceCalculatorService.ts:24
useItemPricing.useBasePrice.useQuery @ item-pricing.ts:206
fetchFn @ query.ts:434
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
Promise.then
(anonymous) @ retryer.ts:195
Promise.catch
run @ retryer.ts:160
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248
react-stack-bottom-frame @ react-dom-client.development.js:23054
runWithFiberInDEV @ react-dom-client.development.js:844
commitHookEffectListMount @ react-dom-client.development.js:11977
commitHookPassiveMountEffects @ react-dom-client.development.js:12098

commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
<PriceCalculatorSubstep>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
renderSubStepContent @ ItemWizardStep.tsx:86
ItemWizardStep @ ItemWizardStep.tsx:103
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
item-pricing.ts:211 Помилка при отриманні базової ціни: ApiError: Not Found
    at catchErrorCodes (request.ts:266:15)
    at request.ts:315:17
overrideMethod @ hook.js:608
error @ intercept-console-error.ts:40
useItemPricing.useBasePrice.useQuery @ item-pricing.ts:211
await in useItemPricing.useBasePrice.useQuery
fetchFn @ query.ts:434
run @ retryer.ts:153
(anonymous) @ retryer.ts:199
Promise.then
(anonymous) @ retryer.ts:195
Promise.catch
run @ retryer.ts:160
start @ retryer.ts:218
fetch @ query.ts:546
#executeFetch @ queryObserver.ts:341
onSubscribe @ queryObserver.ts:104
subscribe @ subscribable.ts:11
useBaseQuery.useSyncExternalStore.useCallback @ useBaseQuery.ts:101
subscribeToStore @ react-dom-client.development.js:7248
react-stack-bottom-frame @ react-dom-client.development.js:23054
runWithFiberInDEV @ react-dom-client.development.js:844
commitHookEffectListMount @ react-dom-client.development.js:11977
commitHookPassiveMountEffects @ react-dom-client.development.js:12098

commitPassiveMountOnFiber @ react-dom-client.development.js:13931
recursivelyTraversePassiveMountEffects @ react-dom-client.development.js:13901
<PriceCalculatorSubstep>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
renderSubStepContent @ ItemWizardStep.tsx:86
ItemWizardStep @ ItemWizardStep.tsx:103
react-stack-bottom-frame @ react-dom-client.development.js:22973
renderWithHooksAgain @ react-dom-client.development.js:6766
renderWithHooks @ react-dom-client.development.js:6678
updateFunctionComponent @ react-dom-client.development.js:8930
beginWork @ react-dom-client.development.js:10555
runWithFiberInDEV @ react-dom-client.development.js:844
performUnitOfWork @ react-dom-client.development.js:15257
workLoopSync @ react-dom-client.development.js:15077
renderRootSync @ react-dom-client.development.js:15057
performWorkOnRoot @ react-dom-client.development.js:14525
performSyncWorkOnRoot @ react-dom-client.development.js:16364
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16210
processRootScheduleInMicrotask @ react-dom-client.development.js:16249
(anonymous) @ react-dom-client.development.js:16383
