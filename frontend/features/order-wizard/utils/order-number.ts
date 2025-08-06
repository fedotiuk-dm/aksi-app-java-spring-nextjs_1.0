/**
 * Generate unique order number
 * Format: YYYY-MM-DD-XXXX where XXXX is a sequential number
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Get current counter from localStorage
  const storageKey = `order-counter-${year}-${month}-${day}`;
  const currentCounter = parseInt(localStorage.getItem(storageKey) || '0', 10);
  const newCounter = currentCounter + 1;
  
  // Save new counter
  localStorage.setItem(storageKey, String(newCounter));
  
  // Format order number
  const counterStr = String(newCounter).padStart(4, '0');
  return `${year}-${month}-${day}-${counterStr}`;
}

/**
 * Generate unique label ID
 * Format: Branch-prefix + timestamp + random
 */
export function generateUniqueLabel(branchId: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const branchPrefix = branchId.substring(0, 3).toUpperCase();
  
  return `${branchPrefix}-${timestamp}-${random}`;
}